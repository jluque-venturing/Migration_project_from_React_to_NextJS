import type { ActiveErrorSummary } from "@/features/form-lab/utils";

interface ActiveErrorsSummaryProps {
  errors: ActiveErrorSummary[];
}

export function ActiveErrorsSummary({ errors }: ActiveErrorsSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <section
      aria-label="Resumen de errores activos"
      className="mb-6 rounded-lg border border-red-200 bg-red-50/80 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-red-700">Errores activos</h2>
        <span className="text-xs font-medium text-red-600">{errors.length}</span>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-red-700">
        {errors.map((item) => (
          <li key={item.fieldId}>
            <span className="font-medium">{item.label}</span>: {item.error}
          </li>
        ))}
      </ul>
    </section>
  );
}
