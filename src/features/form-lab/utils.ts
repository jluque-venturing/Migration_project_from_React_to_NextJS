import { z } from "zod";
import { formSchema } from "./schema";
import type {
  Form,
  FormField,
  FieldRule,
  FormTemplate,
  FormTemplateCategory,
  FormTemplateComplexity,
} from "./schema";
export { type SortKey, sortLabel } from "@/shared/lib/sort";

// ─── Tipos de estado de validación en tiempo real (D4) ───────────────────────

export type FieldValidationStatus = "idle" | "valid" | "invalid" | "pending";

export interface FieldState {
  value: string;
  status: FieldValidationStatus;
  error: string | null;
  isDirty: boolean;
}

export interface ActiveErrorSummary {
  fieldId: string;
  label: string;
  error: string;
}

export function createFieldRule(
  type: FieldRule["type"],
  value?: string,
  message?: string
): FieldRule {
  return {
    id: crypto.randomUUID(),
    type,
    value,
    message,
  };
}

export function createFormField(
  label: string,
  type: FormField["type"] = "text",
  rules: FieldRule[] = []
): FormField {
  return {
    id: crypto.randomUUID(),
    label,
    type,
    rules,
    placeholder: `Ingresá ${label.toLowerCase()}`,
  };
}

export function formatFieldType(type: FormField["type"]): string {
  const labels: Record<FormField["type"], string> = {
    text: "Texto",
    email: "Correo electrónico",
    number: "Número",
    password: "Contraseña",
    textarea: "Texto largo",
    date: "Fecha",
  };
  return labels[type] ?? type;
}

export function extractAllTags(forms: Form[]): string[] {
  const set = new Set<string>();
  for (const form of forms) {
    for (const tag of form.tags ?? []) set.add(tag);
  }
  return Array.from(set).sort();
}

export function formatRuleType(type: FieldRule["type"]): string {
  const labels: Record<FieldRule["type"], string> = {
    required: "Requerido",
    min: "Mínimo",
    max: "Máximo",
    email: "Email válido",
    regex: "Expresión regular",
  };
  return labels[type] ?? type;
}

export function getDefaultRuleValue(type: FieldRule["type"]): string {
  switch (type) {
    case "min":
      return "1";
    case "max":
      return "100";
    case "regex":
      return ".*";
    default:
      return "";
  }
}

export function countTemplateRules(template: FormTemplate): number {
  return template.fields.reduce(
    (total, field) => total + field.rules.length,
    0
  );
}

export type TemplateSortKey =
  | "name-asc"
  | "simple-first"
  | "complete-first"
  | "most-fields"
  | "most-rules";

export const templateCategoryLabels: Record<FormTemplateCategory, string> = {
  cuentas: "Cuentas",
  comercio: "Comercio",
  salud: "Salud",
  educacion: "Educación",
  soporte: "Soporte",
  feedback: "Feedback",
  reservas: "Reservas",
  servicios: "Servicios",
  "recursos-humanos": "Recursos humanos",
};

export const templateComplexityLabels: Record<FormTemplateComplexity, string> = {
  simple: "Simple",
  intermedia: "Intermedia",
  avanzada: "Avanzada",
};

const templateComplexityWeight: Record<FormTemplateComplexity, number> = {
  simple: 1,
  intermedia: 2,
  avanzada: 3,
};

export function getTemplateCategories(
  templates: FormTemplate[]
): FormTemplateCategory[] {
  return Array.from(new Set(templates.map((template) => template.category)));
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function templateMatchesSearch(
  template: FormTemplate,
  query: string
): boolean {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (normalizedQuery.length === 0) return true;

  const searchableText = [
    template.name,
    template.description,
    template.category,
    template.complexity,
    ...template.tags,
    ...template.fields.flatMap((field) => [
      field.label,
      field.type,
      field.placeholder ?? "",
      ...field.rules.flatMap((rule) => [
        rule.type,
        rule.value ?? "",
        rule.message ?? "",
      ]),
    ]),
  ].join(" ");

  return normalizeSearchText(searchableText).includes(normalizedQuery);
}

export function filterTemplates(
  templates: FormTemplate[],
  query: string,
  category: FormTemplateCategory | "all"
): FormTemplate[] {
  return templates.filter(
    (template) =>
      (category === "all" || template.category === category) &&
      templateMatchesSearch(template, query)
  );
}

export function sortTemplates(
  templates: FormTemplate[],
  sortKey: TemplateSortKey
): FormTemplate[] {
  const sorted = [...templates];

  switch (sortKey) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "simple-first":
      return sorted.sort(
        (a, b) =>
          templateComplexityWeight[a.complexity] -
          templateComplexityWeight[b.complexity]
      );
    case "complete-first":
      return sorted.sort(
        (a, b) =>
          templateComplexityWeight[b.complexity] -
          templateComplexityWeight[a.complexity]
      );
    case "most-fields":
      return sorted.sort((a, b) => b.fields.length - a.fields.length);
    case "most-rules":
      return sorted.sort((a, b) => countTemplateRules(b) - countTemplateRules(a));
    default:
      return sorted;
  }
}

// ─── Motor de reglas (D2) ────────────────────────────────────────────────────

/**
 * Valida un valor contra una regla individual.
 * Retorna el mensaje de error o null si pasa.
 *
 * Para campos de tipo "number", min/max comparan el valor numérico.
 * Para el resto de los tipos, min/max comparan la longitud del texto.
 */
function validateRule(
  value: string,
  rule: FieldRule,
  fieldType: FormField["type"] = "text"
): string | null {
  const msg = rule.message;

  switch (rule.type) {
    case "required":
      return value.trim() === ""
        ? (msg ?? "Este campo es obligatorio")
        : null;

    case "min": {
      const min = Number(rule.value ?? 0);
      if (fieldType === "number") {
        const num = Number(value);
        return Number.isNaN(num) || num < min
          ? (msg ?? `Mínimo ${min}`)
          : null;
      }
      return value.length < min
        ? (msg ?? `Mínimo ${min} caracteres`)
        : null;
    }

    case "max": {
      const max = Number(rule.value ?? Infinity);
      if (fieldType === "number") {
        const num = Number(value);
        return Number.isNaN(num) || num > max
          ? (msg ?? `Máximo ${max}`)
          : null;
      }
      return value.length > max
        ? (msg ?? `Máximo ${max} caracteres`)
        : null;
    }

    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value)
        ? (msg ?? "Ingresá un correo electrónico válido")
        : null;
    }

    case "regex": {
      try {
        const regex = new RegExp(rule.value ?? ".*");
        return !regex.test(value)
          ? (msg ?? "El valor no cumple el formato requerido")
          : null;
      } catch {
        return "Expresión regular inválida";
      }
    }

    default:
      return null;
  }
}

/**
 * Aplica todas las reglas de un campo en orden.
 * Retorna el primer error encontrado o null si todo pasa.
 */
export function validateField(
  value: string,
  rules: FieldRule[],
  fieldType: FormField["type"] = "text"
): string | null {
  for (const rule of rules) {
    const error = validateRule(value, rule, fieldType);
    if (error !== null) return error;
  }
  return null;
}

// ─── Helpers de validación en tiempo real (D4) ───────────────────────────────

/**
 * Valida un campo usando el motor de reglas existente.
 * Wrapper puro alrededor de validateField para facilitar su uso en hooks.
 */
export function validateFieldRules(value: string, field: FormField): string | null {
  return validateField(value, field.rules, field.type);
}

/**
 * Determina si el estado de los campos debe reiniciarse al cambiar de formulario.
 */
export function shouldResetFieldStates(
  previousFormId: string | null | undefined,
  nextFormId: string | null | undefined
): boolean {
  return previousFormId !== nextFormId;
}

/**
 * Resuelve el estado visual de un campo a partir de su valor, error y flags.
 */
export function resolveFieldStatus({
  value,
  isValidating,
  error,
  isDirty,
}: {
  value: string;
  isValidating: boolean;
  error: string | null;
  isDirty: boolean;
}): FieldValidationStatus {
  if (isValidating) return "pending";
  if (!isDirty && !value.trim()) return "idle";
  return error ? "invalid" : value.trim() ? "valid" : "idle";
}

/**
 * Construye el resumen de errores activos (campos tocados o con valor).
 */
export function buildErrorsSummary(
  form: Form | null | undefined,
  fieldsState: Record<string, FieldState>
): ActiveErrorSummary[] {
  if (!form) return [];

  return form.fields
    .map((field) => {
      const state = fieldsState[field.id];
      const currentValue = state ? state.value : "";
      const isActive = Boolean(state?.isDirty || currentValue.trim());

      if (!isActive) return null;

      const error = state ? state.error : validateFieldRules(currentValue, field);
      if (error) {
        return {
          fieldId: field.id,
          label: field.label,
          error,
        };
      }
      return null;
    })
    .filter((item): item is ActiveErrorSummary => item !== null);
}

/**
 * Verifica que todos los campos del formulario sean válidos.
 * A diferencia de errorsSummary, incluye campos aún no tocados.
 */
export function checkFormValidity(
  form: Form | null | undefined,
  fieldsState: Record<string, FieldState>
): boolean {
  if (!form) return true;

  return form.fields.every((field) => {
    const state = fieldsState[field.id];
    const value = state?.value ?? "";
    return validateFieldRules(value, field) === null;
  });
}

/**
 * Retorna las reglas que son compatibles con un tipo de campo dado.
 */
export function getCompatibleRules(fieldType: FormField["type"]): FieldRule["type"][] {
  const base: FieldRule["type"][] = ["required", "min", "max", "regex"];
  if (fieldType === "email") return [...base, "email"];
  if (fieldType === "number") return ["required", "min", "max"];
  if (fieldType === "date") return ["required"];
  return base;
}

/**
 * Construye un schema Zod dinámico a partir de los campos de un formulario.
 * Cada campo genera una clave en el schema cuyo valor es string y se valida
 * contra las reglas del campo usando el motor de reglas existente.
 */
export function buildFormSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodString> = {};
  for (const field of fields) {
    shape[field.id] = z.string().check((payload) => {
      const error = validateField(payload.value, field.rules, field.type);
      if (error !== null) {
        payload.issues.push({
          code: "custom",
          message: error,
          path: [field.id],
          input: payload.value,
        });
      }
    });
  }
  return z.object(shape);
}

/**
 * Clona un formulario generando nuevos ids para el formulario y sus campos.
 * El nombre se suffija con " (copia)" a menos que se indique uno personalizado.
 * Las reglas conservan su id (son estables dentro del campo) pero cada campo
 * recibe un id nuevo para evitar colisiones en el store.
 */
export function cloneForm(form: Form, customName?: string): Form {
  return {
    ...form,
    id: crypto.randomUUID(),
    name: customName ?? `${form.name} (copia)`,
    createdAt: new Date().toISOString(),
    fields: form.fields.map((field) => ({
      ...field,
      id: crypto.randomUUID(),
    })),
  };
}

/**
 * Serializa un formulario a JSON string con pretty-print.
 * Util para exportar/descargar formularios como archivo .json.
 */
export function serializeForm(form: Form): string {
  return JSON.stringify(form, null, 2);
}

export type ParseFormResult =
  | { ok: true; form: Form }
  | { ok: false; error: string };

interface ParseFormOptions {
  clone?: boolean;
}

/**
 * Parsea y valida un JSON string contra el schema del formulario.
 * Retorna un resultado discriminado en lugar de lanzar, para que la UI
 * pueda mostrar un mensaje claro sin try/catch suelto.
 */
export function parseForm(
  json: string,
  options: ParseFormOptions = {}
): ParseFormResult {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: "El texto no es JSON válido" };
  }

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return {
      ok: false,
      error:
        "El JSON no representa un formulario válido: " +
        result.error.issues.map((i) => i.message).join(", "),
    };
  }

  return {
    ok: true,
    form: options.clone === false ? result.data : cloneForm(result.data),
  };
}

/**
 * Convierte un nombre de formulario en un nombre de archivo seguro
 * (sin caracteres especiales ni espacios), listo para descargar.
 */
export function toSafeFilename(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? `${slug}.json` : "formulario.json";
}

/**
 * Codifica un formulario a base64 safe para URL.
 * Usa encodeURIComponent/btoa para soportar Unicode (acentos, emoji).
 */
export function encodeFormToBase64(form: Form): string {
  const json = serializeForm(form);
  return btoa(encodeURIComponent(json));
}

export type DecodeFormResult = ParseFormResult;

/**
 * Decodifica un base64 safe para URL y lo valida contra el schema.
 * Retorna un resultado discriminado para que la UI muestre un mensaje claro.
 */
export function decodeFormFromBase64(b64: string): DecodeFormResult {
  let json: string;
  try {
    json = decodeURIComponent(atob(b64));
  } catch {
    return { ok: false, error: "El enlace no contiene un formulario válido" };
  }
  return parseForm(json, { clone: false });
}

// ─── Estadísticas del formulario ─────────────────────────────────────────────

export interface FormStats {
  totalFields: number;
  totalRules: number;
  requiredCount: number;
  rulesByType: Record<string, number>;
  fieldTypeBreakdown: Record<string, number>;
}

/**
 * Deriva estadísticas de un formulario sin side effects.
 * Pura: dado el mismo input, siempre retorna el mismo output.
 */
export function computeFormStats(fields: Form["fields"]): FormStats {
  const rulesByType: Record<string, number> = {};
  const fieldTypeBreakdown: Record<string, number> = {};
  let totalRules = 0;
  let requiredCount = 0;

  for (const field of fields) {
    fieldTypeBreakdown[field.type] = (fieldTypeBreakdown[field.type] ?? 0) + 1;

    for (const rule of field.rules) {
      rulesByType[rule.type] = (rulesByType[rule.type] ?? 0) + 1;
      totalRules++;
      if (rule.type === "required") requiredCount++;
    }
  }

  return {
    totalFields: fields.length,
    totalRules,
    requiredCount,
    rulesByType,
    fieldTypeBreakdown,
  };
}

// ─── Helpers visuales del preview de formulario (D4) ─────────────────────────

/**
 * Resuelve el estado visual de un campo en la vista previa del formulario.
 */
export function resolvePreviewFieldStatus({
  isValidating,
  hasBeenTouched,
  hasValue,
  hasError,
}: {
  isValidating: boolean;
  hasBeenTouched: boolean;
  hasValue: boolean;
  hasError: boolean;
}): FieldValidationStatus {
  if (isValidating) return "pending";
  if (hasBeenTouched || hasValue) {
    return hasError ? "invalid" : "valid";
  }
  return "idle";
}

/**
 * Clases de borde y ring según el estado de validación del campo.
 */
export function getFieldStatusBorderClass(status: FieldValidationStatus): string {
  switch (status) {
    case "invalid":
      return "border-red-500 focus-visible:ring-red-500";
    case "valid":
      return "border-green-500 focus-visible:ring-green-500";
    case "pending":
      return "border-amber-500 focus-visible:ring-amber-500";
    default:
      return "";
  }
}

/**
 * Clases de color para el badge de estado del campo.
 */
export function getFieldStatusBadgeClasses(status: FieldValidationStatus): string {
  switch (status) {
    case "valid":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "invalid":
      return "bg-red-100 text-red-700";
    default:
      return "";
  }
}

/**
 * Etiqueta textual del badge de estado del campo.
 */
const TAG_COLORS: ReadonlyArray<string> = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
];

export function tagColorClass(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) & 0xffffffff;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getFieldStatusBadgeLabel(status: FieldValidationStatus): string {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "valid":
      return "Válido";
    case "invalid":
      return "Inválido";
    default:
      return "";
  }
}
