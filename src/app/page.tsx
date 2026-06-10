"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, MessageSquare, Briefcase, Users, Zap } from "lucide-react";
import { TrianglePanels } from "@/components/TrianglePanels";

const panels = [
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: <FolderOpen className="h-10 w-10" />,
    description: "Proyectos",
  },
  {
    label: "Foro",
    href: "/forum",
    icon: <MessageSquare className="h-10 w-10" />,
    description: "Comunidad",
  },
  {
    label: "Challenges",
    href: "/proposals",
    icon: <Zap className="h-10 w-10" />,
    description: "Retos",
  },
  {
    label: "Empresas",
    href: "/companies",
    icon: <Briefcase className="h-10 w-10" />,
    description: "Industria",
  },
  {
    label: "Estudiantes",
    href: "/students",
    icon: <Users className="h-10 w-10" />,
    description: "Red",
    offsetX: 24,
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const unauthenticated = status !== "loading" && !session;

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Triangle panels — full viewport */}
      <TrianglePanels links={panels} />

      {/* Auth CTA — only when not logged in */}
      <AnimatePresence>
        {unauthenticated && (
          <motion.div
            key="auth-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="pointer-events-none absolute inset-0 flex items-end justify-center"
            style={{ paddingBottom: "clamp(2rem, 6vh, 4rem)" }}
          >
            <div
              className="pointer-events-auto flex items-center gap-3"
            >
              {/* Login */}
              <Link
                href="/auth/login"
                className="flex items-center gap-2 border px-6 py-3 text-sm font-medium transition-all"
                style={{
                  background: "white",
                  color: "#111",
                  borderColor: "white",
                  mixBlendMode: "normal",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#111";
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.borderColor = "#111";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "white";
                  (e.currentTarget as HTMLElement).style.color = "#111";
                  (e.currentTarget as HTMLElement).style.borderColor = "white";
                }}
              >
                Iniciar sesión
              </Link>

              {/* Register */}
              <Link
                href="/auth/register"
                className="flex items-center gap-2 border px-6 py-3 text-sm font-medium transition-all"
                style={{
                  background: "var(--accent)",
                  color: "white",
                  borderColor: "var(--accent)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "white";
                  (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLElement).style.borderColor = "white";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                }}
              >
                Crear cuenta →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
