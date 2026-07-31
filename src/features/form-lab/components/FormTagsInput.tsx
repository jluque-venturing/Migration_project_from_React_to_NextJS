"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { X, Tag } from "lucide-react";
import { cn } from "@/shared/lib/helpers";
import { tagColorClass, normalizeTag } from "../utils";

interface FormTagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export function FormTagsInput({
  tags,
  onChange,
  maxTags = 8,
  placeholder = "Agregar etiqueta y presionar Enter",
}: FormTagsInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw);
    if (!tag || tags.includes(tag) || tags.length >= maxTags) return;
    onChange([...tags, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <label
      aria-label="Etiquetas del formulario"
      className="flex min-h-[2.5rem] flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors cursor-text"
    >
      {tags.length === 0 && draft === "" && (
        <span className="flex items-center gap-1 text-sm text-text-muted select-none">
          <Tag size={14} />
        </span>
      )}
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            tagColorClass(tag)
          )}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="rounded hover:opacity-70 transition-opacity"
            aria-label={`Eliminar etiqueta ${tag}`}
          >
            <X size={10} />
          </button>
        </span>
      ))}
      {tags.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft.trim()) addTag(draft);
          }}
          className="min-w-[8rem] flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      )}
      {tags.length > 0 && (
        <span className="ml-auto text-xs text-text-muted opacity-60">
          {tags.length}/{maxTags}
        </span>
      )}
    </label>
  );
}
