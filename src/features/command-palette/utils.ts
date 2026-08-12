import { Sun, Moon, Monitor } from "lucide-react";
import type { Command } from "./schema";
import type { ThemeMode } from "@/features/settings/schema";

export const themeIconFor: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function filterCommands(commands: Command[], query: string): Command[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return commands;
  return commands.filter((command) => {
    const labelMatch = command.label.toLowerCase().includes(trimmed);
    const keywordsMatch = command.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(trimmed)
    );
    return labelMatch || Boolean(keywordsMatch);
  });
}
