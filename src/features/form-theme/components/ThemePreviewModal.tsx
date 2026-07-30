"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type FieldErrors, type UseFormRegister, type UseFormHandleSubmit } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { buildFormSchema } from "@/features/form-lab/utils";
import type { FormField } from "@/features/form-lab/schema";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  getDefaultTheme,
  spacingClass,
  fontFamilyClass,
  radiusToClass,
  getInputBorderRadius,
  getButtonBorderRadius,
  submitAnimationClass,
  fieldEntranceAnimationClass,
} from "@/features/form-theme/utils";
import { applyThemeToCssVars } from "@/features/form-theme/dom-helpers";
import { cn, cssVars } from "@/shared/lib/helpers";
import { ThemedFormLayout, ThemedFormSuccess } from "./ThemedFormLayout";

interface ThemePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formName: string;
  formDescription?: string;
  fields: FormField[];
}

export function ThemePreviewModal({
  isOpen,
  onClose,
  formName,
  formDescription,
  fields,
}: ThemePreviewModalProps) {
  const { theme } = useFormTheme();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolver = zodResolver(buildFormSchema(fields));
  const defaultValues = Object.fromEntries(fields.map((field) => [field.id, ""]));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver,
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onCloseRef = useRef(onClose);
  const resetRef = useRef(reset);
  const defaultValuesRef = useRef(defaultValues);

  useEffect(() => {
    onCloseRef.current = onClose;
    resetRef.current = reset;
    defaultValuesRef.current = defaultValues;
  });

  useEffect(() => {
    applyThemeToCssVars(theme);
    return () => applyThemeToCssVars(getDefaultTheme());
  }, [theme]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    dialog.showModal();
  }, [isOpen]);

  const handleClose = () => {
    resetRef.current(defaultValuesRef.current);
    setIsSuccess(false);
    setIsSubmitting(false);
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
    onCloseRef.current();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleDialogClose = () => handleClose();
    dialog.addEventListener("close", handleDialogClose);
    return () => dialog.removeEventListener("close", handleDialogClose);
  }, []);

  if (!mounted || !isOpen) return null;

  const onSubmit = () => {
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
    setIsSubmitting(true);
    submitTimeoutRef.current = setTimeout(() => {
      submitTimeoutRef.current = null;
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    reset(defaultValues);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Vista previa ampliada del formulario"
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center bg-transparent p-4 sm:p-6"
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out] cursor-default"
        onClick={handleClose}
        aria-label="Cerrar vista previa"
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-[scaleIn_250ms_ease-out]">
        <ThemedFormLayout
          theme={theme}
          formName={formName}
          formDescription={formDescription}
          className="p-6 sm:p-10"
        >
          <div className="absolute right-0 top-0">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              <X size={18} />
              Cerrar
            </Button>
          </div>

          {isSuccess ? (
            <ThemedFormSuccess
              theme={theme}
              message="Gracias por completar el formulario."
              onReset={handleReset}
            />
          ) : (
            <ThemePreviewFormFields
              theme={theme}
              fields={fields}
              isSubmitting={isSubmitting}
              errors={errors}
              register={register}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
            />
          )}
        </ThemedFormLayout>
      </div>
    </dialog>
  );
}

interface ThemePreviewFormFieldsProps {
  theme: ReturnType<typeof useFormTheme>["theme"];
  fields: FormField[];
  isSubmitting: boolean;
  errors: FieldErrors<Record<string, string>>;
  register: UseFormRegister<Record<string, string>>;
  onSubmit: () => void;
  handleSubmit: UseFormHandleSubmit<Record<string, string>>;
}

function ThemePreviewFormFields({
  theme,
  fields,
  isSubmitting,
  errors,
  register,
  onSubmit,
  handleSubmit,
}: ThemePreviewFormFieldsProps) {
  return (
    <>
      {theme.showProgressBar && (
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 opacity-80 form-themed-text">
            <span>Progreso</span>
            <span>0%</span>
          </div>
          <div className="form-progress-bar">
            <div style={cssVars({ "--form-progress-width": "0%" })} />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col",
          spacingClass(theme.spacing),
          fontFamilyClass(theme.fontFamily)
        )}
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn(
              fieldEntranceAnimationClass(theme.fieldEntranceAnimation),
              "form-anim-stagger"
            )}
            style={cssVars({ "--anim-delay": `${index * 80}ms` })}
          >
            <label
              htmlFor={`preview-${field.id}`}
              className="mb-1.5 block text-sm font-medium form-themed-text"
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <Textarea
                id={`preview-${field.id}`}
                className={cn(radiusToClass(getInputBorderRadius(theme)))}
                placeholder={field.placeholder}
                error={errors[field.id]?.message}
                errorId={`preview-${field.id}-error`}
                aria-invalid={Boolean(errors[field.id])}
                aria-describedby={
                  errors[field.id]
                    ? `preview-${field.id}-error`
                    : undefined
                }
                {...register(field.id)}
              />
            ) : (
              <Input
                id={`preview-${field.id}`}
                type={field.type}
                className={cn(radiusToClass(getInputBorderRadius(theme)))}
                placeholder={field.placeholder}
                error={errors[field.id]?.message}
                errorId={`preview-${field.id}-error`}
                aria-invalid={Boolean(errors[field.id])}
                aria-describedby={
                  errors[field.id]
                    ? `preview-${field.id}-error`
                    : undefined
                }
                {...register(field.id)}
              />
            )}
          </div>
        ))}

        <div
          className={cn(
            "flex pt-4",
            theme.titleAlignment === "center"
              ? "justify-center"
              : theme.titleAlignment === "right"
                ? "justify-end"
                : "justify-end"
          )}
        >
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              "relative overflow-hidden form-themed-bg-primary form-themed-border-accent",
              radiusToClass(getButtonBorderRadius(theme)),
              submitAnimationClass(theme.submitAnimation)
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando...
              </span>
            ) : (
              theme.submitLabel || "Enviar"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
