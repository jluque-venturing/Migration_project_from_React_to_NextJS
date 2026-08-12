import type { FormTheme } from "./schema";

/**
 * Helpers de sincronización entre el theme store y CSS custom properties
 * declaradas en `index.css` (`--form-primary`, `--form-accent`, etc.).
 *
 * Son las únicas funciones de este feature con side effects sobre el DOM
 * (escriben sobre `document.documentElement`). Se mantienen aquí, fuera de
 * `utils.ts`, para respetar la regla §4.3 de la skill (utils.ts debe
 * contener solo lógica pura). El side effect es DOM explícito y acotado
 * a CSS variables, no manipula la estructura del documento.
 *
 * Conviene llamarlas dentro de un `useEffect` con cleanup:
 *
 * ```ts
 * useEffect(() => {
 *   applyThemeToCssVars(theme);
 *   return () => clearThemeCssVars();
 * }, [theme]);
 * ```
 */

const FORM_CSS_VARS = [
  "--form-primary",
  "--form-accent",
  "--form-bg",
  "--form-text",
] as const;

function resolveRoot(
  root: HTMLElement | null
): HTMLElement | null {
  if (root) return root;
  if (typeof document === "undefined") return null;
  return document.documentElement;
}

export function applyThemeToCssVars(
  theme: FormTheme,
  root: HTMLElement | null = null
): void {
  const target = resolveRoot(root);
  if (!target) return;
  target.style.setProperty("--form-primary", theme.primaryColor);
  target.style.setProperty("--form-accent", theme.accentColor);
  target.style.setProperty("--form-bg", theme.backgroundColor);
  target.style.setProperty("--form-text", theme.textColor);
}

export function clearThemeCssVars(root: HTMLElement | null = null): void {
  const target = resolveRoot(root);
  if (!target) return;
  for (const cssVar of FORM_CSS_VARS) {
    target.style.removeProperty(cssVar);
  }
}
