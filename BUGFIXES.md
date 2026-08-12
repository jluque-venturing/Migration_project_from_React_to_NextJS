# Registro de bugs — FormForge (React/Vite → Next.js 16)

Requisito de la consigna §5: cada bug encontrado debe quedar registrado con
**qué pasaba / por qué pasaba / cómo se solucionó**, y reflejado en el historial
de commits con un `fix:`.

Los IDs `B*` siguen la numeración de `docs/PLAN-MIGRACION.md` §4.

---

## B2 · El tema se restauraba mal al desmontar

- **Qué pasaba:** al desmontarse el componente que llamaba a `useTheme`, el tema
  volvía al valor anterior en vez de quedarse en el elegido por el usuario.
- **Por qué pasaba:** el `useEffect` leía la clase de `document.documentElement`
  *antes* de aplicar la nueva y devolvía un cleanup que la re-aplicaba
  (`origen: src/features/settings/hooks/useTheme.ts:20-26`).
- **Cómo se solucionó:** se eliminó el cleanup. El tema es estado global
  persistido, no estado local del componente, así que no corresponde revertirlo
  al desmontar. Se agregó `useThemeStore.persist.rehydrate()` en un effect para
  acompañar el `skipHydration` que necesita el SSR.
- **Archivo:** `src/features/settings/hooks/useTheme.ts`

## B7 · `alt` redundante en el logo

- **Qué pasaba:** un lector de pantalla anunciaba "imagen FormForge Logo" al lado
  del texto "FormForge", duplicando la información.
- **Por qué pasaba:** `alt="FormForge Logo"` en un `<img>` puramente decorativo
  que ya va acompañado del nombre en texto (`origen: src/app/layout.tsx:57,119`).
- **Cómo se solucionó:** `alt=""` para marcarlo como decorativo, en el `Header` y
  en el `Footer`.
- **Archivos:** `src/components/shell/Header.tsx`, `src/components/shell/Footer.tsx`

## B8 · El `Modal` quedaba trabado después de cerrarlo con Escape

- **Qué pasaba:** al cerrar el modal con la tecla Escape, el diálogo desaparecía
  de la pantalla pero el estado del componente padre seguía en "abierto". Como
  consecuencia, **el modal no se podía volver a abrir**.
- **Por qué pasaba:** el `useEffect` que suscribe el listener del evento `close`
  del `<dialog>` nativo tenía las dependencias vacías (`[]`). Pero el `<dialog>`
  recién existe cuando el portal se monta, y el portal sólo se monta cuando
  `isOpen` es `true`. En el primer render `isOpen` es `false`, así que
  `dialogRef.current` era `null`, el effect hacía `return` temprano y **nunca
  volvía a correr**. El listener no se suscribía jamás, por lo que `onCancel`
  no se llamaba y el padre nunca enteraba de que el diálogo se había cerrado.
- **Cómo se solucionó:** se agregó `isOpen` a las dependencias del effect, para
  que vuelva a correr cuando el portal ya está montado y el `<dialog>` existe.
- **Archivo:** `src/shared/components/ui/Modal.tsx`
- **Nota:** bug **preexistente** en el proyecto original, no introducido por la
  migración.

## B9 · Diálogos nativos que nunca se abrían (misma causa que B8)

- **Qué pasaba:** la paleta de comandos y el modal de nueva colección no se veían
  al abrirlos. El elemento `<dialog>` se agregaba al DOM pero quedaba invisible.
- **Por qué pasaba:** un `<dialog>` sin el atributo `open` y sin `showModal()`
  tiene `display: none` por defecto. Estos componentes hacen
  `if (!isOpen) return null` **antes** de renderizar el diálogo, así que en el
  primer render `dialogRef.current` es `null`. El `useEffect` que llama a
  `showModal()` tenía dependencias vacías (`[]`): corría una sola vez, salía
  temprano por el ref nulo, y **nunca volvía a correr** cuando `isOpen` pasaba a
  `true`. Es exactamente el mismo error que [B8](#b8), en otros tres archivos.
- **Cómo se solucionó:** se agregó `isOpen` a las dependencias de los tres effects
  afectados (abrir el diálogo, suscribir el listener de `close`, y enfocar el input).
- **Archivos:**
  `src/features/command-palette/components/CommandPalette.tsx`,
  `src/features/collections/components/NewCollectionModal.tsx`
- **Nota:** bug **preexistente**. `TourOverlay` tenía el mismo patrón pero no
  fallaba en el original, porque para un usuario nuevo `hasSeenTour` es `false` y
  el diálogo se renderiza en el primer render. Sí se rompía al migrar, al sumarle
  el guard de hidratación, así que también se le corrigieron las dependencias.

---

# Bugs introducidos por la migración

## M1 · Archivos de `form-theme` commiteados con elisiones

- **Qué pasaba:** el repo **no compilaba**. `pnpm run typecheck` y `pnpm run build`
  fallaban con `TS1003: Identifier expected` y `Declaration or statement expected`.
- **Por qué pasaba:** dos archivos se commitearon con líneas que contenían un punto
  suelto (`.`) donde debía ir código. Son marcadores de elisión —el típico "…resto
  del código acá"— que quedaron guardados como código literal:
  - `presets/index.ts` líneas 242-244: además de romper la sintaxis, se habían
    perdido **6 de los 15 presets** del original (`sunset`, `ocean`, `retro`,
    `cyberpunk`, `nature`, `elegant`) y el preset `neon` estaba cortado por la mitad.
    El archivo tenía 259 líneas contra 426 del original.
  - `ThemedFormLayout.tsx` líneas 145-147: faltaba todo el cuerpo del componente
    `ThemedFormSuccess` (el `return` con el ícono de éxito, el título y el mensaje).
- **Cómo se solucionó:**
  - `presets/index.ts` se restauró copiando el archivo original completo. No tenía
    ninguna adaptación de Next (es data pura), así que la copia es 1:1.
  - `ThemedFormLayout.tsx` se restauró solo el bloque faltante, conservando las
    adaptaciones de Next que sí estaban bien hechas (`"use client"` y el `<img>`
    ya convertido a `next/image`).
- **Cómo se detectó:** `pnpm run typecheck` + comparación de conteo de líneas
  contra el proyecto original.
- **Cómo evitarlo:** correr `pnpm run typecheck && pnpm run build` **antes** de
  cada commit. Es la regla que ya figura en `docs/PLAN-MIGRACION.md` §7.

## M2 · Los presets guardados por el usuario se perdían al recargar

- **Qué pasaba:** al guardar un tema propio desde el drawer, el preset aparecía en
  la lista, pero desaparecía al recargar la página. Se escribía en `localStorage`
  y nunca se volvía a leer.
- **Por qué pasaba:** el store de `form-theme` declara `skipHydration: true` —
  correcto, evita el mismatch de hidratación del SSR— pero eso desactiva la
  rehidratación automática y **nadie llamaba a `persist.rehydrate()`**. El propio
  comentario del store decía que se resolvería "en un componente cliente de alto
  nivel (ej. Providers)", pero esa parte quedó sin hacer.
- **Cómo se solucionó:** se centralizó la rehidratación de todos los stores
  persistidos en `src/app/providers.tsx`, dentro del hook
  `useRehydratePersistedStores()`. Queda un único lugar donde sumar cada store
  nuevo que use `persist`.
- **Archivos:** `src/app/providers.tsx`, `src/features/form-theme/store.ts`
- **Nota:** el store de `settings` no tenía el problema porque rehidrata dentro de
  `useTheme`. El de `form-lab`, migrado junto con este fix, ya nació conectado.

## M3 · Funcionalidad del shell perdida al migrar el layout

- **Qué pasaba:** el atajo `Ctrl+K` / `⌘K` no hacía nada, el botón de la paleta de
  comandos en la barra de navegación no respondía al click, y el contador de
  formularios al lado de "Mis formularios" había desaparecido.
- **Por qué pasaba:** al partir el `AppLayout` original en `Header` / `Nav` /
  `Footer`, quedaron sin portar tres cosas que vivían en ese archivo: el
  `useKeyboardShortcut` del atajo, el `onClick` del botón, y el badge con
  `formCount`. Además `<CommandPalette />` no estaba montado en ningún lado.
- **Cómo se solucionó:** los atajos y el montaje de `<CommandPalette />` se
  pusieron en `app/providers.tsx` (el equivalente al `AppProviders` original), y
  el `onClick` junto con el badge volvieron a `Nav.tsx`.
- **Archivos:** `src/app/providers.tsx`, `src/components/shell/Nav.tsx`

---

## Deudas de accesibilidad corregidas al migrar

### Spinner de carga sin nombre accesible

- **Qué pasaba:** el spinner de las rutas lazy tenía `aria-live="polite"` pero
  ningún contenido de texto, así que no anunciaba nada.
- **Cómo se solucionó:** se agregó un `<span className="sr-only">Cargando…</span>`
  en `src/app/loading.tsx`. Cero cambio visual.

### A1 · El color primario no cumplía el contraste mínimo en modo claro

- **Qué pasaba:** en tema claro, todo el texto en color de marca (enlaces del
  footer, acentos de títulos, el "404", el badge del contador) era difícil de
  leer. La clase `text-primary` aparece **56 veces** en 26 archivos.
- **Por qué pasaba:** el token `--color-primary: #06b6d4` estaba declarado con el
  **mismo valor en ambos temas**. Sobre el fondo oscuro (`#0a0f1a`) rinde 7.89:1,
  pero sobre el claro (`#f8fafc`) cae a **2.32:1**, muy por debajo del 4.5:1 que
  exige WCAG 2.1 AA para texto normal.
- **Cómo se solucionó:** se redefinió el token dentro del bloque `.light` con una
  variante más oscura del mismo cyan, que conserva la identidad visual:
  `#0e7490` → **5.12:1**. El tema oscuro queda intacto. Como efecto lateral, el
  texto blanco sobre `bg-primary` también mejoró (a 5.36:1).
- **Archivo:** `src/app/globals.css`
- **Nota:** deuda **preexistente** del proyecto original.

### A2 · La página actual se señalaba únicamente con color

- **Qué pasaba:** en la barra de navegación, el enlace de la página actual se
  distinguía solo por su color y su fondo. Un lector de pantalla no anunciaba en
  qué página estaba el usuario, y sin percibir el color no había forma de saberlo.
  Incumple el punto "no depender solo del color" de la consigna §8.
- **Cómo se solucionó:** se agregó `aria-current="page"` al enlace activo (el
  estado nativo que los lectores anuncian como "página actual") y se aplicó la
  clase `.nav-link-active`, que **ya existía** en `globals.css` sin que la usara
  nadie y agrega un subrayado — así el estado también se percibe sin color.
- **Archivos:** `src/components/shell/Nav.tsx`, `src/app/globals.css`

### A3 · Texto del pie de página por debajo del contraste mínimo

- **Qué pasaba:** el aviso de copyright y la lista del stack usaban
  `text-text-muted/60`, y el eslogan `text-primary/80`. La opacidad sobre colores
  ya apagados, en texto de 12 px, daba 3.38:1 en oscuro y 2.27:1 en claro.
- **Cómo se solucionó:** se quitaron los modificadores de opacidad. Con el color
  pleno queda en 7.47:1 (oscuro) y 4.55:1 (claro).
- **Archivo:** `src/components/shell/Footer.tsx`

### A4 · Saltos en la jerarquía de encabezados y landmarks sin nombre

- **Qué pasaba:** el pie de página abría en `<h3>` sin un `<h2>` previo, y el
  `Modal` titulaba con `<h3>`; ambos generaban saltos h1 → h3. Además había dos
  landmarks `<nav>` por página y solo el del pie estaba nombrado, así que el
  listado de regiones mostraba dos "navigation" indistinguibles.
- **Cómo se solucionó:** los encabezados pasaron a `<h2>` y el `<nav>` del
  encabezado recibió `aria-label="Navegación principal"`. También se agregó
  `aria-hidden="true"` a los íconos decorativos que no lo tenían y un texto
  `sr-only` al badge del contador, que se anunciaba como un número suelto.
- **Archivos:** `src/components/shell/Footer.tsx`, `src/components/shell/Header.tsx`,
  `src/components/shell/Nav.tsx`, `src/shared/components/ui/Modal.tsx`

> La auditoría completa que originó estas correcciones está en
> [`auditorias/auditoria-a11y_2026-08-12.md`](./auditorias/auditoria-a11y_2026-08-12.md).

---

## Riesgos de migración resueltos

Estos no son bugs del original sino asimetrías Vite → Next que había que resolver.
Referencia: `docs/PLAN-MIGRACION.md` §3.

| Riesgo | Resolución |
|---|---|
| **R1** Zustand `persist` + SSR | `skipHydration: true` + `persist.rehydrate()` en un effect |
| **R2** FOUC del tema | script bloqueante en el `<head>` del root layout |
| **R4** `createPortal` en SSR | hook compartido `useIsHydrated()` (`useSyncExternalStore`) antes de portalizar |
| **R9** `<img>` planos | `next/image`; las imágenes subidas por el usuario van con `unoptimized` porque son data URIs |
| **R5** `#root` inexistente en Next | `min-height` movido a `body` |
| **R8** Fuentes por CDN | `next/font/google` con Space Grotesk y JetBrains Mono |
| **R11** `ErrorBoundary` class component | `"use client"` |
| **R12** `<main>` anidado | un solo `<main>` en el root layout |
| **R6/R7** rewrites SPA | `vercel.json` y `public/_redirects` deliberadamente **no** migrados |

---

## B1 · El layout tenía un `<main>` anidado en las páginas de vista previa y share

- **Qué pasaba:** la salida HTML de `FormPreviewPage` y `SharePage` generaba un
  elemento `<main>` dentro del `<main id="main-content">` que define el root layout.
- **Por qué pasaba:** el proyecto original devolvía `main` en esas páginas y la
  migración a Next reprodujo la misma estructura sin notar que el layout ya lo
  había definido.
- **Cómo se solucionó:** se dejó una sola landmark principal en el root layout y
  las páginas devolvieron contenedores semánticos (`div` / `section`) sin anidar
  ningún `<main>` adicional.
- **Archivos:** `src/app/layout.tsx`, `src/features/form-lab/components/SharePage.tsx`,
  `src/features/form-lab/components/FormPreviewPage.tsx`

## B3 · El sitio no tenía imagen Open Graph ni canonical

- **Qué pasaba:** el metadata del sitio no exponía una imagen `og:image` ni una
  URL canónica en la raíz, por lo que el compartir en redes y el SEO básico quedaban
  incompletos.
- **Por qué pasaba:** la migración del metadata local no incluyó `canonical` ni `images`
  dentro de `openGraph`, y el proyecto no tenía un asset OG. En el proyecto original
  lo único que existía era `og:type` y una card de Twitter sin contenido concreto.
- **Cómo se solucionó:** se agregó `alternates.canonical`, `openGraph.images`, y un
  generator `src/app/opengraph-image.tsx` para producir una imagen dinámica con el
  branding de FormForge.
- **Archivos:** `src/app/layout.tsx`, `src/app/opengraph-image.tsx`

## B4 · El sitio no exponía `robots.txt` ni `sitemap.xml`

- **Qué pasaba:** el proyecto no generaba el mapa de sitios ni permitía que los
  crawlers conocieran las rutas indexables del proyecto.
- **Por qué pasaba:** durante la migración se omitieron los archivos de SEO del
  App Router y la configuración del sitio quedaba incompleta.
- **Cómo se solucionó:** se añadieron `src/app/robots.ts` y `src/app/sitemap.ts` con
  la base URL del proyecto y la lista de rutas públicas.
- **Archivos:** `src/app/robots.ts`, `src/app/sitemap.ts`

## B5 · Las rutas no tenían metadata única y descriptiva

- **Qué pasaba:** el sitio tenía un título base global, pero cada ruta no siempre tenía
  texto distintivo para mostrar en el navegador y previsualizaciones compartidas.
- **Por qué pasaba:** en la migración inicial, el SEO se centró en el root y no se
  definieron títulos/description específicos para páginas como `forms`, `builder`,
  `share`, `preview` y `templates`.
- **Cómo se solucionó:** se dejó el title global y se reforzó la descripción del sitio,
  además de definir metadata por ruta con `title` y `description` en cada página del app.
- **Archivos:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/forms/page.tsx`,
  `src/app/builder/page.tsx`, `src/app/share/page.tsx`, `src/app/templates/page.tsx`,
  `src/app/preview/[id]/page.tsx`

## B6 · La feature `collections` no estaba documentada

- **Qué pasaba:** el proyecto tenía soporte de colecciones de formularios, pero ese
  feature no figuraba en la documentación principal ni en la introducción del proyecto.
- **Por qué pasaba:** en la migración se trasladó la feature completa al código sin
  dejar un trace en la documentación del repositorio.
- **Cómo se solucionó:** se agregó una sección de documentación y de estructura del
  proyecto en `README.md` con referencia explícita a `src/features/collections` y a su
  propósito dentro de FormForge.
- **Archivo:** `README.md`
