export type ResolvedTheme = "light" | "dark";

export function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}
