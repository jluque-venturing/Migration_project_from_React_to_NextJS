"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/helpers";
import type { Toast } from "@/features/notifications/schema";
import { toastIconFor, toastStylesFor, toastIconColorFor } from "../utils";

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = toastIconFor[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <li
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
        "animate-toast-in",
        toastStylesFor[toast.type]
      )}
    >
      <Icon size={18} className={cn("mt-0.5 shrink-0", toastIconColorFor[toast.type])} />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-text-muted hover:text-text transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </li>
  );
}
