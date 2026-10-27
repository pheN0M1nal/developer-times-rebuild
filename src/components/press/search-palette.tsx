"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { sortedArticles } from "@/content/press";
import { cases } from "@/content/cases";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type Entry = { kind: string; title: string; href: string; hint: string };

const ENTRIES: Entry[] = [
  ...sortedArticles.map((a) => ({ kind: "Dispatch", title: a.title, href: `/press/${a.slug}/`, hint: a.dek })),
  ...cases.map((c) => ({ kind: "Case", title: c.title, href: `/cases/${c.id}/`, hint: c.evidence.join(" · ") })),
  { kind: "Desk", title: "The Detective's Desk", href: "/desk/", hint: "invoices, pomodoro, wireless, turntable, darkroom, stationer" },
  { kind: "Locker", title: "The Evidence Locker", href: "/locker/", hint: "records, postcards, sealed drawers" },
];

/** A card-catalogue search, opened with the button or Ctrl/Cmd + K. */
export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      setTimeout(() => input.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ENTRIES.filter((e) => `${e.title} ${e.hint} ${e.kind}`.toLowerCase().includes(s)) : ENTRIES;
  }, [q]);

  const go = (e: Entry) => {
    setOpen(false);
    router.push(e.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-foreground/60 px-2 py-1 font-grotesk text-[0.65rem] uppercase tracking-widest hover:bg-foreground/5 cursor-pointer"
      >
        Search <kbd className="border border-foreground/30 px-1 text-[0.55rem] text-muted-foreground">Ctrl K</kbd>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label="Search the archive" className="max-w-lg">
        <div className="bg-background border border-foreground/30 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-foreground/20 px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setI(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") setI((v) => Math.min(v + 1, results.length - 1));
                if (e.key === "ArrowUp") setI((v) => Math.max(v - 1, 0));
                if (e.key === "Enter" && results[i]) go(results[i]);
              }}
              placeholder="Search dispatches, cases, the desk…"
              className="w-full bg-transparent py-3 pr-8 font-serif focus:outline-none"
            />
          </div>
          <ul className="max-h-80 overflow-y-auto py-2" role="listbox">
            {results.map((r, k) => (
              <li key={r.href} role="option" aria-selected={k === i}>
                <button
                  type="button"
                  onMouseEnter={() => setI(k)}
                  onClick={() => go(r)}
                  className={cn("w-full px-4 py-2.5 text-left cursor-pointer", k === i && "bg-foreground/[0.07]")}
                >
                  <span className="type-label text-[0.55rem] text-muted-foreground">{r.kind}</span>
                  <span className="block font-serif font-semibold">{r.title}</span>
                  <span className="block truncate font-serif italic text-xs text-muted-foreground">{r.hint}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="px-4 py-6 text-center font-serif italic text-muted-foreground">Nothing on file.</li>}
          </ul>
        </div>
      </Modal>
    </>
  );
}
