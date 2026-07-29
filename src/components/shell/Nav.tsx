"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, FolderOpen } from "lucide-react";
import { ThemeToggle } from "@/features/settings/components/ThemeToggle";
import { cn } from "@/shared/lib/helpers";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "text-primary bg-primary/10"
            : "text-text-muted hover:text-text hover:bg-surface"
        )}
      >
        {label}
      </Link>
    </li>
  );
}

export function Nav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <ul className="flex items-center gap-1">
      <NavLink href="/" label="Inicio" isActive={isActive("/")} />
      <li>
        <Link
          href="/forms"
          className={cn(
            "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            isActive("/forms")
              ? "text-primary bg-primary/10"
              : "text-text-muted hover:text-text hover:bg-surface"
          )}
        >
          <FolderOpen size={14} />
          Mis formularios
        </Link>
      </li>
      <NavLink href="/builder" label="Crear" isActive={isActive("/builder")} />
      <li className="ml-1">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 text-sm text-text-muted transition-colors hover:text-text hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Abrir paleta de comandos"
        >
          <Search size={14} />
          <kbd className="hidden text-xs opacity-60 sm:inline">⌘K</kbd>
        </button>
      </li>
      <li className="ml-1">
        <ThemeToggle />
      </li>
    </ul>
  );
}
