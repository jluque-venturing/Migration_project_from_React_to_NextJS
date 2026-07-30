"use client";

import { useToastStore } from "@/features/notifications/store";
import { createToast } from "@/features/notifications/utils";
import type { ToastType } from "@/features/notifications/schema";

interface ShowOptions {
  duration?: number;
}

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const dismissAll = useToastStore((state) => state.dismissAll);

  const show = (type: ToastType, message: string, options?: ShowOptions) => {
    addToast(createToast(type, message, options?.duration));
  };

  return {
    success: (message: string, options?: ShowOptions) =>
      show("success", message, options),
    error: (message: string, options?: ShowOptions) =>
      show("error", message, options),
    warning: (message: string, options?: ShowOptions) =>
      show("warning", message, options),
    info: (message: string, options?: ShowOptions) =>
      show("info", message, options),
    dismiss: removeToast,
    dismissAll,
  } as const;
}
