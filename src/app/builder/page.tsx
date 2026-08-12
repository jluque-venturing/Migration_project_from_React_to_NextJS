import type { Metadata } from "next";
import { Suspense } from "react";
import { FormBuilderRoute } from "@/features/form-lab/components/FormBuilderRoute";

export const metadata: Metadata = {
  title: "Constructor",
  description:
    "Diseñá tu formulario, definí campos y reglas de validación en vivo.",
};

function BuilderSkeleton() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <span className="sr-only">Cargando constructor…</span>
    </div>
  );
}

export default function BuilderPage() {
  // Suspense obligatorio: el FormBuilderRoute usa `useSearchParams()` para
  // leer `?id=` y forzar el remount. Sin Suspense, Next 16 falla el build
  // (Riesgo R3 del plan de migración).
  return (
    <Suspense fallback={<BuilderSkeleton />}>
      <FormBuilderRoute />
    </Suspense>
  );
}
