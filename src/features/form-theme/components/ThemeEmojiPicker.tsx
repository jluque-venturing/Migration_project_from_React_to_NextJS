"use client";

import { useState } from "react";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { EMOJI_CATEGORIES } from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import { ThemeTabs } from "./ThemeTabs";
import type { ThemeTab } from "./ThemeTabs";
import { X, Search } from "lucide-react";

export function ThemeEmojiPicker() {
  const { theme, updateField } = useFormTheme();
  const [activeCategoryId, setActiveCategoryId] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = EMOJI_CATEGORIES.find(
    (cat) => cat.id === activeCategoryId
  );

  const categoryTabs: ThemeTab[] = EMOJI_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label.replace(/^\S+\s/, ""),
    icon: cat.label.match(/^\S+/)?.[0] ?? "•",
  }));

  const filteredEmojis = searchQuery.trim().length > 0
    ? EMOJI_CATEGORIES.flatMap((cat) => [...cat.emojis])
    : (activeCategory?.emojis ?? []);

  const handleSelectEmoji = (emoji: string) => {
    updateField("emoji", emoji);
  };

  const handleClearEmoji = () => {
    updateField("emoji", "");
  };

  return (
    <div className="space-y-4">
      {/* Selected emoji preview */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl">
          {theme.emoji || "—"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">
            {theme.emoji ? "Emoji seleccionado" : "Sin emoji"}
          </p>
          <p className="text-xs text-text-muted">
            {theme.emoji ? "Se muestra junto al título" : "Seleccioná uno abajo"}
          </p>
        </div>
        {theme.emoji && (
          <button
            type="button"
            onClick={handleClearEmoji}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
            aria-label="Quitar emoji"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Free text input */}
      <div>
        <label
          htmlFor="theme-emoji-input"
          className="block text-xs font-medium text-text-muted mb-1"
        >
          Emoji libre
        </label>
        <input
          id="theme-emoji-input"
          type="text"
          value={theme.emoji}
          onChange={(e) => updateField("emoji", e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Pegá cualquier emoji"
          maxLength={4}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface pl-8 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Buscar entre todos los emojis..."
          aria-label="Buscar emojis"
        />
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <ThemeTabs
          tabs={categoryTabs}
          activeTab={activeCategoryId}
          onChange={setActiveCategoryId}
          ariaLabel="Categorías de emojis"
        />
      )}

      {/* Emoji grid */}
      <div
        role="radiogroup"
        aria-label="Emojis disponibles"
        className="grid grid-cols-8 gap-1.5"
      >
        {filteredEmojis.map((emoji, index) => {
          const isSelected = theme.emoji === emoji;
          return (
            <button
              key={`${emoji}-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelectEmoji(emoji)}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg border text-lg transition-all duration-150",
                isSelected
                  ? "border-primary bg-primary/10 scale-110 shadow-sm"
                  : "border-border bg-surface hover:border-primary/50 hover:scale-105"
              )}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
