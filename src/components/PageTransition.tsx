"use client";

import { useRef, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

/* ── Public context so other components can trigger transitions ── */
interface TransitionCtx { navigate: (href: string) => void }
const TransitionContext = createContext<TransitionCtx>({ navigate: () => {} });
export const usePageNavigate = () => useContext(TransitionContext);

/*
  Two alternating page transitions (matching reference video):

  TYPE A  — Slide UP
    overlay starts below screen  →  slides up covering page  →  navigate
    →  continues up revealing new page (vertical wipe, bottom → top)

  TYPE B  — Slide RIGHT→LEFT
    overlay starts right of screen  →  slides left covering page  →  navigate
    →  continues left revealing new page (horizontal wipe, right → left)

  Counter alternates A / B / A / B …
*/

const DUR  = 0.48;                         // seconds per half
const EASE = [0.76, 0, 0.24, 1] as const; // fast start, soft finish

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const controls = useAnimation();
  const busy     = useRef(false);
  const counter  = useRef(0);              // even = A, odd = B

  const run = useCallback(
    async (href: string) => {
      const isA = counter.current % 2 === 0;
      counter.current += 1;

      if (isA) {
        /* ── TYPE A: vertical wipe ─────────────────────── */
        controls.set({ x: "0%", y: "102%" });                // snap below
        await controls.start({
          y: "0%",
          transition: { duration: DUR, ease: EASE },
        });
        router.push(href);
        await new Promise((r) => setTimeout(r, 80));         // let new page render
        await controls.start({
          y: "-102%",
          transition: { duration: DUR, ease: EASE },
        });
        controls.set({ y: "102%", x: "0%" });                // reset for next A
      } else {
        /* ── TYPE B: horizontal wipe ───────────────────── */
        controls.set({ x: "102%", y: "0%" });                // snap right
        await controls.start({
          x: "0%",
          transition: { duration: DUR, ease: EASE },
        });
        router.push(href);
        await new Promise((r) => setTimeout(r, 80));
        await controls.start({
          x: "-102%",
          transition: { duration: DUR, ease: EASE },
        });
        controls.set({ x: "0%", y: "102%" });                // reset
      }

      busy.current = false;
    },
    [controls, router]
  );

  // ── Global click interception ─────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Block clicks while animating
      if (busy.current) {
        const a = (e.target as HTMLElement).closest("a[href]");
        if (a) e.preventDefault();
        return;
      }

      const anchor = (e.target as HTMLElement).closest(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.includes(":") ||
        href === pathname
      )
        return;

      e.preventDefault();
      busy.current = true;
      run(href);
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [pathname, run]);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current || href === pathname) return;
      busy.current = true;
      run(href);
    },
    [busy, pathname, run]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Overlay — lives off-screen (below) until a transition fires */}
      <motion.div
        className="fixed inset-0 z-[9999] pointer-events-none"
        initial={{ y: "102%" }}
        animate={controls}
        style={{ backgroundColor: "var(--fg)" }} /* #111 */
      />
    </TransitionContext.Provider>
  );
}
