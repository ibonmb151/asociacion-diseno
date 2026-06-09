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
    template: "%s | Deusto Design Association",
    default: "Deusto Design Association",
  },
  description:
    "Comunidad de diseño de la Universidad de Deusto. Conectamos estudiantes, profesores y empresas para compartir conocimiento, organizar charlas, retos de diseño y construir el futuro del diseño.",
  keywords: [
    "diseño",
    "Deusto",
    "comunidad",
    "portfolio",
    "estudiantes",
    "empresas",
    "charlas",
    "retos",
    "foro",
    "networking",
  ],
  authors: [{ name: "Deusto Design Association" }],
  openGraph: {
    title: "Deusto Design Association",
    description:
      "Comunidad de diseño de la Universidad de Deusto. Charlas, retos, proyectos y conexión con la industria.",
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
