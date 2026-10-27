"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useTorch } from "@/components/providers/torch";

/**
 * The beam: five stacked radial gradients (a dark mask with a clear centre,
 * three warm screen-blended glows and a soft outer falloff) that follow the
 * pointer. Positions go straight into CSS variables inside rAF, so React
 * never re-renders on mouse move.
 */
export function TorchOverlay() {
  const { torchEnabled, isDesktop } = useTorch();
  const { resolvedTheme } = useTheme();
  const root = useRef<HTMLDivElement>(null);
  const on = torchEnabled && isDesktop && resolvedTheme === "dark";

  useEffect(() => {
    if (!on) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let frame = 0;
    const apply = () => {
      frame = 0;
      root.current?.style.setProperty("--tx", `${x}px`);
      root.current?.style.setProperty("--ty", `${y}px`);
    };
    const move = (e: MouseEvent | TouchEvent) => {
      const p = "touches" in e ? e.touches[0] : e;
      if (!p) return;
      x = p.clientX;
      y = p.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("touchmove", move, { passive: true });
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      cancelAnimationFrame(frame);
    };
  }, [on]);

  if (!on) return null;

  const at = "at var(--tx, 50vw) var(--ty, 50vh)";
  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle 400px ${at}, transparent 0%, transparent 20%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 85%, rgba(0,0,0,0.98) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle 300px ${at}, rgba(255,220,150,0.06) 0%, rgba(255,200,120,0.03) 60%, transparent 85%)`, mixBlendMode: "screen" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle 200px ${at}, rgba(255,235,190,0.1) 0%, rgba(255,220,160,0.06) 50%, rgba(255,200,130,0.02) 80%, transparent 90%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle 100px ${at}, rgba(255,250,220,0.15) 0%, rgba(255,245,200,0.1) 30%, rgba(255,235,180,0.05) 60%, transparent 80%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle 360px ${at}, transparent 0%, transparent 80%, rgba(0,0,0,0.1) 90%, rgba(0,0,0,0.3) 100%)` }}
      />
    </div>
  );
}
