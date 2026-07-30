"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useIsHydrated } from "@/shared/hooks/useIsHydrated";
import { cn } from "@/shared/lib/helpers";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  isDangerous = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Keep latest callbacks accessible to event handlers without re-subscribing
  // listeners on every render.
  const onCancelRef = useRef(onCancel);
  const onConfirmRef = useRef(onConfirm);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      dialog.focus();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Notify the parent when the native dialog is closed (Escape, close(), etc.).
  // isOpen va en las deps porque el <dialog> recién existe cuando el portal se
  // monta: con deps vacías el listener nunca se llegaba a suscribir.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onCancelRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [isHydrated, isOpen]);

  // Keyboard support: Enter confirms (Escape is handled natively by <dialog>).
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onConfirmRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !isHydrated) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 m-0 flex h-screen w-screen items-center justify-center bg-transparent p-0 outline-none"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar modal"
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity animate-[fadeIn_150ms_ease-out] cursor-default"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative w-full max-w-md bg-surface border border-border rounded-xl shadow-xl p-6",
          "flex flex-col gap-4 animate-[fadeIn_150ms_ease-out]",
          "z-10"
        )}
      >
        <div className="flex gap-4 items-start">
          <div
            className={cn(
              "p-2.5 rounded-full shrink-0",
              isDangerous
                ? "bg-danger/10 text-danger"
                : "bg-primary/10 text-primary"
            )}
          >
            {isDangerous ? <AlertTriangle size={22} /> : <Info size={22} />}
          </div>

          <div className="flex-1 space-y-1">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-text leading-6"
            >
              {title}
            </h3>
            <p id="modal-message" className="text-sm text-text-muted">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={isDangerous ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
