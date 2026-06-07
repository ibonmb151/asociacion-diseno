import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Design Association Hub",
    default: "Design Association Hub",
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
  authors: [{ name: "Design Association Hub" }],
  openGraph: {
    title: "Design Association Hub",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
