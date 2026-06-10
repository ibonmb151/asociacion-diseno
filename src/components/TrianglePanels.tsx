"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CUT = 72;

interface PanelLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  offsetX?: number; // extra horizontal nudge in px
}

export function TrianglePanels({ links }: { links: PanelLink[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const n = links.length;

  const getGrow = (i: number) =>
    hovered === null ? 1 : hovered === i ? 1.6 : 0.85;

  const isActive = (i: number) => hovered === i;

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {links.map((link, i) => {
        const isEven = i % 2 === 0;
        const active = isActive(i);

        return (
          <motion.div
            key={link.label}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            animate={{ flexGrow: getGrow(i) }}
            transition={{ type: "spring", stiffness: 220, damping: 32 }}
            className="relative flex flex-col items-center justify-center select-none cursor-pointer"
            style={{
              flexBasis: 0,
              flexShrink: 1,
              marginLeft: i > 0 ? `-${CUT}px` : 0,
              zIndex: hovered === i ? n + 1 : n - i,
              clipPath: isEven
                ? `polygon(0 0, 100% 0, calc(100% - ${CUT}px) 100%, 0 100%)`
                : `polygon(${CUT}px 0, 100% 0, 100% 100%, 0 100%)`,
              backgroundColor: active
                ? "var(--accent)"
                : isEven
                ? "var(--fg)"
                : "var(--surface)",
              transition: "background-color 0.3s ease",
              color: active || isEven ? "var(--bg)" : "var(--fg)",
            }}
          >
            <Link
              href={link.href}
              className="flex flex-col items-center gap-5 px-2 text-center w-full h-full justify-center"
              style={{
                transform: `translateX(${(isEven ? -(CUT / 4) : CUT / 4) + (link.offsetX ?? 0)}px)`,
                color: "inherit",
              }}
            >
              {/* Icon wrapper */}
              <motion.div
                animate={{ scale: active ? 1.2 : 1, opacity: active ? 1 : 0.4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {link.icon}
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{ opacity: active ? 1 : 0.85 }}
                transition={{ duration: 0.2 }}
                className="font-heading text-2xl font-normal leading-tight tracking-tight"
              >
                {link.label}
              </motion.span>

              {/* Description */}
              {link.description && (
                <motion.span
                  animate={{ opacity: active ? 0.7 : 0.25 }}
                  transition={{ duration: 0.2 }}
                  className="text-[0.62rem] font-medium uppercase tracking-[0.15em]"
                >
                  {link.description}
                </motion.span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
