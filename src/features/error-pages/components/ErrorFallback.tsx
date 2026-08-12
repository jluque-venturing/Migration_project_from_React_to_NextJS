"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface ErrorFallbackProps {
  error?: Error;
  onReset?: () => void;
}

export function ErrorFallback({ onReset }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertCircle size={32} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-text">
          Algo se rompió en esta vista
        </h1>
        <p className="max-w-md text-text-muted">
          Se produjo un error inesperado al renderizar esta parte de la
          aplicación. Probá recargando la página.
        </p>
      </div>
      <Button type="button" onClick={() => window.location.reload()}>
        <RefreshCw size={16} />
        Recargar página
      </Button>
      {onReset && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Volver atrás
        </Button>
      )}
    </div>
  );
}
