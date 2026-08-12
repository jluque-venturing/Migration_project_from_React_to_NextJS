import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormTheme } from "./schema";
import { getDefaultTheme } from "./utils";

interface UserPreset {
  id: string;
  name: string;
  theme: FormTheme;
  createdAt: string;
}

interface FormThemeState {
  currentTheme: FormTheme;
  isDrawerOpen: boolean;
  userPresets: UserPreset[];
  setTheme: (theme: FormTheme) => void;
  applyPreset: (preset: FormTheme) => void;
  updateField: <K extends keyof FormTheme>(key: K, value: FormTheme[K]) => void;
  updateFields: (partial: Partial<FormTheme>) => void;
  setImage: (key: "backgroundImage" | "logoImage", dataUrl: string | undefined) => void;
  resetTheme: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  saveAsPreset: (name: string) => void;
  removeUserPreset: (id: string) => void;
}

export type { UserPreset };

export const useFormThemeStore = create<FormThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: getDefaultTheme(),
      isDrawerOpen: false,
      userPresets: [],
      setTheme: (theme) => set({ currentTheme: theme }),
      applyPreset: (preset) => set({ currentTheme: { ...preset } }),
      updateField: (key, value) =>
        set((state) => ({
          currentTheme: { ...state.currentTheme, [key]: value },
        })),
      updateFields: (partial) =>
        set((state) => ({
          currentTheme: { ...state.currentTheme, ...partial },
        })),
      setImage: (key, dataUrl) =>
        set((state) => ({
          currentTheme: { ...state.currentTheme, [key]: dataUrl },
        })),
      resetTheme: () => set({ currentTheme: getDefaultTheme() }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      saveAsPreset: (name) => {
        const theme = get().currentTheme;
        const newPreset: UserPreset = {
          id: crypto.randomUUID(),
          name,
          theme: {
            ...theme,
            presetId: `user-${crypto.randomUUID().slice(0, 8)}`,
            backgroundImage: undefined,
            logoImage: undefined,
          },
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          userPresets: [...state.userPresets, newPreset],
        }));
      },
      removeUserPreset: (id) =>
        set((state) => ({
          userPresets: state.userPresets.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "form-theme-storage",
      partialize: (state) => ({
        userPresets: state.userPresets,
      }),
      // Evita la hidratación automática en el servidor para prevenir mismatches con el cliente.
      // La rehidratación se manejará explícitamente en un componente cliente de alto nivel (ej. Providers).
      skipHydration: true,
    }
  )
);
