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

---

## Deudas de accesibilidad corregidas al migrar

### Spinner de carga sin nombre accesible

- **Qué pasaba:** el spinner de las rutas lazy tenía `aria-live="polite"` pero
  ningún contenido de texto, así que no anunciaba nada.
- **Cómo se solucionó:** se agregó un `<span className="sr-only">Cargando…</span>`
  en `src/app/loading.tsx`. Cero cambio visual.

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

> **Pendiente:** los bugs **B1** (`<main>` anidado en `SharePage` y
> `FormPreviewPage`), **B3** (falta `og:image`), **B4** (sitemap/robots),
> **B5** (metadata por ruta) y **B6** (feature `collections` sin documentar)
> se resuelven en los tracks que todavía no arrancaron.
