import type { Metadata } from "next";
import { FormPreviewPage } from "@/features/form-lab/components/FormPreviewPage";

/**
 * Decisión técnica (documentada en docs/PLAN-MIGRACION.md §5 P4):
 * el formulario vive en localStorage, así que el servidor no puede saber
 * su nombre. El título dinámico sólo puede ser genérico.
 */
export const metadata: Metadata = {
  title: "Vista previa",
  description:
    "Completá y validá el formulario en vivo: reglas, estados visuales y animaciones temáticas.",
  openGraph: {
    title: "Vista previa · FormForge",
    description:
      "Completá y validá el formulario en vivo: reglas, estados visuales y animaciones temáticas.",
  },
};

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  // Next 16: `params` es una Promise en los segmentos dinámicos.
  const { id } = await params;
  return <FormPreviewPage formId={id} />;
}
