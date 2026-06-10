"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

/*
  MENU tab — fixed right side, vertically centered.
  Text rotated 90°. mix-blend-mode: difference → always contrasts.
  Hover → panel slides in from the right.
*/

const NAV_LINKS = [
  { href: "/",          label: "Inicio" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students",  label: "Estudiantes" },
  { href: "/companies", label: "Empresas" },
  { href: "/proposals", label: "Propuestas" },
];

const SOCIAL_LINKS = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Twitter" },
  { href: "#", label: "Behance" },
];

export function MenuOverlay() {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { data: session }     = useSession();
  const pathname              = usePathname();

  const links = (session ? NAV_LINKS : NAV_LINKS.filter((l) => l.href === "/"))
    .filter((l) => l.href !== pathname);

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[10001] flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ── Panel (slides in from right, behind the tab) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="flex flex-col justify-center px-12 py-14"
            style={{
              backgroundColor: "var(--fg)",
              minWidth: "min(420px, 45vw)",
              minHeight: "min(520px, 60vh)",
            }}
          >
            {/* Nav links */}
            <nav className="flex flex-col gap-0">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.06 + i * 0.055 } }}
                  exit={{ opacity: 0 }}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block font-heading leading-none py-1"
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                      color: "#ffffff",
                      fontStyle: hovered === i ? "italic" : "normal",
                      opacity: hovered !== null && hovered !== i ? 0.2 : 1,
                      transition: "opacity 0.18s, font-style 0.1s",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }} />

            {/* Social */}
            <div className="flex flex-col gap-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-[0.65rem] font-semibold uppercase tracking-widest transition-opacity"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MENU tab ── */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 8px",
          background: "white",
          mixBlendMode: "difference",
          writingMode: "vertical-rl",
          userSelect: "none",
        }}
      >
        <span
          style={{
            color: "black",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            transform: "rotate(180deg)",
          }}
        >
          Menu
        </span>
      </div>
    </div>
  );
}
