"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { useFormLabStore } from "@/features/form-lab/store";

/**
 * CTA condicional de la Home: sólo aparece cuando el usuario ya tiene
 * formularios guardados. Como depende del store persistido, es client.
 */
export function MyFormsCta() {
  const formCount = useFormLabStore((state) => state.forms.length);

  if (formCount === 0) return null;

  return (
    <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
      <Link href="/forms">
        Ver mis formularios ({formCount})
      </Link>
    </Button>
  );
}
