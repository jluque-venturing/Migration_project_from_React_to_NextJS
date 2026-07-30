"use client";

import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { FORM_THEME_PRESETS } from "@/features/form-theme/presets";
import { radiusToClass, fontFamilyClass, getFormBorderRadius, PRESET_NAMES } from "@/features/form-theme/utils";
import { cn, cssVars } from "@/shared/lib/helpers";
import { Check, Trash2, Sparkles } from "lucide-react";

export function ThemePresetGrid() {
  const { theme, applyPreset, userPresets, removeUserPreset } = useFormTheme();

  return (
    <div className="space-y-6">
      {/* User presets */}
      {userPresets.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
            <Sparkles size={14} className="text-primary" />
            Mis plantillas
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 list-none">
            {userPresets.map((userPreset) => {
              const preset = userPreset.theme;
              const isSelected = theme.presetId === preset.presetId;
              return (
                <li key={userPreset.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full flex-col items-stretch overflow-hidden rounded-lg border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-14 items-center justify-center text-2xl bg-[var(--preset-bg)] text-[var(--preset-text)]",
                        radiusToClass(getFormBorderRadius(preset))
                      )}
                      style={cssVars({
                        "--preset-bg": preset.backgroundColor,
                        "--preset-text": preset.textColor,
                      })}
                    >
                      <span>{preset.emoji || "🎨"}</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 bg-[var(--preset-primary)] text-white",
                        fontFamilyClass(preset.fontFamily)
                      )}
                      style={cssVars({ "--preset-primary": preset.primaryColor })}
                    >
                      <span className="truncate text-xs font-medium">
                        {userPreset.name}
                      </span>
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30">
                          <Check size={10} />
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeUserPreset(userPreset.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Eliminar plantilla ${userPreset.name}`}
                  >
                    <Trash2 size={10} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Built-in presets */}
      <section>
        {userPresets.length > 0 && (
          <h3 className="mb-3 text-sm font-semibold text-text-muted">
            Plantillas del sistema
          </h3>
        )}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 list-none">
          {FORM_THEME_PRESETS.map((preset) => {
            const isSelected = theme.presetId === preset.presetId;
            return (
              <li key={preset.presetId}>
                <button
                  key={preset.presetId}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group relative flex w-full flex-col items-stretch overflow-hidden rounded-lg border-2 text-left transition-all duration-200",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 items-center justify-center text-2xl transition-transform group-hover:scale-110 bg-[var(--preset-bg)] text-[var(--preset-text)]",
                      radiusToClass(getFormBorderRadius(preset))
                    )}
                    style={cssVars({
                      "--preset-bg": preset.backgroundColor,
                      "--preset-text": preset.textColor,
                    })}
                  >
                    <span>{preset.emoji}</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 bg-[var(--preset-primary)] text-white",
                      fontFamilyClass(preset.fontFamily)
                    )}
                    style={cssVars({ "--preset-primary": preset.primaryColor })}
                  >
                    <span className="truncate text-xs font-medium">
                      {PRESET_NAMES[preset.presetId] ?? preset.presetId}
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30">
                        <Check size={10} />
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
