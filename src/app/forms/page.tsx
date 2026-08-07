import type { Metadata } from "next";
import { MyFormsPage } from "@/features/form-lab/components/MyFormsPage";

export const metadata: Metadata = {
  title: "Mis formularios",
  description:
    "Gestioná tus formularios guardados: editá, duplicá, exportá, importá y organizalos en colecciones.",
  openGraph: {
    title: "Mis formularios · FormForge",
    description:
      "Gestioná tus formularios guardados: editá, duplicá, exportá, importá y organizalos en colecciones.",
  },
};

export default function FormsPage() {
  return <MyFormsPage />;
}
