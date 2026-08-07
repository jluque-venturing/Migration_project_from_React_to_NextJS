import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Providers } from "@/app/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://formforge-next.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "FormForge — Laboratorio de Validación de Formularios",
    template: "%s · FormForge",
  },
  description:
    "Diseñá formularios con reglas combinables, animaciones temáticas y previsualización en vivo.",
  openGraph: {
    type: "website",
    siteName: "FormForge",
    url: "/",
    title: "FormForge — Laboratorio de Validación de Formularios",
    description:
      "Armá formularios, validalos en vivo y compartilos con diseño propio.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FormForge — laboratorio de validación de formularios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FormForge — Laboratorio de Validación de Formularios",
    description:
      "Armá formularios, validalos en vivo y compartilos con diseño propio.",
  },
};

const antiFOUCScript = `
(function() {
  try {
    var stored = localStorage.getItem('form-lab-theme');
    if (stored) {
      var data = JSON.parse(stored);
      var mode = data && data.state && data.state.mode;
      if (mode === 'light') {
        document.documentElement.classList.add('light');
      }
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFOUCScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Saltar al contenido
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
