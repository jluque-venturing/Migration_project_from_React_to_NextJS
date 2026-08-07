import type { Metadata } from "next";
import { TemplateGalleryPage } from "@/features/form-lab/components/TemplateGalleryPage";

export const metadata: Metadata = {
  title: "Plantillas",
  description:
    "Galería de formularios prearmados: revisá sus reglas de validación y creá una copia editable para personalizar.",
  openGraph: {
    title: "Plantillas · FormForge",
    description:
      "Galería de formularios prearmados: revisá sus reglas de validación y creá una copia editable para personalizar.",
  },
};

export default function TemplatesPage() {
  return <TemplateGalleryPage />;
}
