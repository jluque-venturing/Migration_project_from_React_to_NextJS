import { describe, expect, it } from "vitest";
import {
  formSchema,
  formTemplateSchema,
  type FormTemplate,
} from "@/features/form-lab/schema";
import {
  createFormFromTemplate,
  formTemplates,
} from "@/features/form-lab/templates";
import {
  countTemplateRules,
  filterTemplates,
  getTemplateCategories,
  sortTemplates,
  templateMatchesSearch,
} from "@/features/form-lab/utils";

const CREATED_AT = "2026-06-19T12:00:00.000Z";
const TEMPLATE_IDS: FormTemplate["id"][] = [
  "login",
  "signup",
  "checkout",
  "contact",
  "satisfaction",
  "appointment",
  "event-registration",
  "quote-request",
  "job-application",
  "newsletter-subscription",
  "hotel-reservation",
  "course-enrollment",
  "technical-support",
  "claim-warranty",
  "donation",
  "patient-registration",
  "medical-appointment",
  "product-review",
  "service-review",
  "scholarship-application",
];

const NEW_D5_TEMPLATE_IDS: FormTemplate["id"][] = [
  "newsletter-subscription",
  "hotel-reservation",
  "course-enrollment",
  "technical-support",
  "claim-warranty",
  "donation",
  "patient-registration",
  "medical-appointment",
  "product-review",
  "service-review",
  "scholarship-application",
];

function createSequentialIdGenerator() {
  let sequence = 0;
  return () => `test-id-${++sequence}`;
}

describe("formTemplates", () => {
  it("provides the expected template catalog", () => {
    expect(formTemplates.map((template) => template.id)).toEqual(TEMPLATE_IDS);
  });

  it("includes the required template categories", () => {
    expect(formTemplates.map((template) => template.id)).toEqual(
      expect.arrayContaining(["login", "signup", "checkout"])
    );
  });

  it("includes every expanded D5 template", () => {
    expect(formTemplates.map((template) => template.id)).toEqual(
      expect.arrayContaining(NEW_D5_TEMPLATE_IDS)
    );
  });

  it("provides complete display information for every template", () => {
    formTemplates.forEach((template) => {
      expect(template.name.trim().length).toBeGreaterThan(0);
      expect(template.description.trim().length).toBeGreaterThan(0);
      expect(template.category.trim().length).toBeGreaterThan(0);
      expect(template.tags.length).toBeGreaterThan(0);
      expect(template.complexity.trim().length).toBeGreaterThan(0);
      expect(template.fields.length).toBeGreaterThan(0);
      expect(formTemplateSchema.safeParse(template).success).toBe(true);
      expect(countTemplateRules(template)).toBeGreaterThan(0);
    });
  });

  it("keeps expanded D5 templates within the expected field range", () => {
    const expandedTemplates = formTemplates.filter((template) =>
      NEW_D5_TEMPLATE_IDS.includes(template.id)
    );

    expandedTemplates.forEach((template) => {
      expect(template.fields.length).toBeGreaterThanOrEqual(3);
      expect(template.fields.length).toBeLessThanOrEqual(7);
    });
  });

  it("provides every expected category", () => {
    expect(getTemplateCategories(formTemplates)).toEqual(
      expect.arrayContaining([
        "cuentas",
        "comercio",
        "salud",
        "educacion",
        "soporte",
        "feedback",
        "reservas",
        "servicios",
        "recursos-humanos",
      ])
    );
  });

  it.each(["login", "signup", "checkout"] as const)(
    "provides configured validation rules for %s",
    (templateId) => {
      const template = formTemplates.find(({ id }) => id === templateId);
      const rules = template?.fields.flatMap((field) => field.rules) ?? [];

      expect(template).toBeDefined();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.some((rule) => rule.type === "required")).toBe(true);
    }
  );

  it("covers every rule type supported by the D2 contract", () => {
    const ruleTypes = formTemplates.flatMap((template) =>
      template.fields.flatMap((field) =>
        field.rules.map((rule) => rule.type)
      )
    );

    expect(new Set(ruleTypes)).toEqual(
      new Set(["required", "min", "max", "email", "regex"])
    );
  });
});

describe("template gallery helpers", () => {
  it("matches templates by name, tags, fields, and rule types", () => {
    const hotel = formTemplates.find(({ id }) => id === "hotel-reservation")!;
    const checkout = formTemplates.find(({ id }) => id === "checkout")!;

    expect(templateMatchesSearch(hotel, "hotel")).toBe(true);
    expect(templateMatchesSearch(hotel, "huespedes")).toBe(true);
    expect(templateMatchesSearch(hotel, "fecha de salida")).toBe(true);
    expect(templateMatchesSearch(checkout, "regex")).toBe(true);
  });

  it("filters templates by category and query", () => {
    const results = filterTemplates(formTemplates, "dni", "salud");

    expect(results.map((template) => template.id)).toContain(
      "patient-registration"
    );
    expect(results.every((template) => template.category === "salud")).toBe(true);
  });

  it("sorts templates by name and rule count", () => {
    const byName = sortTemplates(formTemplates, "name-asc");
    const byRules = sortTemplates(formTemplates, "most-rules");

    expect(byName[0]!.name.localeCompare(byName[1]!.name)).toBeLessThanOrEqual(0);
    expect(countTemplateRules(byRules[0]!)).toBeGreaterThanOrEqual(
      countTemplateRules(byRules[1]!)
    );
  });
});

describe("createFormFromTemplate", () => {
  it.each(formTemplates)("creates a valid form from $name", (template) => {
    const form = createFormFromTemplate(template, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });

    expect(formSchema.safeParse(form).success).toBe(true);
    expect(form.createdAt).toBe(CREATED_AT);
  });

  it("creates a different id for the form, fields, and rules", () => {
    const form = createFormFromTemplate(formTemplates[0]!, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });
    const ids = [
      form.id,
      ...form.fields.flatMap((field) => [
        field.id,
        ...field.rules.map((rule) => rule.id),
      ]),
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("creates fresh ids on every import", () => {
    const createId = createSequentialIdGenerator();
    const dependencies = {
      createId,
      getCreatedAt: () => CREATED_AT,
    };

    const firstForm = createFormFromTemplate(formTemplates[0]!, dependencies);
    const secondForm = createFormFromTemplate(formTemplates[0]!, dependencies);

    const firstIds = [
      firstForm.id,
      ...firstForm.fields.flatMap((field) => [
        field.id,
        ...field.rules.map((rule) => rule.id),
      ]),
    ];
    const secondIds = [
      secondForm.id,
      ...secondForm.fields.flatMap((field) => [
        field.id,
        ...field.rules.map((rule) => rule.id),
      ]),
    ];

    expect(firstIds.every((id) => !secondIds.includes(id))).toBe(true);
  });

  it("does not mutate the selected template", () => {
    const template = formTemplates[0]!;
    const snapshot = structuredClone(template);

    createFormFromTemplate(template, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });

    expect(template).toEqual(snapshot);
  });

  it("preserves rule types, values, and messages", () => {
    const template = formTemplates.find(({ id }) => id === "checkout")!;
    const form = createFormFromTemplate(template, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });
    const sourceRules = template.fields.flatMap((field) =>
      field.rules.map(({ type, value, message }) => ({ type, value, message }))
    );
    const createdRules = form.fields.flatMap((field) =>
      field.rules.map(({ type, value, message }) => ({ type, value, message }))
    );

    expect(createdRules).toEqual(sourceRules);
  });
});
