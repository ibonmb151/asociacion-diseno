"use client";

import { useEffect, useRef } from "react";

/*
  Custom cursor — plain 10px black circle, tracks mouse 1:1 via CSS transform.
  No spring, no lag. Native cursor hidden via globals.css on pointer devices.
*/

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let visible = false;

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      if (!visible) {
        dot.style.opacity = "1";
        visible = true;
      }
    };

    const onLeave = () => { dot.style.opacity = "0"; visible = false; };
    const onEnter = () => { dot.style.opacity = "1"; visible = true; };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "var(--fg)",
        pointerEvents: "none",
        zIndex: 99999,
        opacity: 0,
        willChange: "transform",
      }}
    />
  );
}
