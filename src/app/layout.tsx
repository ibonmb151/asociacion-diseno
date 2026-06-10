import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import { TransitionProvider } from "@/components/PageTransition";
import { CustomCursor } from "@/components/CustomCursor";
import { MenuOverlay } from "@/components/MenuOverlay";
import { SwipeNavigator } from "@/components/SwipeNavigator";

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
    "La comunidad de diseño de la Universidad de Deusto. Portfolio, charlas con profesionales, challenges y conexión con la industria.",
  keywords: [
    "diseño",
    "deusto",
    "portfolio",
    "estudiantes",
    "comunidad",
    "charlas",
    "challenges",
    "bilbao",
  ],
  authors: [{ name: "Deusto Design Association" }],
  openGraph: {
    title: "Deusto Design Association",
    description: "La comunidad de diseño de la Universidad de Deusto.",
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
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-bg font-body text-fg">
        <SessionProvider>
          <TransitionProvider>
            <SwipeNavigator />
            <Navbar />
            <main>{children}</main>
          </TransitionProvider>
          <MenuOverlay />
          <CustomCursor />
        </SessionProvider>
      </body>
    </html>
  );
}
