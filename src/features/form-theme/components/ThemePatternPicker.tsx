"use client";

import { Check } from "lucide-react";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { PATTERN_OPTIONS, patternToClass } from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import type { Pattern } from "@/features/form-theme/schema";

export function ThemePatternPicker() {
  const { theme, updateField } = useFormTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Patrón de fondo"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {PATTERN_OPTIONS.map((option) => {
        const isSelected = theme.pattern === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => updateField("pattern", option.value as Pattern)}
            className={cn(
              "relative h-20 overflow-hidden rounded-lg border-2 transition-colors",
              isSelected
                ? "border-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-surface",
                option.value !== "none" && patternToClass(option.value as Pattern)
              )}
            />
            <span className="absolute inset-x-0 bottom-1 text-center text-xs font-medium text-text bg-white/80 py-0.5">
              {option.label}
            </span>
            {isSelected && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <Check size={12} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
