"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};
const getSnapshotOnClient = () => true;
const getSnapshotOnServer = () => false;

/**
 * Devuelve false durante el SSR y true una vez hidratado.
 *
 * Sirve para diferir todo lo que necesita APIs del navegador — típicamente
 * `createPortal(…, document.body)`. Se usa `useSyncExternalStore` en vez del
 * clásico `useState(false)` + `useEffect(() => setMounted(true))` porque ese
 * patrón dispara un render en cascada y la regla `react-hooks/set-state-in-effect`
 * lo marca como error.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    getSnapshotOnClient,
    getSnapshotOnServer
  );
}
