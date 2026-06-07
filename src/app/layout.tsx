import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Asociación de Diseño",
    default: "Asociación de Diseño",
  },
  description:
    "Plataforma que conecta estudiantes de diseño con empresas. Crea tu portfolio, participa en el foro, y encuentra oportunidades profesionales.",
  keywords: [
    "diseño",
    "portfolio",
    "estudiantes",
    "empresas",
    "comunidad",
    "foro",
    "networking",
  ],
  authors: [{ name: "Asociación de Diseño" }],
  openGraph: {
    title: "Asociación de Diseño",
    description:
      "Plataforma que conecta estudiantes de diseño con empresas.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-body text-fg selection:bg-accent-light">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
