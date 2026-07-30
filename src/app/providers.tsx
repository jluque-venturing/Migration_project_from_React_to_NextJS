"use client";

import { useTheme } from "@/features/settings/hooks/useTheme";
import { ToastContainer } from "@/features/notifications/components/ToastContainer";
import { ErrorBoundary } from "@/shared/components/ui/ErrorBoundary";
import { ErrorFallback } from "@/features/error-pages/components/ErrorFallback";

export function Providers({ children }: { children: React.ReactNode }) {
  useTheme();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
      <ToastContainer />
    </ErrorBoundary>
  );
}
