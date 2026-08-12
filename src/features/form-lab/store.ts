import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Form } from "./schema";
import { cloneForm } from "./utils";

interface FormLabState {
  forms: Form[];
  currentForm: Form | null;
  addForm: (form: Form) => void;
  duplicateForm: (id: string) => void;
  removeForm: (id: string) => void;
  setCurrentForm: (form: Form | null) => void;
  updateForm: (form: Form) => void;
  getFormById: (id: string) => Form | undefined;
  updateFormTags: (id: string, tags: string[]) => void;
}

export const useFormLabStore = create<FormLabState>()(
  persist(
    (set, get) => ({
      forms: [],
      currentForm: null,
      addForm: (form) =>
        set((state) => ({
          forms: [...state.forms, form],
        })),
      duplicateForm: (id) =>
        set((state) => {
          const original = state.forms.find((f) => f.id === id);
          if (!original) return state;
          return { forms: [...state.forms, cloneForm(original)] };
        }),
      removeForm: (id) =>
        set((state) => ({
          forms: state.forms.filter((f) => f.id !== id),
        })),
      setCurrentForm: (form) => set({ currentForm: form }),
      updateForm: (form) =>
        set((state) => ({
          forms: state.forms.map((f) => (f.id === form.id ? form : f)),
          currentForm: state.currentForm?.id === form.id ? form : state.currentForm,
        })),
      getFormById: (id) => get().forms.find((f) => f.id === id),
      updateFormTags: (id, tags) =>
        set((state) => ({
          forms: state.forms.map((f) =>
            f.id === id ? { ...f, tags } : f
          ),
        })),
    }),
    {
      name: "form-lab-storage",
      // Evita la hidratación automática en el servidor para prevenir mismatches
      // con el cliente. La rehidratación se dispara en app/providers.tsx.
      skipHydration: true,
    }
  )
);
