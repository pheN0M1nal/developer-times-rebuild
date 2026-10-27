"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { allEvidenceTags, cases } from "@/content/cases";
import { cn } from "@/lib/utils";
import { CaseCard } from "./case-card";

/** Search and tag filter over the case files. `?tag=React` preselects a tag. */
export function Archive() {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    const t = params.get("tag");
    if (t && allEvidenceTags.includes(t)) setTag(t);
  }, [params]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter(
      (c) =>
        (!tag || c.evidence.includes(tag)) &&
        (!q || [c.title, c.description, c.summary, ...c.evidence].join(" ").toLowerCase().includes(q)),
    );
  }, [query, tag]);

  const chip = (active: boolean) =>
    cn(
      "px-3 py-1.5 border font-serif text-sm transition-colors cursor-pointer",
      active ? "bg-foreground/15 border-foreground/40 text-foreground" : "border-foreground/15 text-foreground/70 hover:border-foreground/40",
    );

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search cases</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cases..."
          className="w-full border border-foreground/30 bg-transparent py-2.5 pl-9 pr-3 font-serif text-sm shadow-[2px_2px_0_0_color-mix(in_oklab,var(--foreground)_12%,transparent)] focus:outline-none focus:border-foreground/70"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="toolbar" aria-label="Filter by evidence">
        <button type="button" className={chip(!tag)} onClick={() => setTag(null)} aria-pressed={!tag}>
          All Cases
        </button>
        {allEvidenceTags.map((t) => (
          <button key={t} type="button" className={chip(tag === t)} onClick={() => setTag(tag === t ? null : t)} aria-pressed={tag === t}>
            {t}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
              <CaseCard c={c} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && (
        <p className="mt-12 text-center font-serif italic text-muted-foreground">No file matches. The trail goes cold here.</p>
      )}
    </div>
  );
}
