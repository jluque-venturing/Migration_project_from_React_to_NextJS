import type { Metadata } from "next";
import { Suspense } from "react";
import { SharePage } from "@/features/form-lab/components/SharePage";

export const metadata: Metadata = {
  title: "Formulario compartido",
  description:
    "Vista previa de un formulario compartido por enlace. Guardá una copia editable en tu laboratorio.",
  openGraph: {
    title: "Formulario compartido · FormForge",
    description:
      "Vista previa de un formulario compartido por enlace. Guardá una copia editable en tu laboratorio.",
  },
};

function ShareSkeleton() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <span className="sr-only">Cargando formulario compartido…</span>
    </div>
  );
}

export default function ShareRoute() {
  // Suspense obligatorio: SharePage usa `useSearchParams()` para leer
  // `?data=`. Sin Suspense, Next 16 falla el build (Riesgo R3 del plan).
  return (
    <Suspense fallback={<ShareSkeleton />}>
      <SharePage />
    </Suspense>
  );
}
