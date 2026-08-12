"use client";

import { useEffect } from "react";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { useThemeStore } from "@/features/settings/store";
import { useFormLabStore } from "@/features/form-lab/store";
import { useFormThemeStore } from "@/features/form-theme/store";
import { useCollectionStore } from "@/features/collections/store";
import { useOnboardingStore } from "@/features/onboarding/store";
import { useCommandPaletteStore } from "@/features/command-palette/store";
import { CommandPalette } from "@/features/command-palette/components/CommandPalette";
import { ToastContainer } from "@/features/notifications/components/ToastContainer";
import { ErrorBoundary } from "@/shared/components/ui/ErrorBoundary";
import { ErrorFallback } from "@/features/error-pages/components/ErrorFallback";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut";

/**
 * Los stores persistidos usan `skipHydration: true` para no leer localStorage
 * durante el SSR. Acá, ya en el cliente, se los rehidrata explícitamente.
 * Cada store nuevo con `persist` tiene que sumarse a esta lista.
 */
function useRehydratePersistedStores() {
  useEffect(() => {
    useThemeStore.persist.rehydrate();
    useFormLabStore.persist.rehydrate();
    useFormThemeStore.persist.rehydrate();
    useCollectionStore.persist.rehydrate();
    useOnboardingStore.persist.rehydrate();
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const togglePalette = useCommandPaletteStore((state) => state.toggle);

  useTheme();
  useRehydratePersistedStores();
  useKeyboardShortcut("k", togglePalette, { metaKey: true });
  useKeyboardShortcut("k", togglePalette, { ctrlKey: true });

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
      <ToastContainer />
      <CommandPalette />
    </ErrorBoundary>
  );
}
