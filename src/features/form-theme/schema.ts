import { z } from "zod";

const borderRadiusSchema = z.enum([
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "full",
]);

const fontFamilySchema = z.enum([
  "sans",
  "serif",
  "mono",
  "display",
  "rounded",
]);

const spacingSchema = z.enum(["compact", "normal", "relaxed"]);

const patternSchema = z.enum([
  "none",
  "dots",
  "grid",
  "waves",
  "checkered",
  "stars",
  "carbon",
]);

const logoPositionSchema = z.enum(["left", "center", "right"]);

const titleAlignmentSchema = z.enum(["left", "center", "right"]);

const submitAnimationSchema = z.enum([
  "none",
  "pulse",
  "shake",
  "zoom",
  "race",
  "bounce",
  "confetti",
  "rocket",
]);

const fieldEntranceAnimationSchema = z.enum([
  "none",
  "fade-up",
  "slide-left",
  "scale-in",
  "race-in",
  "flip-in",
]);

const cardStyleSchema = z.enum(["flat", "elevated", "glass", "outline"]);

const formShadowSchema = z.enum([
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
]);

const borderWidthSchema = z.union([
  z.enum(["none", "thin", "medium", "thick"]),
  z.number(),
]);

export const formThemeSchema = z.object({
  presetId: z.string(),
  primaryColor: z.string(),
  accentColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  emoji: z.string(),
  /**
   * @deprecated Mantenido por retrocompatibilidad con themes anteriores a D3.
   * Usá `borderRadiusForm` / `borderRadiusInput` / `borderRadiusButton` /
   * `borderRadiusLogo`. Si están ausentes, los helpers (`getFormBorderRadius`,
   * etc.) caen a este valor como fallback (excepto el logo, que por defecto
   * es `none`).
   */
  borderRadius: borderRadiusSchema,
  borderRadiusForm: borderRadiusSchema.optional(),
  borderRadiusInput: borderRadiusSchema.optional(),
  borderRadiusButton: borderRadiusSchema.optional(),
  borderRadiusLogo: borderRadiusSchema.optional(),
  fontFamily: fontFamilySchema,
  headingFontFamily: fontFamilySchema,
  spacing: spacingSchema,
  pattern: patternSchema,
  backgroundImage: z.string().optional(),
  backgroundOverlay: z.string().optional(),
  logoImage: z.string().optional(),
  logoPosition: logoPositionSchema,
  titleAlignment: titleAlignmentSchema,
  submitAnimation: submitAnimationSchema,
  fieldEntranceAnimation: fieldEntranceAnimationSchema,
  submitLabel: z.string(),
  cardStyle: cardStyleSchema,
  showProgressBar: z.boolean(),
  shadow: formShadowSchema,
  borderWidth: borderWidthSchema,
  borderColor: z.string(),
  backgroundGradient: z.string().optional(),
  backgroundOpacity: z.number(),
  showEmoji: z.boolean().optional(),
});

export type BorderRadius = z.infer<typeof borderRadiusSchema>;
export type FontFamily = z.infer<typeof fontFamilySchema>;
export type Spacing = z.infer<typeof spacingSchema>;
export type Pattern = z.infer<typeof patternSchema>;
export type LogoPosition = z.infer<typeof logoPositionSchema>;
export type TitleAlignment = z.infer<typeof titleAlignmentSchema>;
export type SubmitAnimation = z.infer<typeof submitAnimationSchema>;
export type FieldEntranceAnimation = z.infer<typeof fieldEntranceAnimationSchema>;
export type CardStyle = z.infer<typeof cardStyleSchema>;
export type FormShadow = z.infer<typeof formShadowSchema>;
export type BorderWidth = z.infer<typeof borderWidthSchema>;
export type FormTheme = z.infer<typeof formThemeSchema>;

export interface EmojiCategory {
  id: string;
  label: string;
  emojis: ReadonlyArray<string>;
}
