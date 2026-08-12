"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import type { FormField, FieldRule } from "@/features/form-lab/schema";
import { formatRuleType } from "@/features/form-lab/utils";
import { useRuleEngine } from "@/features/form-lab/hooks/useRuleEngine";

interface RuleEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
}

export function RuleEditor({ field, onUpdate }: RuleEditorProps) {
  const { addRule, updateRule, removeRule, availableToAdd } =
    useRuleEngine({ field, onUpdate });

  return (
    <div className="mt-3 space-y-2">
      {/* Reglas existentes */}
      {field.rules.length > 0 && (
        <ul
          className="space-y-2"
          aria-label={`Reglas del campo ${field.label}`}
        >
          {field.rules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              onUpdate={updateRule}
              onRemove={removeRule}
            />
          ))}
        </ul>
      )}

      {/* Botones para agregar reglas disponibles */}
      {availableToAdd.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {availableToAdd.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addRule(type)}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-dashed border-border text-text-muted hover:border-primary hover:text-primary transition-colors"
              aria-label={`Agregar regla ${formatRuleType(type)}`}
            >
              <Plus size={12} aria-hidden="true" />
              {formatRuleType(type)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface RuleRowProps {
  rule: FieldRule;
  onUpdate: (rule: FieldRule) => void;
  onRemove: (id: string) => void;
}

function RuleRow({ rule, onUpdate, onRemove }: RuleRowProps) {
  const needsValue =
    rule.type === "min" || rule.type === "max" || rule.type === "regex";

  return (
    <li className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border">
      {/* Tipo de regla (badge) */}
      <span className="mt-1 shrink-0 px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">
        {formatRuleType(rule.type)}
      </span>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Valor de la regla (solo min/max/regex) */}
        {needsValue && (
          <Input
            value={rule.value ?? ""}
            onChange={(e) => onUpdate({ ...rule, value: e.target.value })}
            placeholder={
              rule.type === "min" || rule.type === "max"
                ? "Cantidad de caracteres"
                : "Expresión regular"
            }
            aria-label={`Valor de regla ${formatRuleType(rule.type)}`}
          />
        )}

        {/* Mensaje de error personalizado */}
        <Input
          value={rule.message ?? ""}
          onChange={(e) =>
            onUpdate({ ...rule, message: e.target.value || undefined })
          }
          placeholder="Mensaje de error (opcional)"
          aria-label="Mensaje de error personalizado"
        />
      </div>

      {/* Eliminar regla */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(rule.id)}
        aria-label={`Eliminar regla ${formatRuleType(rule.type)}`}
      >
        <Trash2 size={14} className="text-danger" />
      </Button>
    </li>
  );
}
