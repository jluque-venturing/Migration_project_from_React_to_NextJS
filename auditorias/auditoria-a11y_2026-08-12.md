═══════════════════════════════════════════
♿ MAESTRO DE SEMÁNTICA Y A11Y — FormForge (Next.js 16)
═══════════════════════════════════════════
Fecha: 2026-08-12 · Alcance: `src/` completo — semántica, headings, landmarks,
labels, ARIA, contraste, dependencia del color, estados y teclado.

📂 Archivos leídos: 60 `.tsx` / `.ts` + `src/app/globals.css`

---

## ─── CLASIFICACIÓN POR ARCHIVO ───

| Archivo | Estado |
|---|---|
| `src/app/globals.css` | 🔴 contraste en modo claro |
| `src/components/shell/Nav.tsx` | 🔴 estado activo solo por color |
| `src/components/shell/Footer.tsx` | 🔴 contraste + salto de heading |
| `src/components/shell/Header.tsx` | 🟡 `<nav>` sin nombre |
| `src/shared/components/ui/EmptyState.tsx` | 🟡 nivel de heading fijo |
| `src/shared/components/ui/Modal.tsx` | 🟡 nivel de heading |
| `src/features/form-lab/components/HomePage.tsx` | 🟢 |
| `src/features/form-lab/components/FormPreviewPage.tsx` | 🟢 |
| `src/features/form-lab/components/FieldStatusBadge.tsx` | 🟢 |
| `src/features/form-lab/components/ActiveErrorsSummary.tsx` | 🟢 |
| `src/app/layout.tsx` · `not-found.tsx` · `loading.tsx` | 🟢 |
| `src/features/notifications/**` | 🟢 |
| Resto (`form-theme`, `collections`, `command-palette`, `onboarding`) | 🟢 |

---

## 🔴 ARCHIVOS CON ERRORES

### `src/app/globals.css`

- **🔴 — `--color-primary` no alcanza el contraste mínimo en modo claro** (`globals.css:31`)
  - **Qué pasa:** el token `--color-primary: #06b6d4` es idéntico en modo oscuro y
    en modo claro. Sobre el fondo claro (`#f8fafc`) da **2.32:1**, muy por debajo
    del 4.5:1 que exige WCAG 2.1 AA para texto normal. En oscuro está bien (7.89:1).
    La clase `text-primary` aparece **56 veces** en 26 archivos: enlaces del footer,
    acentos de títulos, el "404", el badge del contador, los estados activos de la
    navegación. Es la deuda de accesibilidad más extendida del proyecto.
  - **Ratios medidos:**
    ```
    modo oscuro  #06b6d4 sobre #0a0f1a ....... 7.89:1  ✔
    modo claro   #06b6d4 sobre #f8fafc ....... 2.32:1  ✘ (necesita 4.5:1)
    ```
  - **Principio:** I (contraste, revisando ambos temas) · L (contraste legible)
  - **Cómo lo corregiría:** separar el color de **marca** del color de **texto**.
    El de marca puede seguir siendo el cyan brillante en fondos oscuros o rellenos;
    el de texto necesita una variante oscura solo en modo claro:
    ```css
    .light {
      /* #06b6d4 sobre fondo claro da 2.32:1 — no cumple AA.
         #0e7490 da 5.12:1 manteniendo la identidad cyan. */
      --color-primary: #0e7490;
      --color-primary-dark: #155e75;
    }
    ```
    Alternativas medidas: `#0e7490` → 5.12:1 · `#155e75` → 6.95:1 ·
    `#0891b2` → 3.52:1 (**sigue sin alcanzar**).
    ⚠️ Cambiar el token afecta también `bg-primary`; ahí el texto es blanco y el
    contraste **mejora**, así que no rompe nada. Conviene verificarlo a ojo en
    modo claro después del cambio.

### `src/components/shell/Nav.tsx`

- **🔴 — La página actual se indica únicamente con color** (`Nav.tsx:24-27, 49-52`)
  - **Qué pasa:** el enlace activo se distingue con `text-primary bg-primary/10` y
    nada más. Un lector de pantalla no tiene forma de saber en qué página está, y
    una persona con baja visión o daltonismo tampoco. Es exactamente el punto
    "no depender solo del color" de la consigna §8.
  - **Principio:** G (estados ARIA) · I/L (no solo color)
  - **Cómo lo corregiría:** agregar el estado nativo de ARIA, que además es el que
    los lectores anuncian como "página actual":
    ```tsx
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(..., isActive && "text-primary bg-primary/10")}
    >
    ```
    Y para reforzarlo visualmente sin depender del color, el proyecto **ya tiene**
    la clase `.nav-link-active` en `globals.css:737` (subraya con un `::after`),
    pero no la usa nadie. Aplicarla al enlace activo resuelve las dos mitades.

- **🟡 — El badge del contador no dice qué cuenta** (`Nav.tsx:56-60`)
  - **Qué pasa:** el enlace se anuncia como "Mis formularios 3". El "3" queda
    suelto, sin unidad.
  - **Principio:** C (ícono/número como única etiqueta)
  - **Cómo lo corregiría:**
    ```tsx
    <span className="...">
      {formCount}
      <span className="sr-only"> formularios guardados</span>
    </span>
    ```

- **🟡 — Íconos decorativos sin `aria-hidden`** (`Nav.tsx:54, 71`)
  - **Qué pasa:** `<FolderOpen>` y `<Search>` acompañan texto y son decorativos,
    pero no llevan `aria-hidden`. El resto del proyecto sí lo pone
    (p. ej. `FormBuilderPage.tsx:303`), así que es una inconsistencia.
  - **Principio:** C
  - **Cómo lo corregiría:** `<FolderOpen size={14} aria-hidden="true" />`

### `src/components/shell/Footer.tsx`

- **🔴 — Texto legal e info del stack por debajo del contraste mínimo**
  (`Footer.tsx:55, 58`)
  - **Qué pasa:** `text-text-muted/60` aplica 60 % de opacidad sobre un color que
    ya es apagado, en texto de 12 px (no cuenta como "texto grande").
  - **Ratios medidos:**
    ```
    modo oscuro  #5e697a sobre #0c121c ....... 3.38:1  ✘
    modo claro   #a0aab8 sobre #fafbfc ....... 2.27:1  ✘
    ```
  - **Principio:** I · L
  - **Cómo lo corregiría:** quitar el modificador de opacidad. `text-text-muted`
    a secas da 7.47:1 en oscuro y 4.55:1 en claro, ambos aprobados:
    ```tsx
    <p className="text-xs text-text-muted">© 2026 FormForge…</p>
    <div className="flex items-center gap-4 text-xs text-text-muted">
    ```

- **🔴 — El eslogan tampoco alcanza en modo claro** (`Footer.tsx:48`)
  - **Qué pasa:** `text-primary/80` sobre el fondo del footer da **2.01:1** en modo
    claro. Se arrastra el problema del token más la opacidad.
  - **Cómo lo corregiría:** quitar el `/80` y aplicar además la corrección del
    token de `globals.css`. Con `#0e7490` al 100 % queda en ~5:1.

- **🟡 — Salto de nivel de encabezado** (`Footer.tsx:26, 44`)
  - **Qué pasa:** el footer arranca en `<h3>` sin que exista un `<h2>` en esa
    región. La jerarquía de la página salta h1 → h3.
  - **Principio:** B
  - **Cómo lo corregiría:** subirlos a `<h2>`. El `<h1>` es el título de la página,
    así que las secciones del footer son de segundo nivel.

---

## 🟡 ARCHIVOS MEJORABLES

### `src/components/shell/Header.tsx`

- **🟡 — El `<nav>` principal no tiene nombre accesible** (`Header.tsx:8`)
  - **Qué pasa:** hay dos landmarks `<nav>` en cada página. El del footer sí está
    nombrado (`aria-label="Navegación secundaria"`); el del header no. Cuando hay
    más de un landmark del mismo tipo, cada uno debe distinguirse — si no, el
    listado de regiones del lector muestra dos "navigation" idénticos.
  - **Principio:** A
  - **Cómo lo corregiría:** `<nav aria-label="Navegación principal" className="…">`

### `src/shared/components/ui/EmptyState.tsx`

- **🟡 — Nivel de encabezado fijo en `<h3>`** (`EmptyState.tsx:48`)
  - **Qué pasa:** el componente se reutiliza en `MyFormsPage`, `FieldList` y
    `TemplateGalleryPage`, que tienen distinta profundidad de encabezados. En
    algunos contextos produce un salto de nivel.
  - **Principio:** B (encabezados por estructura, no por tamaño)
  - **Cómo lo corregiría:** hacerlo configurable, manteniendo el default actual:
    ```tsx
    interface EmptyStateProps {
      headingLevel?: 2 | 3 | 4;
    }
    const Heading = `h${headingLevel ?? 3}` as const;
    …
    <Heading className={cn("font-semibold text-text mb-1", cls.heading)}>{title}</Heading>
    ```

### `src/shared/components/ui/Modal.tsx`

- **🟡 — Título del diálogo en `<h3>`** (`Modal.tsx:120`)
  - **Qué pasa:** dentro de un `<dialog>` modal el contenido es autónomo, pero el
    árbol de encabezados de la página sigue siendo uno solo. `<h3>` sin `<h2>`
    previo genera un salto.
  - **Principio:** B
  - **Cómo lo corregiría:** `<h2 id="modal-title">`. El `aria-labelledby` que ya
    existe sigue funcionando igual.

---

## 🟢 ARCHIVOS SIN HALLAZGOS

`app/layout.tsx` · `app/loading.tsx` · `app/not-found.tsx` · `app/error.tsx` ·
`app/providers.tsx` · las 6 `page.tsx` · `HomePage.tsx` · `FormPreviewPage.tsx` ·
`MyFormsPage.tsx` · `SharePage.tsx` · `TemplateGalleryPage.tsx` · `FormCard.tsx` ·
`FormBuilderPage.tsx` · `FieldItem.tsx` · `FieldList.tsx` · `RuleEditor.tsx` ·
`FieldStatusBadge.tsx` · `ActiveErrorsSummary.tsx` · `FormStatsCard.tsx` ·
`FormTagsInput.tsx` · `ImportFormModal.tsx` · `JsonPreviewModal.tsx` ·
`notifications/**` · `form-theme/**` · `collections/**` ·
`command-palette/**` · `onboarding/**` · `settings/**`

**Prácticas correctas que conviene no romper:**

```
✔ skip link funcional ................ layout.tsx:67 + globals.css:805
✔ :focus-visible global con outline .. globals.css:799  (nunca outline:none suelto)
✔ prefers-reduced-motion ............. globals.css:786
✔ <html lang="es"> ................... layout.tsx:59
✔ un solo <main> ..................... layout.tsx:72  (bug B1 corregido)
✔ toasts con role="status" + aria-live ToastItem.tsx:26-27
✔ aria-invalid + aria-describedby .... FormPreviewPage.tsx:303-306
✔ errores de campo con role="alert" .. NewCollectionModal.tsx:111
✔ estados de validación con TEXTO .... FieldStatusBadge — "Válido"/"Inválido"/
                                       "Pendiente", no solo color
✔ <dialog> nativo .................... foco, Esc y modalidad gratis; sin ARIA
                                       redundante (Regla #1 bien aplicada)
✔ labels asociadas con htmlFor/id .... FieldItem.tsx:70,89,116 · NewCollectionModal:94
✔ sr-only en spinners ................ loading.tsx · builder/page.tsx · share/page.tsx
✔ íconos decorativos con aria-hidden . mayoría de los componentes
```

---

## 📊 RESUMEN

```
Archivos:   🟢 54   ·   🔴 3   ·   🟡 3
Hallazgos:  🔴 5    ·   🟡 6
```

**Mínimos a11y (bloque L / consigna §8):**

```
✅ Imágenes con alt (o alt="" decorativas)
❌ Contraste legible entre texto y fondo  ← falla en MODO CLARO
✅ Formularios con labels asociadas
✅ Botones y enlaces identificables
✅ Navegación clara
❌ No depender solo del color             ← estado activo de la navegación
✅ Estados de error o éxito visibles en pantalla
```

**TOP HALLAZGOS (corregir primero):**

1. **`--color-primary` en modo claro (2.32:1).** Un cambio de token en
   `globals.css` arregla 56 usos de golpe. Es el de mayor impacto y el más barato.
2. **`aria-current="page"` en la navegación.** Dos líneas, y cierra el único
   incumplimiento de "no depender solo del color". La clase `.nav-link-active` ya
   existe sin usarse.
3. **Opacidades del footer (`/60` y `/80`).** Quitar los modificadores; cuatro
   líneas.

Los tres juntos son ~15 líneas de cambio y dejan los 7 mínimos de la consigna en
verde.

**Nota de verificación:** los ratios se calcularon con la fórmula de luminancia
relativa de WCAG 2.1 sobre los tokens declarados en `globals.css`. Las mezclas con
opacidad (`/60`, `/80`) se estimaron componiendo sobre el fondo efectivo. Conviene
confirmarlos en el navegador con las DevTools o WebAIM una vez aplicados los
cambios, sobre todo los del footer, donde el fondo real es `bg-surface/30` sobre
`--color-background`.
