import type React from "react";
import type {
  FormTheme,
  BorderRadius,
  FontFamily,
  Spacing,
  Pattern,
  LogoPosition,
  TitleAlignment,
  SubmitAnimation,
  FieldEntranceAnimation,
  CardStyle,
  FormShadow,
  BorderWidth,
  EmojiCategory,
} from "./schema";

export const DEFAULT_THEME: FormTheme = {
  presetId: "default",
  primaryColor: "#3b82f6",
  accentColor: "#8b5cf6",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  emoji: "🧪",
  borderRadius: "md",
  borderRadiusForm: "md",
  borderRadiusInput: "md",
  borderRadiusButton: "md",
  borderRadiusLogo: "none",
  fontFamily: "sans",
  headingFontFamily: "sans",
  spacing: "normal",
  pattern: "none",
  logoPosition: "left",
  titleAlignment: "left",
  submitAnimation: "none",
  fieldEntranceAnimation: "none",
  submitLabel: "Enviar",
  cardStyle: "flat",
  showProgressBar: false,
  shadow: "md",
  borderWidth: "thin",
  borderColor: "#e2e8f0",
  backgroundOpacity: 100,
  backgroundImage: undefined,
  backgroundOverlay: undefined,
  logoImage: undefined,
  backgroundGradient: undefined,
  showEmoji: undefined,
};

export function getDefaultTheme(): FormTheme {
  return { ...DEFAULT_THEME };
}

export function hasEmoji(theme: FormTheme): boolean {
  return theme.emoji.trim().length > 0;
}

export function mergeTheme(
  base: FormTheme,
  override: Partial<FormTheme>
): FormTheme {
  return { ...base, ...override };
}

export function radiusToClass(radius: BorderRadius): string {
  const map: Record<BorderRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
  return map[radius];
}

export function getFormBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusForm ?? theme.borderRadius ?? "md";
}

export function getInputBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusInput ?? theme.borderRadius ?? "md";
}

export function getButtonBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusButton ?? theme.borderRadius ?? "md";
}

export function getLogoBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusLogo ?? "none";
}

export function fontFamilyClass(font: FontFamily): string {
  const map: Record<FontFamily, string> = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    display: "font-display",
    rounded: "font-rounded",
  };
  return map[font];
}

export function headingFontFamilyClass(font: FontFamily): string {
  return fontFamilyClass(font);
}

export function spacingClass(spacing: Spacing): string {
  const map: Record<Spacing, string> = {
    compact: "space-y-3",
    normal: "space-y-6",
    relaxed: "space-y-10",
  };
  return map[spacing];
}

export function patternToClass(pattern: Pattern): string {
  const map: Record<Pattern, string> = {
    none: "",
    dots: "form-pattern-dots",
    grid: "form-pattern-grid",
    waves: "form-pattern-waves",
    checkered: "form-pattern-checkered",
    stars: "form-pattern-stars",
    carbon: "form-pattern-carbon",
  };
  return map[pattern];
}

export function titleAlignmentClass(alignment: TitleAlignment): string {
  const map: Record<TitleAlignment, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  return map[alignment];
}

export function submitAnimationClass(animation: SubmitAnimation): string {
  const map: Record<SubmitAnimation, string> = {
    none: "",
    pulse: "form-submit-pulse",
    shake: "form-submit-shake",
    zoom: "form-submit-zoom",
    race: "form-submit-race",
    bounce: "form-submit-bounce",
    confetti: "form-submit-confetti",
    rocket: "form-submit-rocket",
  };
  return map[animation];
}

export function fieldEntranceAnimationClass(
  animation: FieldEntranceAnimation
): string {
  const map: Record<FieldEntranceAnimation, string> = {
    none: "",
    "fade-up": "form-field-fade-up",
    "slide-left": "form-field-slide-left",
    "scale-in": "form-field-scale-in",
    "race-in": "form-field-race-in",
    "flip-in": "form-field-flip-in",
  };
  return map[animation];
}

export function cardStyleClass(style: CardStyle): string {
  const map: Record<CardStyle, string> = {
    flat: "bg-white/80 border border-black/10",
    elevated: "bg-white/80 shadow-2xl border border-transparent",
    glass: "bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl",
    outline: "bg-white/50 border-2 border-[color:var(--form-text,#1c1917)]",
  };
  return map[style];
}

export function shadowClass(shadow: FormShadow): string {
  const map: Record<FormShadow, string> = {
    none: "form-shadow-none",
    sm: "form-shadow-sm",
    md: "form-shadow-md",
    lg: "form-shadow-lg",
    xl: "form-shadow-xl",
    "2xl": "form-shadow-2xl",
  };
  return map[shadow];
}

export function borderWidthStyle(width: BorderWidth): string {
  if (typeof width === "number") {
    return `${width}px`;
  }
  const map: Record<Exclude<BorderWidth, number>, string> = {
    none: "0px",
    thin: "1px",
    medium: "2px",
    thick: "3px",
  };
  return map[width] || "0px";
}

export function borderWidthToNumber(width?: BorderWidth): number {
  if (typeof width === "number") return width;
  if (!width || width === "none") return 0;
  const map: Record<string, number> = {
    thin: 1,
    medium: 2,
    thick: 3,
  };
  return map[width] || 0;
}

export function hasBorder(width?: BorderWidth): boolean {
  if (!width || width === "none" || width === 0) return false;
  return true;
}

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function normalizeHexColor(value: string): string {
  if (!isValidHexColor(value)) return DEFAULT_THEME.primaryColor;
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return value.toLowerCase();
}

/**
 * Atributos `data-*` para delegar el borde dinámico a CSS
 * (clase `.form-border-dynamic` en `index.css`).
 * Sustituye al `style={{ borderWidth/Color/Style }}` inline.
 */
export function formBorderDataAttrs(theme: FormTheme): {
  "data-border-w": string;
  "data-has-border": "true" | "false";
  style: React.CSSProperties & Record<`--${string}`, string>;
} {
  return {
    "data-border-w": String(borderWidthToNumber(theme.borderWidth)),
    "data-has-border": hasBorder(theme.borderWidth) ? "true" : "false",
    style: { "--form-border-color": theme.borderColor || "#e2e8f0" },
  };
}

/* ─── Option arrays ─── */

export const RADIUS_OPTIONS: ReadonlyArray<{
  value: BorderRadius;
  label: string;
  preview: string;
}> = [
  { value: "none", label: "Sin bordes", preview: "rounded-none" },
  { value: "sm", label: "Suave", preview: "rounded-sm" },
  { value: "md", label: "Medio", preview: "rounded-md" },
  { value: "lg", label: "Redondeado", preview: "rounded-lg" },
  { value: "xl", label: "Muy redondeado", preview: "rounded-xl" },
  { value: "full", label: "Píldora", preview: "rounded-full" },
];

export const FONT_OPTIONS: ReadonlyArray<{
  value: FontFamily;
  label: string;
}> = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
  { value: "display", label: "Display" },
  { value: "rounded", label: "Rounded" },
];

export const SPACING_OPTIONS: ReadonlyArray<{
  value: Spacing;
  label: string;
}> = [
  { value: "compact", label: "Compacto" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Holgado" },
];

export const PATTERN_OPTIONS: ReadonlyArray<{
  value: Pattern;
  label: string;
}> = [
  { value: "none", label: "Sin patrón" },
  { value: "dots", label: "Puntos" },
  { value: "grid", label: "Cuadrícula" },
  { value: "waves", label: "Ondas" },
  { value: "checkered", label: "A cuadros" },
  { value: "stars", label: "Estrellas" },
  { value: "carbon", label: "Carbono" },
];

export const LOGO_POSITION_OPTIONS: ReadonlyArray<{
  value: LogoPosition;
  label: string;
}> = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

export const TITLE_ALIGNMENT_OPTIONS: ReadonlyArray<{
  value: TitleAlignment;
  label: string;
}> = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

export const SUBMIT_ANIMATION_OPTIONS: ReadonlyArray<{
  value: SubmitAnimation;
  label: string;
}> = [
  { value: "none", label: "Ninguna" },
  { value: "pulse", label: "Pulso" },
  { value: "shake", label: "Sacudida" },
  { value: "zoom", label: "Zoom" },
  { value: "bounce", label: "Rebote" },
  { value: "race", label: "Carrera" },
  { value: "confetti", label: "Confeti" },
  { value: "rocket", label: "Cohete" },
];

export const FIELD_ENTRANCE_ANIMATION_OPTIONS: ReadonlyArray<{
  value: FieldEntranceAnimation;
  label: string;
}> = [
  { value: "none", label: "Ninguna" },
  { value: "fade-up", label: "Aparecer arriba" },
  { value: "slide-left", label: "Deslizar izquierda" },
  { value: "scale-in", label: "Escalar" },
  { value: "race-in", label: "Carrera" },
  { value: "flip-in", label: "Voltear" },
];

export const CARD_STYLE_OPTIONS: ReadonlyArray<{
  value: CardStyle;
  label: string;
}> = [
  { value: "flat", label: "Plano" },
  { value: "elevated", label: "Elevado" },
  { value: "glass", label: "Cristal" },
  { value: "outline", label: "Contorno" },
];

export const SHADOW_OPTIONS: ReadonlyArray<{
  value: FormShadow;
  label: string;
}> = [
  { value: "none", label: "Sin sombra" },
  { value: "sm", label: "Sutil" },
  { value: "md", label: "Media" },
  { value: "lg", label: "Grande" },
  { value: "xl", label: "Extra grande" },
  { value: "2xl", label: "Dramática" },
];

export const COLOR_PALETTE_PRESETS: ReadonlyArray<{
  name: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
}> = [
  { name: "Ocean", primary: "#0ea5e9", accent: "#6366f1", bg: "#f0f9ff", text: "#0c4a6e" },
  { name: "Sunset", primary: "#f97316", accent: "#ef4444", bg: "#fff7ed", text: "#7c2d12" },
  { name: "Forest", primary: "#16a34a", accent: "#059669", bg: "#f0fdf4", text: "#14532d" },
  { name: "Berry", primary: "#d946ef", accent: "#a855f7", bg: "#fdf4ff", text: "#581c87" },
  { name: "Midnight", primary: "#60a5fa", accent: "#a78bfa", bg: "#0f172a", text: "#f1f5f9" },
  { name: "Coral", primary: "#fb7185", accent: "#f472b6", bg: "#fff1f2", text: "#881337" },
  { name: "Mint", primary: "#2dd4bf", accent: "#34d399", bg: "#f0fdfa", text: "#134e4a" },
  { name: "Slate", primary: "#475569", accent: "#64748b", bg: "#f8fafc", text: "#0f172a" },
];

/* ─── Emoji categories ─── */

export const EMOJI_CATEGORIES: ReadonlyArray<EmojiCategory> = [
  {
    id: "popular",
    label: "⭐ Populares",
    emojis: [
      "🧪", "🔬", "📋", "🎨", "📝", "📊", "🚀", "✨",
      "🦄", "🌈", "🌟", "🎯", "📚", "🧠", "💡", "🔥",
    ],
  },
  {
    id: "faces",
    label: "😀 Caras",
    emojis: [
      "😀", "😎", "🤩", "😍", "🥳", "🤓", "😇", "🤔",
      "😏", "🙃", "😜", "🤗", "😂", "💀", "👻", "🤖",
    ],
  },
  {
    id: "nature",
    label: "🌿 Naturaleza",
    emojis: [
      "🌴", "🌸", "🌺", "🍀", "🌻", "🌊", "🏔️", "🌙",
      "☀️", "⭐", "🌈", "🔥", "❄️", "⚡", "🌍", "🍂",
    ],
  },
  {
    id: "food",
    label: "🍕 Comida",
    emojis: [
      "🍕", "🍔", "🍟", "🌮", "🍦", "🎂", "🍩", "☕",
      "🍷", "🍺", "🥐", "🍿", "🥑", "🍣", "🧁", "🍫",
    ],
  },
  {
    id: "activities",
    label: "⚽ Actividades",
    emojis: [
      "⚽", "🏀", "🎾", "🏈", "🎮", "🎸", "🎬", "🎵",
      "🎭", "🎪", "🏎️", "🏁", "🎤", "🎲", "🎯", "🏆",
    ],
  },
  {
    id: "travel",
    label: "✈️ Viajes",
    emojis: [
      "✈️", "🚀", "🚗", "🚂", "⛵", "🏖️", "🗽", "🗼",
      "🏰", "⛺", "🌋", "🎡", "🗺️", "🧳", "🚁", "🛸",
    ],
  },
  {
    id: "objects",
    label: "💎 Objetos",
    emojis: [
      "💎", "💰", "🎁", "🎈", "🎀", "🏅", "🏷️", "📎",
      "✏️", "🔑", "💌", "📦", "🔔", "🎊", "🧲", "🔮",
    ],
  },
  {
    id: "symbols",
    label: "💜 Símbolos",
    emojis: [
      "❤️", "💜", "💙", "💚", "💛", "🧡", "🤍", "🖤",
      "✅", "❌", "⭕", "💯", "🔷", "🔶", "♻️", "⚠️",
    ],
  },
];

/** Flat array of all emojis for backwards compat */
export const EMOJI_OPTIONS: ReadonlyArray<string> =
  EMOJI_CATEGORIES.flatMap((cat) => cat.emojis);

export const SUBMIT_PREVIEW_CLASS: Record<SubmitAnimation, string> = {
  none: "",
  pulse: "anim-preview-pulse",
  shake: "anim-preview-shake",
  zoom: "anim-preview-zoom",
  bounce: "anim-preview-bounce",
  race: "anim-preview-race",
  confetti: "anim-preview-confetti",
  rocket: "anim-preview-rocket",
};

export const FIELD_PREVIEW_CLASS: Record<FieldEntranceAnimation, string> = {
  none: "",
  "fade-up": "anim-preview-fade-up",
  "slide-left": "anim-preview-slide-left",
  "scale-in": "anim-preview-scale-in",
  "race-in": "anim-preview-race-in",
  "flip-in": "anim-preview-flip-in",
};

export const PRESET_NAMES: Record<string, string> = {
  lab: "Laboratorio",
  minimal: "Minimal",
  playful: "Juguetón",
  dark: "Oscuro",
  academic: "Académico",
  tropical: "Tropical",
  racing: "Fórmula 1",
  party: "Fiesta",
  neon: "Neón",
  sunset: "Atardecer",
  ocean: "Océano",
  retro: "Retro",
  cyberpunk: "Cyberpunk",
  nature: "Naturaleza",
  elegant: "Elegante",
};

export function isValidBase64Image(value: string): boolean {
  return value.startsWith("data:image/");
}
