"use client";

import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { isValidHexColor, normalizeHexColor, COLOR_PALETTE_PRESETS } from "@/features/form-theme/utils";
import { cn, cssVars } from "@/shared/lib/helpers";
import { ArrowLeftRight, Check } from "lucide-react";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowOpacity?: boolean;
}

function ColorField({ label, value, onChange, allowOpacity }: ColorFieldProps) {
  const colorId = `color-field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={colorId} className="block text-xs font-medium text-text-muted mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={colorId}
          type="color"
          value={isValidHexColor(value) ? value : "#000000"}
          onChange={(e) => onChange(normalizeHexColor(e.target.value))}
          className="h-9 w-12 cursor-pointer rounded border border-border bg-surface"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(allowOpacity ? e.target.value : normalizeHexColor(e.target.value))}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={allowOpacity ? "rgba(0,0,0,0.5)" : "#3b82f6"}
          maxLength={allowOpacity ? 25 : 7}
          aria-label={`${label} (código)`}
        />
      </div>
    </div>
  );
}

export function ThemeColorPicker() {
  const { theme, updateField, updateFields } = useFormTheme();

  const handleSwapColors = () => {
    updateFields({
      backgroundColor: theme.textColor,
      textColor: theme.backgroundColor,
    });
  };

  const handleApplyPalette = (palette: typeof COLOR_PALETTE_PRESETS[number]) => {
    updateFields({
      primaryColor: palette.primary,
      accentColor: palette.accent,
      backgroundColor: palette.bg,
      textColor: palette.text,
    });
  };

  return (
    <div className="space-y-5">
      {/* Quick color palettes */}
      <section>
        <h3 className="mb-2 text-xs font-medium text-text-muted">
          Paletas rápidas
        </h3>
        <ul className="grid grid-cols-4 gap-2 list-none">
          {COLOR_PALETTE_PRESETS.map((palette) => {
            const isActive =
              theme.primaryColor === palette.primary &&
              theme.accentColor === palette.accent;
            return (
              <li key={palette.name}>
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => handleApplyPalette(palette)}
                  className={cn(
                    "group relative flex w-full flex-col items-center gap-1.5 rounded-lg border p-2 transition-all duration-150",
                    isActive
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                  aria-label={`Paleta ${palette.name}`}
                >
                <div className="flex gap-0.5" aria-hidden="true">
                  <div
                    className="h-5 w-5 rounded-l-md bg-[var(--swatch-primary)]"
                    style={cssVars({ "--swatch-primary": palette.primary })}
                  />
                  <div
                    className="h-5 w-5 bg-[var(--swatch-accent)]"
                    style={cssVars({ "--swatch-accent": palette.accent })}
                  />
                  <div
                    className="h-5 w-5 rounded-r-md border border-border bg-[var(--swatch-bg)]"
                    style={cssVars({ "--swatch-bg": palette.bg })}
                  />
                </div>
                <span className="text-[10px] font-medium text-text-muted">
                  {palette.name}
                </span>
                {isActive && (
                  <Check
                    size={10}
                    className="absolute right-1 top-1 text-primary"
                    aria-hidden="true"
                  />
                )}
              </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Manual color pickers */}
      <ColorField
        label="Color primario"
        value={theme.primaryColor}
        onChange={(value) => updateField("primaryColor", value)}
      />
      <ColorField
        label="Color de acento"
        value={theme.accentColor}
        onChange={(value) => updateField("accentColor", value)}
      />
      <ColorField
        label="Color de fondo"
        value={theme.backgroundColor}
        onChange={(value) => updateField("backgroundColor", value)}
      />
      <ColorField
        label="Color de texto"
        value={theme.textColor}
        onChange={(value) => updateField("textColor", value)}
      />

      {/* Swap colors button */}
      <button
        type="button"
        onClick={handleSwapColors}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
      >
        <ArrowLeftRight size={14} />
        Invertir fondo y texto
      </button>

      {theme.backgroundImage && (
        <ColorField
          label="Overlay sobre la imagen de fondo"
          value={theme.backgroundOverlay ?? "rgba(0,0,0,0.4)"}
          onChange={(value) => updateField("backgroundOverlay", value)}
          allowOpacity
        />
      )}
    </div>
  );
}
