"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Disc3, Mail } from "lucide-react";
import { records } from "@/content/records";
import { postcards } from "@/content/postcards";
import { Surface } from "@/components/ui/surface";
import { pageTurn } from "@/lib/audio";
import { cn } from "@/lib/utils";

export type Tab = { id: string; label: string; dot?: boolean };

type Props = {
  section: "vinyl" | "postcards";
  tabs: Tab[];
  tab: string;
  onTab: (id: string) => void;
  meter: { label: string; value: number; total: number };
  spreadKey: string;
  left: React.ReactNode;
  right: React.ReactNode;
  strip: {
    label: string;
    note?: React.ReactNode;
    items: { key: string; node: React.ReactNode; label: string }[];
    index: number;
    onSelect: (i: number) => void;
  };
};

/** The journal: chrome tabs, an archive rail, a leather-bound spread and a strip of items. */
export function Journal({ section, tabs, tab, onTab, meter, spreadKey, left, right, strip }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      const ti = tabs.findIndex((x) => x.id === tab);
      if (e.key === "]") onTab(tabs[(ti + 1) % tabs.length].id);
      if (e.key === "[") onTab(tabs[(ti - 1 + tabs.length) % tabs.length].id);
      if (e.key === "ArrowRight") strip.onSelect(Math.min(strip.items.length - 1, strip.index + 1));
      if (e.key === "ArrowLeft") strip.onSelect(Math.max(0, strip.index - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tabs, tab, onTab, strip]);

  useEffect(() => {
    pageTurn();
  }, [spreadKey]);

  const pct = Math.round((meter.value / meter.total) * 100);

  return (
    <div data-surface="locker" className="mx-auto max-w-[1400px] px-4 sm:px-8 pb-10 text-[var(--ink-900)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl text-foreground">Journal</h1>
          <Link href="/locker/" className="inline-flex items-center gap-1.5 type-label text-[0.6rem] text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> The Evidence Locker
          </Link>
        </div>
        <div className="flex items-end overflow-x-auto max-w-full" role="tablist" aria-label="Journal sections">
          <button type="button" onClick={() => onTab(tabs[(tabs.findIndex((x) => x.id === tab) - 1 + tabs.length) % tabs.length].id)} className="mr-3 border border-[var(--ink-400)]/50 bg-[var(--panel-800)] px-2.5 py-1 font-typewriter text-xs shadow-[0_2px_0_#0003] cursor-pointer" aria-label="Previous section">
            [
          </button>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => onTab(t.id)}
              className={cn(
                "chrome-tab relative px-5 py-2 type-label text-[0.58rem] cursor-pointer whitespace-nowrap",
                tab === t.id ? "bg-[var(--manila-400)] text-[var(--ink-900)] pb-3 translate-y-[1px]" : "bg-[var(--panel-700)] text-[var(--ink-600)] dark:text-[var(--ink-inv-600)] hover:bg-[var(--panel-800)]",
              )}
            >
              {t.label}
              {t.dot && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--rust)] align-middle" />}
            </button>
          ))}
          <button type="button" onClick={() => onTab(tabs[(tabs.findIndex((x) => x.id === tab) + 1) % tabs.length].id)} className="ml-3 border border-[var(--ink-400)]/50 bg-[var(--panel-800)] px-2.5 py-1 font-typewriter text-xs shadow-[0_2px_0_#0003] cursor-pointer" aria-label="Next section">
            ]
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <aside className="space-y-5">
          <Surface id={`rail-${section}`} variant="index-card" lift="soft" className="p-3">
            <p className="text-center type-label text-[0.55rem] text-[var(--rust)]">—— The Archive ——</p>
            <nav className="mt-3 space-y-1" aria-label="Archive">
              <Link
                href="/locker/vinyl/"
                className={cn("flex items-center gap-2 px-2 py-1.5 type-label text-[0.58rem]", section === "vinyl" ? "bg-[var(--manila-400)] border border-[var(--ink-600)]/40" : "hover:bg-black/5")}
              >
                <Disc3 className="h-3.5 w-3.5" /> Vinyl Records <span className="ml-auto opacity-60">{records.length}</span>
              </Link>
              <Link
                href="/locker/postcards/"
                className={cn("flex items-center gap-2 px-2 py-1.5 type-label text-[0.58rem]", section === "postcards" ? "bg-[var(--manila-400)] border border-[var(--ink-600)]/40" : "hover:bg-black/5")}
              >
                <Mail className="h-3.5 w-3.5" /> Postcards <span className="ml-auto opacity-60">{postcards.length}</span>
              </Link>
            </nav>
          </Surface>
          <Surface id={`meter-${section}`} variant="index-card" lift="soft" className="p-4 text-center">
            <p className="type-label text-[0.55rem] text-[var(--ink-600)]">{meter.label}</p>
            <p className="mt-2 font-typewriter text-sm">
              {meter.value} / {meter.total}
            </p>
            <div className="mt-2 h-[3px] bg-[var(--ink-900)]/10">
              <div className="h-full bg-[var(--rust)] transition-[width] duration-700" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 type-label text-[0.55rem] text-[var(--ink-600)]">Completion {pct}%</p>
          </Surface>
        </aside>

        <div className="min-w-0">
          <Surface id={`cover-${section}`} variant="leather" lift="deep" className="relative p-3 sm:p-6">
            <span aria-hidden className="absolute -top-0 right-1 sm:right-1.5 z-10 h-[calc(100%+2.5rem)] w-3 bg-gradient-to-b from-[#8a2a18] to-[#6e1d10] shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_calc(100%-8px),0_100%)]" />
            <div className="relative grid md:grid-cols-2 spread">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`l-${spreadKey}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.32, ease: [0.22, 0.68, 0.28, 1] }}
                  className="min-w-0"
                >
                  <Surface id={`page-l-${spreadKey}`} variant="parchment" lift="none" foxed className="h-full min-h-[28rem] p-6 sm:p-8 md:rounded-l-sm">
                    {left}
                  </Surface>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`r-${spreadKey}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.32, delay: 0.05, ease: [0.22, 0.68, 0.28, 1] }}
                  className="min-w-0"
                >
                  <Surface id={`page-r-${spreadKey}`} variant="parchment" lift="none" className="relative h-full min-h-[28rem] p-6 sm:p-8 md:rounded-r-sm">
                    {right}
                  </Surface>
                </motion.div>
              </AnimatePresence>
            </div>
          </Surface>

          <Surface id={`strip-${section}`} variant="parchment-light" lift="soft" className="mt-0 border border-[var(--ink-400)]/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="type-label text-[0.62rem] text-[var(--rust)] tracking-[0.3em]">◂ {strip.label}</span>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline type-label text-[0.55rem] text-[var(--ink-600)]">[ ] turn sections · ← → walk the strip</span>
                {strip.note}
                <button type="button" onClick={() => strip.onSelect(Math.max(0, strip.index - 1))} className="border border-[var(--ink-400)]/40 bg-[var(--panel-800)] p-1.5 cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => strip.onSelect(Math.min(strip.items.length - 1, strip.index + 1))} className="border border-[var(--ink-400)]/40 bg-[var(--panel-800)] p-1.5 cursor-pointer" aria-label="Next">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {strip.items.map((it, i) => (
                <li key={it.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => strip.onSelect(i)}
                    aria-current={i === strip.index}
                    className={cn("w-28 p-1.5 text-left transition-colors cursor-pointer", i === strip.index ? "bg-[var(--parchment-100)] outline outline-1 outline-[var(--ink-600)]" : "hover:bg-black/5")}
                  >
                    {it.node}
                    <span className="mt-2 block truncate type-label text-[0.55rem]">{it.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </div>
    </div>
  );
}
