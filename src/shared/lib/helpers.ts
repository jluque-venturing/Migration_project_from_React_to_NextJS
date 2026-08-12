import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StyleWithVars = CSSProperties & Record<`--${string}`, string>;

export function cssVars(vars: Record<`--${string}`, string>): StyleWithVars {
  return vars as StyleWithVars;
}
