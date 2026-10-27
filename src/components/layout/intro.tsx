"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GREETINGS = [
  { text: "Hello", font: "serif", dir: "ltr", lang: "en" },
  { text: "Bonjour", font: "serif", dir: "ltr", lang: "fr" },
  { text: "سلام", font: "arabic", dir: "rtl", lang: "ur" },
  { text: "Hola", font: "serif", dir: "ltr", lang: "es" },
  { text: "Namaste", font: "serif", dir: "ltr", lang: "hi-Latn" },
  { text: "Ciao", font: "serif", dir: "ltr", lang: "it" },
] as const;

/** Inline script: decide before first paint whether today's visit gets the intro. */
export const introGateScript = `(function(){try{var t=sessionStorage.getItem('intro_seen_at');if(!t||Date.now()-Number(t)>86400000)document.documentElement.setAttribute('data-intro','1');}catch(e){}})()`;

export function Intro() {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const saved = useRef(false);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-intro")) setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    document.documentElement.removeAttribute("data-intro");
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prev = { o: document.body.style.overflow, p: document.body.style.paddingRight };
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    return () => {
      document.body.style.overflow = prev.o;
      document.body.style.paddingRight = prev.p;
    };
  }, [active]);

  useEffect(() => {
    if (!active || leaving) return;
    if (index >= GREETINGS.length - 1) {
      if (!saved.current) {
        saved.current = true;
        try {
          sessionStorage.setItem("intro_seen_at", Date.now().toString());
        } catch {}
      }
      const t = setTimeout(() => setLeaving(true), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? 1000 : 520);
    return () => clearTimeout(t);
  }, [active, leaving, index]);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setActive(false), 900);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!active) return null;
  const g = GREETINGS[index];

  return (
    <motion.div
      data-intro-layer
      className="fixed inset-0 z-[200] grid place-items-center bg-background"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      onClick={() => setLeaving(true)}
      role="presentation"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 26% at 50% 50%, color-mix(in oklab, var(--foreground) 6%, transparent), transparent 70%)" }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={g.text}
          lang={g.lang}
          dir={g.dir}
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.22 }}
          className={cn(
            "text-6xl sm:text-8xl md:text-9xl text-foreground",
            g.font === "arabic" ? "font-arabic" : "font-serif",
          )}
        >
          {g.text}
        </motion.p>
      </AnimatePresence>
      <span className="absolute bottom-8 type-label text-muted-foreground">tap to skip</span>
    </motion.div>
  );
}
