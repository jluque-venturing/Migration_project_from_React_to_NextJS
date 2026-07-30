"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Palette,
  Pipette,
  Smile,
  Square,
  Layers,
  Check,
  ImageIcon,
  Sparkles,
  Save,
  Eye,
} from "lucide-react";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { ThemePresetGrid } from "./ThemePresetGrid";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { ThemeEmojiPicker } from "./ThemeEmojiPicker";
import { ThemeStylePicker, RadioGroup } from "./ThemeStylePicker";
import { ThemePatternPicker } from "./ThemePatternPicker";
import { ThemeImageUploader } from "./ThemeImageUploader";
import { ThemeAnimationPicker } from "./ThemeAnimationPicker";
import { ThemeTabs } from "./ThemeTabs";
import { LiveThemePreview } from "./LiveThemePreview";
import type { ThemeTab } from "./ThemeTabs";
import { RADIUS_OPTIONS, getLogoBorderRadius } from "@/features/form-theme/utils";
import type { BorderRadius } from "@/features/form-theme/schema";

import { cn, cssVars } from "@/shared/lib/helpers";

type TabId = "presets" | "colors" | "emoji" | "style" | "pattern" | "images" | "animations";

const TABS: ReadonlyArray<ThemeTab> = [
  { id: "presets", label: "Plantillas", icon: Palette },
  { id: "colors", label: "Colores", icon: Pipette },
  { id: "emoji", label: "Emoji", icon: Smile },
  { id: "style", label: "Estilo", icon: Square },
  { id: "pattern", label: "Fondo", icon: Layers },
  { id: "images", label: "Imágenes", icon: ImageIcon },
  { id: "animations", label: "Animar", icon: Sparkles },
];

function focusPresetInput(node: HTMLInputElement | null) {
  if (node) node.focus();
}

export function ThemeDrawer() {
  const { isDrawerOpen, closeDrawer, theme, setImage, saveAsPreset, updateField } = useFormTheme();
  const [activeTab, setActiveTab] = useState<TabId>("presets");
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open the native modal when the component mounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, []);

  // Notify the hook when the native dialog is closed.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => closeDrawer();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [closeDrawer]);

  // If the user is naming a preset, let Escape cancel that instead of closing the drawer.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      if (isSaving) {
        event.preventDefault();
        setIsSaving(false);
      }
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [isSaving]);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    saveAsPreset(presetName.trim());
    setPresetName("");
    setIsSaving(false);
  };

  if (!isDrawerOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Personalizar el diseño del formulario"
      className="fixed inset-0 z-40 m-0 flex h-screen max-h-none w-screen max-w-none justify-end bg-transparent p-0"
    >
      {/* Subtle backdrop so the builder preview stays visible */}
      <button
        type="button"
        aria-label="Cerrar panel de diseño"
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/5 transition-opacity"
      />

      <aside
        className={cn(
          "relative flex h-full w-full max-w-md flex-col border-l border-border/60 bg-gradient-to-br from-background via-surface to-background shadow-2xl",
          "animate-[slideInRight_220ms_ease-out]"
        )}
      >
        {/* Decorative top gradient bar */}
        <div
          className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[var(--drawer-accent-start)] to-[var(--drawer-accent-end)]"
          style={cssVars({
            "--drawer-accent-start": theme.primaryColor,
            "--drawer-accent-end": theme.accentColor,
          })}
        />

        <header className="flex items-center justify-between border-b border-border/60 bg-surface/40 px-5 py-4 backdrop-blur-sm">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
              <Palette size={18} className="text-primary" aria-hidden="true" />
              Personalizar diseño
            </h2>
            <p className="flex items-center gap-1 text-xs text-text-muted">
              <Eye size={12} aria-hidden="true" />
              Cambios en tiempo real
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-xl p-2 text-text-muted transition-colors hover:bg-surface hover:text-text focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </header>

        {/* Mini live preview — always visible inside the drawer */}
        <div className="shrink-0 border-b border-border/60 bg-surface/30 px-5 py-4 lg:hidden">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-text-muted">
            <Eye size={12} />
            Vista previa
          </div>
          <div className="scale-[0.92] origin-top-left">
            <LiveThemePreview />
          </div>
        </div>

        <div className="shrink-0 border-b border-border/60 bg-surface/40 px-4 py-3">
          <ThemeTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
            ariaLabel="Secciones de diseño"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              className="animate-[fadeIn_200ms_ease-out] space-y-4"
            >
              {tab.id === "presets" && (
                <>
                  <p className="text-sm text-text-muted">
                    Empezá con un preset temático y personalizalo después.
                  </p>
                  <ThemePresetGrid />
                </>
              )}
              {tab.id === "colors" && <ThemeColorPicker />}
              {tab.id === "emoji" && <ThemeEmojiPicker />}
              {tab.id === "style" && <ThemeStylePicker />}
              {tab.id === "pattern" && (
                <>
                  <p className="text-sm text-text-muted">
                    Elegí un patrón de fondo para la vista previa.
                  </p>
                  <ThemePatternPicker />
                </>
              )}
              {tab.id === "images" && (
                <div className="space-y-5">
                  <ThemeImageUploader
                    label="Imagen de fondo"
                    imageUrl={theme.backgroundImage}
                    onChange={(dataUrl) => setImage("backgroundImage", dataUrl)}
                    aspectRatio="wide"
                  />
                  <div>
                    <label htmlFor="bg-opacity-range" className="block text-xs font-medium text-text-muted mb-1">
                      Opacidad del fondo — {theme.backgroundOpacity ?? 100}%
                    </label>
                    <input
                      id="bg-opacity-range"
                      type="range"
                      min={20}
                      max={100}
                      step={5}
                      value={theme.backgroundOpacity ?? 100}
                      onChange={(e) => updateField("backgroundOpacity", Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <ThemeImageUploader
                    label="Logo del formulario"
                    imageUrl={theme.logoImage}
                    onChange={(dataUrl) => setImage("logoImage", dataUrl)}
                    aspectRatio="wide"
                  />
                  {theme.logoImage && (
                    <RadioGroup<BorderRadius>
                      legend="Radio de borde del logo / icono"
                      options={RADIUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                      value={getLogoBorderRadius(theme)}
                      onChange={(value) => updateField("borderRadiusLogo", value)}
                    />
                  )}
                  {theme.backgroundImage && (
                    <p className="text-xs text-text-muted">
                      Ajustá el overlay en la pestaña Colores para mejorar la legibilidad.
                    </p>
                  )}
                </div>
              )}
              {tab.id === "animations" && <ThemeAnimationPicker />}
            </div>
          ))}
        </div>

        <footer className="flex flex-col gap-3 border-t border-border/60 bg-surface/40 px-5 py-3">
          {isSaving ? (
            <div className="flex items-center gap-2 animate-[fadeIn_150ms_ease-out]">
              <input
                ref={isSaving ? focusPresetInput : undefined}
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Nombre de la plantilla..."
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Nombre de la plantilla"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSavePreset();
                  if (e.key === "Escape") setIsSaving(false);
                }}
              />
              <button
                type="button"
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="rounded-xl px-2 py-2 text-sm text-text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Check size={14} className="text-success" aria-hidden="true" />
                  Auto-guardado
                </p>
                <button
                  type="button"
                  onClick={() => setIsSaving(true)}
                  className="flex items-center gap-1 rounded-xl border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Save size={12} />
                  Guardar plantilla
                </button>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Listo
              </button>
            </div>
          )}
        </footer>
      </aside>
    </dialog>
  );
}
