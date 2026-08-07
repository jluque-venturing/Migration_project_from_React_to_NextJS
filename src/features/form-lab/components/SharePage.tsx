"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowLeft, Save, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useToast } from "@/features/notifications/hooks/useToast";
import { useFormLabStore } from "@/features/form-lab/store";
import {
  cloneForm,
  decodeFormFromBase64,
  formatRuleType,
} from "@/features/form-lab/utils";
import type { Form, FormField } from "@/features/form-lab/schema";
import {
  cardStyleClass,
  fieldEntranceAnimationClass,
  fontFamilyClass,
  getDefaultTheme,
  hasEmoji,
  patternToClass,
  radiusToClass,
  spacingClass,
  titleAlignmentClass,
  getFormBorderRadius,
  getInputBorderRadius,
  getLogoBorderRadius,
  formBorderDataAttrs,
  shadowClass,
} from "@/features/form-theme/utils";
import type { FormTheme } from "@/features/form-theme/schema";
import { cn, cssVars } from "@/shared/lib/helpers";

interface ReadonlyFieldProps {
  field: FormField;
  theme: FormTheme;
  index: number;
}

function ReadonlyField({ field, theme, index }: ReadonlyFieldProps) {
  const ruleLabels = field.rules.map((rule) => formatRuleType(rule.type));

  return (
    <div
      className={cn(fieldEntranceAnimationClass(theme.fieldEntranceAnimation), "form-anim-stagger")}
      style={cssVars({ "--anim-delay": `${index * 80}ms` })}
    >
      <label
        htmlFor={field.id}
        className="mb-1.5 block text-sm font-medium form-themed-text"
      >
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <Textarea
          id={field.id}
          readOnly
          className={cn(radiusToClass(getInputBorderRadius(theme)), "cursor-default")}
          placeholder={field.placeholder}
          value=""
        />
      ) : (
        <Input
          id={field.id}
          type={field.type}
          readOnly
          className={cn(radiusToClass(getInputBorderRadius(theme)), "cursor-default")}
          placeholder={field.placeholder}
          value=""
        />
      )}

      {ruleLabels.length > 0 && (
        <p className="mt-1.5 text-xs opacity-70 form-themed-text">
          Reglas: {ruleLabels.join(", ")}
        </p>
      )}
    </div>
  );
}

interface SharedFormPreviewProps {
  form: Form;
}

function SharedFormPreview({ form }: SharedFormPreviewProps) {
  const theme = form.theme ?? getDefaultTheme();
  const hasBackgroundImage = Boolean(theme.backgroundImage);

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-border bg-surface/20 p-5 sm:p-8"
      aria-labelledby="shared-form-title"
    >
      <article
        className={cn(
          "relative mx-auto max-w-2xl p-4 sm:p-8 overflow-hidden form-border-dynamic bg-[var(--form-bg)]",
          theme.backgroundGradient && "bg-[image:var(--form-gradient)]",
          radiusToClass(getFormBorderRadius(theme)),
          shadowClass(theme.shadow),
          patternToClass(theme.pattern)
        )}
        {...formBorderDataAttrs(theme)}
        style={cssVars({
          "--form-bg": theme.backgroundColor,
          ...(theme.backgroundGradient && { "--form-gradient": theme.backgroundGradient }),
          "--form-border-color": theme.borderColor || "#e2e8f0",
        })}
      >
        {/* Capas absolutas de fondo, la de cardStyleClass al fondo para nitidez */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            cardStyleClass(theme.cardStyle)
          )}
          aria-hidden="true"
        />
        {hasBackgroundImage && (
          <div
            className="absolute inset-0 pointer-events-none bg-[image:var(--form-bg-image)] bg-cover bg-center bg-no-repeat opacity-[var(--form-bg-opacity)]"
            style={cssVars({
              "--form-bg-image": `url(${theme.backgroundImage})`,
              "--form-bg-opacity": String((theme.backgroundOpacity ?? 100) / 100),
            })}
            aria-hidden="true"
          />
        )}
        {hasBackgroundImage && theme.backgroundOverlay && (
          <div
            className="absolute inset-0 pointer-events-none bg-[var(--form-overlay-color)]"
            style={cssVars({ "--form-overlay-color": theme.backgroundOverlay })}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10">
          <header
            className={cn(
              "mb-8 flex flex-col",
              theme.titleAlignment === "center"
                ? "items-center text-center"
                : theme.titleAlignment === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
            )}
          >
            <h2
              id="shared-form-title"
              className={cn(
                "flex items-center gap-3 text-3xl font-bold form-themed-text",
                fontFamilyClass(theme.headingFontFamily),
                titleAlignmentClass(theme.titleAlignment)
              )}
            >
              {theme.logoImage && (
                <Image
                  src={theme.logoImage}
                  alt=""
                  width={160}
                  height={40}
                  unoptimized
                  className={cn(
                    "h-9 w-auto object-contain shrink-0",
                    radiusToClass(getLogoBorderRadius(theme))
                  )}
                />
              )}
              {hasEmoji(theme) && (
                <span aria-hidden="true" className="shrink-0">{theme.emoji}</span>
              )}
              <span>{form.name}</span>
            </h2>

            {form.description && (
              <p
                className={cn(
                  "mt-3 text-lg opacity-80 form-themed-text",
                  titleAlignmentClass(theme.titleAlignment)
                )}
              >
                {form.description}
              </p>
            )}
          </header>

          {form.fields.length === 0 ? (
            <p className="text-sm opacity-80 form-themed-text">
              Este formulario no tiene campos cargados.
            </p>
          ) : (
            <div
              className={cn(
                "flex flex-col",
                spacingClass(theme.spacing),
                fontFamilyClass(theme.fontFamily)
              )}
            >
              {form.fields.map((field, index) => (
                <ReadonlyField
                  key={field.id}
                  field={field}
                  theme={theme}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export function SharePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addForm = useFormLabStore((state) => state.addForm);
  const { success: showSuccess } = useToast();
  const encodedData = searchParams.get("data");
  const result = encodedData
    ? decodeFormFromBase64(encodedData)
    : { ok: false as const, error: "Falta el formulario compartido" };

  const handleSaveCopy = (form: Form) => {
    const copy = cloneForm(form);
    addForm(copy);
    showSuccess(`Se guardo "${copy.name}" en tus formularios`);
    router.push("/forms");
  };

  // B1: esta página NO define su propio <main> — ya existe uno en el
  // root layout. El original devolvía un <main> anidado (HTML inválido).
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft size={16} />
                Volver
              </Link>
            </Button>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
                <Share2 size={16} aria-hidden="true" />
                Formulario compartido
              </div>
              <h1 className="text-2xl font-bold text-text">
                Vista previa del enlace
              </h1>
            </div>
          </div>

          {result.ok && (
            <Button type="button" onClick={() => handleSaveCopy(result.form)}>
              <Save size={16} />
              Guardar copia
            </Button>
          )}
        </header>

        {result.ok ? (
          <SharedFormPreview form={result.form} />
        ) : (
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-danger/10 p-2 text-danger">
                <AlertCircle size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">
                  No se pudo abrir el formulario
                </h2>
                <p className="mt-1 text-sm text-text-muted">{result.error}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
