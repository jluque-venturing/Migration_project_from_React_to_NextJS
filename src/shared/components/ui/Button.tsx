"use client";

import { type ButtonHTMLAttributes, type ReactElement, cloneElement, isValidElement } from "react";
import { cn } from "@/shared/lib/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  asChild,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "bg-primary text-white hover:bg-primary-dark": variant === "primary",
      "bg-secondary text-white hover:bg-slate-600": variant === "secondary",
      "bg-transparent text-text hover:bg-surface": variant === "ghost",
      "bg-danger text-white hover:bg-red-600": variant === "danger",
    },
    {
      "px-3 py-1.5 text-sm": size === "sm",
      "px-4 py-2 text-sm": size === "md",
      "px-6 py-3 text-base": size === "lg",
    },
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
    } as { className?: string });
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
