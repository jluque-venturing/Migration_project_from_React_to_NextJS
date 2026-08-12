import { type ReactNode } from "react";
import { cn } from "@/shared/lib/helpers";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  emoji,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: { wrap: "py-8", icon: "h-12 w-12 text-4xl", heading: "text-base", body: "text-sm" },
    md: { wrap: "py-14", icon: "h-16 w-16 text-5xl", heading: "text-lg", body: "text-sm" },
    lg: { wrap: "py-20", icon: "h-20 w-20 text-6xl", heading: "text-xl", body: "text-base" },
  };

  const cls = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        cls.wrap,
        className
      )}
    >
      {emoji && (
        <span
          className={cn(
            "mb-4 flex items-center justify-center rounded-2xl bg-primary/8 animate-float",
            cls.icon
          )}
          aria-hidden="true"
        >
          {emoji}
        </span>
      )}
      <h3 className={cn("font-semibold text-text mb-1", cls.heading)}>
        {title}
      </h3>
      {description && (
        <p className={cn("text-text-muted max-w-xs mx-auto", cls.body)}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
