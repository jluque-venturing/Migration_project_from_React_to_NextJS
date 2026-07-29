import { Sun, Moon, Monitor } from "lucide-react";
import type { ThemeMode } from "./schema";

export const themeModeIconFor: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function resolveTheme(mode: ThemeMode, systemTheme: "light" | "dark"): "light" | "dark" {
  return mode === "system" ? systemTheme : mode;
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  const order: ThemeMode[] = ["light", "dark", "system"];
  const index = order.indexOf(mode);
  return order[(index + 1) % order.length] as ThemeMode;
}

export function themeModeLabel(mode: ThemeMode): string {
  const labels: Record<ThemeMode, string> = {
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  };
  return labels[mode] ?? mode;
}
