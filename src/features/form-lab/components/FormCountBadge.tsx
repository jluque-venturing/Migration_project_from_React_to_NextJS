"use client";

import { useFormLabStore } from "@/features/form-lab/store";

/**
 * Único pedazo interactivo de la Home: el contador de formularios creados.
 * Vive en el store persistido, así que sólo puede leerse en el cliente.
 * El resto de la página queda renderizada en el servidor (ver HomePage).
 */
export function FormCountBadge() {
  const formCount = useFormLabStore((state) => state.forms.length);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-bold text-text">{formCount}</span>
      <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
        {formCount === 1 ? "Formulario creado" : "Formularios creados"}
      </span>
    </div>
  );
}
