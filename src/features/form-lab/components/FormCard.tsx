"use client";

import { Copy, Download, Eye, Pencil, Trash2, Folder, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useToast } from "@/features/notifications/hooks/useToast";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog";
import { getCollectionColorClasses } from "@/features/collections/utils";
import { CollectionSelect } from "@/features/collections/components/CollectionSelect";
import {
  serializeForm,
  toSafeFilename,
} from "@/features/form-lab/utils";
import { downloadTextFile } from "@/features/form-lab/dom-helpers";
import { Card } from "@/shared/components/ui/Card";
import { cn, cssVars } from "@/shared/lib/helpers";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Form } from "@/features/form-lab/schema";
import type { Collection } from "@/features/collections/types";

interface FormCardProps {
  form: Form;
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
  collections: Collection[];
  onRemoveFromCollection: (collectionId: string, formId: string) => void;
  onRemoveForm: (formId: string) => void;
  onRemoveFormFromAllCollections: (formId: string) => void;
  onDuplicateForm: (formId: string) => void;
  index: number;
}

export function FormCard({
  form,
  activeTag,
  onTagClick,
  collections,
  onRemoveFromCollection,
  onRemoveForm,
  onRemoveFormFromAllCollections,
  onDuplicateForm,
  index,
}: FormCardProps) {
  const { confirm, confirmProps } = useConfirmDialog();
  const { success: showSuccess, error: showError } = useToast();

  const formCollections = collections.filter((c) => c.formIds.includes(form.id));

  return (
    <li
      className="form-anim-stagger animate-fade-up"
      style={cssVars({ "--anim-delay": `${(index + 2) * 60}ms` })}
    >
      <Card className="group h-full p-0 card-lift">
        <div
          className="h-1 rounded-t-xl bg-gradient-to-r from-[var(--card-accent-start)] to-[var(--card-accent-end)]"
          style={cssVars({
            "--card-accent-start": form.theme?.primaryColor ?? "var(--color-primary)",
            "--card-accent-end": form.theme?.accentColor ?? "#8b5cf6",
          })}
        />
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl bg-[var(--card-icon-bg)] text-[var(--card-icon-color)]"
                style={cssVars({
                  "--card-icon-bg": form.theme
                    ? `${form.theme.primaryColor}18`
                    : "rgba(59,130,246,0.1)",
                  "--card-icon-color": form.theme?.primaryColor ?? "var(--color-primary)",
                })}
              >
                {form.theme?.emoji || "🧪"}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-text">
                  {form.name}
                </h3>
                <p className="text-xs text-text-muted">
                  Creado{" "}
                  {formatDistanceToNow(new Date(form.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-muted border border-border">
              {form.fields.length}{" "}
              {form.fields.length === 1 ? "campo" : "campos"}
            </span>
          </div>

          {form.description && (
            <p className="mb-3 line-clamp-2 text-sm text-text-muted">
              {form.description}
            </p>
          )}

          {formCollections.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5 select-none animate-fade-in">
              {formCollections.map((col) => {
                const colorClasses = getCollectionColorClasses(col.color);
                return (
                  <span
                    key={col.id}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                      colorClasses.bg,
                      colorClasses.text,
                      colorClasses.border
                    )}
                  >
                    <Folder size={10} />
                    <span>{col.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromCollection(col.id, form.id);
                        showSuccess(`Se quitó de la colección "${col.name}"`);
                      }}
                      className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors cursor-pointer"
                      aria-label={`Quitar formulario de la colección ${col.name}`}
                      title="Quitar de colección"
                    >
                      <X size={10} aria-hidden="true" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {(form.tags ?? []).length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(form.tags ?? []).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(activeTag === tag ? null : tag)}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    activeTag === tag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface text-text-muted hover:border-primary/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href={`/preview/${form.id}`}>
                <Eye size={14} />
                Ver resultado
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/builder?id=${form.id}`}>
                <Pencil size={14} />
                Editar
              </Link>
            </Button>
            <CollectionSelect
              formId={form.id}
              align="right"
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  title="Asignar a colecciones"
                  aria-label={`Asignar a colecciones ${form.name}`}
                >
                  <Folder size={14} className="text-text-muted" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const ok = downloadTextFile({
                  filename: toSafeFilename(form.name),
                  content: serializeForm(form),
                });
                if (ok) showSuccess(`Se exportó "${form.name}"`);
                else showError("No se pudo descargar el archivo");
              }}
              aria-label={`Exportar formulario ${form.name}`}
            >
              <Download size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDuplicateForm(form.id);
                showSuccess(`Se duplicó "${form.name}"`);
              }}
              aria-label={`Duplicar formulario ${form.name}`}
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                const confirmed = await confirm({
                  title: "Eliminar formulario",
                  message: `¿Eliminar el formulario "${form.name}"? Esta acción no se puede deshacer.`,
                  confirmLabel: "Eliminar",
                  isDangerous: true,
                });
                if (confirmed) {
                  onRemoveForm(form.id);
                  onRemoveFormFromAllCollections(form.id);
                }
              }}
              aria-label={`Eliminar formulario ${form.name}`}
            >
              <Trash2 size={14} className="text-danger" />
            </Button>
          </div>
        </div>

        <Link
          href={`/preview/${form.id}`}
          className="flex w-full items-center justify-center gap-1 border-t border-border bg-surface/50 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-surface"
        >
          Abrir formulario
          <ArrowRight size={14} />
        </Link>
      </Card>
      <Modal {...confirmProps} />
    </li>
  );
}
