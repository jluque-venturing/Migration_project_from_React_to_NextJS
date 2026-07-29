"use client";

import { useTheme } from "@/features/settings/hooks/useTheme";

export function Providers({ children }: { children: React.ReactNode }) {
  useTheme();

  return <>{children}</>;
}
