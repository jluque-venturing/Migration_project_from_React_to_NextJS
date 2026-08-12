import Link from "next/link";
import Image from "next/image";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-border/50">
      <nav
        aria-label="Navegación principal"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-2"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-primary font-bold text-lg group"
        >
          <Image
            src="/icon.png"
            alt=""
            width={44}
            height={44}
            className="object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-primary">FormForge</span>
        </Link>
        <Nav />
      </nav>
    </header>
  );
}
