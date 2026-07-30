import { z } from "zod";

export const collectionColorSchema = z.enum([
  "blue",
  "violet",
  "emerald",
  "amber",
  "pink",
  "slate",
]);

export const collectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre de la colección es obligatorio"),
  color: collectionColorSchema.default("slate"),
  formIds: z.array(z.string()).default([]),
});

export const createCollectionSchema = collectionSchema.pick({
  name: true,
  color: true,
});

export const newCollectionFormSchema = z.object({
  name: z.string().min(1, "El nombre de la colección es obligatorio"),
  color: collectionColorSchema,
});
