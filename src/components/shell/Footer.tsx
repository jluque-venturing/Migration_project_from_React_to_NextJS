import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/30 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3 flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link href="/" className="inline-flex items-center gap-2 text-primary justify-center sm:justify-start">
              <Image
                src="/icon.png"
                alt=""
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-display text-xl tracking-tight text-text">FormForge</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              Diseñá, validá y compartí formularios con reglas combinables, animaciones temáticas y estilo propio.
            </p>
          </div>

          <nav aria-label="Navegación secundaria" className="flex flex-col items-center text-center">
            <h2 className="mb-3 text-sm font-semibold text-text">Links rápidos</h2>
            <ul className="space-y-2 text-sm flex flex-col items-center">
              <li>
                <Link href="/" className="text-text-muted transition-colors hover:text-primary">Inicio</Link>
              </li>
              <li>
                <Link href="/builder" className="text-text-muted transition-colors hover:text-primary">Crear formulario</Link>
              </li>
              <li>
                <Link href="/forms" className="text-text-muted transition-colors hover:text-primary">Mis formularios</Link>
              </li>
              <li>
                <Link href="/templates" className="text-text-muted transition-colors hover:text-primary">Plantillas</Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-3 sm:col-span-2 lg:col-span-1 flex flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="text-sm font-semibold text-text">IntegrarTEC</h2>
            <p className="text-sm text-text-muted">
              Proyecto Integrador React 2026
            </p>
            <p className="font-mono text-xs text-primary">
              Experimentá. Validá. Repetí.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 sm:flex-row">
          <p className="text-xs text-text-muted">
            © 2026 FormForge. Hecho con cuidado para IntegrarTEC.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>React 19</span>
            <span>·</span>
            <span>TypeScript</span>
            <span>·</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
