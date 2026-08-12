"use client";

import { Fragment, useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useForm, useWatch, type FieldErrors, type UseFormRegister, type UseFormHandleSubmit } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { useFormValidation } from "@/features/form-lab/hooks/useFormValidation";
import { ActiveErrorsSummary } from "./ActiveErrorsSummary";
import { FieldStatusBadge } from "./FieldStatusBadge";
import {
  buildFormSchema,
  getFieldStatusBorderClass,
  resolvePreviewFieldStatus,
  type FieldState,
} from "@/features/form-lab/utils";
import type { ActiveErrorSummary } from "@/features/form-lab/utils";
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
import {
  applyThemeToCssVars,
} from "@/features/form-theme/dom-helpers";
import { cn, cssVars } from "@/shared/lib/helpers";
import { useToast } from "@/features/notifications/hooks/useToast";
import { ThemedFormLayout, ThemedFormSuccess } from "@/features/form-theme/components/ThemedFormLayout";

interface FormPreviewPageProps {
  formId: string;
}

export function FormPreviewPage({ formId }: FormPreviewPageProps) {
  const form = useFormById(formId);
  const { success: showSuccess } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formNameRef = useRef(form?.name);

  useEffect(() => {
    formNameRef.current = form?.name;
  });

  useEffect(() => {
    if (!isSubmitting) return;
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showSuccess(`¡${formNameRef.current ?? "Formulario"} enviado con éxito!`);
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [isSubmitting, showSuccess]);

  const effectiveTheme = form?.theme ?? getDefaultTheme();

  const resolver = zodResolver(buildFormSchema(form?.fields ?? []));
  const defaultValues = Object.fromEntries((form?.fields ?? []).map((field) => [field.id, ""]));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields, isValidating },
  } = useForm<Record<string, string>>({
    resolver,
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const values = useWatch({ control }) as Record<string, string | undefined>;

  const { fieldsState, errorsSummary } = useFormValidation(form, {
    values,
    touchedFields,
    isValidating,
  });

  useEffect(() => {
    applyThemeToCssVars(effectiveTheme);
    return () => {
      applyThemeToCssVars(getDefaultTheme());
    };
  }, [effectiveTheme]);

  // B1: esta página NO define su propio <main> — ya existe uno en el
  // root layout. El original devolvía un <main> anidado (HTML inválido).
  if (!form) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/forms">
                <ArrowLeft size={16} />
                Volver
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Formulario no encontrado</h1>
          </div>
          <p className="text-text-muted mb-6">
            El formulario que buscás no existe o fue eliminado.
          </p>
          <Button asChild>
            <Link href="/forms">Volver a Mis formularios</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progress =
    form.fields.length === 0
      ? 0
      : Math.round(
        (form.fields.filter((field) => {
          if (!values) return false;
          const value = values[field.id];
          return value ? value.trim().length > 0 : false;
        }).length /
          form.fields.length) *
        100
      );

  const onSubmit = () => {
    setIsSubmitting(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    reset(Object.fromEntries(form.fields.map((field) => [field.id, ""])));
  };

  return (
    <Fragment key={form.id}>
      <div className="relative min-h-screen p-4 sm:p-6 bg-surface flex flex-col justify-start">
      <div className="mx-auto max-w-3xl w-full mb-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="shrink-0"
        >
          <Link href="/forms">
            <ArrowLeft size={16} />
            Volver a Mis formularios
          </Link>
        </Button>
      </div>

      <ThemedFormLayout
        theme={effectiveTheme}
        formName={form.name}
        formDescription={form.description}
        className="max-w-3xl w-full mx-auto p-4 sm:p-10"
      >
        {isSuccess ? (
          <ThemedFormSuccess
            theme={effectiveTheme}
            message={`Gracias por completar ${form.name}.`}
            onReset={handleReset}
          />
        ) : (
          <FormPreviewFields
            form={form}
            effectiveTheme={effectiveTheme}
            isSubmitting={isSubmitting}
            progress={progress}
            errors={errors}
            touchedFields={touchedFields}
            fieldsState={fieldsState}
            isValidating={isValidating}
            values={values}
            errorsSummary={errorsSummary}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        )}
      </ThemedFormLayout>
    </div>
    </Fragment>
  );
}

interface FormPreviewFieldsProps {
  form: NonNullable<ReturnType<typeof useFormById>>;
  effectiveTheme: ReturnType<typeof getDefaultTheme>;
  isSubmitting: boolean;
  progress: number;
  errors: FieldErrors<Record<string, string>>;
  touchedFields: Partial<Readonly<Record<string, boolean>>>;
  fieldsState: Record<string, FieldState>;
  isValidating: boolean;
  values: Record<string, string | undefined>;
  errorsSummary: ActiveErrorSummary[];
  register: UseFormRegister<Record<string, string>>;
  handleSubmit: UseFormHandleSubmit<Record<string, string>>;
  onSubmit: () => void;
}

function FormPreviewFields({
  form,
  effectiveTheme,
  isSubmitting,
  progress,
  errors,
  touchedFields,
  fieldsState,
  isValidating,
  values,
  errorsSummary,
  register,
  handleSubmit,
  onSubmit,
}: FormPreviewFieldsProps) {
  return (
    <>
      {effectiveTheme.showProgressBar && (
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 opacity-80 form-themed-text">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <div className="form-progress-bar">
            <div style={cssVars({ "--form-progress-width": `${progress}%` })} />
          </div>
        </div>
      )}

      <ActiveErrorsSummary errors={errorsSummary} />

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col",
          spacingClass(effectiveTheme.spacing),
          fontFamilyClass(effectiveTheme.fontFamily)
        )}
      >
      {form.fields.map((field, index) => {
          const fieldState = fieldsState[field.id];
          const hasBeenTouched = Boolean(fieldState?.isDirty || touchedFields[field.id]);
          const hasValue = Boolean(fieldState?.value?.trim() || values[field.id]);
          const hasError = Boolean(fieldState?.error || errors[field.id]);

          const currentStatus = resolvePreviewFieldStatus({
            isValidating,
            hasBeenTouched,
            hasValue,
            hasError,
          });

          const statusBorderClass = getFieldStatusBorderClass(currentStatus);
          const fieldRegistration = register(field.id);
          const handleFieldInputChange = (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            fieldRegistration.onChange(event);
          };

          return (
            <div
              key={field.id}
              className={cn(
                fieldEntranceAnimationClass(effectiveTheme.fieldEntranceAnimation),
                "form-anim-stagger"
              )}
              style={cssVars({ "--anim-delay": `${index * 80}ms` })}
            >
              <label
                htmlFor={field.id}
                className="mb-1.5 flex justify-between items-center text-sm font-medium form-themed-text"
              >
                <span>{field.label}</span>

                {(hasBeenTouched || hasValue) && (
                  <FieldStatusBadge status={currentStatus} />
                )}
              </label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  className={cn(
                    radiusToClass(getInputBorderRadius(effectiveTheme)),
                    statusBorderClass
                  )}
                  placeholder={field.placeholder}
                  error={errors[field.id]?.message}
                  errorId={`${field.id}-error`}
                  aria-invalid={Boolean(errors[field.id])}
                  aria-describedby={
                    errors[field.id] ? `${field.id}-error` : undefined
                  }
                  {...fieldRegistration}
                  onChange={handleFieldInputChange}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  className={cn(
                    radiusToClass(getInputBorderRadius(effectiveTheme)),
                    statusBorderClass
                  )}
                  placeholder={field.placeholder}
                  error={errors[field.id]?.message}
                  errorId={`${field.id}-error`}
                  aria-invalid={Boolean(errors[field.id])}
                  aria-describedby={
                    errors[field.id] ? `${field.id}-error` : undefined
                  }
                  {...fieldRegistration}
                  onChange={handleFieldInputChange}
                />
              )}
            </div>
          );
        })}

        <div
          className={cn(
            "flex pt-4",
            effectiveTheme.titleAlignment === "center"
              ? "justify-center"
              : effectiveTheme.titleAlignment === "right"
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
              radiusToClass(getButtonBorderRadius(effectiveTheme)),
              submitAnimationClass(effectiveTheme.submitAnimation)
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando...
              </span>
            ) : (
              effectiveTheme.submitLabel || "Enviar"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
