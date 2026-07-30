import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import type { ToastType, Toast } from "./schema";

export const toastIconFor: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const toastStylesFor: Record<ToastType, string> = {
  success: "border-success/40 bg-surface text-text",
  error: "border-danger/40 bg-surface text-text",
  warning: "border-warning/40 bg-surface text-text",
  info: "border-primary/40 bg-surface text-text",
};

export const toastIconColorFor: Record<ToastType, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-primary",
};

function defaultDurationForType(type: ToastType): number {
  return type === "error" ? 6000 : 4000;
}

export function createToast(
  type: ToastType,
  message: string,
  duration?: number
): Toast {
  return {
    id: crypto.randomUUID(),
    type,
    message,
    duration: duration ?? defaultDurationForType(type),
  };
}
