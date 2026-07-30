import { describe, it, expect } from "vitest";
import { applyThemeToCssVars, clearThemeCssVars } from "./dom-helpers";
import { DEFAULT_THEME } from "./utils";

function makeFakeRoot() {
  const values = new Map<string, string>();
  return {
    style: {
      values,
      setProperty(name: string, value: string) {
        values.set(name, value);
      },
      removeProperty(name: string) {
        values.delete(name);
      },
    },
  } as unknown as HTMLElement;
}

describe("applyThemeToCssVars and clearThemeCssVars (dom-helpers)", () => {
  it("applies all four CSS variables to the provided root", () => {
    const root = makeFakeRoot();
    applyThemeToCssVars(DEFAULT_THEME, root);
    const style = root.style as unknown as { values: Map<string, string> };
    expect(style.values.get("--form-primary")).toBe(DEFAULT_THEME.primaryColor);
    expect(style.values.get("--form-accent")).toBe(DEFAULT_THEME.accentColor);
    expect(style.values.get("--form-bg")).toBe(DEFAULT_THEME.backgroundColor);
    expect(style.values.get("--form-text")).toBe(DEFAULT_THEME.textColor);
  });

  it("clears the four CSS variables from the provided root", () => {
    const root = makeFakeRoot();
    applyThemeToCssVars(DEFAULT_THEME, root);
    clearThemeCssVars(root);
    const style = root.style as unknown as { values: Map<string, string> };
    expect(style.values.has("--form-primary")).toBe(false);
    expect(style.values.has("--form-accent")).toBe(false);
    expect(style.values.has("--form-bg")).toBe(false);
    expect(style.values.has("--form-text")).toBe(false);
  });

  it("is a no-op when root is null and document is unavailable", () => {
    const previousDocument = (globalThis as { document?: unknown }).document;
    delete (globalThis as { document?: unknown }).document;
    try {
      expect(() => applyThemeToCssVars(DEFAULT_THEME)).not.toThrow();
      expect(() => clearThemeCssVars()).not.toThrow();
    } finally {
      (globalThis as { document?: unknown }).document = previousDocument;
    }
  });
});
