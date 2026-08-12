"use client";

import { useId } from "react";
import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/helpers";
import { useFileToBase64 } from "@/features/form-theme/hooks/useFileToBase64";

interface ThemeImageUploaderProps {
  label: string;
  imageUrl?: string;
  onChange: (dataUrl: string | undefined) => void;
  aspectRatio?: "square" | "wide" | "auto";
}

export function ThemeImageUploader({
  label,
  imageUrl,
  onChange,
  aspectRatio = "auto",
}: ThemeImageUploaderProps) {
  const inputId = useId();
  const fileToBase64 = useFileToBase64();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToBase64(file);
      onChange(dataUrl);
    } catch {
      // Silently ignore failed reads
    }
  };

  const aspectClass = {
    square: "aspect-square",
    wide: "aspect-video",
    auto: "aspect-auto max-h-32",
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-text">
        {label}
      </label>

      {imageUrl ? (
        <div className="relative group">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-border bg-surface",
              aspectClass[aspectRatio]
            )}
          >
            <Image
              src={imageUrl}
              alt={`Vista previa de ${label.toLowerCase()}`}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onChange(undefined)}
            className="absolute right-2 top-2 opacity-90 transition-opacity group-hover:opacity-100 focus:ring-2 focus:ring-red-500"
            aria-label={`Quitar ${label.toLowerCase()}`}
          >
            <X size={14} aria-hidden="true" />
            Quitar
          </Button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface p-6 text-text-muted transition-colors hover:border-primary hover:text-primary focus-within:border-primary focus-within:text-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 outline-none"
        >
          <ImageIcon size={28} aria-hidden="true" />
          <span className="text-sm font-medium">Subir imagen</span>
          <span className="text-xs opacity-70">
            JPG, PNG o GIF (se guarda en el navegador)
          </span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={imageUrl ? -1 : undefined}
      />
    </div>
  );
}
