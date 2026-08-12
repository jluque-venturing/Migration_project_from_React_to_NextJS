"use client";

import { useRouter } from "next/navigation";
import { FlaskConical, AlertTriangle, Home, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center pt-[15vh]">
        <section aria-labelledby="not-found-title">
          <div className="relative mb-8 inline-flex">
            <FlaskConical
              size={120}
              className="text-primary opacity-20"
              strokeWidth={1.5}
            />
            <AlertTriangle
              size={40}
              className="absolute -right-2 -top-2 text-warning"
              strokeWidth={2}
            />
          </div>

          <h1
            id="not-found-title"
            className="text-7xl font-bold text-primary mb-4 tracking-tight"
          >
            404
          </h1>

          <h2 className="text-2xl font-semibold text-text mb-3">
            Esta página se evaporó en el laboratorio
          </h2>

          <p className="text-text-muted mb-8 max-w-md">
            El formulario que buscás no existe, fue eliminado, o nunca formó
            parte de este formulario. Volvé al área de trabajo para seguir
            creando.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => router.push("/")}>
              <Home size={18} />
              Volver al inicio
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/builder")}
            >
              <Plus size={18} />
              Crear formulario
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
