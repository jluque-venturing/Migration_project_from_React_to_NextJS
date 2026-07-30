"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Folder, Plus, Check } from "lucide-react";
import { useCollectionStore } from "../store";
import { getCollectionColorClasses } from "../utils";
import { cn } from "@/shared/lib/helpers";

interface CollectionSelectProps {
  formId: string;
  align?: "left" | "right";
  className?: string;
  trigger?: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
}

export function CollectionSelect({
  formId,
  align = "left",
  className,
  trigger,
}: CollectionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = `collection-select-${formId}`;

  const collections = useCollectionStore((state) => state.collections);
  const addCollection = useCollectionStore((state) => state.addCollection);
  const addFormToCollection = useCollectionStore((state) => state.addFormToCollection);
  const toggleFormInCollection = useCollectionStore((state) => state.toggleFormInCollection);

  // Filtrar las colecciones a las que pertenece este formulario
  const activeCollections = collections.filter((c) => c.formIds.includes(formId));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const performCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    // Crear la colección y asociar el formulario inmediatamente
    const newId = addCollection(newCollectionName.trim());
    addFormToCollection(newId, formId);

    setNewCollectionName("");
  };

  const toggleProps = {
    onClick: () => setIsOpen((prev) => !prev),
    "aria-expanded": isOpen,
    "aria-haspopup": "menu" as const,
    "aria-controls": listboxId,
  };

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      {trigger ? (
        <span onClick={(e) => e.stopPropagation()}>
          {cloneTrigger(trigger, toggleProps)}
        </span>
      ) : (
        <button
          type="button"
          {...toggleProps}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text hover:bg-surface-hover hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Folder size={16} className="text-text-muted" aria-hidden="true" />
          <span>
            {activeCollections.length === 0
              ? "Asignar colección"
              : activeCollections.length === 1
                ? `1 colección`
                : `${activeCollections.length} colecciones`}
          </span>
        </button>
      )}

      {isOpen && (
        <div
          id={listboxId}
          aria-label="Colecciones disponibles"
          className={cn(
            "absolute z-50 mt-1 w-64 rounded-xl border border-border bg-surface p-3 shadow-xl animate-[scaleIn_150ms_ease-out] select-none",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Colecciones
          </h4>

          {collections.length === 0 ? (
            <p className="py-3 text-center text-xs text-text-muted">
              No hay colecciones creadas.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {collections.map((collection) => {
                const isSelected = collection.formIds.includes(formId);
                const colorClasses = getCollectionColorClasses(collection.color);

                return (
                  <button
                    key={collection.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleFormInCollection(collection.id, formId)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors",
                      isSelected
                        ? cn(colorClasses.bg, colorClasses.text)
                        : "text-text hover:bg-surface-hover"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder
                        size={14}
                        className={cn(
                          "shrink-0",
                          isSelected ? colorClasses.text : "text-text-muted"
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{collection.name}</span>
                    </div>
                    {isSelected && (
                      <Check size={14} className={cn("shrink-0", colorClasses.text)} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="my-2 border-t border-border" />

          <div className="flex gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Nueva colección..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  performCreateCollection();
                }
              }}
              aria-label="Nombre de la nueva colección"
              className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                performCreateCollection();
              }}
              disabled={!newCollectionName.trim()}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer"
              aria-label="Crear colección"
              title="Crear colección"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function cloneTrigger(
  trigger: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>,
  toggleProps: {
    onClick: () => void;
    "aria-expanded": boolean;
    "aria-haspopup": "menu";
    "aria-controls": string;
  }
): React.ReactElement {
  return React.cloneElement(trigger, {
    ...toggleProps,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleProps.onClick();
      if (typeof trigger.props.onClick === "function") {
        trigger.props.onClick(e);
      }
    },
  });
}
