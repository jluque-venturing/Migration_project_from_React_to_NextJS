import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collectionColorSchema } from "./schema";
import type { Collection, CollectionColor } from "./types";

interface CollectionState {
  collections: Collection[];
  addCollection: (name: string, color?: CollectionColor) => string;
  removeCollection: (id: string) => void;
  renameCollection: (id: string, name: string) => void;
  updateCollectionColor: (id: string, color: CollectionColor) => void;
  toggleFormInCollection: (collectionId: string, formId: string) => void;
  addFormToCollection: (collectionId: string, formId: string) => void;
  removeFormFromCollection: (collectionId: string, formId: string) => void;
  removeFormFromAllCollections: (formId: string) => void;
}

const COLORS: CollectionColor[] = collectionColorSchema.options;

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collections: [],

      addCollection: (name, color) => {
        const id = crypto.randomUUID();
        const finalColor = color || COLORS[Math.floor(Math.random() * COLORS.length)];

        set((state) => ({
          collections: [
            ...state.collections,
            {
              id,
              name: name.trim(),
              color: finalColor,
              formIds: [],
            },
          ],
        }));

        return id;
      },

      removeCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      renameCollection: (id, name) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, name: name.trim() } : c
          ),
        })),

      updateCollectionColor: (id, color) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, color } : c
          ),
        })),

      toggleFormInCollection: (collectionId, formId) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            const exists = c.formIds.includes(formId);
            return {
              ...c,
              formIds: exists
                ? c.formIds.filter((id) => id !== formId)
                : [...c.formIds, formId],
            };
          }),
        })),

      addFormToCollection: (collectionId, formId) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            if (c.formIds.includes(formId)) return c;
            return { ...c, formIds: [...c.formIds, formId] };
          }),
        })),

      removeFormFromCollection: (collectionId, formId) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            return { ...c, formIds: c.formIds.filter((id) => id !== formId) };
          }),
        })),

      removeFormFromAllCollections: (formId) =>
        set((state) => ({
          collections: state.collections.map((c) => ({
            ...c,
            formIds: c.formIds.filter((id) => id !== formId),
          })),
        })),
    }),
    {
      name: "collections-storage",
      // Evita la hidratación automática en el servidor para prevenir mismatches
      // con el cliente. La rehidratación se dispara en app/providers.tsx.
      skipHydration: true,
    }
  )
);
