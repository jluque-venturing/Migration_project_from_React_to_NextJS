# FormForge

FormForge es un laboratorio de validación de formularios pensado para crear, probar, tematizar y compartir formularios sin backend.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form + Zod
- Vitest

## Estructura principal

```text
src/
├── app/                  # rutas, layout, metadata, SEO y providers
├── components/
│   └── shell/            # Header, Navigation, Footer
├── features/
│   ├── collections/      # agrupación de formularios por colecciones
│   ├── command-palette/  # atajo Cmd/Ctrl + K
│   ├── error-pages/      # fallback de errores y 404
│   ├── form-lab/         # núcleo del builder, validación y formularios
│   ├── form-theme/       # diseño visual y presets del formulario
│   ├── notifications/    # toasts y feedback
│   ├── onboarding/       # tour guiado de uso
│   ├── settings/         # tema claro/oscuro/sistema
│   └── ...
├── shared/
│   ├── components/
│   ├── hooks/
│   └── lib/
└── ...
```

## Flujo principal

1. Creás o editás un formulario desde el constructor.
2. Definís campos, validaciones y reglas de negocio.
3. Previsualizás el resultado en tiempo real.
4. Tematizás la apariencia del formulario.
5. Guardás, compartís o exportás el formulario.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
```

## Nota de migración

El proyecto se migró desde una SPA React + Vite hacia Next.js 16 respetando la identidad visual original y los patrones de UX del producto. La migración priorizó mantener la funcionalidad del laboratorio, la experiencia del usuario y la compatibilidad con App Router.
