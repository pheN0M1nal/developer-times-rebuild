"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Flashlight, FlashlightOff, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { nav, persona } from "@/content/site";
import { useTorch } from "@/components/providers/torch";
import { useMusic } from "@/components/providers/music";
import { Highlighter } from "@/components/ui/highlighter";
import { playSfx } from "@/lib/audio";
import { ThemeToggle, useThemeSwitch } from "./theme-toggle";

function VinylButton() {
  const { playing, loading, toggle } = useMusic();
  return (
    <button
      id="vinyl"
      type="button"
      onClick={toggle}
      className={cn(
        "cursor-pointer border border-foreground/20 rounded-full transition-all focus:outline-none ring-1 ring-primary",
        loading && "animate-pulse",
      )}
      aria-label={playing ? "Stop the music" : "Play music"}
      aria-pressed={playing}
      title={playing ? "Lift the needle" : "Drop the needle on some lounge jazz"}
    >
      <svg viewBox="0 0 122.88 122.88" className="text-foreground w-6 h-6" aria-hidden>
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: playing ? "disc-spin 2.2s linear infinite" : undefined,
          }}
        >
          <circle cx="61.44" cy="61.44" r="55" stroke="currentColor" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
          <path d="M61.44 24a37.44 37.44 0 0 1 37.44 37.44" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" vectorEffect="non-scaling-stroke" />
          <path d="M61.44 98.88A37.44 37.44 0 0 1 24 61.44" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" vectorEffect="non-scaling-stroke" />
          <circle cx="61.44" cy="61.44" r="10" fill="currentColor" opacity="0.8" />
        </g>
        <g
          className="transition-transform duration-700 ease-in-out"
          style={{ transformBox: "fill-box", transformOrigin: "top right", transform: `rotate(${playing ? -18 : -50}deg)`, opacity: 0.8 }}
        >
          <path d="M108 8 L84 66" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="84" cy="68" r="5" fill="currentColor" />
        </g>
      </svg>
    </button>
  );
}

function TorchButton() {
  const { torchEnabled, setTorchEnabled } = useTorch();
  const { resolvedTheme } = useTheme();
  const switchTheme = useThemeSwitch();
  const ref = useRef<HTMLButtonElement>(null);
  const icon = useRef<HTMLSpanElement>(null);

  // While off, the torch fidgets every few seconds to be noticed.
  useEffect(() => {
    if (torchEnabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: number;
    const schedule = () => {
      t = window.setTimeout(() => {
        icon.current?.animate(
          [
            { transform: "rotate(0deg) scale(1)", filter: "drop-shadow(0 0 0 rgba(255,240,200,0))" },
            { transform: "rotate(-14deg) scale(1.06)", offset: 0.2, filter: "drop-shadow(0 0 6px rgba(255,240,200,0.65))" },
            { transform: "rotate(10deg) scale(1.03)", offset: 0.4 },
            { transform: "rotate(-6deg) scale(1.015)", offset: 0.6 },
            { transform: "rotate(3deg) scale(1.005)", offset: 0.8 },
            { transform: "rotate(0deg) scale(1)", offset: 1, filter: "drop-shadow(0 0 0 rgba(255,240,200,0))" },
          ],
          { duration: 1200, easing: "cubic-bezier(0.19, 1, 0.22, 1)" },
        );
        schedule();
      }, 3000 + Math.floor(2000 * Math.random()));
    };
    schedule();
    return () => window.clearTimeout(t);
  }, [torchEnabled]);

  return (
    <button
      ref={ref}
      id="torch"
      type="button"
      onClick={() => {
        if (resolvedTheme !== "dark") switchTheme(ref.current, "dark");
        const next = !torchEnabled;
        setTorchEnabled(next);
        playSfx(next ? "switch-on" : "switch-off", 0.35);
      }}
      className="cursor-pointer p-2 text-foreground/80 hover:text-foreground transition-colors"
      aria-label="Use torch to uncover hidden secrets."
      aria-pressed={torchEnabled}
      title="Use torch to uncover hidden secrets."
    >
      <span ref={icon} className="block will-change-transform">
        {torchEnabled ? <Flashlight className="h-5 w-5 text-amber-300" /> : <FlashlightOff className="h-5 w-5" />}
      </span>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 sm:px-8",
          scrolled ? "bg-background/90 backdrop-blur-sm border-b border-foreground/10" : "bg-transparent",
        )}
      >
        <div className="max-w-5xl mx-auto py-4 flex items-center justify-between gap-4">
          <Link className="text-xl sm:text-2xl font-semibold text-foreground font-serif whitespace-nowrap" href="/">
            {persona.name}.
          </Link>
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10" aria-label="Sections">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-serif transition-colors text-foreground/70 hover:text-foreground hover:underline whitespace-nowrap"
              >
                {"highlight" in item && item.highlight && mounted ? (
                  <Highlighter action="highlight" color="#704214" padding={[2, 6]} iterations={2} animationDuration={900}>
                    <span className="text-background dark:text-foreground">{item.label}</span>
                  </Highlighter>
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <VinylButton />
            <TorchButton />
            <ThemeToggle />
            <button
              type="button"
              className="lg:hidden cursor-pointer p-2 text-foreground/80 hover:text-foreground transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
      <div data-header-spacer className="h-16 md:h-20" />
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-x-0 top-16 z-40 bg-background/97 backdrop-blur border-b border-foreground/15 shadow-lg"
            aria-label="Sections"
          >
            <ul className="max-w-5xl mx-auto px-6 py-6 grid gap-1">
              {nav.map((item, i) => (
                <li key={item.href} className="border-b border-dashed border-foreground/15 last:border-0">
                  <Link href={item.href} className="flex items-baseline gap-4 py-3 font-serif text-lg text-foreground/85 hover:text-foreground">
                    <span className="type-label text-muted-foreground w-8">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
