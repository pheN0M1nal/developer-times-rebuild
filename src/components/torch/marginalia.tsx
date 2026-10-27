"use client";

import { cn } from "@/lib/utils";
import { useTorch } from "@/components/providers/torch";

// "Invisible ink" notes: hidden until the torch is lit, then they glow like
// UV ink inside the beam.
const HUES = {
  teal: { fg: "rgb(94, 234, 212)", glow: "0 0 4px rgba(94, 234, 212, 0.85), 0 0 10px rgba(56, 189, 248, 0.55), 0 0 18px rgba(34, 211, 238, 0.35)" },
  blue: { fg: "rgb(125, 211, 252)", glow: "0 0 4px rgba(125, 211, 252, 0.85), 0 0 10px rgba(96, 165, 250, 0.55), 0 0 18px rgba(59, 130, 246, 0.35)" },
  violet: { fg: "rgb(196, 181, 253)", glow: "0 0 4px rgba(196, 181, 253, 0.85), 0 0 10px rgba(167, 139, 250, 0.55), 0 0 18px rgba(139, 92, 246, 0.35)" },
};

type Props = {
  children: React.ReactNode;
  at: React.CSSProperties;
  rotate?: number;
  font?: "hand" | "mono" | "serif";
  size?: string;
  hue?: keyof typeof HUES;
  className?: string;
};

export function Marginalia({ children, at, rotate = 0, font = "hand", size = "text-sm", hue = "teal", className }: Props) {
  const { torchEnabled } = useTorch();
  const { fg, glow } = HUES[hue];
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none select-none absolute z-[1] leading-tight whitespace-nowrap transition-opacity duration-700 ease-out hidden md:inline",
        size,
        font === "hand" ? "font-hand" : font === "mono" ? "font-mono" : "font-serif",
        torchEnabled ? "opacity-90" : "opacity-0",
        className,
      )}
      style={{
        ...at,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        color: fg,
        textShadow: torchEnabled ? glow : "none",
        filter: torchEnabled ? "blur(0.2px)" : "none",
      }}
    >
      {children}
    </span>
  );
}

/** A small cluster of margin notes, written once per section. */
export function MarginNotes({ notes }: { notes: Props[] }) {
  return (
    <>
      {notes.map((n, i) => (
        <Marginalia key={i} {...n} />
      ))}
    </>
  );
}
