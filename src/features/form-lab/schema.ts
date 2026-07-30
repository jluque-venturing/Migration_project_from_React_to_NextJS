import { z } from "zod";
import { formThemeSchema } from "@/features/form-theme/schema";

const fieldTypeSchema = z.enum([
  "text",
  "email",
  "number",
  "password",
  "textarea",
  "date",
]);

export const fieldRuleSchema = z.object({
  id: z.string(),
  type: z.enum(["required", "min", "max", "email", "regex"]),
  value: z.string().optional(),
  message: z.string().optional(),
});

export const formFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: fieldTypeSchema,
  rules: z.array(fieldRuleSchema),
  placeholder: z.string().optional(),
});

export const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  fields: z.array(formFieldSchema),
  createdAt: z.iso.datetime(),
  theme: formThemeSchema.optional(),
});

export type FieldType = z.infer<typeof fieldTypeSchema>;
export type FieldRule = z.infer<typeof fieldRuleSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
export type Form = z.infer<typeof formSchema>;

const formTemplateIdSchema = z.enum([
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
]);

const formTemplateCategorySchema = z.enum([
  "cuentas",
  "comercio",
  "salud",
  "educacion",
  "soporte",
  "feedback",
  "reservas",
  "servicios",
  "recursos-humanos",
]);

const formTemplateComplexitySchema = z.enum([
  "simple",
  "intermedia",
  "avanzada",
]);

const templateRuleSchema = fieldRuleSchema.omit({ id: true }).extend({
  message: z.string().min(1),
});

const templateFieldSchema = formFieldSchema
  .omit({ id: true, rules: true })
  .extend({
    rules: z.array(templateRuleSchema),
  });

export const formTemplateSchema = z.object({
  id: formTemplateIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  category: formTemplateCategorySchema,
  tags: z.array(z.string().min(1)).min(1),
  complexity: formTemplateComplexitySchema,
  fields: z.array(templateFieldSchema).min(1),
});

export type FormTemplate = z.infer<typeof formTemplateSchema>;
export type FormTemplateCategory = z.infer<typeof formTemplateCategorySchema>;
export type FormTemplateComplexity = z.infer<typeof formTemplateComplexitySchema>;
