import { describe, it, expect } from "vitest";
import {
  buildFormSchema,
  cloneForm,
  createFieldRule,
  createFormField,
  decodeFormFromBase64,
  encodeFormToBase64,
  formatFieldType,
  formatRuleType,
  getDefaultRuleValue,
  parseForm,
  serializeForm,
  toSafeFilename,
} from "./utils";
import type { FieldRule, Form, FormField } from "./schema";

describe("createFieldRule", () => {
  it("generates a valid UUID id", () => {
    const rule = createFieldRule("required");
    expect(rule.id).toBeTypeOf("string");
    expect(rule.id).toHaveLength(36);
    expect(rule.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("preserves type, value, and message", () => {
    const rule = createFieldRule("min", "5", "Mínimo 5 caracteres");
    expect(rule.type).toBe("min");
    expect(rule.value).toBe("5");
    expect(rule.message).toBe("Mínimo 5 caracteres");
  });

  it("does not mutate the inputs", () => {
    const type: FieldRule["type"] = "max";
    const value = "10";
    const message = "Máximo 10";
    const rule = createFieldRule(type, value, message);
    expect(rule).toEqual({
      id: expect.any(String),
      type: "max",
      value: "10",
      message: "Máximo 10",
    });
  });
});

describe("createFormField", () => {
  it("generates a valid UUID id", () => {
    const field = createFormField("Email");
    expect(field.id).toBeTypeOf("string");
    expect(field.id).toHaveLength(36);
  });

  it("applies the label and default text type", () => {
    const field = createFormField("Nombre");
    expect(field.label).toBe("Nombre");
    expect(field.type).toBe("text");
  });

  it("applies a custom type when provided", () => {
    const field = createFormField("Edad", "number");
    expect(field.type).toBe("number");
  });

  it("generates default placeholder from label", () => {
    const field = createFormField("Correo Electrónico");
    expect(field.placeholder).toBe("Ingresá correo electrónico");
  });

  it("accepts an empty rules array by default", () => {
    const field = createFormField("Teléfono");
    expect(field.rules).toEqual([]);
  });

  it("accepts custom rules", () => {
    const rule: FieldRule = {
      id: "test-rule-id",
      type: "required",
      message: "Requerido",
    };
    const field = createFormField("Usuario", "text", [rule]);
    expect(field.rules).toHaveLength(1);
    expect(field.rules[0].type).toBe("required");
  });
});

describe("formatFieldType", () => {
  it("maps all field types to Spanish labels", () => {
    const cases: Array<{ type: FormField["type"]; label: string }> = [
      { type: "text", label: "Texto" },
      { type: "email", label: "Correo electrónico" },
      { type: "number", label: "Número" },
      { type: "password", label: "Contraseña" },
      { type: "textarea", label: "Texto largo" },
      { type: "date", label: "Fecha" },
    ];

    for (const { type, label } of cases) {
      expect(formatFieldType(type)).toBe(label);
    }
  });

  it("returns the raw type for unknown values", () => {
    expect(formatFieldType("unknown" as FormField["type"])).toBe("unknown");
  });
});

describe("formatRuleType", () => {
  it("maps all rule types to Spanish labels", () => {
    const cases: Array<{ type: FieldRule["type"]; label: string }> = [
      { type: "required", label: "Requerido" },
      { type: "min", label: "Mínimo" },
      { type: "max", label: "Máximo" },
      { type: "email", label: "Email válido" },
      { type: "regex", label: "Expresión regular" },
    ];

    for (const { type, label } of cases) {
      expect(formatRuleType(type)).toBe(label);
    }
  });

  it("returns the raw type for unknown values", () => {
    expect(formatRuleType("unknown" as FieldRule["type"])).toBe("unknown");
  });
});

describe("getDefaultRuleValue", () => {
  it('returns "1" for min', () => {
    expect(getDefaultRuleValue("min")).toBe("1");
  });

  it('returns "100" for max', () => {
    expect(getDefaultRuleValue("max")).toBe("100");
  });

  it('returns ".*" for regex', () => {
    expect(getDefaultRuleValue("regex")).toBe(".*");
  });

  it('returns "" for required', () => {
    expect(getDefaultRuleValue("required")).toBe("");
  });

  it('returns "" for email', () => {
    expect(getDefaultRuleValue("email")).toBe("");
  });
});

describe("buildFormSchema", () => {
  it("passes when all fields satisfy their rules", () => {
    const field = createFormField("Nombre", "text", [createFieldRule("required")]);
    const schema = buildFormSchema([field]);
    expect(schema.safeParse({ [field.id]: "Juan" }).success).toBe(true);
  });

  it("fails when a required field is empty", () => {
    const field = createFormField("Nombre", "text", [createFieldRule("required")]);
    const schema = buildFormSchema([field]);
    const result = schema.safeParse({ [field.id]: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain(field.id);
    }
  });

  it("uses custom rule message and attaches the issue to the field path", () => {
    const message = "Mínimo 3 caracteres";
    const field = createFormField("Nombre", "text", [
      createFieldRule("min", "3", message),
    ]);
    const schema = buildFormSchema([field]);
    const result = schema.safeParse({ [field.id]: "ab" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(message);
      expect(result.error.issues[0].path).toContain(field.id);
    }
  });

  it("ignores unknown keys and validates known keys", () => {
    const field = createFormField("Email", "email", [createFieldRule("email")]);
    const schema = buildFormSchema([field]);
    const result = schema.safeParse({ [field.id]: "not-an-email", extra: "ok" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain(field.id);
    }
  });

  it("validates number fields by value, not string length", () => {
    const field = createFormField("Edad", "number", [
      createFieldRule("min", "1"),
      createFieldRule("max", "5"),
    ]);
    const schema = buildFormSchema([field]);

    expect(schema.safeParse({ [field.id]: "3" }).success).toBe(true);
    expect(schema.safeParse({ [field.id]: "10" }).success).toBe(false);
    expect(schema.safeParse({ [field.id]: "0" }).success).toBe(false);
  });
});

describe("cloneForm", () => {
  function makeForm(overrides: Partial<Form> = {}): Form {
    const field = createFormField("Nombre", "text", [createFieldRule("required")]);
    return {
      id: "form-1",
      name: "Original",
      description: "desc",
      tags: [],
      fields: [field],
      createdAt: "2026-01-01T00:00:00.000Z",
      theme: undefined,
      ...overrides,
    };
  }

  it("generates a new form id distinct from the original", () => {
    const original = makeForm();
    const copy = cloneForm(original);
    expect(copy.id).not.toBe(original.id);
    expect(copy.id).toBeTypeOf("string");
  });

  it("appends ' (copia)' to the name when no customName is provided", () => {
    const original = makeForm({ name: "Login" });
    const copy = cloneForm(original);
    expect(copy.name).toBe("Login (copia)");
  });

  it("uses the custom name when provided", () => {
    const original = makeForm({ name: "Login" });
    const copy = cloneForm(original, "Copia login");
    expect(copy.name).toBe("Copia login");
  });

  it("regenerates ids for every field", () => {
    const fieldA = createFormField("A");
    const fieldB = createFormField("B");
    const original = makeForm({ fields: [fieldA, fieldB] });
    const copy = cloneForm(original);
    expect(copy.fields.map((f) => f.id)).not.toEqual([fieldA.id, fieldB.id]);
    expect(copy.fields.map((f) => f.id)).toHaveLength(2);
  });

  it("preserves field labels, types and rules", () => {
    const field = createFormField("Email", "email", [createFieldRule("email")]);
    const original = makeForm({ fields: [field] });
    const copy = cloneForm(original);
    expect(copy.fields[0].label).toBe("Email");
    expect(copy.fields[0].type).toBe("email");
    expect(copy.fields[0].rules).toEqual(field.rules);
  });

  it("sets a fresh createdAt timestamp", () => {
    const original = makeForm({ createdAt: "2020-01-01T00:00:00.000Z" });
    const copy = cloneForm(original);
    expect(copy.createdAt).not.toBe(original.createdAt);
    expect(new Date(copy.createdAt).getTime()).toBeGreaterThan(
      new Date("2025-01-01").getTime()
    );
  });
});

describe("serializeForm / parseForm", () => {
  function makeForm(): Form {
    const field = createFormField("Email", "email", [createFieldRule("email")]);
    return {
      id: "form-1",
      name: "Login",
      description: "Form de login",
      tags: [],
      fields: [field],
      createdAt: "2026-01-01T00:00:00.000Z",
      theme: undefined,
    };
  }

  it("roundtrip serialize -> parse returns a valid form with new ids", () => {
    const original = makeForm();
    const json = serializeForm(original);
    const result = parseForm(json);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // parseForm usa cloneForm internamente para evitar colisiones de id,
    // por lo que el nombre se suffija con " (copia)".
    expect(result.form.name).toBe("Login (copia)");
    expect(result.form.fields).toHaveLength(1);
    expect(result.form.fields[0].label).toBe("Email");
    expect(result.form.id).not.toBe(original.id);
    expect(result.form.fields[0].id).not.toBe(original.fields[0].id);
  });

  it("parseForm rejects invalid JSON", () => {
    const result = parseForm("{ not json ");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("no es JSON válido");
  });

  it("parseForm rejects well-formed JSON that is not a Form", () => {
    const result = parseForm(JSON.stringify({ foo: "bar" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("no representa un formulario válido");
  });
});

describe("encodeFormToBase64 / decodeFormFromBase64", () => {
  function makeForm(): Form {
    const field = createFormField("Nombre", "text", [
      createFieldRule("required"),
    ]);
    return {
      id: "shared-form-1",
      name: "Registro \u00f1and\u00fa",
      description: "Formulario con caracteres Unicode",
      tags: [],
      fields: [field],
      createdAt: "2026-01-01T00:00:00.000Z",
      theme: undefined,
    };
  }

  it("roundtrips a shared form without creating an import copy", () => {
    const original = makeForm();
    const encoded = encodeFormToBase64(original);
    const result = decodeFormFromBase64(encoded);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.form.name).toBe(original.name);
    expect(result.form.id).toBe(original.id);
    expect(result.form.fields[0].id).toBe(original.fields[0].id);
    expect(result.form.fields[0].label).toBe("Nombre");
  });

  it("rejects invalid shared payloads", () => {
    const result = decodeFormFromBase64("not-valid-base64");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("enlace");
  });
});

describe("toSafeFilename", () => {
  it("slugifies a simple name", () => {
    expect(toSafeFilename("Login Form")).toBe("login-form.json");
  });

  it("strips non-alphanumeric characters", () => {
    expect(toSafeFilename("Form #1: Contacto!")).toBe("form-1-contacto.json");
  });

  it("falls back to default for empty or symbol-only names", () => {
    expect(toSafeFilename("")).toBe("formulario.json");
    expect(toSafeFilename("   $$$   ")).toBe("formulario.json");
  });
});
