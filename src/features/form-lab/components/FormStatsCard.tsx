import { BarChart2, CheckCircle2, Shield, Layers } from "lucide-react";
import {
  computeFormStats,
  formatFieldType,
  formatRuleType,
} from "@/features/form-lab/utils";
import type { Form } from "@/features/form-lab/schema";
import { cn, cssVars } from "@/shared/lib/helpers";

interface FormStatsCardProps {
  fields: Form["fields"];
}

interface StatRowProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

function StatRow({ label, value, max, color = "bg-primary" }: StatRowProps) {
  const pct = max && max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-muted">{label}</span>
        <span className="text-xs font-semibold text-text">{value}</span>
      </div>
      {max !== undefined && (
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className={cn(
              "h-full w-[var(--stat-width)] rounded-full transition-all duration-500",
              color
            )}
            style={cssVars({ "--stat-width": `${pct}%` })}
          />
        </div>
      )}
    </div>
  );
}

export function FormStatsCard({ fields }: FormStatsCardProps) {
  const stats = computeFormStats(fields);

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center text-text-muted">
        <BarChart2 size={28} className="opacity-40" />
        <p className="text-xs">Agregá campos para ver las estadísticas</p>
      </div>
    );
  }

  const ruleEntries = Object.entries(stats.rulesByType);
  const fieldTypeEntries = Object.entries(stats.fieldTypeBreakdown);

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 text-center">
          <Layers size={16} className="text-primary" />
          <span className="text-2xl font-bold text-text">{stats.totalFields}</span>
          <span className="text-[10px] text-text-muted uppercase tracking-wide">
            {stats.totalFields === 1 ? "Campo" : "Campos"}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 text-center">
          <Shield size={16} className="text-primary" />
          <span className="text-2xl font-bold text-text">{stats.totalRules}</span>
          <span className="text-[10px] text-text-muted uppercase tracking-wide">
            {stats.totalRules === 1 ? "Regla" : "Reglas"}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 text-center">
          <CheckCircle2 size={16} className="text-success" />
          <span className="text-2xl font-bold text-text">{stats.requiredCount}</span>
          <span className="text-[10px] text-text-muted uppercase tracking-wide">Requeridos</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 text-center">
          <BarChart2 size={16} className="text-warning" />
          <span className="text-2xl font-bold text-text">
            {stats.totalFields > 0
              ? Math.round((stats.requiredCount / stats.totalFields) * 100)
              : 0}
            %
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-wide">% Required</span>
        </div>
      </div>

      {/* Rule breakdown */}
      {ruleEntries.length > 0 && (
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Reglas por tipo
          </h4>
          <div className="space-y-2">
            {ruleEntries.map(([type, count]) => (
              <StatRow
                key={type}
                label={formatRuleType(
                  type as Parameters<typeof formatRuleType>[0]
                )}
                value={count}
                max={stats.totalRules}
                color="bg-primary"
              />
            ))}
          </div>
        </section>
      )}

      {/* Field type breakdown */}
      {fieldTypeEntries.length > 1 && (
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Tipos de campo
          </h4>
          <div className="space-y-2">
            {fieldTypeEntries.map(([type, count]) => (
              <StatRow
                key={type}
                label={formatFieldType(
                  type as Parameters<typeof formatFieldType>[0]
                )}
                value={count}
                max={stats.totalFields}
                color="bg-secondary"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
