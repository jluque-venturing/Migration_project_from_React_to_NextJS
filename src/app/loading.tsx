export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
