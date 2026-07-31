"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Copy, Check, Code2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useIsHydrated } from "@/shared/hooks/useIsHydrated";
import { serializeForm } from "@/features/form-lab/utils";
import type { Form } from "@/features/form-lab/schema";

interface JsonPreviewModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
}

export function JsonPreviewModal({
  form,
  isOpen,
  onClose,
}: JsonPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isHydrated = useIsHydrated();

  const json = serializeForm(form);

  // Abrir/cerrar el <dialog> nativo según `isOpen`.
  // El dialog recién existe cuando el portal se monta (después de hidratar),
  // así que las deps incluyen `isOpen` y `isHydrated` para reintentar.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, isHydrated]);

  // Notificar al padre cuando el <dialog> se cierra (Escape, backdrop, etc.).
  // Bug B8 del original: con deps vacías el listener nunca se llegaba a
  // suscribir porque el dialog era null en el primer render.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [isHydrated, isOpen]);

  // Resetear el flag "copied" después de 2s.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  if (!isOpen || !isHydrated) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
    } catch {
      // Silently ignore if clipboard unavailable
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby="json-modal-title"
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center bg-transparent p-0"
    >
      <button
        type="button"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out] cursor-default"
        onClick={onClose}
        aria-label="Cerrar modal"
      />
      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-2xl animate-[fadeIn_150ms_ease-out]">
        <div className="flex items-center justify-between">
          <h2
            id="json-modal-title"
            className="flex items-center gap-2 text-lg font-semibold text-text"
          >
            <Code2 size={20} className="text-primary" aria-hidden="true" />
            Vista de código
            <span className="text-sm font-normal text-text-muted">— {form.name}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-text transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-text-muted">
          Así modela Zod los datos de tu formulario. Este JSON es lo que se
          guarda y valida internamente.
        </p>

        <div className="relative">
          <pre
            className="max-h-[50vh] overflow-auto rounded-lg bg-[#0f172a] p-4 text-xs leading-relaxed text-[#e2e8f0] font-mono"
            aria-label="JSON del formulario"
          >
            <code>{json}</code>
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/20"
            aria-label="Copiar JSON al portapapeles"
          >
            {copied ? (
              <>
                <Check size={12} />
                Copiado
              </>
            ) : (
              <>
                <Copy size={12} />
                Copiar
              </>
            )}
          </button>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
