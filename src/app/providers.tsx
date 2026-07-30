"use client";

import { useEffect } from "react";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { useFormLabStore } from "@/features/form-lab/store";
import { useFormThemeStore } from "@/features/form-theme/store";
import { ToastContainer } from "@/features/notifications/components/ToastContainer";
import { ErrorBoundary } from "@/shared/components/ui/ErrorBoundary";
import { ErrorFallback } from "@/features/error-pages/components/ErrorFallback";

/**
 * Los stores persistidos usan `skipHydration: true` para no leer localStorage
 * durante el SSR. Acá, ya en el cliente, se los rehidrata explícitamente.
 * Cada store nuevo con `persist` tiene que sumarse a esta lista.
 */
function useRehydratePersistedStores() {
  useEffect(() => {
    useFormLabStore.persist.rehydrate();
    useFormThemeStore.persist.rehydrate();
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  useTheme();
  useRehydratePersistedStores();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
      <ToastContainer />
    </ErrorBoundary>
  );
}
