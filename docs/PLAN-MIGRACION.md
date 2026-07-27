# Plan de Migración — FormForge · React (Vite) → Next.js 16

>
> **Proyecto origen:** `integrartec-segundo-proyecto` (FormForge)
> Repo: https://github.com/AlejoElPaisano/integrartec-segundo-proyecto
> Deploy original: https://integrartec-segundo-proyecto.vercel.app/
>
> **Proyecto destino:** este repo — Next.js 16.2.12 (App Router) + TypeScript

---

## 0. Estado actual del repo destino

Ya está hecho (base instalada, **sin commitear**):

```
✅ Scaffold create-next-app 16.2.12 (App Router + TS + Tailwind v4 + ESLint + src/)
✅ Alias @/* → ./src/*
✅ Dependencias de runtime del proyecto original instaladas
   (zustand, zod, react-hook-form, @hookform/resolvers,
    @dnd-kit/*, lucide-react, clsx, tailwind-merge, date-fns)
✅ Infra de tests: vitest + @vitejs/plugin-react + vite-tsconfig-paths
   → vitest.config.ts (environment: node, igual que el original)
✅ Scripts: dev / build / start / lint / typecheck / test / test:ui
✅ pnpm run build verificado OK
❌ react-router-dom NO se instala (lo reemplaza el App Router)
```

---

## 1. Qué es el proyecto que migramos

**FormForge** — laboratorio de validación de formularios. SPA React 19 + Vite 6.

```
┌──────────────────────────────────────────────────────────────┐
│  FormForge                                                   │
│                                                              │
│  Armás un formulario  →  le ponés reglas  →  lo validás      │
│  en vivo  →  lo tematizás  →  lo guardás / compartís         │
└──────────────────────────────────────────────────────────────┘
```

**Números del código origen:**

| Métrica | Valor |
|---|---|
| Archivos `.ts` / `.tsx` en `src/` | 94 |
| Líneas totales (incl. CSS y tests) | ~14.060 |
| Rutas | 6 + catch-all 404 |
| Features (vertical slices) | 8 |
| Tests (Vitest) | 141 en 7 archivos |
| Stores Zustand | 6 (5 con `persist`) |

**Identidad visual:** "Lab Nocturno" — dark por defecto, acento cyan `#06b6d4`,
tipografías Space Grotesk + JetBrains Mono, voz rioplatense.
**No se toca el diseño.** La migración debe verse idéntica.

### Features (vertical slices)

```
src/features/
├── form-lab/          ← núcleo: formularios, campos, reglas, plantillas   (~6.100 líneas)
├── form-theme/        ← personalización visual del formulario            (~3.000 líneas)
├── collections/       ← agrupar formularios en colecciones                 (~650 líneas)
├── command-palette/   ← Ctrl+K                                             (~250 líneas)
├── onboarding/        ← tour guiado                                        (~210 líneas)
├── notifications/     ← toasts                                             (~170 líneas)
├── settings/          ← tema claro/oscuro/sistema                          (~170 líneas)
└── error-pages/       ← 404 + ErrorBoundary fallback                       (~100 líneas)
```

---

## 2. Mapa de rutas: React Router → App Router

```
┌─────────────────────────────┬────────────────────────────────────────────┐
│ React Router v7 (origen)    │ App Router (destino)                       │
├─────────────────────────────┼────────────────────────────────────────────┤
│ AppLayout + <Outlet/>       │ src/app/layout.tsx                         │
│ "/"                         │ src/app/page.tsx                           │
│ "/forms"                    │ src/app/forms/page.tsx                     │
│ "/builder"        (?id=)    │ src/app/builder/page.tsx                   │
│ "/preview/:id"              │ src/app/preview/[id]/page.tsx              │
│ "/share"          (?data=)  │ src/app/share/page.tsx                     │
│ "/templates"                │ src/app/templates/page.tsx                 │
│ "*"                         │ src/app/not-found.tsx                      │
│ errorElement                │ src/app/error.tsx  (+ global-error.tsx)    │
│ lazy() + <RouteSuspense/>   │ code-splitting automático + loading.tsx    │
└─────────────────────────────┴────────────────────────────────────────────┘
```

### API de navegación

```
react-router-dom                    next
────────────────────────────────────────────────────────────────
<Link to="/x">              →       <Link href="/x">        (next/link)
useNavigate()               →       useRouter()             (next/navigation)
  navigate("/forms")        →         router.push("/forms")
useParams<{id}>()           →       props.params  (Promise<{id}> en Next 16 → await)
useSearchParams()           →       useSearchParams()       (next/navigation, client)
                            →       o props.searchParams (server, Promise → await)
useLocation().pathname      →       usePathname()           (next/navigation)
```

> ⚠️ **Next 16:** `params` y `searchParams` de las páginas son **Promises**.
> `export default async function Page({ params }) { const { id } = await params }`

### Estructura destino de `src/`

```
src/
├── app/
│   ├── layout.tsx              ← root layout: <html lang="es">, fonts, metadata, shell
│   ├── page.tsx                ← "/"
│   ├── globals.css             ← ex index.css
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── providers.tsx           ← "use client" — ErrorBoundary + ToastContainer + useTheme
│   ├── icon.png                ← favicon vía convención de Next
│   ├── opengraph-image.png     ← og:image
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── forms/page.tsx
│   ├── builder/page.tsx
│   ├── preview/[id]/page.tsx
│   ├── share/page.tsx
│   └── templates/page.tsx
├── components/
│   └── shell/                  ← Header.tsx, Nav.tsx, Footer.tsx (ex app/layout.tsx viejo)
├── features/                   ← 1:1 con el origen
└── shared/                     ← 1:1 con el origen
```

---

## 3. Riesgos técnicos detectados (leídos del código real)

| # | Riesgo | Dónde | Cómo se resuelve |
|---|---|---|---|
| R1 | **Zustand `persist` + SSR** → mismatch de hidratación | 5 stores | `skipHydration: true` + rehidratar en `useEffect`, o guard `mounted` |
| R2 | **FOUC de tema** — `.light` se aplica recién tras hidratar | `settings/hooks/useTheme.ts` | script bloqueante inline en `<head>` del root layout |
| R3 | **`useSearchParams()` sin `<Suspense>`** → error de build en Next | `/builder`, `/share` | envolver el componente cliente en `<Suspense>` |
| R4 | **`createPortal(…, document.body)`** en render | `Modal.tsx`, `ImportFormModal`, `JsonPreviewModal`, `TourOverlay` | `"use client"` + guard `mounted` antes del portal |
| R5 | **`#root { min-height:100vh }`** ya no existe en Next | `index.css:51` | mover a `body` |
| R6 | **`vercel.json` con rewrite SPA** rompería el ruteo de Next | `vercel.json` origen | **no migrar** ese archivo |
| R7 | **`public/_redirects`** (Netlify SPA) | origen | **no migrar** |
| R8 | **Fuentes por CDN de Google** | `index.html` | `next/font/google` (Space Grotesk + JetBrains Mono) |
| R9 | **6 `<img>` planos** | ver §4 | `next/image` |
| R10 | **`btoa`/`atob`** para compartir por link | `form-lab/utils.ts:515,527` | existen en Node 20, pero `/share` debe ser client igual |
| R11 | **ErrorBoundary es class component** | `shared/ui/ErrorBoundary.tsx` | `"use client"` obligatorio |
| R12 | **`<main>` anidado dentro de `<main>`** | ver bug B1 | quitar el `<main>` de las páginas |
| R13 | React Compiler activo en el origen | `vite.config.ts` | `reactCompiler: true` en `next.config.ts` + `babel-plugin-react-compiler` (opcional, encarece el build) |

---

## 4. Registro previo de bugs y deudas (semilla para `BUGFIXES.md`)

Detectados **leyendo el código original**, antes de migrar. Cada uno debe terminar
en `BUGFIXES.md` con: *qué pasaba / por qué pasaba / cómo se solucionó* + commit `fix:`.

### Bugs reales del original

| ID | Bug | Evidencia | Tipo |
|---|---|---|---|
| **B1** | `<main>` anidado dentro del `<main>` del layout — HTML inválido, rompe landmarks para lectores de pantalla | `app/layout.tsx:108` define `<main id="main-content">`; `SharePage.tsx:229` y `FormPreviewPage.tsx:139` devuelven otro `<main>` | a11y / semántica |
| **B2** | `useTheme` en su cleanup lee la clase del `documentElement` *antes* de aplicar y la restaura al desmontar — puede dejar el tema equivocado | `settings/hooks/useTheme.ts:20-26` | lógica |
| **B3** | Sin `og:image` ni `canonical`; `og:type` presente pero sin `twitter:card` | `index.html` | SEO |
| **B4** | No hay `sitemap.xml` ni `robots.txt` | raíz del proyecto | SEO |
| **B5** | Título único para toda la SPA — las 6 rutas comparten `<title>` | `index.html:11` | SEO |
| **B6** | El feature `collections/` existe en el código pero **no está documentado** en el README ni en la tabla de estructura | `README.md` vs `src/features/collections/` | documentación |
| **B7** | `alt="FormForge Logo"` — la palabra "Logo" es redundante para un lector de pantalla; además el logo es decorativo cuando va junto al texto "FormForge" | `app/layout.tsx:57,119` | a11y |

### Bugs esperables *introducidos por la migración* (a documentar cuando aparezcan)

- Hidratación de los 5 stores con `persist` (R1).
- Flash de tema claro→oscuro en el primer paint (R2).
- `useSearchParams` sin Suspense (R3).
- Portales que rompen en SSR (R4).

> **Regla del equipo:** ningún `fix:` se mergea sin su entrada en `BUGFIXES.md`.

---

## 5. División del trabajo — 5 personas

### Criterio de reparto

El código origen está organizado en **vertical slices** (`features/`), así que
repartimos **por slice**, no por tipo de archivo. Ventajas:

```
✔ Cada persona toca su carpeta  →  casi cero conflictos de merge
✔ Cada persona es dueña end-to-end de su parte (migración + SEO + a11y + bugs)
✔ Se puede trabajar en paralelo apenas termina la Etapa 1
```

Se equilibró por **esfuerzo**, no por líneas: `templates.ts` (1.093 líneas) es data
pura que se copia tal cual, mientras que el root layout (176 líneas) es lo más
delicado de todo el proyecto.

### Resumen del reparto

| | Persona | Track | Archivos | Peso aprox. |
|---|---|---|---|---|
| **P1** | *(a definir)* | 🏗️ Base, shell, ruteo, tema | ~18 | Alto (bloqueante) |
| **P2** | *(a definir)* | ⚙️ Núcleo form-lab + Builder | ~14 | Alto |
| **P3** | *(a definir)* | 🎨 form-theme completo | ~20 | Medio-alto |
| **P4** | *(a definir)* | 📄 Páginas de consumo + UI shared | ~17 | Alto |
| **P5** | *(a definir)* | 🧩 Features satélite + SEO global | ~20 | Medio-alto |

---

### 🏗️ P1 — Base, Shell, Ruteo y Tema  *(ETAPA 1 — bloquea a todos)*

**Objetivo:** que en 2-3 días el resto pueda empezar a trabajar sin pisarse.

**Archivos que le corresponden**

```
src/app/layout.tsx                    ← root layout nuevo
src/app/globals.css                   ← ex src/index.css (905 líneas)
src/app/providers.tsx                 ← ex src/app/providers.tsx
src/app/error.tsx  ·  not-found.tsx  ·  loading.tsx
src/components/shell/Header.tsx       ← extraído de app/layout.tsx viejo
src/components/shell/Nav.tsx
src/components/shell/Footer.tsx
src/features/settings/**              ← 7 archivos (theme completo)
src/shared/lib/helpers.ts  ·  sort.ts
src/shared/hooks/useKeyboardShortcut.ts  ·  useConfirmDialog.ts
next.config.ts                        ← images, reactCompiler
public/  (icon.png, favicon.png)      ← copiados del origen
```

**Tareas**

1. Copiar `public/icon.png` y `public/favicon.png` del origen; borrar los SVG demo del scaffold.
2. `src/index.css` → `src/app/globals.css`. Ajustes: quitar `#root`, mover `min-height` a `body`,
   verificar que `@custom-variant dark` y `.light` sigan funcionando.
3. Fuentes: `next/font/google` → `Space_Grotesk` + `JetBrains_Mono`, exponerlas
   como variables CSS (`--font-sans`, `--font-mono`, `--font-display`, `--font-rounded`)
   y quitar los `<link>` a `fonts.googleapis.com` **(R8)**.
4. Root layout: `<html lang="es">`, `metadata` base del sitio, `<a class="skip-link">`,
   `<main id="main-content">`, providers, `<CommandPalette/>` slot.
5. **Script anti-FOUC** de tema en `<head>` (lee `localStorage["form-lab-theme"]`
   y aplica `.light` antes del primer paint) **(R2)**.
6. Shell: partir el `AppLayout` viejo en `Header` / `Nav` / `Footer`.
   `Nav` es client (usa `usePathname` + store), `Footer` puede ser **Server Component**.
7. Migrar `settings/` completo; `useTheme` corregido **(B2)**.
8. `not-found.tsx` y `error.tsx` (este último `"use client"`).
9. **Esqueleto de las 6 rutas restantes con un `page.tsx` placeholder**
   → esto es lo que desbloquea a P2/P3/P4/P5.
10. `next.config.ts`: `images` (permitir `data:` para las imágenes base64 del tema)
    y opcionalmente `reactCompiler: true`.

**Secuencia de commits sugerida** (rama `feat/p1-base-shell`)

```
chore: scaffold Next.js 16 App Router with TypeScript and Tailwind   ← YA HECHO, sin commitear
chore: add original project runtime dependencies
chore: configure vitest for the Next.js project
feat: migrate global styles from Vite index.css to app/globals.css
feat: load Space Grotesk and JetBrains Mono with next/font
feat: add root layout with base metadata and skip link
fix: prevent theme flash on first paint with blocking script
feat: split legacy AppLayout into Header, Nav and Footer components
feat: migrate settings theme feature to Next.js client components
fix: restore correct theme on useTheme cleanup
feat: add not-found and error boundary route files
feat: scaffold empty route segments for all original routes
chore: configure next.config for data-uri images
```

---

### ⚙️ P2 — Núcleo de form-lab + Form Builder

**Depende de:** P1 etapa 1 (esqueleto de rutas + shared/lib).

**Archivos**

```
src/features/form-lab/schema.ts              (106)   copia 1:1
src/features/form-lab/store.ts                (55)   + skipHydration
src/features/form-lab/utils.ts               (663)   copia 1:1 (lógica pura)
src/features/form-lab/templates.ts         (1.093)   copia 1:1 (data)
src/features/form-lab/dom-helpers.ts          (35)
src/features/form-lab/hooks/useFormLab.ts     (14)
src/features/form-lab/hooks/useHistory.ts     (56)
src/features/form-lab/hooks/useRuleEngine.ts  (38)
src/features/form-lab/components/FormBuilderPage.tsx  (704)
src/features/form-lab/components/FieldList.tsx        (133)
src/features/form-lab/components/FieldItem.tsx        (150)
src/features/form-lab/components/RuleEditor.tsx       (108)
src/features/form-lab/components/FormTagsInput.tsx     (95)
src/features/form-lab/components/FormMetadataCard.tsx  (38)
src/app/builder/page.tsx
tests: utils.test.ts (362) · templates.test.ts (257)
```

**Tareas**

1. Migrar el núcleo de datos (`schema`, `store`, `utils`, `templates`) — casi copy-paste.
   Único cambio real: `persist` con `skipHydration` **(R1)**.
2. `FormBuilderPage` → `"use client"`; `useSearchParams` de `next/navigation`,
   `useNavigate` → `useRouter`.
3. El truco `key={search}` del router viejo (`router.tsx:115`) se reemplaza por
   `key={searchParams.get("id") ?? "new"}` para forzar el remount al cambiar de formulario.
4. `/builder` → Server Component fino con `metadata` + `<Suspense>` + el componente client **(R3)**.
5. Drag & drop `@dnd-kit` → verificar que funcione bajo StrictMode de Next.
6. Portar los 2 archivos de tests y dejarlos en verde.
7. SEO de su ruta: `metadata` de `/builder`.
8. a11y de sus componentes: labels de los inputs de reglas, foco al agregar campo.

**Commits sugeridos** (rama `feat/p2-form-lab-core`)

```
feat: migrate form-lab zod schemas and shared contracts
feat: migrate form-lab zustand store with SSR-safe hydration
feat: migrate form-lab pure utils and rule engine
feat: migrate the 20 form templates catalog
feat: migrate form-lab hooks (useFormLab, useHistory, useRuleEngine)
feat: migrate FieldItem, FieldList and RuleEditor as client components
feat: migrate FormTagsInput and FormMetadataCard
feat: migrate FormBuilderPage to the App Router
fix: remount the builder when the form id query param changes
feat: add metadata for the builder route
test: port form-lab utils and templates test suites
```

---

### 🎨 P3 — Feature form-theme completo

**Depende de:** P1 etapa 1 + `shared/ui` de P4 (coordinar: P4 entrega `Button`/`Card`/`Input` primero).

**Archivos** — 20 archivos, ~3.000 líneas

```
src/features/form-theme/schema.ts             (130)
src/features/form-theme/store.ts               (85)
src/features/form-theme/utils.ts              (493)   lógica pura
src/features/form-theme/dom-helpers.ts         (56)
src/features/form-theme/presets/index.ts      (426)   data
src/features/form-theme/hooks/useFormTheme.ts  (50)
src/features/form-theme/hooks/useFileToBase64.ts (10)
src/features/form-theme/components/  (12 archivos, ~1.800 líneas)
    ThemeDrawer · ThemeTabs · ThemePresetGrid · ThemeColorPicker
    ThemeStylePicker · ThemePatternPicker · ThemeEmojiPicker
    ThemeAnimationPicker · ThemeImageUploader · ThemePreviewModal
    LiveThemePreview · ThemedFormLayout
tests: utils.test.ts (376) · dom-helpers.test.ts (52)
```

**Tareas**

1. `schema`, `utils`, `presets` → copia 1:1 (pura).
2. Los 12 componentes → `"use client"` (todos usan estado o eventos).
   **Excepción a evaluar:** `LiveThemePreview` no tiene hooks propios pero consume
   `useFormTheme` → igual es client.
3. `store` con `skipHydration` **(R1)**.
4. `ThemeImageUploader` sube imágenes a **base64 (data URI)** → `next/image`
   necesita `unoptimized` para `data:` o usar `<img>` con comentario justificando.
   Coordinar la decisión con P1 (dueño de `next.config.ts`).
5. `ThemePreviewModal` usa portal → guard `mounted` **(R4)**.
6. Portar los 2 archivos de tests.
7. a11y: los pickers de color deben tener label y no depender solo del color **(consigna §8)**.

**Commits sugeridos** (rama `feat/p3-form-theme`)

```
feat: migrate form-theme schema and presets catalog
feat: migrate form-theme pure utils and css-var dom helpers
feat: migrate form-theme store with SSR-safe hydration
feat: migrate form-theme hooks
feat: migrate theme pickers as client components
feat: migrate ThemeDrawer and ThemeTabs
feat: migrate LiveThemePreview and ThemedFormLayout
fix: guard ThemePreviewModal portal against server rendering
perf: render theme logo images with next/image
fix: add accessible labels to theme color pickers
test: port form-theme test suites
```

---

### 📄 P4 — Páginas de consumo + primitivas UI compartidas

**Entrega temprana crítica:** `shared/components/ui/*` en los primeros 2 días
(P2, P3 y P5 dependen de `Button`, `Card`, `Input`, `Modal`).

**Archivos**

```
src/shared/components/ui/Button.tsx        (46)
src/shared/components/ui/Card.tsx          (18)
src/shared/components/ui/Input.tsx         (74)
src/shared/components/ui/EmptyState.tsx    (63)
src/shared/components/ui/Modal.tsx        (138)
src/shared/components/ui/ErrorBoundary.tsx (46)
src/features/form-lab/components/HomePage.tsx           (326)
src/features/form-lab/components/MyFormsPage.tsx        (459)
src/features/form-lab/components/FormCard.tsx           (241)
src/features/form-lab/components/FormStatsCard.tsx      (127)
src/features/form-lab/components/FormPreviewPage.tsx    (359)
src/features/form-lab/components/SharePage.tsx          (278)
src/features/form-lab/components/ImportFormModal.tsx    (168)
src/features/form-lab/components/JsonPreviewModal.tsx   (124)
src/features/form-lab/components/ActiveErrorsSummary.tsx (28)
src/features/form-lab/components/FieldStatusBadge.tsx    (31)
src/features/form-lab/hooks/useFormValidation.ts         (57)
src/app/page.tsx · forms/page.tsx · preview/[id]/page.tsx · share/page.tsx
tests: FormPreviewPage.test.tsx (69) · useFormValidation.test.ts (184)
```

**Tareas**

1. `shared/ui`: `Card` y `EmptyState` quedan **Server Components**; `Button`,
   `Input`, `Modal`, `ErrorBoundary` van `"use client"` **(R11)**.
2. **`/` (Home) — la oportunidad de SEO más grande del proyecto.**
   `HomePage` sólo usa el store para el contador de formularios. Partirla:

   ```
   ┌─────────────────────────────────────────────┐
   │  app/page.tsx        SERVER  ← hero, features,│
   │                              cards, CTAs      │
   │    └─ <FormCountBadge/>  CLIENT  ← 1 número  │
   └─────────────────────────────────────────────┘
   ```
   Así todo el contenido indexable se renderiza en el servidor.
3. `/preview/[id]`: `useParams` → `const { id } = await params` en el Server Component,
   pasado por prop al componente client. `generateMetadata` dinámico.
   ⚠️ El formulario vive en `localStorage`, así que el título dinámico sólo puede ser
   genérico ("Vista previa · FormForge") — documentarlo como decisión técnica.
4. `/share`: `useSearchParams` dentro de `<Suspense>` **(R3)**.
5. **Fix B1**: quitar los `<main>` de `SharePage` y `FormPreviewPage` (ya hay uno en el layout).
6. Portales de `ImportFormModal` / `JsonPreviewModal` → guard `mounted` **(R4)**.
7. `next/image` en los `<img>` de `SharePage:156`.
8. Portar los 2 archivos de tests.

**Commits sugeridos** (rama `feat/p4-pages`)

```
feat: migrate shared UI primitives to Next.js
fix: mark ErrorBoundary and Modal as client components
feat: migrate HomePage splitting static content into a server component
feat: add metadata and Open Graph tags for the home route
feat: migrate MyFormsPage, FormCard and FormStatsCard
feat: migrate FormPreviewPage to a dynamic App Router segment
feat: migrate SharePage with a Suspense boundary for search params
fix: remove nested main landmarks from preview and share pages
fix: guard import and json preview modal portals against SSR
perf: render shared form logo with next/image
test: port form preview and validation test suites
```

---

### 🧩 P5 — Features satélite + SEO global + entrega

**Depende de:** P1 etapa 1. Su parte de SEO global se cierra al final.

**Archivos**

```
src/features/command-palette/**       (4 archivos, 253 líneas)
src/features/notifications/**         (6 archivos, 172 líneas)
src/features/onboarding/**            (2 archivos, 210 líneas)
src/features/collections/**           (6 archivos, 652 líneas)
src/features/error-pages/**           (2 archivos,  98 líneas)
src/app/sitemap.ts
src/app/robots.ts
src/app/opengraph-image.png  (+ icon.png)
README.md
BUGFIXES.md
tests: collections/store.test.ts (90)
```

**Tareas**

1. `command-palette`: `useNavigate` → `useRouter`; `"use client"`.
2. `notifications`: store sin persist (fácil); `ToastContainer` puede quedar client fino.
3. `onboarding`: `TourOverlay` usa portal + `document` → guard `mounted` **(R4)**.
4. `collections`: 6 archivos, store con persist **(R1)**.
5. `error-pages`: `NotFoundPage` → alimenta el `app/not-found.tsx` de P1;
   `ErrorFallback` → alimenta `app/error.tsx`. **Coordinar con P1.**
6. **SEO global (eje central de la consigna):**
   - `src/app/sitemap.ts` con las 6 rutas estáticas.
   - `src/app/robots.ts`.
   - `metadataBase` + Open Graph + `twitter:card` en el root layout (con P1) **(B3)**.
   - `opengraph-image.png` (1200×630) respetando la identidad Lab Nocturno.
7. **Auditoría final de a11y** con Lighthouse sobre las 6 rutas; abrir issues a quien corresponda.
8. `README.md` completo (§11 de la consigna) y `BUGFIXES.md` consolidado.
9. Deploy en Vercel + verificar que las 6 rutas naveguen y recarguen bien.

**Commits sugeridos** (rama `feat/p5-satellites-seo`)

```
feat: migrate notifications toast system
feat: migrate command palette to next/navigation
feat: migrate onboarding tour with SSR-safe portal
feat: migrate collections feature and store
feat: wire error-pages into not-found and error route files
feat: add sitemap.xml generation with all static routes
feat: add robots.txt generation
feat: add Open Graph image and twitter card metadata
docs: document collections feature missing from the original README
docs: add BUGFIXES.md with pre-existing and migration bugs
docs: write project README with migration notes
chore: configure Vercel deployment
```

---

## 6. Línea de tiempo y dependencias

```
 SEMANA 1              SEMANA 2              SEMANA 3           SEMANA 4
 ├─ Lectura ─┤
 │ (los 5)   │
 │           │
 P1 ████████████░░░░░░░░░░                                      ← base + shell
 │      ▲                                                          (BLOQUEANTE)
 │      └── día 3: esqueleto de rutas listo → arrancan todos
 │
 P4 ██░░░░████████████████░░░░░░                                ← ui shared (día 1-2)
 │   ▲                                                             + páginas
 │   └── entrega Button/Card/Input temprano
 │
 P2      ░░░░████████████████████░░░░                           ← core + builder
 P3      ░░░░░░██████████████████████░░                         ← form-theme
 P5      ░░░░░░░░██████████░░░░░░████████████                   ← satélites → SEO global
                                  ▲
                                  └── cierre: SEO + a11y + README + deploy

 ████ trabajo activo    ░░░░ dependencia / espera / revisión de PRs
```

### Grafo de dependencias

```
                    ┌──────────────────────┐
                    │ P1 · base + shell    │
                    │ + esqueleto de rutas │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
     ┌────────────────┐  ┌───────────┐  ┌──────────────┐
     │ P4 · shared/ui │  │ P2 · core │  │ P5 · satéli- │
     │   (día 1-2)    │  │  form-lab │  │     tes      │
     └───┬────────┬───┘  └─────┬─────┘  └──────┬───────┘
         │        │            │               │
         ▼        ▼            ▼               │
    ┌────────┐ ┌──────────────────┐            │
    │P3·theme│ │ P4 · páginas     │            │
    └────┬───┘ └────────┬─────────┘            │
         │              │                      │
         └──────────────┴──────────┬───────────┘
                                   ▼
                        ┌──────────────────────┐
                        │ P5 · SEO global,     │
                        │ a11y, README, deploy │
                        └──────────────────────┘
```

---

## 7. Convenciones de Git para el equipo

### Ramas

```
main                        ← protegida, sólo merge por PR
 └── feat/p1-base-shell
 └── feat/p2-form-lab-core
 └── feat/p3-form-theme
 └── feat/p4-pages
 └── feat/p5-satellites-seo
```

Ramas cortas por sub-tarea cuando la principal se hace larga:
`feat/p3-theme-pickers`, `fix/p4-nested-main`.

### Commits

Conventional Commits, **en inglés**, uno por unidad lógica pequeña.

```
feat:     nueva funcionalidad o migración de una pieza
fix:      corrección de bug (¡también va a BUGFIXES.md!)
perf:     optimización (next/image, next/font, lazy)
refactor: cambio interno sin cambio de comportamiento
docs:     documentación
test:     tests
chore:    infraestructura, configuración, dependencias
```

❌ Prohibidos: `cambios`, `avance`, `arreglos`, `commit final`, `wip`, `asdf`.

### Granularidad — regla práctica

```
┌────────────────────────────────────────────────────────┐
│  1 commit  ≈  1 archivo migrado y funcionando          │
│              o 1 grupo chico de archivos hermanos      │
│                                                        │
│  Si el mensaje necesita un "y" → son 2 commits         │
└────────────────────────────────────────────────────────┘
```

Meta del equipo: **≥ 60 commits** en total, repartidos parejo entre los 5.
Eso es lo que demuestra la trazabilidad que pide la consigna.

### Pull Requests

- Chicos y frecuentes: máximo ~400 líneas de diff por PR.
- Título con Conventional Commit.
- Descripción con: qué migra, qué bug corrige (si aplica), cómo probarlo.
- **1 aprobación mínima** de otro integrante antes de mergear.
- Antes de abrir PR: `pnpm run lint && pnpm run typecheck && pnpm run build && pnpm test`.

---

## 8. Reglas técnicas transversales (aplican a los 5)

### Server vs Client — el árbol de decisión

```
                ¿El archivo usa alguno de estos?
     useState · useEffect · useRef · useReducer · onClick · onChange
     localStorage · window · document · createPortal · zustand hook
                              │
              ┌───────────────┴───────────────┐
             SÍ                               NO
              │                                │
     "use client" en línea 1         dejarlo Server Component
                                     (no poner "use client"
                                      "por las dudas")
```

> La directiva se pone **lo más abajo posible en el árbol**: si una página sólo
> necesita interactividad en un botón, el botón es client y la página no.

### Checklist obligatorio por cada archivo migrado

```
[ ] ¿Necesita "use client"? (árbol de decisión de arriba)
[ ] ¿Imports de react-router-dom reemplazados por next/link y next/navigation?
[ ] ¿Algún <img> que deba ser next/image?
[ ] ¿Toca localStorage/window/document sin guard de SSR?
[ ] ¿Los <label> están asociados a su input? (htmlFor / id)
[ ] ¿Las imágenes tienen alt (o alt="" si son decorativas)?
[ ] pnpm run lint + typecheck en verde
```

### Checklist obligatorio por cada ruta migrada

```
[ ] export const metadata (o generateMetadata) con title + description propios
[ ] openGraph.title + openGraph.description
[ ] Un solo <h1> por página, jerarquía de headings sin saltos
[ ] Un solo <main> (el del root layout)
[ ] Navegación y recarga (F5) funcionan
[ ] La página se ve idéntica al original
```

---

## 9. Checklist de cierre del proyecto

Contra §12 de la consigna:

```
[ ] Proyecto funcional en Next.js 16 App Router + TypeScript
[ ] Las 6 rutas + 404 navegan y recargan igual que el original
[ ] Estado global (6 stores Zustand) funcionando con persistencia
[ ] metadata + Open Graph en las 6 rutas
[ ] sitemap.ts + robots.ts
[ ] next/image en los 6 <img> del original
[ ] next/font reemplazando el CDN de Google Fonts
[ ] Code-splitting por ruta verificado en el output de `next build`
[ ] Lazy loading de componentes pesados (ThemeDrawer, TemplateGallery)
[ ] BUGFIXES.md con los 7 bugs del original + los de migración
[ ] Auditoría de a11y pasada en las 6 rutas
[ ] README.md con los 10 puntos de la consigna §11
[ ] Repo público + PRs mergeados + historial granular
[ ] Deploy funcional en Vercel
```

---

## 10. Decisiones abiertas para charlar en el grupo

1. **React Compiler** — el original lo usa. En Next 16 se activa con
   `reactCompiler: true`, pero requiere Babel y **encarece el build**.
   ¿Lo activamos por paridad o lo dejamos afuera y lo documentamos?
2. **Funcionalidad extra (opcional, consigna §9)** — candidatos que respetan la
   identidad del original y aprovechan Next:
   - Compartir formularios con **URL corta vía Route Handler** en vez de base64 gigante.
   - `opengraph-image.tsx` dinámico por formulario.
   - Exportar el formulario a PDF.
   > Recordar: es opcional y **no puede rediseñar** el sitio ajeno.
3. **Nombres reales** — reemplazar `P1..P5` por los integrantes del grupo
   en la tabla de §5 antes de arrancar.
