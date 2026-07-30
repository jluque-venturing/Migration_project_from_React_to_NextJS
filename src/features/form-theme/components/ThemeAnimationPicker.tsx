"use client";

import { useState } from "react";
import { Play, Sparkles, Zap, MousePointerClick, RotateCcw } from "lucide-react";
import { cn, cssVars } from "@/shared/lib/helpers";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  SUBMIT_ANIMATION_OPTIONS,
  FIELD_ENTRANCE_ANIMATION_OPTIONS,
  radiusToClass,
  getInputBorderRadius,
  getButtonBorderRadius,
  SUBMIT_PREVIEW_CLASS,
  FIELD_PREVIEW_CLASS,
} from "@/features/form-theme/utils";
import type { SubmitAnimation, FieldEntranceAnimation } from "@/features/form-theme/schema";

const submitIcons: Record<string, typeof Play> = {
  none: MousePointerClick,
  pulse: Play,
  shake: Zap,
  zoom: Sparkles,
  bounce: Play,
  race: Zap,
  confetti: Sparkles,
  rocket: Sparkles,
};

export function ThemeAnimationPicker() {
  const { theme, updateField } = useFormTheme();
  const [submitPreviewKey, setSubmitPreviewKey] = useState(0);
  const [fieldPreviewKey, setFieldPreviewKey] = useState(0);

  const handleSelectSubmitAnimation = (value: SubmitAnimation) => {
    updateField("submitAnimation", value);
    setSubmitPreviewKey((prev) => prev + 1);
  };

  const handleSelectFieldAnimation = (value: FieldEntranceAnimation) => {
    updateField("fieldEntranceAnimation", value);
    setFieldPreviewKey((prev) => prev + 1);
  };

  const replaySubmitPreview = () => setSubmitPreviewKey((prev) => prev + 1);
  const replayFieldPreview = () => setFieldPreviewKey((prev) => prev + 1);

  return (
    <div className="space-y-6">
      {/* Submit button animation */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-text">
          Animación del botón de enviar
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {SUBMIT_ANIMATION_OPTIONS.map((option) => {
            const Icon = submitIcons[option.value];
            const isActive = theme.submitAnimation === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectSubmitAnimation(option.value as SubmitAnimation)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-150",
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-surface text-text hover:border-primary/50"
                )}
              >
                <Icon size={16} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Submit animation preview */}
        {theme.submitAnimation !== "none" && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-border bg-surface/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">
                Vista previa
              </span>
              <button
                type="button"
                onClick={replaySubmitPreview}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
              >
                <RotateCcw size={12} />
                Repetir
              </button>
            </div>
            <div className="flex justify-center">
              <button
                key={submitPreviewKey}
                type="button"
                onClick={replaySubmitPreview}
                className={cn(
                  "px-5 py-2.5 text-sm font-medium text-white transition-opacity form-themed-bg-primary",
                  radiusToClass(getButtonBorderRadius(theme)),
                  SUBMIT_PREVIEW_CLASS[theme.submitAnimation]
                )}
              >
                {theme.submitLabel || "Enviar"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Field entrance animation */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-text">
          Animación de entrada de los campos
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {FIELD_ENTRANCE_ANIMATION_OPTIONS.map((option) => {
            const isActive = theme.fieldEntranceAnimation === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectFieldAnimation(option.value as FieldEntranceAnimation)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-150",
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-surface text-text hover:border-primary/50"
                )}
              >
                <span>{option.label}</span>
                {isActive && <Sparkles size={14} />}
              </button>
            );
          })}
        </div>

        {/* Field entrance preview */}
        {theme.fieldEntranceAnimation !== "none" && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-border bg-surface/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">
                Vista previa
              </span>
              <button
                type="button"
                onClick={replayFieldPreview}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
              >
                <RotateCcw size={12} />
                Repetir
              </button>
            </div>
            <div
              key={fieldPreviewKey}
              className={cn(
                "space-y-3",
                FIELD_PREVIEW_CLASS[theme.fieldEntranceAnimation]
              )}
            >
              <div>
                <span
                  className="mb-1 block text-xs font-medium form-themed-text"
                >
                  Campo de ejemplo
                </span>
                <div
                  className={cn(
                    "border bg-white/50 px-3 py-2 text-sm text-text-muted border-[var(--preview-border-color)]",
                    radiusToClass(getInputBorderRadius(theme))
                  )}
                  style={cssVars({ "--preview-border-color": theme.borderColor || "#e2e8f0" })}
                >
                  Ingresá un valor...
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
