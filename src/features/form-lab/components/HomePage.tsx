import Link from "next/link";
import {
  Plus,
  LayoutTemplate,
  Sparkles,
  Palette,
  ShieldCheck,
  MousePointerClick,
  Zap,
  ArrowRight,
  Layers,
  Eye,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { FormCountBadge } from "./FormCountBadge";
import { MyFormsCta } from "./MyFormsCta";
import { cn, cssVars } from "@/shared/lib/helpers";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Reglas combinables",
    description:
      "Agregá validaciones por campo: requerido, mínimo, máximo, email y regex. Combiná reglas para entender validación a fondo.",
    gradient: "from-cyan-500/20 to-sky-500/20",
    highlight: true,
  },
  {
    icon: MousePointerClick,
    title: "Respuesta en tiempo real",
    description:
      "Feedback inmediato mientras completás cada campo. Estados visuales claros: válido, inválido o pendiente.",
    gradient: "from-sky-500/20 to-cyan-500/20",
    highlight: false,
  },
  {
    icon: Palette,
    title: "Diseño totalmente libre",
    description:
      "Colores, fuentes, sombras, gradientes, imágenes y animaciones temáticas. Cada formulario tiene su propia personalidad.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    highlight: false,
  },
  {
    icon: Zap,
    title: "Experiencia inmersiva",
    description:
      "Desde un formulario de F1 con banderas a cuadros hasta una fiesta con confeti. El límite lo ponés vos.",
    gradient: "from-sky-500/20 to-indigo-500/20",
    highlight: false,
  },
] as const;

const SHOWCASE_STEPS = [
  {
    icon: Layers,
    step: "1",
    title: "Creá los campos",
    description: "Arrastrá, reordená y configurá cada campo con su tipo y placeholder.",
  },
  {
    icon: Palette,
    step: "2",
    title: "Personalizá el diseño",
    description: "Elegí colores, tipografías, sombras, gradientes y animaciones únicas.",
  },
  {
    icon: Eye,
    step: "3",
    title: "Previsualizá en vivo",
    description: "Mirá cómo queda tu formulario en tiempo real mientras lo editás.",
  },
] as const;

/**
 * Home como Server Component: todo el contenido indexable (hero, features,
 * pasos, CTAs) se renderiza en el servidor. Las dos únicas piezas que
 * dependen del store persistido (`FormCountBadge` y `MyFormsCta`) son
 * Client Components aislados — es la oportunidad de SEO más grande del
 * proyecto (ver docs/PLAN-MIGRACION.md §5 P4).
 *
 * B1: sin <main> propio — ya existe en el root layout.
 */
export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 hero-gradient">
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col items-start text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-xs font-medium text-primary animate-fade-in">
                <Sparkles size={14} />
                <span>Laboratorio de validación de formularios</span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-text sm:text-6xl lg:text-7xl animate-fade-up">
                Creá formularios con reglas, diseño y estilo propio.
              </h1>

              <p
                className="form-anim-stagger mb-10 max-w-xl text-lg text-text-muted sm:text-xl animate-fade-up"
                style={cssVars({ "--anim-delay": "100ms" })}
              >
                Diseñá formularios únicos con validación combinables, animaciones
                temáticas y una experiencia que destaca.
              </p>

              <div
                className="form-anim-stagger flex flex-col items-stretch gap-3 sm:flex-row animate-fade-up"
                style={cssVars({ "--anim-delay": "200ms" })}
              >
                <Button
                  asChild
                  size="lg"
                  className="min-w-[14rem] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                >
                  <Link href="/builder">
                    <Plus size={20} />
                    Crear formulario
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="min-w-[14rem]"
                >
                  <Link href="/templates">
                    <LayoutTemplate size={20} />
                    Explorar plantillas
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div
                className="form-anim-stagger mt-12 flex flex-wrap items-center gap-6 animate-fade-up"
                style={cssVars({ "--anim-delay": "300ms" })}
              >
                <FormCountBadge />
                <div className="h-8 w-px bg-border" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-text">15+</span>
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Plantillas</span>
                </div>
                <div className="h-8 w-px bg-border" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-text">8</span>
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Animaciones</span>
                </div>
              </div>
            </div>

            {/* Hero visual — subtle lab grid accent */}
            <div
              className="relative hidden animate-fade-up lg:block"
              style={cssVars({ "--anim-delay": "200ms" })}
              aria-hidden="true"
            >
              <div className="relative aspect-square max-w-md rounded-2xl border border-primary/10 bg-surface/50 p-6">
                <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="relative flex h-full flex-col justify-center gap-4">
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-background/80 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-text-muted">REGEX</div>
                      <div className="text-sm text-text">Campo validado</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-background/80 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MousePointerClick size={20} />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-text-muted">ESTADO</div>
                      <div className="text-sm text-text">Respuesta en vivo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-background/80 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Palette size={20} />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-text-muted">TEMA</div>
                      <div className="text-sm text-text">Estilo propio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-surface/30">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-text sm:text-4xl animate-fade-up">
              Herramientas del <span className="text-primary">laboratorio</span>
            </h2>
            <p className="form-anim-stagger mt-3 max-w-2xl text-lg text-text-muted animate-fade-up" style={cssVars({ "--anim-delay": "80ms" })}>
              Una caja de herramientas que va más allá de los creadores de formularios clásicos.
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className={cn(
                    "form-anim-stagger group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up",
                    feature.highlight && "sm:col-span-2 lg:col-span-1"
                  )}
                  style={cssVars({ "--anim-delay": `${(index + 2) * 80}ms` })}
                >
                  <Card className="h-full p-6">
                    <div className={cn("absolute inset-0 bg-gradient-to-br", feature.gradient, "opacity-0 transition-opacity group-hover:opacity-100")} />
                    <div className="relative">
                      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 font-semibold text-text">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-text sm:text-4xl">
              Protocolo de trabajo
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-text-muted">
              Tres pasos para armar formularios que no pasen desapercibidos.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {SHOWCASE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="form-anim-stagger relative flex flex-col items-start text-left animate-fade-up"
                  style={cssVars({ "--anim-delay": `${index * 100}ms` })}
                >
                  <div className="relative mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
                      <Icon size={28} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-lg shadow-primary/25">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector line */}
                  {index < SHOWCASE_STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-[calc(100%-1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="relative overflow-hidden p-10 text-center flex flex-col items-center">
            <div className="absolute inset-0 hero-gradient opacity-60" />
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold text-text sm:text-3xl">
                ¿Listo para tu próximo formulario?
              </h2>
              <p className="mt-3 text-text-muted max-w-md">
                Empezá ahora y diseñá formularios que dejen huella.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="shadow-lg shadow-primary/25 w-full sm:w-auto"
                >
                  <Link href="/builder">
                    <Plus size={18} />
                    Crear formulario
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <MyFormsCta />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
