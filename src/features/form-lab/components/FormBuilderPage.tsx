"use client";

import { useEffect, useReducer, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Palette,
  Eye,
  Sparkles,
  Maximize2,
  Share2,
  Code2,
  Undo2,
  Redo2,
  BarChart2,
  Tag,
  Layers,
  Folder,
  Check,
  Minus,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { FormMetadataCard } from "./FormMetadataCard";
import { FieldList } from "./FieldList";
import { FormStatsCard } from "./FormStatsCard";
import { FormTagsInput } from "./FormTagsInput";
import { JsonPreviewModal } from "./JsonPreviewModal";
import { useFormLabStore } from "@/features/form-lab/store";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { useHistory } from "@/features/form-lab/hooks/useHistory";
import { formSchema, type Form, type FormField } from "@/features/form-lab/schema";
import { encodeFormToBase64 } from "@/features/form-lab/utils";
import { ThemeDrawer } from "@/features/form-theme/components/ThemeDrawer";
import { LiveThemePreview } from "@/features/form-theme/components/LiveThemePreview";
import { ThemePreviewModal } from "@/features/form-theme/components/ThemePreviewModal";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { useToast } from "@/features/notifications/hooks/useToast";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut";
import { TourOverlay } from "@/features/onboarding/components/TourOverlay";
import { CollectionSelect } from "@/features/collections/components/CollectionSelect";
import { cn } from "@/shared/lib/helpers";

const AUTO_SAVE_DELAY_MS = 2000;

function createEmptyForm(): Form {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    tags: [],
    fields: [],
    createdAt: new Date().toISOString(),
    theme: undefined,
  };
}

type SidebarTab = "preview" | "stats";
type MobileTab = "fields" | "preview" | "stats";

interface BuilderHeaderProps {
  existingForm: Form | null | undefined;
  autoSaveStatus: "idle" | "saved" | "unsaved";
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenJson: () => void;
  onOpenDrawer: () => void;
  onShare: () => void;
  isFormNameValid: boolean;
  backHref: string;
}

function BuilderHeader({
  existingForm,
  autoSaveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenJson,
  onOpenDrawer,
  onShare,
  isFormNameValid,
  backHref,
}: BuilderHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={backHref}>
            <ArrowLeft size={16} />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-text sm:text-2xl">
            {existingForm ? "Editar formulario" : "Crear formulario"}
          </h1>
          {existingForm && (
            <p
              className={cn(
                "text-xs transition-colors",
                autoSaveStatus === "saved" && "text-success",
                autoSaveStatus === "unsaved" && "text-text-muted",
                autoSaveStatus === "idle" && "text-transparent"
              )}
              aria-live="polite"
            >
              {autoSaveStatus === "saved" && (
                <span className="inline-flex items-center gap-1">
                  <Check size={12} aria-hidden="true" />
                  Auto-guardado
                </span>
              )}
              {autoSaveStatus === "unsaved" && "Cambios sin guardar..."}
              {autoSaveStatus === "idle" && (
                <span className="inline-flex items-center gap-1">
                  <Minus size={12} aria-hidden="true" />
                  Sin cambios
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-lg border border-border bg-surface">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex h-9 w-9 items-center justify-center rounded-l-lg text-text-muted transition-colors hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Deshacer (Ctrl+Z)"
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex h-9 w-9 items-center justify-center rounded-r-lg text-text-muted transition-colors hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Rehacer (Ctrl+Shift+Z)"
            title="Rehacer (Ctrl+Shift+Z)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenJson}
          title="Ver JSON (Ctrl+Shift+J)"
        >
          <Code2 size={15} />
          <span className="hidden sm:inline">Ver JSON</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onOpenDrawer}
          className="gap-2 border-2 border-primary/20 hover:border-primary/40"
        >
          <Palette size={16} />
          <span className="hidden sm:inline">Personalizar diseño</span>
          <span className="sm:hidden">Diseño</span>
          <Sparkles size={14} className="text-primary" />
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onShare}
          disabled={!isFormNameValid}
          title="Publicar"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Publicar</span>
        </Button>

        <Button
          type="submit"
          disabled={!isFormNameValid}
          title="Guardar (Ctrl+S)"
        >
          <Save size={16} />
          Guardar
        </Button>
      </div>
    </header>
  );
}

interface MobileTabBarProps {
  mobileTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

function MobileTabBar({ mobileTab, onTabChange }: MobileTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Secciones del formulario"
      className="mb-4 flex gap-1 rounded-lg border border-border bg-surface p-1 lg:hidden"
    >
      {([
        { key: "fields" as const, icon: Layers, label: "Campos" },
        { key: "preview" as const, icon: Eye, label: "Diseño" },
        { key: "stats" as const, icon: BarChart2, label: "Stats" },
      ]).map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={mobileTab === key}
          onClick={() => onTabChange(key)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-medium transition-colors",
            mobileTab === key
              ? "bg-background text-text shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}

interface SidebarTabBarProps {
  sidebarTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

function SidebarTabBar({ sidebarTab, onTabChange }: SidebarTabBarProps) {
  return (
    <div
      role="tablist"
      className="flex gap-1 rounded-lg border border-border bg-surface p-1"
      aria-label="Opciones del panel lateral"
    >
      {([
        { key: "preview" as const, icon: Eye, label: "Diseño" },
        { key: "stats" as const, icon: BarChart2, label: "Estadísticas" },
      ]).map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={sidebarTab === key}
          onClick={() => onTabChange(key)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors",
            sidebarTab === key
              ? "bg-background text-text shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}

interface BuilderMainColumnProps {
  formIdValue: string | undefined;
  tags: string[];
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  onTagsChange: (tags: string[]) => void;
  hasErrors: boolean;
}

function BuilderMainColumn({
  formIdValue,
  tags,
  fields,
  onFieldsChange,
  onTagsChange,
  hasErrors,
}: BuilderMainColumnProps) {
  return (
    <div className="space-y-6">
      <FormMetadataCard />

      <Card className="p-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
          <Folder size={15} className="text-text-muted" aria-hidden="true" />
          Colecciones
        </h3>
        <CollectionSelect formId={formIdValue ?? ""} className="w-full" />
        <p className="mt-1.5 text-xs text-text-muted">
          Agrupá este formulario en colecciones para organizarlo en &quot;Mis
          formularios&quot;.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
          <Tag size={15} className="text-text-muted" aria-hidden="true" />
          Etiquetas
        </h3>
        <FormTagsInput tags={tags} onChange={onTagsChange} />
        <p className="mt-1.5 text-xs text-text-muted">
          Presioná Enter o coma para agregar. Sirven para filtrar en &quot;Mis
          formularios&quot;.
        </p>
      </Card>

      <FieldList fields={fields} onChange={onFieldsChange} />

      {hasErrors && (
        <Card className="border-danger p-4">
          <p className="text-sm text-danger">
            Revisá los campos antes de guardar. Asegurate de que todos
            los campos tengan un label y que el nombre del formulario no
            esté vacío.
          </p>
        </Card>
      )}
    </div>
  );
}

interface BuilderSidebarProps {
  sidebarTab: SidebarTab;
  mobileTab: MobileTab;
  onSidebarTabChange: (tab: SidebarTab) => void;
  onOpenPreview: () => void;
  fields: FormField[];
}

function BuilderSidebar({
  sidebarTab,
  mobileTab,
  onSidebarTabChange,
  onOpenPreview,
  fields,
}: BuilderSidebarProps) {
  return (
    <aside
      className={cn(
        "lg:sticky lg:top-6 h-fit space-y-4",
        mobileTab === "fields" && "hidden lg:block"
      )}
    >
      <SidebarTabBar sidebarTab={sidebarTab} onTabChange={onSidebarTabChange} />

      {(sidebarTab === "preview" || mobileTab === "preview") && (
        <section aria-labelledby="preview-heading">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2
              id="preview-heading"
              className="text-sm font-semibold text-text-muted"
            >
              Vista previa en vivo
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenPreview}
              className="gap-1 text-xs"
              title="Ampliar (Ctrl+E)"
            >
              <Maximize2 size={14} />
              Ampliar
            </Button>
          </div>
          <LiveThemePreview />

          <Card className="mt-4 p-4 text-sm text-text-muted">
            <p className="flex items-start gap-2">
              <Sparkles size={15} className="mt-0.5 shrink-0 text-primary" />
              <span>
                Tip: elegí un preset temático, subí imágenes y agregá
                animaciones al botón de enviar desde el panel de diseño.
              </span>
            </p>
          </Card>
        </section>
      )}

      {(sidebarTab === "stats" || mobileTab === "stats") && (
        <section aria-labelledby="stats-heading">
          <h2
            id="stats-heading"
            className="mb-3 text-sm font-semibold text-text-muted"
          >
            Estadísticas del formulario
          </h2>
          <Card className="p-4">
            <FormStatsCard fields={fields} />
          </Card>
        </section>
      )}
    </aside>
  );
}

type UiState = {
  isPreviewOpen: boolean;
  isJsonOpen: boolean;
  sidebarTab: SidebarTab;
  mobileTab: MobileTab;
  autoSaveStatus: "idle" | "saved" | "unsaved";
};

type UiAction =
  | { type: "setPreviewOpen"; value: boolean }
  | { type: "setJsonOpen"; value: boolean }
  | { type: "setSidebarTab"; value: SidebarTab }
  | { type: "setMobileTab"; value: MobileTab }
  | { type: "setAutoSaveStatus"; value: "idle" | "saved" | "unsaved" };

function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "setPreviewOpen":
      return { ...state, isPreviewOpen: action.value };
    case "setJsonOpen":
      return { ...state, isJsonOpen: action.value };
    case "setSidebarTab":
      return { ...state, sidebarTab: action.value };
    case "setMobileTab":
      return { ...state, mobileTab: action.value };
    case "setAutoSaveStatus":
      return { ...state, autoSaveStatus: action.value };
  }
}

export function FormBuilderPage() {
  // Next.js 16: useSearchParams() retorna ReadonlyURLSearchParams (objeto,
  // no array). Se usa igual: .get("id"), .toString(), etc.
  const searchParams = useSearchParams();
  const router = useRouter();
  const formId = searchParams.get("id");

  const addForm = useFormLabStore((state) => state.addForm);
  const updateForm = useFormLabStore((state) => state.updateForm);
  const existingForm = useFormById(formId ?? undefined);
  const { success: showSuccess, error: showError } = useToast();

  const { theme, isDrawerOpen, openDrawer, setTheme, resetTheme } = useFormTheme();

  const lastFormIdRef = useRef<string | null | null>(null);
  const hasLoadedThemeRef = useRef<boolean>(false);

  useEffect(() => {
    const resolvedFormId = formId ?? null;
    const isNewForm = resolvedFormId === null;
    const formChanged = lastFormIdRef.current !== resolvedFormId;

    if (formChanged) {
      lastFormIdRef.current = resolvedFormId;
      hasLoadedThemeRef.current = false;
    }

    if (isNewForm) {
      if (!hasLoadedThemeRef.current) {
        resetTheme();
        hasLoadedThemeRef.current = true;
      }
    } else {
      if (existingForm?.theme && !hasLoadedThemeRef.current) {
        setTheme(existingForm.theme);
        hasLoadedThemeRef.current = true;
      }
    }
  }, [formId, existingForm?.theme, setTheme, resetTheme]);

  const [ui, dispatch] = useReducer(uiReducer, {
    isPreviewOpen: false,
    isJsonOpen: false,
    sidebarTab: "preview" as SidebarTab,
    mobileTab: "fields" as MobileTab,
    autoSaveStatus: "idle" as const,
  });
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo/redo
  const {
    canUndo,
    canRedo,
    pushHistory,
    undo: historyUndo,
    redo: historyRedo,
    clearHistory,
  } = useHistory();

  const methods = useForm<Form, unknown, Form>({
    resolver: zodResolver(formSchema) as Resolver<Form>,
    defaultValues: existingForm ?? createEmptyForm(),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, setValue, reset, getValues, formState } = methods;
  const name = useWatch({ control: methods.control, name: "name" });
  const description = useWatch({ control: methods.control, name: "description" });
  const fields = useWatch({ control: methods.control, name: "fields" }) ?? [];
  const tags = useWatch({ control: methods.control, name: "tags" }) ?? [];
  const formIdValue = useWatch({ control: methods.control, name: "id" });
  const watchedValues = useWatch({ control: methods.control });

  // Track if we have already loaded the existingForm to avoid infinite loops when reset is called.
  const lastLoadedFormIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!existingForm) return;
    if (lastLoadedFormIdRef.current === existingForm.id) return;
    lastLoadedFormIdRef.current = existingForm.id;

    reset(existingForm);
    clearHistory();
  }, [existingForm, reset, clearHistory]);

  const themeRef = useRef(theme);
  const existingFormRef = useRef(existingForm);

  useEffect(() => {
    themeRef.current = theme;
    existingFormRef.current = existingForm;
  });

  // Watch changes for auto-save (existing forms only)
  useEffect(() => {
    if (!existingFormRef.current) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    dispatch({ type: "setAutoSaveStatus", value: "unsaved" });
    autoSaveTimerRef.current = setTimeout(() => {
      const current = getValues();
      if (!current.name?.trim()) return;
      const formData: Form = { ...current, theme: themeRef.current };
      updateForm(formData);
      dispatch({ type: "setAutoSaveStatus", value: "saved" });
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [watchedValues, getValues, updateForm]);

  const handleFieldsChange = (updatedFields: FormField[]) => {
    pushHistory({ ...getValues(), theme });
    setValue("fields", updatedFields, { shouldValidate: false });
  };

  const handleUndo = () => {
    const current: Form = { ...getValues(), theme };
    const prev = historyUndo(current);
    if (!prev) return;
    reset(prev);
  };

  const handleRedo = () => {
    const current: Form = { ...getValues(), theme };
    const next = historyRedo(current);
    if (!next) return;
    reset(next);
  };

  const onSubmit = (values: Form) => {
    const formData: Form = { ...values, theme };
    if (existingForm) {
      updateForm(formData);
    } else {
      addForm(formData);
    }
    showSuccess(existingForm ? "Formulario actualizado" : "Formulario guardado");
    router.push("/forms");
  };

  const isFormNameValid = name.trim().length > 0;

  const handleShare = async () => {
    const shareableForm: Form = { ...getValues(), theme };
    const shareUrl = new URL("/share", window.location.origin);
    shareUrl.searchParams.set("data", encodeFormToBase64(shareableForm));

    if (!navigator.clipboard) {
      showError("No se pudo acceder al portapapeles");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      showSuccess("Enlace copiado al portapapeles");
    } catch {
      showError("No se pudo copiar el enlace");
    }
  };

  // --- Keyboard shortcuts ---
  // Cmd/Ctrl+S -> save
  useKeyboardShortcut("s", () => {
    if (isFormNameValid) handleSubmit(onSubmit)();
  }, { metaKey: true });
  useKeyboardShortcut("s", () => {
    if (isFormNameValid) handleSubmit(onSubmit)();
  }, { ctrlKey: true });

  // Cmd/Ctrl+E -> open preview
  useKeyboardShortcut("e", () => dispatch({ type: "setPreviewOpen", value: true }), { metaKey: true });
  useKeyboardShortcut("e", () => dispatch({ type: "setPreviewOpen", value: true }), { ctrlKey: true });

  // Cmd/Ctrl+Z -> undo
  useKeyboardShortcut("z", handleUndo, { metaKey: true });
  useKeyboardShortcut("z", handleUndo, { ctrlKey: true });

  // Cmd/Ctrl+Shift+Z -> redo
  useKeyboardShortcut("z", handleRedo, { metaKey: true, shiftKey: true });
  useKeyboardShortcut("z", handleRedo, { ctrlKey: true, shiftKey: true });

  // Cmd+Shift+J -> JSON view
  useKeyboardShortcut("j", () => dispatch({ type: "setJsonOpen", value: true }), { metaKey: true, shiftKey: true });
  useKeyboardShortcut("j", () => dispatch({ type: "setJsonOpen", value: true }), { ctrlKey: true, shiftKey: true });

  return (
    <FormProvider {...methods}>
      {/*
        Antes: <main className="min-h-screen p-4 sm:p-6">
        Bug B1: el root layout ya tiene <main id="main-content">, no se puede
        anidar otro <main>. Migración: <div>, el landmark queda en el layout.
      */}
      <div className="min-h-screen p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl">
          <BuilderHeader
            existingForm={existingForm}
            autoSaveStatus={ui.autoSaveStatus}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onOpenJson={() => dispatch({ type: "setJsonOpen", value: true })}
            onOpenDrawer={openDrawer}
            onShare={handleShare}
            isFormNameValid={isFormNameValid}
            backHref="/forms"
          />

          <MobileTabBar
            mobileTab={ui.mobileTab}
            onTabChange={(v) => dispatch({ type: "setMobileTab", value: v })}
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div
              className={cn(
                "space-y-6",
                ui.mobileTab !== "fields" && "hidden lg:block"
              )}
            >
              <BuilderMainColumn
                formIdValue={formIdValue}
                tags={tags}
                fields={fields}
                onFieldsChange={handleFieldsChange}
                onTagsChange={(newTags) =>
                  setValue("tags", newTags, { shouldValidate: false })
                }
                hasErrors={Object.keys(formState.errors).length > 0}
              />
            </div>

            <BuilderSidebar
              sidebarTab={ui.sidebarTab}
              mobileTab={ui.mobileTab}
              onSidebarTabChange={(v) =>
                dispatch({ type: "setSidebarTab", value: v })
              }
              onOpenPreview={() =>
                dispatch({ type: "setPreviewOpen", value: true })
              }
              fields={fields}
            />
          </div>
        </form>

        {isDrawerOpen && (
          <aside
            className="fixed inset-y-0 left-0 right-[28rem] z-30 hidden xl:flex"
            aria-hidden="true"
          >
            <div className="flex h-full w-full items-center justify-center bg-black/20 p-8 backdrop-blur-md">
              <div className="w-full max-w-2xl animate-[scaleIn_250ms_ease-out]">
                <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-white/90">
                  <Eye size={16} aria-hidden="true" />
                  <span>Vista previa en vivo</span>
                </div>
                <LiveThemePreview />
              </div>
            </div>
          </aside>
        )}
      </div>

      <ThemeDrawer />

      <ThemePreviewModal
        isOpen={ui.isPreviewOpen}
        onClose={() => dispatch({ type: "setPreviewOpen", value: false })}
        formName={name}
        formDescription={description}
        fields={fields}
      />

      <JsonPreviewModal
        isOpen={ui.isJsonOpen}
        onClose={() => dispatch({ type: "setJsonOpen", value: false })}
        form={{ ...getValues(), theme }}
      />

      <TourOverlay />
    </FormProvider>
  );
}
