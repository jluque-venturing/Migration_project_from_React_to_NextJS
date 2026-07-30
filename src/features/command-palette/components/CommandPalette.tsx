"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Search, CornerDownLeft, Home, Plus, FlaskConical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCommandPaletteStore } from "@/features/command-palette/store";
import { filterCommands, themeIconFor } from "@/features/command-palette/utils";
import type { Command } from "@/features/command-palette/schema";
import { useThemeStore } from "@/features/settings/store";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { cn } from "@/shared/lib/helpers";

export function CommandPalette() {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const close = useCommandPaletteStore((state) => state.close);
  const router = useRouter();
  const { mode, cycleToNext, label: themeLabel } = useTheme();
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: "go-home",
      label: "Ir a inicio",
      keywords: ["home", "mis formularios", "inicio"],
      icon: Home,
      action: () => router.push("/"),
    },
    {
      id: "create-form",
      label: "Crear nuevo formulario",
      keywords: ["nuevo", "builder", "crear", "formulario"],
      icon: Plus,
      action: () => router.push("/builder"),
    },
    {
      id: "go-builder",
      label: "Ir al constructor",
      keywords: ["builder", "editar", "constructor"],
      icon: FlaskConical,
      action: () => router.push("/builder"),
    },
    {
      id: "cycle-theme",
      label: `Cambiar tema (actual: ${themeLabel})`,
      keywords: ["tema", "dark", "light", "oscuro", "claro", "mode"],
      icon: themeIconFor[mode],
      action: cycleToNext,
    },
    {
      id: "toggle-theme",
      label: "Alternar tema claro/oscuro",
      keywords: ["toggle", "alternar", "theme", "tema"],
      icon: themeIconFor[mode],
      action: toggleMode,
    },
  ];

  const filtered = filterCommands(commands, query);

  const reset = () => {
    setQuery("");
    setSelectedIndex(0);
  };

  const handleClose = () => {
    close();
    reset();
  };

  const runCommand = (command: Command) => {
    command.action();
    handleClose();
  };

  // Open the native modal when the component mounts.
  // isOpen va en las deps porque el <dialog> recién existe cuando isOpen pasa a
  // true: con deps vacías showModal() nunca se llegaba a llamar y el diálogo
  // quedaba en display:none.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, [isOpen]);

  // Notify the store when the native dialog is closed (e.g. Escape).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleDialogClose = () => {
      close();
      reset();
    };
    dialog.addEventListener("close", handleDialogClose);
    return () => dialog.removeEventListener("close", handleDialogClose);
  }, [isOpen, close]);

  // Focus the search input when opening.
  useEffect(() => {
    const input = dialogRef.current?.querySelector("input");
    if (input) {
      queueMicrotask(() => input.focus());
    }
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Escape is handled natively by <dialog>.
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) runCommand(selected);
      return;
    }
  };

  if (!isOpen) return null;

  const noResults = filtered.length === 0;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Paleta de comandos"
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-start justify-center bg-transparent p-4 pt-[15vh]"
    >
      <button
        type="button"
        aria-label="Cerrar paleta de comandos"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un comando o buscá..."
            className="flex-1 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
            aria-label="Buscar comando"
          />
          <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-text-muted sm:inline">
            ESC
          </kbd>
        </div>

        {noResults ? (
          <p className="px-4 py-6 text-center text-sm text-text-muted">
            No se encontraron comandos para “{query}”.
          </p>
        ) : (
          <ul aria-label="Comandos disponibles" className="max-h-80 overflow-y-auto py-2">
            {filtered.map((command, index) => {
              const Icon = command.icon;
              const isActive = index === selectedIndex;
              return (
                <li
                  key={command.id}
                  className={cn(
                    isActive && "bg-surface text-text"
                  )}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => runCommand(command)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isActive ? "bg-surface text-text" : "text-text hover:bg-surface"
                    )}
                  >
                    {Icon ? (
                      <Icon size={16} className="shrink-0 text-text-muted" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    <span className="flex-1">{command.label}</span>
                    {isActive && (
                      <CornerDownLeft
                        size={14}
                        className="shrink-0 text-text-muted"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </dialog>
  );
}
