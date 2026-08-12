import { describe, it, expect } from "vitest";
import type { FormTheme } from "./schema";
import {
  DEFAULT_THEME,
  EMOJI_OPTIONS,
  FONT_OPTIONS,
  PATTERN_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  SUBMIT_ANIMATION_OPTIONS,
  FIELD_ENTRANCE_ANIMATION_OPTIONS,
  CARD_STYLE_OPTIONS,
  LOGO_POSITION_OPTIONS,
  TITLE_ALIGNMENT_OPTIONS,
  fontFamilyClass,
  headingFontFamilyClass,
  getDefaultTheme,
  isValidHexColor,
  mergeTheme,
  normalizeHexColor,
  patternToClass,
  radiusToClass,
  spacingClass,
  submitAnimationClass,
  fieldEntranceAnimationClass,
  cardStyleClass,
  isValidBase64Image,
  getFormBorderRadius,
  getInputBorderRadius,
  getButtonBorderRadius,
  getLogoBorderRadius,
  borderWidthStyle,
  borderWidthToNumber,
  hasBorder,
  formBorderDataAttrs,
} from "./utils";

describe("getDefaultTheme", () => {
  it("returns a fresh copy of the default theme", () => {
    const a = getDefaultTheme();
    const b = getDefaultTheme();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  it("matches DEFAULT_THEME shape", () => {
    expect(getDefaultTheme()).toEqual(DEFAULT_THEME);
  });
});

describe("isValidHexColor", () => {
  it("accepts 6-digit hex with hash", () => {
    expect(isValidHexColor("#3b82f6")).toBe(true);
    expect(isValidHexColor("#FFFFFF")).toBe(true);
    expect(isValidHexColor("#000000")).toBe(true);
  });

  it("accepts 3-digit hex with hash", () => {
    expect(isValidHexColor("#fff")).toBe(true);
    expect(isValidHexColor("#000")).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isValidHexColor("3b82f6")).toBe(false);
    expect(isValidHexColor("#ggg")).toBe(false);
    expect(isValidHexColor("#1234")).toBe(false);
    expect(isValidHexColor("")).toBe(false);
    expect(isValidHexColor("rgb(0,0,0)")).toBe(false);
  });
});

describe("normalizeHexColor", () => {
  it("expands 3-digit hex to 6-digit", () => {
    expect(normalizeHexColor("#f00")).toBe("#ff0000");
    expect(normalizeHexColor("#abc")).toBe("#aabbcc");
  });

  it("lowercases 6-digit hex", () => {
    expect(normalizeHexColor("#AABBCC")).toBe("#aabbcc");
  });

  it("returns default primary color for invalid input", () => {
    expect(normalizeHexColor("not-a-color")).toBe(DEFAULT_THEME.primaryColor);
    expect(normalizeHexColor("")).toBe(DEFAULT_THEME.primaryColor);
  });
});

describe("mergeTheme", () => {
  it("merges partial override on top of base", () => {
    const merged = mergeTheme(DEFAULT_THEME, {
      primaryColor: "#ff0000",
      emoji: "🔥",
    });
    expect(merged.primaryColor).toBe("#ff0000");
    expect(merged.emoji).toBe("🔥");
    expect(merged.backgroundColor).toBe(DEFAULT_THEME.backgroundColor);
  });

  it("does not mutate the base theme", () => {
    const base = { ...DEFAULT_THEME };
    mergeTheme(base, { primaryColor: "#000000" });
    expect(base.primaryColor).toBe(DEFAULT_THEME.primaryColor);
  });
});

describe("radiusToClass", () => {
  it("maps every radius to a Tailwind class", () => {
    for (const option of RADIUS_OPTIONS) {
      expect(radiusToClass(option.value)).toMatch(/^rounded-/);
    }
  });
});

describe("fontFamilyClass and headingFontFamilyClass", () => {
  it("maps every font to a Tailwind class", () => {
    for (const option of FONT_OPTIONS) {
      expect(fontFamilyClass(option.value)).toMatch(/^font-/);
      expect(headingFontFamilyClass(option.value)).toMatch(/^font-/);
    }
  });
});

describe("spacingClass", () => {
  it("maps every spacing to a Tailwind space-y class", () => {
    for (const option of SPACING_OPTIONS) {
      expect(spacingClass(option.value)).toMatch(/^space-y-/);
    }
  });
});

describe("patternToClass", () => {
  it("returns empty string for 'none'", () => {
    expect(patternToClass("none")).toBe("");
  });

  it("returns form-pattern class for non-none patterns", () => {
    for (const option of PATTERN_OPTIONS) {
      if (option.value === "none") continue;
      expect(patternToClass(option.value)).toMatch(/^form-pattern-/);
    }
  });
});

describe("submitAnimationClass", () => {
  it("maps every submit animation to a CSS class", () => {
    for (const option of SUBMIT_ANIMATION_OPTIONS) {
      const cls = submitAnimationClass(option.value);
      expect(typeof cls).toBe("string");
      if (option.value !== "none") {
        expect(cls).toMatch(/^form-submit-/);
      }
    }
  });
});

describe("fieldEntranceAnimationClass", () => {
  it("maps every field animation to a CSS class", () => {
    for (const option of FIELD_ENTRANCE_ANIMATION_OPTIONS) {
      const cls = fieldEntranceAnimationClass(option.value);
      expect(typeof cls).toBe("string");
      if (option.value !== "none") {
        expect(cls).toMatch(/^form-field-/);
      }
    }
  });
});

describe("cardStyleClass", () => {
  it("maps every card style to a CSS class", () => {
    for (const option of CARD_STYLE_OPTIONS) {
      expect(typeof cardStyleClass(option.value)).toBe("string");
    }
  });
});

describe("isValidBase64Image", () => {
  it("accepts data:image URLs", () => {
    expect(isValidBase64Image("data:image/png;base64,abc")).toBe(true);
    expect(isValidBase64Image("data:image/jpeg;base64,xyz")).toBe(true);
  });

  it("rejects non-image data URLs and plain strings", () => {
    expect(isValidBase64Image("data:application/pdf;base64,abc")).toBe(false);
    expect(isValidBase64Image("https://example.com/image.png")).toBe(false);
    expect(isValidBase64Image("")).toBe(false);
  });
});

describe("option arrays", () => {
  it("RADIUS_OPTIONS covers all radius values", () => {
    expect(RADIUS_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["full", "lg", "md", "none", "sm", "xl"].sort()
    );
  });

  it("FONT_OPTIONS covers all font values", () => {
    expect(FONT_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["display", "mono", "rounded", "sans", "serif"].sort()
    );
  });

  it("SPACING_OPTIONS covers all spacing values", () => {
    expect(SPACING_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["compact", "normal", "relaxed"].sort()
    );
  });

  it("PATTERN_OPTIONS covers all pattern values", () => {
    expect(PATTERN_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["carbon", "checkered", "dots", "grid", "none", "stars", "waves"].sort()
    );
  });

  it("LOGO_POSITION_OPTIONS covers all logo positions", () => {
    expect(LOGO_POSITION_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["center", "left", "right"].sort()
    );
  });

  it("TITLE_ALIGNMENT_OPTIONS covers all title alignments", () => {
    expect(TITLE_ALIGNMENT_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["center", "left", "right"].sort()
    );
  });

  it("SUBMIT_ANIMATION_OPTIONS covers all submit animations", () => {
    expect(SUBMIT_ANIMATION_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["bounce", "confetti", "none", "pulse", "race", "rocket", "shake", "zoom"].sort()
    );
  });

  it("FIELD_ENTRANCE_ANIMATION_OPTIONS covers all field animations", () => {
    expect(FIELD_ENTRANCE_ANIMATION_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["fade-up", "flip-in", "none", "race-in", "scale-in", "slide-left"].sort()
    );
  });

  it("CARD_STYLE_OPTIONS covers all card styles", () => {
    expect(CARD_STYLE_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["elevated", "flat", "glass", "outline"].sort()
    );
  });

  it("EMOJI_OPTIONS has at least 8 options and only non-empty strings", () => {
    expect(EMOJI_OPTIONS.length).toBeGreaterThanOrEqual(8);
    for (const emoji of EMOJI_OPTIONS) {
      expect(typeof emoji).toBe("string");
      expect(emoji.length).toBeGreaterThan(0);
    }
  });
});

describe("resolved border radius utilities", () => {
  it("resolves specific border radii if defined", () => {
    const customTheme = {
      ...DEFAULT_THEME,
      borderRadius: "md" as const,
      borderRadiusForm: "lg" as const,
      borderRadiusInput: "sm" as const,
      borderRadiusButton: "none" as const,
      borderRadiusLogo: "full" as const,
    };
    expect(getFormBorderRadius(customTheme)).toBe("lg");
    expect(getInputBorderRadius(customTheme)).toBe("sm");
    expect(getButtonBorderRadius(customTheme)).toBe("none");
    expect(getLogoBorderRadius(customTheme)).toBe("full");
  });

  it("falls back to general borderRadius if specific is not defined (except logo which defaults to none)", () => {
    const legacyTheme = {
      ...DEFAULT_THEME,
      borderRadius: "xl" as const,
      borderRadiusForm: undefined,
      borderRadiusInput: undefined,
      borderRadiusButton: undefined,
      borderRadiusLogo: undefined,
    };
    expect(getFormBorderRadius(legacyTheme)).toBe("xl");
    expect(getInputBorderRadius(legacyTheme)).toBe("xl");
    expect(getButtonBorderRadius(legacyTheme)).toBe("xl");
    expect(getLogoBorderRadius(legacyTheme)).toBe("none");
  });

  it("defaults to md (or none for logo) if both specific and general are undefined", () => {
    const minimalTheme: FormTheme = {
      ...DEFAULT_THEME,
      borderRadius: undefined as unknown as FormTheme["borderRadius"],
      borderRadiusForm: undefined,
      borderRadiusInput: undefined,
      borderRadiusButton: undefined,
      borderRadiusLogo: undefined,
    };
    expect(getFormBorderRadius(minimalTheme)).toBe("md");
    expect(getInputBorderRadius(minimalTheme)).toBe("md");
    expect(getButtonBorderRadius(minimalTheme)).toBe("md");
    expect(getLogoBorderRadius(minimalTheme)).toBe("none");
  });
});

describe("border width utilities", () => {
  describe("borderWidthStyle", () => {
    it("handles legacy string values correctly", () => {
      expect(borderWidthStyle("none")).toBe("0px");
      expect(borderWidthStyle("thin")).toBe("1px");
      expect(borderWidthStyle("medium")).toBe("2px");
      expect(borderWidthStyle("thick")).toBe("3px");
    });

    it("handles numeric pixel values correctly", () => {
      expect(borderWidthStyle(0)).toBe("0px");
      expect(borderWidthStyle(1)).toBe("1px");
      expect(borderWidthStyle(4)).toBe("4px");
      expect(borderWidthStyle(6)).toBe("6px");
    });
  });

  describe("borderWidthToNumber", () => {
    it("converts legacy string values to equivalent numbers", () => {
      expect(borderWidthToNumber("none")).toBe(0);
      expect(borderWidthToNumber("thin")).toBe(1);
      expect(borderWidthToNumber("medium")).toBe(2);
      expect(borderWidthToNumber("thick")).toBe(3);
    });

    it("returns numeric values as-is", () => {
      expect(borderWidthToNumber(0)).toBe(0);
      expect(borderWidthToNumber(3)).toBe(3);
      expect(borderWidthToNumber(5)).toBe(5);
    });

    it("returns 0 for undefined/null/unknown values", () => {
      expect(borderWidthToNumber(undefined)).toBe(0);
      expect(
        borderWidthToNumber("invalid" as unknown as FormTheme["borderWidth"])
      ).toBe(0);
    });
  });

  describe("hasBorder", () => {
    it("returns false for none or 0", () => {
      expect(hasBorder("none")).toBe(false);
      expect(hasBorder(0)).toBe(false);
      expect(hasBorder(undefined)).toBe(false);
    });

    it("returns true for valid border widths", () => {
      expect(hasBorder("thin")).toBe(true);
      expect(hasBorder("thick")).toBe(true);
      expect(hasBorder(1)).toBe(true);
      expect(hasBorder(5)).toBe(true);
    });
  });
});

describe("formBorderDataAttrs", () => {
  it("maps a numeric border width to a data-border-w value", () => {
    const theme = { ...DEFAULT_THEME, borderWidth: 4 as const, borderColor: "#abcdef" };
    const attrs = formBorderDataAttrs(theme);
    expect(attrs["data-border-w"]).toBe("4");
    expect(attrs["data-has-border"]).toBe("true");
    expect(attrs.style["--form-border-color"]).toBe("#abcdef");
  });

  it("reports has-border false when width is 0 / none / undefined", () => {
    const theme = { ...DEFAULT_THEME, borderWidth: 0 as const };
    const attrs = formBorderDataAttrs(theme);
    expect(attrs["data-border-w"]).toBe("0");
    expect(attrs["data-has-border"]).toBe("false");
  });

  it("falls back to default color when borderColor is empty", () => {
    const theme = { ...DEFAULT_THEME, borderWidth: 2 as const, borderColor: "" };
    const attrs = formBorderDataAttrs(theme);
    expect(attrs.style["--form-border-color"]).toBe("#e2e8f0");
  });
});
