# FormForge — Migración a Next.js 16

> Tercer Proyecto Integrador — IntegrarTEC · Julio 2026

FormForge es un **laboratorio de validación de formularios**: permite crear
formularios con campos configurables, combinar reglas de validación, ver cómo
responden en tiempo real, personalizar su diseño y compartirlos por enlace. Todo
vive en el navegador, sin backend.

Este repositorio es la **migración a Next.js 16** de una Single Page Application
originalmente construida con React 19 + Vite 6 por otro grupo del curso.

## Enlaces

| | |
|---|---|
| **Deploy** | https://migration-project-from-react-to-nex.vercel.app/ |
| **Repositorio** | https://github.com/jluque-venturing/Migration_project_from_React_to_NextJS |
| **Proyecto original migrado** | https://github.com/AlejoElPaisano/integrartec-segundo-proyecto |
| **Deploy del original** | https://integrartec-segundo-proyecto.vercel.app/ |

## Integrantes

| Integrante | GitHub | Aporte principal |
|---|---|---|
| **Jonatan Luque** | [@jluque-venturing](https://github.com/jluque-venturing) | Base del scaffold, primitivas de UI, contratos Zod, sistema de toasts, núcleo de `form-lab`, features satélite, auditoría de accesibilidad |
| **Alex Sánchez** | — | Layout global, fuentes y shell, feature `settings`, páginas de consumo, SEO y metadatos, tests |
| **Santiago Silva** | — | Constructor de formularios (`FormBuilderPage`), lista de campos con drag & drop, editor de reglas |
| **Matías Robles** | — | Feature `form-theme` completa: presets, pickers, drawer y previsualización |

## Tecnologías

- **Next.js 16** (App Router) + **TypeScript** en modo estricto
- **React 19**
- **Tailwind CSS v4** — tokens con `@theme` en CSS, sin `tailwind.config.js`
- **Zustand v5** + `persist` — estado global con persistencia en `localStorage`
- **Zod 4** — motor de validación y fuente única de verdad de los tipos
- **React Hook Form** + `@hookform/resolvers`
- **@dnd-kit** — drag & drop con soporte de teclado
- **lucide-react** · **clsx** · **tailwind-merge** · **date-fns**
- **Vitest** — 141 tests en 7 archivos
- **ESLint 9** (flat config, `eslint-config-next`)

## Funcionalidades

- Constructor de formularios con campos configurables (label, tipo, placeholder)
- Reordenamiento por drag & drop, operable también con teclado
- Motor de reglas combinables por campo: `required`, `min`, `max`, `email`, `regex`
- Mensajes de error personalizados por regla
- Validación en vivo con estado por campo y resumen de errores activos
- Galería con **20 plantillas** prearmadas
- Personalización visual completa: 15 presets, colores, tipografías, bordes,
  sombras, fondos, patrones, imágenes, emojis y animaciones
- Colecciones para agrupar formularios
- Importar / exportar formularios como JSON
- Compartir por enlace (base64 en la query string)
- Paleta de comandos (`Ctrl/⌘ + K`) y tour de onboarding
- Tema claro / oscuro / sistema

## Qué implicó la migración

| Aspecto original | Equivalente en Next.js |
|---|---|
| React Router v7 | App Router — carpetas `app/`, `layout.tsx`, `page.tsx` |
| `index.html` único | `app/layout.tsx` + `metadata` por ruta |
| `<img>` planos | `next/image` |
| Fuentes por CDN de Google | `next/font/google` |
| `lazy()` + `<Suspense>` manual | code-splitting automático por ruta + `loading.tsx` |
| Zustand sin SSR | `skipHydration` + rehidratación centralizada en `providers.tsx` |

Decisiones destacadas:

- **`/` es un Server Component.** Todo el contenido indexable del home se
  renderiza en el servidor; solo el contador de formularios y su CTA son islas
  cliente. Es la mayor ganancia de SEO del proyecto.
- **`/builder` y `/share` usan `<Suspense>`**, requisito de Next 16 para
  `useSearchParams()`.
- **`/preview/[id]`** resuelve `params` como Promise (Next 16) y baja el `id`
  por prop al componente cliente.
- Los 5 stores con `persist` usan `skipHydration` y se rehidratan en un único
  lugar, `app/providers.tsx`.

## SEO

- `metadata` propio con Open Graph en las 6 rutas
- `app/sitemap.ts` — se excluyen `/share` y `/preview/[id]` a propósito, porque
  dependen de query params y de `localStorage`, y no tiene sentido indexarlas
- `app/robots.ts`
- `app/opengraph-image.tsx` — imagen OG generada
- `metadataBase` configurable vía `NEXT_PUBLIC_BASE_URL`

## Bugs encontrados y corregidos

Se documentaron **12 bugs**: 9 preexistentes del proyecto original y 3
introducidos durante la migración. El detalle completo —qué pasaba, por qué
pasaba y cómo se solucionó— está en **[`BUGFIXES.md`](./BUGFIXES.md)**.

Los más relevantes:

- **B8 / B9** — Tres `<dialog>` nativos nunca se suscribían al evento `close` ni
  llamaban a `showModal()`, porque el efecto tenía dependencias vacías y el
  diálogo no existía en el primer render. El modal quedaba trabado y la paleta de
  comandos no se veía.
- **B1** — Las páginas anidaban un `<main>` dentro del `<main>` del layout.
- **M1** — Dos archivos se commitearon con marcadores de elisión (`.`) en lugar
  de código: el build se rompía y se habían perdido 6 de los 15 presets de tema.
- **M2** — Los presets guardados por el usuario se perdían al recargar.

## Accesibilidad

Se corrigieron las deudas detectadas en una auditoría documentada en
[`auditorias/`](./auditorias/):

- Contraste WCAG 2.1 AA en **ambos temas**. El color primario del original daba
  2.32:1 sobre fondo claro; ahora da 5.12:1.
- `aria-current="page"` en la navegación: la página actual ya no se indica solo
  con color.
- Encabezados sin saltos de nivel, `<nav>` con nombre accesible, íconos
  decorativos con `aria-hidden`.

Se conservaron las buenas prácticas del original: skip link, `:focus-visible`,
`prefers-reduced-motion`, `<dialog>` nativo, labels asociadas y estados de
validación comunicados con texto además de color.

## Funcionalidad extra

No se agregaron funcionalidades nuevas. El foco estuvo en migrar sin perder nada,
corregir los bugs encontrados y mejorar SEO, rendimiento y accesibilidad, que es
lo que prioriza la consigna.

## Estructura del proyecto

```text
src/
├── app/                      # rutas, layout, metadata, SEO y providers
│   ├── layout.tsx            # <html lang="es">, next/font, metadata base, shell
│   ├── providers.tsx         # tema, rehidratación de stores, toasts, paleta
│   ├── globals.css           # Tailwind v4 + tokens @theme + clases .form-*
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx
│   └── page.tsx · forms/ · builder/ · templates/ · share/ · preview/[id]/
├── components/shell/         # Header, Nav, Footer
├── features/
│   ├── form-lab/             # núcleo: formularios, campos, reglas, plantillas
│   ├── form-theme/           # personalización visual y presets
│   ├── collections/          # agrupación de formularios
│   ├── command-palette/      # Ctrl/⌘ + K
│   ├── onboarding/           # tour guiado
│   ├── notifications/        # toasts
│   ├── settings/             # tema claro/oscuro/sistema
│   └── error-pages/          # 404 y fallback de errores
└── shared/
    ├── components/ui/        # Button, Card, Input, Modal, EmptyState, ErrorBoundary
    ├── hooks/                # useIsHydrated, useKeyboardShortcut, useConfirmDialog
    └── lib/                  # cn, cssVars, sort
```

## Cómo correrlo

```bash
pnpm install

pnpm dev          # servidor de desarrollo (http://localhost:3000)
pnpm build        # build de producción
pnpm start        # servir el build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest
```

### Variables de entorno

```bash
# .env.local — usada por metadataBase, sitemap.ts y robots.ts
NEXT_PUBLIC_BASE_URL=https://migration-project-from-react-to-nex.vercel.app
```

Si no se define, se usa un valor por defecto. **Conviene fijarla al desplegar**
para que el canonical y el sitemap apunten a la URL real.

## Documentación adicional

- [`BUGFIXES.md`](./BUGFIXES.md) — registro completo de bugs
- [`docs/PLAN-MIGRACION.md`](./docs/PLAN-MIGRACION.md) — plan de migración, mapa
  de rutas, riesgos técnicos y reparto del trabajo
- [`auditorias/`](./auditorias/) — auditoría de semántica y accesibilidad
