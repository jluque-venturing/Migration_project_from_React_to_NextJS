import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/helpers";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-xl shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
