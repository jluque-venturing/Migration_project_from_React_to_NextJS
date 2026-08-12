"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, Palette, Eye, Save, Layers } from "lucide-react";
import { useOnboardingStore } from "@/features/onboarding/store";
import { useIsHydrated } from "@/shared/hooks/useIsHydrated";
import { cn } from "@/shared/lib/helpers";

interface TourStep {
  id: string;
  icon: typeof Palette;
  title: string;
  description: string;
  emoji: string;
}

const TOUR_STEPS: ReadonlyArray<TourStep> = [
  {
    id: "welcome",
    icon: Layers,
    title: "Bienvenido a FormForge",
    description:
      "Acá podés crear formularios con campos, reglas de validación y diseño propio. Todo vive en tu navegador — sin servidor ni base de datos.",
    emoji: "🧪",
  },
  {
    id: "fields",
    icon: Layers,
    title: "Campos y reglas",
    description:
      "Usá el panel de la izquierda para agregar campos. Podés ordenarlos arrastrando y agregarles reglas (requerido, mínimo, máximo, email, regex).",
    emoji: "📋",
  },
  {
    id: "customize",
    icon: Palette,
    title: "Personalizar diseño",
    description:
      "El botón \"Personalizar diseño\" abre un panel completo con presets temáticos, colores, tipografía, emojis, patrones, imágenes y animaciones.",
    emoji: "🎨",
  },
  {
    id: "preview",
    icon: Eye,
    title: "Vista previa en vivo",
    description:
      "El panel de la derecha muestra cómo queda tu formulario en tiempo real. Podés ampliarla a pantalla completa o ver el JSON interno.",
    emoji: "👁️",
  },
  {
    id: "save",
    icon: Save,
    title: "Guardar y compartir",
    description:
      "Guardá el formulario con Ctrl+S, compartilo por URL con el botón Compartir, o exportalo como archivo .json para hacer backup.",
    emoji: "🚀",
  },
];

export function TourOverlay() {
  const { hasSeenTour, currentStep, markTourSeen, setStep } = useOnboardingStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Sin este guard el tour parpadearía para quien ya lo vio: hasSeenTour arranca
  // en false y recién pasa a true cuando el store rehidrata desde localStorage.
  const isHydrated = useIsHydrated();
  const isVisible = isHydrated && !hasSeenTour;

  // Open the native modal when the component mounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, [isVisible]);

  // Mark the tour as seen when the native dialog is closed (Escape, backdrop click, etc.).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => markTourSeen();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [isVisible, markTourSeen]);

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (isLast) {
      markTourSeen();
    } else {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setStep(currentStep - 1);
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label="Tour de bienvenida"
      className="fixed inset-0 z-[100] m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center bg-transparent p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm animate-[fadeIn_200ms_ease-out] cursor-default"
        onClick={markTourSeen}
        aria-label="Saltar tour"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-[scaleIn_200ms_ease-out]">
        {/* Close */}
        <button
          type="button"
          onClick={markTourSeen}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-text transition-colors"
          aria-label="Saltar tour"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-4xl animate-float">
            {step.emoji}
          </span>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary uppercase tracking-wide">
            <Icon size={12} />
            Paso {currentStep + 1} de {TOUR_STEPS.length}
          </div>
          <h2 className="mb-2 text-xl font-bold text-text">{step.title}</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            {step.description}
          </p>
        </div>

        {/* Progress dots */}
        <div
          role="tablist"
          aria-label="Progreso del tour"
          className="mb-5 flex justify-center gap-1.5"
        >
          {TOUR_STEPS.map((tourStep, i) => (
            <button
              key={tourStep.id}
              type="button"
              role="tab"
              aria-selected={i === currentStep}
              onClick={() => setStep(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                i === currentStep
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-text-muted"
              )}
              aria-label={`Ir al paso ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-sm font-medium text-text-muted transition-colors hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {isLast ? "¡Empezar!" : "Siguiente"}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
