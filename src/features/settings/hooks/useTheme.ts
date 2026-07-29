import { useEffect } from "react";
import { useThemeStore } from "@/features/settings/store";
import { useSystemTheme } from "@/features/settings/hooks/useSystemTheme";
import {
  resolveTheme,
  nextThemeMode,
  themeModeLabel,
} from "@/features/settings/utils";
import { applyThemeToDocument } from "@/features/settings/dom-helpers";

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  const systemTheme = useSystemTheme();
  const resolved = resolveTheme(mode, systemTheme);

  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    applyThemeToDocument(resolved);
  }, [resolved]);

  return {
    mode,
    resolved,
    setMode,
    toggleMode: () => setMode(nextThemeMode(mode)),
    cycleToNext: () => setMode(nextThemeMode(mode)),
    label: themeModeLabel(mode),
  } as const;
}
