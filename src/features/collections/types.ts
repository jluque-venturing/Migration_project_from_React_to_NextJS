import { z } from "zod";
import {
  collectionSchema,
  collectionColorSchema,
  createCollectionSchema,
} from "./schema";

export type CollectionColor = z.infer<typeof collectionColorSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
