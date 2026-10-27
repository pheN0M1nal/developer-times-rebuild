"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Moment } from "@/content/lifestyle";
import { useTorch } from "@/components/providers/torch";
import { asset, cn } from "@/lib/utils";

const CATEGORIES = ["All", "Travels", "Streets", "Studio", "Kitchen"] as const;

export function Gallery({ moments }: { moments: Moment[] }) {
  const { torchEnabled } = useTorch();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = moments.filter((m) => filter === "All" || m.category === filter);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? null : (i + dir + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open !== null ? shown[open] : null;

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="toolbar" aria-label="Filter photographs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={cn(
              "type-label text-[0.62rem] px-3 py-1.5 border cursor-pointer transition-colors",
              filter === c ? "border-foreground bg-foreground text-background" : "border-foreground/25 hover:border-foreground/60",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((m, i) => (
            <motion.li key={m.src} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-md bg-foreground/5 shadow-[0_6px_18px_-10px_#140c048c] cursor-zoom-in text-left"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(m.src)}
                    alt={m.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover sepia-[0.25] dark:grayscale-50 transition-[filter,transform] duration-700 group-hover:sepia-0 group-hover:animate-ken-burns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <p className="font-serif font-semibold">{m.title}</p>
                    <p className="font-serif italic text-xs text-white/80">{m.caption}</p>
                  </div>
                  <span className="absolute left-2 top-2 font-typewriter text-[0.6rem] tracking-widest text-amber-200/80 [text-shadow:0_0_4px_#000]">
                    {String(m.frame).padStart(2, "0")}A ▸
                  </span>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <p className="mt-12 text-center type-label text-[0.6rem] text-muted-foreground">
        All images © {new Date().getFullYear()} · {torchEnabled ? "Fixed in chemical bath • Kodak Portra 400" : "Developed with Kodak Portra 400"} · generated, not photographed
      </p>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                key="lightbox"
                className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(null)}
                role="dialog"
                aria-modal="true"
                aria-label={current.title}
              >
                <motion.figure key={current.src} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(current.src)} alt={current.title} className="max-h-[78vh] w-auto rounded-sm border-[10px] border-[#f4eee0] shadow-2xl" />
                  <figcaption className="mt-3 text-center text-amber-100">
                    <span className="font-serif font-semibold">{current.title}</span> — <span className="font-serif italic text-sm">{current.caption}</span>
                  </figcaption>
                </motion.figure>
                <button type="button" onClick={() => setOpen(null)} className="absolute right-4 top-4 rounded-full bg-black/70 p-2 text-white hover:text-amber-200 cursor-pointer" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => step(-1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white hover:text-amber-200 cursor-pointer" aria-label="Previous image">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <div className="rounded-full border border-amber-900/20 bg-black/70 px-4 py-2 font-serif text-sm text-amber-100">
                    <span className="font-semibold">{(open ?? 0) + 1}</span> / {shown.length}
                  </div>
                  <button type="button" onClick={() => step(1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white hover:text-amber-200 cursor-pointer" aria-label="Next image">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
