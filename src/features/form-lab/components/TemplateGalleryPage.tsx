"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  LayoutTemplate,
  Search,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Input } from "@/shared/components/ui/Input";
import { useFormLabStore } from "@/features/form-lab/store";
import {
  createFormFromTemplate,
  formTemplates,
} from "@/features/form-lab/templates";
import type {
  FormTemplate,
  FormTemplateCategory,
} from "@/features/form-lab/schema";
import {
  countTemplateRules,
  filterTemplates,
  formatFieldType,
  formatRuleType,
  getTemplateCategories,
  sortTemplates,
  templateCategoryLabels,
  templateComplexityLabels,
  type TemplateSortKey,
} from "@/features/form-lab/utils";
import { cn, cssVars } from "@/shared/lib/helpers";

interface TemplateCardProps {
  template: FormTemplate;
  onPreviewTemplate: (template: FormTemplate) => void;
  onUseTemplate: (template: FormTemplate) => void;
}

const sortOptions: Array<{ value: TemplateSortKey; label: string }> = [
  { value: "name-asc", label: "A-Z" },
  { value: "simple-first", label: "Más simples" },
  { value: "complete-first", label: "Más completas" },
  { value: "most-fields", label: "Más campos" },
  { value: "most-rules", label: "Más validaciones" },
];

function TemplateCard({
  template,
  onPreviewTemplate,
  onUseTemplate,
}: TemplateCardProps) {
  const validationCount = countTemplateRules(template);

  return (
    <article aria-labelledby={`template-${template.id}`} className="h-full">
      <Card className="flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {templateCategoryLabels[template.category]}
              </span>
              <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-text-muted">
                {templateComplexityLabels[template.complexity]}
              </span>
            </div>
            <h2
              id={`template-${template.id}`}
              className="break-words text-lg font-semibold text-text"
            >
              {template.name}
            </h2>
            <p className="mt-2 break-words text-sm text-text-muted">
              {template.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-row flex-wrap items-center gap-1 text-xs text-text-muted sm:flex-col sm:items-end">
            <span className="rounded-full border border-border bg-background px-2 py-1">
              {template.fields.length} campos
            </span>
            <span>
              {validationCount}{" "}
              {validationCount === 1 ? "validación" : "validaciones"}
            </span>
          </div>
        </header>

        <div className="mb-4 flex flex-wrap gap-1.5" aria-label="Etiquetas">
          {template.tags.slice(0, 4).map((tag) => (
            <span
              key={`${template.id}-${tag}`}
              className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs text-text-muted"
            >
              <Tags size={11} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>

        <section className="mb-5 flex-1" aria-label={`Campos de ${template.name}`}>
          <ul className="space-y-2">
            {template.fields.slice(0, 5).map((field) => (
              <li
                key={`${template.id}-${field.label}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-text">
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 break-words">{field.label}</span>
                </span>
                <span className="shrink-0 text-right text-xs text-text-muted">
                  {formatFieldType(field.type)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-auto grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onPreviewTemplate(template)}
          >
            <Eye size={16} aria-hidden="true" />
            Preview
          </Button>
          <Button type="button" onClick={() => onUseTemplate(template)}>
            <Sparkles size={16} aria-hidden="true" />
            Usar
          </Button>
        </div>
      </Card>
    </article>
  );
}

interface TemplatePreviewDialogProps {
  template: FormTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: FormTemplate) => void;
}

function TemplatePreviewDialog({
  template,
  onClose,
  onUseTemplate,
}: TemplatePreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Bug B9 del original: con deps vacías el effect corría con
  // dialogRef.current === null (porque `if (!template) return null`) y
  // showModal() nunca se llamaba. Las deps incluyen `template` para
  // reintentar cuando el diálogo recién se monta.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, [template]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [template]);

  if (!template) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="template-preview-title"
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center bg-transparent p-0"
    >
      <button
        type="button"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        aria-label="Cerrar preview"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {templateCategoryLabels[template.category]}
              </span>
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-muted">
                {templateComplexityLabels[template.complexity]}
              </span>
            </div>
            <h2 id="template-preview-title" className="text-xl font-bold text-text">
              {template.name}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{template.description}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            <X size={16} aria-hidden="true" />
            Cerrar
          </Button>
        </header>

        <div className="overflow-y-auto p-5">
          <div className="mb-5 flex flex-wrap gap-1.5">
            {template.tags.map((tag) => (
              <span
                key={`preview-${template.id}-${tag}`}
                className="rounded-full border border-border bg-surface px-2 py-1 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <ul className="space-y-3">
            {template.fields.map((field) => (
              <li
                key={`preview-${template.id}-${field.label}`}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-text">{field.label}</h3>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-text-muted">
                    {formatFieldType(field.type)}
                  </span>
                </div>
                {field.placeholder && (
                  <p className="mt-1 text-sm text-text-muted">
                    Placeholder: {field.placeholder}
                  </p>
                )}
                {field.rules.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {field.rules.map((rule, index) => (
                      <li
                        key={`${field.label}-${rule.type}-${index}`}
                        className="text-sm text-text-muted"
                      >
                        <span className="font-medium text-text">
                          {formatRuleType(rule.type)}
                          {rule.value ? ` (${rule.value})` : ""}:
                        </span>{" "}
                        {rule.message}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-border p-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => onUseTemplate(template)}>
            <Sparkles size={16} aria-hidden="true" />
            Usar plantilla
          </Button>
        </footer>
      </section>
    </dialog>
  );
}

interface UseTemplateDialogProps {
  template: FormTemplate | null;
  formName: string;
  error: string;
  onChangeName: (name: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function UseTemplateDialog({
  template,
  formName,
  error,
  onChangeName,
  onCancel,
  onConfirm,
}: UseTemplateDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  // Mismo fix B9: deps incluyen `template` para re-correr cuando el
  // diálogo recién se monta.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, [template]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onCancelRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [template]);

  useEffect(() => {
    const input = dialogRef.current?.querySelector("input");
    if (input) {
      queueMicrotask(() => input.focus());
    }
  }, [template]);

  if (!template) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="use-template-title"
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center bg-transparent p-0"
    >
      <button
        type="button"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        aria-label="Cancelar creación"
        onClick={onCancel}
      />
      <section className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
        <header>
          <h2 id="use-template-title" className="text-xl font-bold text-text">
            Crear copia editable
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Vas a crear un formulario nuevo a partir de &quot;{template.name}&quot;.
          </p>
        </header>

        <div className="mt-5">
          <label htmlFor="template-form-name" className="block text-sm font-medium text-text">
            Nombre del formulario
          </label>
          <Input
            id="template-form-name"
            value={formName}
            onChange={(event) => onChangeName(event.target.value)}
            className="mt-2"
            error={error}
          />
        </div>

        <footer className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm}>
            <Sparkles size={16} aria-hidden="true" />
            Crear formulario
          </Button>
        </footer>
      </section>
    </dialog>
  );
}

type GalleryFilterState = {
  searchQuery: string;
  selectedCategory: FormTemplateCategory | "all";
  sortKey: TemplateSortKey;
};

type GalleryFilterAction =
  | { type: "setSearchQuery"; value: string }
  | { type: "setSelectedCategory"; value: FormTemplateCategory | "all" }
  | { type: "setSortKey"; value: TemplateSortKey };

function galleryFilterReducer(state: GalleryFilterState, action: GalleryFilterAction): GalleryFilterState {
  switch (action.type) {
    case "setSearchQuery":
      return { ...state, searchQuery: action.value };
    case "setSelectedCategory":
      return { ...state, selectedCategory: action.value };
    case "setSortKey":
      return { ...state, sortKey: action.value };
  }
}

type DialogState = {
  previewTemplate: FormTemplate | null;
  templateToCreate: FormTemplate | null;
  customName: string;
  nameError: string;
};

type DialogAction =
  | { type: "openPreview"; template: FormTemplate }
  | { type: "closePreview" }
  | { type: "openUseTemplate"; template: FormTemplate }
  | { type: "cancelUseTemplate" }
  | { type: "setCustomName"; value: string }
  | { type: "setNameError"; value: string };

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "openPreview":
      return { ...state, previewTemplate: action.template };
    case "closePreview":
      return { ...state, previewTemplate: null };
    case "openUseTemplate":
      return { ...state, previewTemplate: null, templateToCreate: action.template, customName: action.template.name, nameError: "" };
    case "cancelUseTemplate":
      return { ...state, templateToCreate: null, customName: "", nameError: "" };
    case "setCustomName":
      return { ...state, customName: action.value };
    case "setNameError":
      return { ...state, nameError: action.value };
  }
}

export function TemplateGalleryPage() {
  const addForm = useFormLabStore((state) => state.addForm);
  const setCurrentForm = useFormLabStore((state) => state.setCurrentForm);
  const router = useRouter();
  const [filter, dispatchFilter] = useReducer(galleryFilterReducer, {
    searchQuery: "",
    selectedCategory: "all" as FormTemplateCategory | "all",
    sortKey: "name-asc" as TemplateSortKey,
  });
  const [dialog, dispatchDialog] = useReducer(dialogReducer, {
    previewTemplate: null,
    templateToCreate: null,
    customName: "",
    nameError: "",
  });

  const categories = getTemplateCategories(formTemplates);
  const filtered = sortTemplates(
    filterTemplates(formTemplates, filter.searchQuery, filter.selectedCategory),
    filter.sortKey
  );

  const openUseTemplateDialog = (template: FormTemplate) => {
    dispatchDialog({ type: "openUseTemplate", template });
  };

  const cancelUseTemplate = () => {
    dispatchDialog({ type: "cancelUseTemplate" });
  };

  const confirmUseTemplate = () => {
    if (!dialog.templateToCreate) return;
    const trimmedName = dialog.customName.trim();
    if (trimmedName.length === 0) {
      dispatchDialog({ type: "setNameError", value: "El nombre del formulario es obligatorio" });
      return;
    }

    const form = {
      ...createFormFromTemplate(dialog.templateToCreate, {
        createId: () => crypto.randomUUID(),
        getCreatedAt: () => new Date().toISOString(),
      }),
      name: trimmedName,
    };

    addForm(form);
    setCurrentForm(form);
    router.push(`/builder?id=${form.id}`);
  };

  // B1: esta página NO define su propio <main> — ya existe uno en el
  // root layout (`<main id="main-content">`).
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 animate-fade-up">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft size={16} aria-hidden="true" />
              Volver
            </Link>
          </Button>

          <div className="mt-6 flex items-start gap-4">
            <span className="shrink-0 rounded-lg bg-primary p-3 text-white">
              <LayoutTemplate size={28} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="break-words text-3xl font-bold text-text">
                Galería de plantillas
              </h1>
              <p className="mt-2 max-w-2xl break-words text-text-muted">
                Elegí un formulario prearmado, revisá sus reglas y creá una
                copia editable para personalizarla desde el constructor.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="text"
                value={filter.searchQuery}
                onChange={(event) => dispatchFilter({ type: "setSearchQuery", value: event.target.value })}
                placeholder="Buscar por nombre, tag, campo o regla..."
                className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-4 text-sm text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Buscar plantilla"
              />
            </div>

            <label className="block">
              <span className="sr-only">Ordenar plantillas</span>
              <select
                value={filter.sortKey}
                onChange={(event) =>
                  dispatchFilter({ type: "setSortKey", value: event.target.value as TemplateSortKey })
                }
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <nav className="mt-5 flex flex-wrap gap-2" aria-label="Categorías">
            <button
              type="button"
              onClick={() => dispatchFilter({ type: "setSelectedCategory", value: "all" })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter.selectedCategory === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-text-muted hover:text-text"
              )}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => dispatchFilter({ type: "setSelectedCategory", value: category })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  filter.selectedCategory === category
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-text-muted hover:text-text"
                )}
              >
                {templateCategoryLabels[category]}
              </button>
            ))}
          </nav>
        </header>

        <section aria-label="Plantillas disponibles">
          {filtered.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title="Sin resultados"
              description={`No encontramos plantillas que coincidan con "${filter.searchQuery}". Probá con otro término o categoría.`}
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatchFilter({ type: "setSearchQuery", value: "" });
                    dispatchFilter({ type: "setSelectedCategory", value: "all" });
                  }}
                >
                  Limpiar filtros
                </Button>
              }
              size="lg"
            />
          ) : (
            <ul
              className="grid list-none grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((template, index) => (
                <li
                  key={template.id}
                  className="form-anim-stagger animate-fade-up"
                  style={cssVars({ "--anim-delay": `${index * 45}ms` })}
                >
                  <TemplateCard
                    template={template}
                    onPreviewTemplate={(t) => dispatchDialog({ type: "openPreview", template: t })}
                    onUseTemplate={openUseTemplateDialog}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <TemplatePreviewDialog
        template={dialog.previewTemplate}
        onClose={() => dispatchDialog({ type: "closePreview" })}
        onUseTemplate={openUseTemplateDialog}
      />
      <UseTemplateDialog
        template={dialog.templateToCreate}
        formName={dialog.customName}
        error={dialog.nameError}
        onChangeName={(name) => {
          dispatchDialog({ type: "setCustomName", value: name });
          if (name.trim().length > 0) dispatchDialog({ type: "setNameError", value: "" });
        }}
        onCancel={cancelUseTemplate}
        onConfirm={confirmUseTemplate}
      />
    </div>
  );
}
