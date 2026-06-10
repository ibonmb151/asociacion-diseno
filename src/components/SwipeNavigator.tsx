"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePageNavigate } from "./PageTransition";

/*
  Swipe left  → next route
  Swipe right → previous route

  Works with touch (mobile) and mouse drag (desktop).
  Thresholds: min 80px horizontal travel, horizontal must dominate vertical.
*/

const ROUTES = [
  "/",
  "/dashboard",
  "/students",
  "/companies",
  "/proposals",
];

const MIN_DIST  = 80;   // px — minimum swipe distance
const RATIO     = 1.4;  // horizontal must be RATIO× the vertical

export function SwipeNavigator() {
  const pathname   = usePathname();
  const { navigate } = usePageNavigate();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let active = false;

    const onDown = (e: PointerEvent) => {
      // Ignore clicks on interactive elements (links, buttons, inputs)
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, select")) return;
      startX = e.clientX;
      startY = e.clientY;
      active = true;
    };

    const onUp = (e: PointerEvent) => {
      if (!active) return;
      active = false;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Must be horizontal-dominant and long enough
      if (Math.abs(dx) < MIN_DIST || Math.abs(dx) < Math.abs(dy) * RATIO) return;

      const base = pathname.split("?")[0]; // strip query params
      const idx  = ROUTES.indexOf(base);
      if (idx === -1) return;

      if (dx < 0 && idx < ROUTES.length - 1) navigate(ROUTES[idx + 1]); // → next
      if (dx > 0 && idx > 0)                 navigate(ROUTES[idx - 1]); // → prev
    };

    const onCancel = () => { active = false; };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup",   onUp);
    window.addEventListener("pointercancel", onCancel);

    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup",   onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [pathname, navigate]);

  return null;
}
