"use client";

import { cn } from "@/shared/lib/helpers";
import type { LucideIcon } from "lucide-react";

export interface ThemeTab {
  id: string;
  label: string;
  icon?: LucideIcon | string;
}

interface ThemeTabsProps {
  tabs: ReadonlyArray<ThemeTab>;
  activeTab: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}

export function ThemeTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
}: ThemeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="theme-tabs flex items-center gap-2 overflow-x-auto rounded-2xl border border-border/60 bg-surface/70 p-1.5 backdrop-blur-sm"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const isStringIcon = typeof Icon === "string";

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            type="button"
            role="tab"
            data-tab-id={tab.id}
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-text-muted hover:bg-surface hover:text-text"
            )}
          >
            {Icon &&
              (isStringIcon ? (
                <span className="text-base leading-none" aria-hidden="true">
                  {Icon}
                </span>
              ) : (
                <Icon
                  size={15}
                  aria-hidden="true"
                  className={cn(isActive && "text-white")}
                />
              ))}
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
