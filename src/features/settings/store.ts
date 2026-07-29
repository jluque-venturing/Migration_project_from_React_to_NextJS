import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "./schema";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const order: ThemeMode[] = ["light", "dark", "system"];

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => {
          const index = order.indexOf(state.mode);
          return { mode: order[(index + 1) % order.length] as ThemeMode };
        }),
    }),
    {
      name: "form-lab-theme",
      skipHydration: true,
    }
  )
);
