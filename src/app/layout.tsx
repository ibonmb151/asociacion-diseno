import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";

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
      className="h-full antialiased"
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
