"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Modal } from "@/shared/components/ui/Modal";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog";
import { createFormField } from "@/features/form-lab/utils";
import { FieldItem } from "./FieldItem";
import type { FormField } from "@/features/form-lab/schema";

interface FieldListProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FieldList({ fields, onChange }: FieldListProps) {
  const [newFieldId, setNewFieldId] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirmDialog();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onChange(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleAddField = () => {
    const newField = createFormField(`Campo ${fields.length + 1}`);
    setNewFieldId(newField.id);
    onChange([...fields, newField]);
  };

  const handleUpdateField = (updated: FormField) => {
    onChange(fields.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleRemoveField = async (id: string) => {
    const target = fields.find((f) => f.id === id);
    if (target && target.rules.length > 0) {
      const confirmed = await confirm({
        title: "Eliminar campo",
        message: `El campo "${target.label}" tiene ${target.rules.length} regla(s) de validación. ¿Eliminarlo de todos modos?`,
        confirmLabel: "Eliminar",
        isDangerous: true,
      });
      if (!confirmed) return;
    }
    onChange(fields.filter((f) => f.id !== id));
  };

  const handleLabelEnter = () => {
    handleAddField();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Campos ({fields.length})</h2>
        <Button type="button" size="sm" onClick={handleAddField}>
          <Plus size={16} />
          Agregar campo
        </Button>
      </div>

      {fields.length === 0 ? (
        <EmptyState
          emoji="📝"
          title="Sin campos todavía"
          description="Agregá tu primer campo para comenzar a construir el formulario."
          action={
            <Button type="button" size="sm" onClick={handleAddField}>
              <Plus size={15} />
              Agregar primer campo
            </Button>
          }
          size="sm"
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              {fields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  autoFocusLabel={field.id === newFieldId}
                  onUpdate={handleUpdateField}
                  onRemove={handleRemoveField}
                  onLabelEnter={handleLabelEnter}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      <Modal {...confirmProps} />
    </Card>
  );
}
