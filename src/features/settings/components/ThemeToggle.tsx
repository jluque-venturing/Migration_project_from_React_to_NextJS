"use client";

import { useTheme } from "@/features/settings/hooks/useTheme";
import { cn } from "@/shared/lib/helpers";
import { themeModeIconFor } from "../utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, cycleToNext, label } = useTheme();
  const Icon = themeModeIconFor[mode];

  return (
    <button
      type="button"
      onClick={cycleToNext}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
        "bg-transparent text-text hover:bg-surface",
        className
      )}
      aria-label={`Tema actual: ${label}. Click para cambiar.`}
      title={`Tema: ${label}`}
    >
      <Icon size={18} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
