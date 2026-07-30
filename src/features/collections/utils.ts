import type { SortKey } from "@/shared/lib/sort";
import type { CollectionColor } from "./types";

export const COLOR_LABELS: Record<CollectionColor, string> = {
  blue: "Azul",
  violet: "Violeta",
  emerald: "Esmeralda",
  amber: "Ámbar",
  pink: "Rosa",
  slate: "Gris",
};

export function getColorBgClass(color: CollectionColor): string {
  const map: Record<CollectionColor, string> = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    pink: "bg-pink-500",
    slate: "bg-slate-500",
  };
  return map[color] || map.slate;
}

export interface ColorClassMap {
  text: string;
  bg: string;
  border: string;
  hoverBg: string;
  checkboxBg: string;
}

export function getCollectionColorClasses(color: CollectionColor): ColorClassMap {
  const maps: Record<CollectionColor, ColorClassMap> = {
    blue: {
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-900/50",
      hoverBg: "hover:bg-blue-100/50 dark:hover:bg-blue-950/40",
      checkboxBg: "checked:bg-blue-600 checked:border-blue-600",
    },
    violet: {
      text: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/20",
      border: "border-violet-200 dark:border-violet-900/50",
      hoverBg: "hover:bg-violet-100/50 dark:hover:bg-violet-950/40",
      checkboxBg: "checked:bg-violet-600 checked:border-violet-600",
    },
    emerald: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-900/50",
      hoverBg: "hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40",
      checkboxBg: "checked:bg-emerald-600 checked:border-emerald-600",
    },
    amber: {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-900/50",
      hoverBg: "hover:bg-amber-100/50 dark:hover:bg-amber-950/40",
      checkboxBg: "checked:bg-amber-600 checked:border-amber-600",
    },
    pink: {
      text: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-950/20",
      border: "border-pink-200 dark:border-pink-900/50",
      hoverBg: "hover:bg-pink-100/50 dark:hover:bg-pink-950/40",
      checkboxBg: "checked:bg-pink-600 checked:border-pink-600",
    },
    slate: {
      text: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-950/20",
      border: "border-slate-200 dark:border-slate-900/50",
      hoverBg: "hover:bg-slate-100/50 dark:hover:bg-slate-950/40",
      checkboxBg: "checked:bg-slate-600 checked:border-slate-600",
    },
  };

  return maps[color] || maps.slate;
}

interface CollectionLike {
  id: string;
  formIds: string[];
}

interface SortableForm {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  fields: unknown[];
}

/**
 * Filtra y ordena formularios aplicando búsqueda, etiqueta y colección.
 */
export function filterAndSortForms<T extends SortableForm>(
  forms: T[],
  {
    searchQuery,
    activeTag,
    activeCollectionId,
    collections,
    sortBy,
  }: {
    searchQuery: string;
    activeTag: string | null;
    activeCollectionId: string | null;
    collections: CollectionLike[];
    sortBy: SortKey;
  }
): T[] {
  const query = searchQuery.toLowerCase();
  const filtered = forms.filter((form) => {
    const matchesSearch = form.name.toLowerCase().includes(query);
    const matchesTag = activeTag === null || form.tags.includes(activeTag);
    const matchesCollection =
      activeCollectionId === null ||
      (collections.find((c) => c.id === activeCollectionId)?.formIds ?? []).includes(form.id);

    return matchesSearch && matchesTag && matchesCollection;
  });

  return filtered.toSorted((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "fields":
        return b.fields.length - a.fields.length;
      default:
        return 0;
    }
  });
}
