"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/lib/helpers";
import type { FormField } from "@/features/form-lab/schema";
import { RuleEditor } from "./RuleEditor";

interface FieldItemProps {
  field: FormField;
  autoFocusLabel?: boolean;
  onUpdate: (field: FormField) => void;
  onRemove: (id: string) => void;
  onLabelEnter?: () => void;
}

export function FieldItem({
  field,
  autoFocusLabel,
  onUpdate,
  onRemove,
  onLabelEnter,
}: FieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onLabelEnter?.();
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 border border-border rounded-lg bg-surface",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1 text-text-muted hover:text-text cursor-grab active:cursor-grabbing"
        aria-label="Reordenar campo"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor={`field-label-${field.id}`}
              className="block text-xs font-medium text-text-muted mb-1"
            >
              Label
            </label>
            <Input
              id={`field-label-${field.id}`}
              value={field.label}
              autoFocus={autoFocusLabel}
              onChange={(e) =>
                onUpdate({ ...field, label: e.target.value })
              }
              onKeyDown={handleLabelKeyDown}
              placeholder="Nombre del campo"
            />
          </div>

          <div>
            <label
              htmlFor={`field-type-${field.id}`}
              className="block text-xs font-medium text-text-muted mb-1"
            >
              Tipo
            </label>
            <select
              id={`field-type-${field.id}`}
              value={field.type}
              onChange={(e) =>
                onUpdate({
                  ...field,
                  type: e.target.value as FormField["type"],
                })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="text">Texto</option>
              <option value="email">Correo electrónico</option>
              <option value="number">Número</option>
              <option value="password">Contraseña</option>
              <option value="textarea">Texto largo</option>
              <option value="date">Fecha</option>
            </select>
          </div>

          <div>
            <label
              htmlFor={`field-placeholder-${field.id}`}
              className="block text-xs font-medium text-text-muted mb-1"
            >
              Placeholder
            </label>
            <Input
              id={`field-placeholder-${field.id}`}
              value={field.placeholder ?? ""}
              onChange={(e) =>
                onUpdate({ ...field, placeholder: e.target.value })
              }
              placeholder="Placeholder opcional"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-text-muted flex-wrap">
          <span>
            Placeholder en preview:{" "}
            <code className="px-1.5 py-0.5 rounded bg-surface border border-border">
              {field.placeholder || `Ingresá ${field.label.toLowerCase()}`}
            </code>
          </span>
          {field.rules.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {field.rules.length}{" "}
              {field.rules.length === 1 ? "regla" : "reglas"}
            </span>
          )}
        </div>
        <RuleEditor field={field} onUpdate={onUpdate} />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(field.id)}
        aria-label="Eliminar campo"
      >
        <Trash2 size={16} className="text-danger" />
      </Button>
    </li>
  );
}
