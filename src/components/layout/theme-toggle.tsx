"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/** Switch themes with a circular reveal that grows from the button. */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (from?: HTMLElement | null, to?: "light" | "dark") => {
    const next = to ?? (resolvedTheme === "dark" ? "light" : "dark");
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce || !from) {
      setTheme(next);
      return;
    }
    const t = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    t.ready.then(() => {
      const { top, left, width, height } = from.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const r = Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top));
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${r}px at ${cx}px ${cy}px)`] },
        { duration: 700, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };
}

export function ThemeToggle() {
  const { resolvedTheme } = useTheme();
  const switchTheme = useThemeSwitch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => switchTheme(e.currentTarget)}
      className="cursor-pointer p-2 text-foreground/80 hover:text-foreground transition-colors"
      aria-label={dark ? "Switch to the day edition" : "Switch to the night edition"}
      title={dark ? "Day edition" : "Night edition"}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
