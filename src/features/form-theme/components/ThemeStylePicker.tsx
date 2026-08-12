"use client";

import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  CARD_STYLE_OPTIONS,
  TITLE_ALIGNMENT_OPTIONS,
  SHADOW_OPTIONS,
  shadowClass,
  getFormBorderRadius,
  getInputBorderRadius,
  getButtonBorderRadius,
  borderWidthToNumber,
  hasBorder,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import { Input } from "@/shared/components/ui/Input";
import { isValidHexColor, normalizeHexColor } from "@/features/form-theme/utils";
import type {
  BorderRadius,
  FontFamily,
  Spacing,
  CardStyle,
  TitleAlignment,
} from "@/features/form-theme/schema";

export interface RadioGroupProps<T extends string> {
  legend: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export function RadioGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <fieldset>
      <legend className="block text-xs font-medium text-text-muted mb-1.5">
        {legend}
      </legend>
      <div role="radiogroup" className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150",
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-surface text-text hover:border-primary/50"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ThemeStylePicker() {
  const { theme, updateField } = useFormTheme();

  return (
    <div className="space-y-5">
      {/* Border width and color controls */}
      <div>
        <label htmlFor="border-width-range" className="block text-xs font-medium text-text-muted mb-1.5">
          Grosor del borde — {borderWidthToNumber(theme.borderWidth) === 0 ? "Sin borde" : `${borderWidthToNumber(theme.borderWidth)}px`}
        </label>
        <input
          id="border-width-range"
          type="range"
          min={0}
          max={6}
          step={1}
          value={borderWidthToNumber(theme.borderWidth)}
          onChange={(e) => updateField("borderWidth", Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {hasBorder(theme.borderWidth) && (
        <div>
          <span className="block text-xs font-medium text-text-muted mb-1">
            Color del borde
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isValidHexColor(theme.borderColor) ? theme.borderColor : "#e2e8f0"}
              onChange={(e) => updateField("borderColor", normalizeHexColor(e.target.value))}
              className="h-9 w-12 cursor-pointer rounded border border-border bg-surface"
              aria-label="Color del borde (selector)"
            />
            <input
              id="border-color-text"
              type="text"
              value={theme.borderColor}
              onChange={(e) => updateField("borderColor", e.target.value)}
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="#e2e8f0"
              maxLength={7}
              aria-label="Código hex del color del borde"
            />
          </div>
        </div>
      )}

      {/* Border radius controls */}
      <div className="space-y-4">
        <RadioGroup<BorderRadius>
          legend="Radio de borde del formulario"
          options={RADIUS_OPTIONS.reduce<ReadonlyArray<{ value: BorderRadius; label: string }>>((acc, o) =>
            o.value !== "full" ? [...acc, { value: o.value, label: o.label }] : acc, []
          )}
          value={getFormBorderRadius(theme)}
          onChange={(value) => updateField("borderRadiusForm", value)}
        />

        <RadioGroup<BorderRadius>
          legend="Radio de borde de los campos"
          options={RADIUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={getInputBorderRadius(theme)}
          onChange={(value) => updateField("borderRadiusInput", value)}
        />

        <RadioGroup<BorderRadius>
          legend="Radio de borde del botón"
          options={RADIUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={getButtonBorderRadius(theme)}
          onChange={(value) => updateField("borderRadiusButton", value)}
        />
      </div>

      <RadioGroup<FontFamily>
        legend="Tipografía del cuerpo"
        options={FONT_OPTIONS}
        value={theme.fontFamily}
        onChange={(value) => updateField("fontFamily", value)}
      />

      <RadioGroup<FontFamily>
        legend="Tipografía de títulos"
        options={FONT_OPTIONS}
        value={theme.headingFontFamily}
        onChange={(value) => updateField("headingFontFamily", value)}
      />

      <RadioGroup<Spacing>
        legend="Espaciado entre campos"
        options={SPACING_OPTIONS}
        value={theme.spacing}
        onChange={(value) => updateField("spacing", value)}
      />

      <RadioGroup<CardStyle>
        legend="Estilo del contenedor"
        options={CARD_STYLE_OPTIONS}
        value={theme.cardStyle}
        onChange={(value) => updateField("cardStyle", value)}
      />

      {/* NEW: Shadow */}
      <fieldset>
        <legend className="block text-xs font-medium text-text-muted mb-1.5">
          Sombra del formulario
        </legend>
        <div className="grid grid-cols-3 gap-1.5">
          {SHADOW_OPTIONS.map((option) => {
            const isSelected = theme.shadow === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateField("shadow", option.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-2 text-xs transition-all duration-150",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-text hover:border-primary/50"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-8 rounded bg-primary/80",
                    shadowClass(option.value)
                  )}
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <RadioGroup<TitleAlignment>
        legend="Alineación del título"
        options={TITLE_ALIGNMENT_OPTIONS}
        value={theme.titleAlignment}
        onChange={(value) => updateField("titleAlignment", value)}
      />

      <div>
        <label
          htmlFor="submit-label"
          className="block text-xs font-medium text-text-muted mb-1"
        >
          Texto del botón de enviar
        </label>
        <Input
          id="submit-label"
          value={theme.submitLabel}
          onChange={(e) => updateField("submitLabel", e.target.value)}
          placeholder="Enviar"
        />
      </div>

      <fieldset>
        <legend className="block text-xs font-medium text-text-muted mb-1">
          Opciones extra
        </legend>
        <label className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm text-text cursor-pointer hover:border-primary/50 transition-colors">
          <input
            type="checkbox"
            checked={theme.showProgressBar}
            onChange={(e) => updateField("showProgressBar", e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Mostrar barra de progreso
        </label>
      </fieldset>
    </div>
  );
}
