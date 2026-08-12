import type { LucideIcon } from "lucide-react";

export interface Command {
  id: string;
  label: string;
  keywords?: string[];
  icon?: LucideIcon;
  action: () => void;
}
