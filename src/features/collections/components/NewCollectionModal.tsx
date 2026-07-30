"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { z } from "zod";
import { Button } from "@/shared/components/ui/Button";
import { newCollectionFormSchema, collectionColorSchema } from "../schema";
import { COLOR_LABELS, getColorBgClass } from "../utils";
import { cn } from "@/shared/lib/helpers";

type FormData = z.infer<typeof newCollectionFormSchema>;

interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, color: z.infer<typeof collectionColorSchema>) => void;
}

export function NewCollectionModal({ isOpen, onClose, onCreate }: NewCollectionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(newCollectionFormSchema),
    defaultValues: { name: "", color: "slate" },
    mode: "onChange",
  });

  // Open the native modal when the component mounts.
  // isOpen va en las deps porque el <dialog> recién existe cuando isOpen pasa a
  // true: con deps vacías showModal() nunca se llegaba a llamar.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, [isOpen]);

  // Notify the parent when the native dialog is closed.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [isOpen, onClose]);

  // Focus the name input when opening.
  useEffect(() => {
    const input = dialogRef.current?.querySelector("input");
    if (input) {
      queueMicrotask(() => input.focus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    onCreate(data.name, data.color);
    reset();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="new-collection-title"
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center bg-transparent p-0"
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out] cursor-default"
        onClick={handleClose}
        aria-label="Cerrar modal"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-[scaleIn_200ms_ease-out]">
        <h3
          id="new-collection-title"
          className="text-lg font-bold text-text mb-4 flex items-center gap-2"
        >
          <FolderPlus className="text-primary" size={20} aria-hidden="true" />
          Crear nueva colección
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="col-name"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
            >
              Nombre
            </label>
            <input
              id="col-name"
              type="text"
              {...register("name")}
              placeholder="Ej: Formularios de Venta, Soporte..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-danger" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
              Color de carpeta
            </span>
            <Controller
              name="color"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex gap-3">
                  {collectionColorSchema.options.map((color) => {
                    const isSelected = value === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        aria-pressed={isSelected}
                        aria-label={`Color ${COLOR_LABELS[color]}${isSelected ? " (seleccionado)" : ""}`}
                        className={cn(
                          "h-7 w-7 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-primary/40 hover:scale-110 cursor-pointer",
                          getColorBgClass(color),
                          isSelected && "ring-2 ring-primary ring-offset-2 dark:ring-offset-surface"
                        )}
                        title={COLOR_LABELS[color]}
                      />
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Crear colección
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
