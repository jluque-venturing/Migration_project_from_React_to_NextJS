"use client";

import { useFormLabStore } from "@/features/form-lab/store";

/**
 * Hook to retrieve a single form by its id.
 * Returns undefined if the form does not exist.
 *
 * Usage:
 *   const form = useFormById("some-id");
 */
export function useFormById(id: string | undefined) {
  return useFormLabStore((state) =>
    id ? state.getFormById(id) : undefined
  );
}
