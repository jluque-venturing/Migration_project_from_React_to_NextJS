import { z } from "zod";

const toastTypeSchema = z.enum(["success", "error", "warning", "info"]);

// Schema interno usado para derivar el tipo Toast. No se exporta porque
// el contrato público del feature es el tipo, no el schema.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toastSchema = z.object({
  id: z.string(),
  type: toastTypeSchema,
  message: z.string().min(1),
  duration: z.number().positive(),
});

export type ToastType = z.infer<typeof toastTypeSchema>;
export type Toast = z.infer<typeof toastSchema>;
