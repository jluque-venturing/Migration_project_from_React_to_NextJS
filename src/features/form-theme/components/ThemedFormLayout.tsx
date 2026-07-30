"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { FormTheme } from "@/features/form-theme/schema";
import {
  fontFamilyClass,
  patternToClass,
  radiusToClass,
  titleAlignmentClass,
  cardStyleClass,
  shadowClass,
  hasEmoji,
  getFormBorderRadius,
  getLogoBorderRadius,
  formBorderDataAttrs,
} from "@/features/form-theme/utils";
import { cn, cssVars } from "@/shared/lib/helpers";

interface ThemedFormLayoutProps {
  theme: FormTheme;
  formName: string;
  formDescription?: string;
  className?: string;
  children: ReactNode;
}

export function ThemedFormLayout({
  theme,
  formName,
  formDescription,
  className,
  children,
}: ThemedFormLayoutProps) {
  const hasBackgroundImage = Boolean(theme.backgroundImage);

  return (
    <article
      className={cn(
        "relative overflow-hidden form-border-dynamic bg-[var(--form-bg)]",
        theme.backgroundGradient && "bg-[image:var(--form-gradient)]",
        radiusToClass(getFormBorderRadius(theme)),
        shadowClass(theme.shadow),
        patternToClass(theme.pattern),
        className
      )}
      {...formBorderDataAttrs(theme)}
      style={cssVars({
        "--form-bg": theme.backgroundColor,
        ...(theme.backgroundGradient && { "--form-gradient": theme.backgroundGradient }),
        "--form-border-color": theme.borderColor || "#e2e8f0",
      })}
    >
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
          <h1
            className={cn(
              "flex items-center gap-3 text-3xl sm:text-4xl font-bold form-themed-text",
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
                  "h-9 sm:h-10 w-auto object-contain shrink-0",
                  radiusToClass(getLogoBorderRadius(theme))
                )}
              />
            )}
            {hasEmoji(theme) && (
              <span aria-hidden="true" className="shrink-0">{theme.emoji}</span>
            )}
            <span>{formName || "Mi formulario"}</span>
          </h1>
          {formDescription && (
            <p
              className={cn(
                "mt-3 text-base opacity-80 form-themed-text",
                titleAlignmentClass(theme.titleAlignment)
              )}
            >
              {formDescription}
            </p>
          )}
        </header>

        {children}
      </div>
    </article>
  );
}

interface ThemedFormSuccessProps {
  theme: FormTheme;
  message: string;
  onReset: () => void;
}

export function ThemedFormSuccess({
  theme,
  message,
  onReset,
}: ThemedFormSuccessProps) {.
.
.
      <Button type="button" variant="secondary" onClick={onReset}>
        Completar de nuevo
      </Button>
    </div>
  );
}
