import type { Metadata } from "next";
import { HomePage } from "@/features/form-lab/components/HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "FormForge — Laboratorio de Validación de Formularios",
  },
  description:
    "Diseñá formularios únicos con reglas de validación combinables, animaciones temáticas y previsualización en vivo.",
  openGraph: {
    title: "FormForge — Laboratorio de Validación de Formularios",
    description:
      "Diseñá formularios únicos con reglas de validación combinables, animaciones temáticas y previsualización en vivo.",
  },
};

export default function Home() {
  return <HomePage />;
}
