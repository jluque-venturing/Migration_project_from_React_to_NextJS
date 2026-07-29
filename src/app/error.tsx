"use client";

import { ErrorFallback } from "@/features/error-pages/components/ErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} onReset={reset} />;
}
