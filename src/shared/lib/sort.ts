export type SortKey = "newest" | "oldest" | "name" | "fields";

export function sortLabel(key: SortKey): string {
  const map: Record<SortKey, string> = {
    newest: "Más recientes",
    oldest: "Más antiguos",
    name: "Nombre A–Z",
    fields: "Más campos",
  };
  return map[key];
}
