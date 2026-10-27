"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Feather, GitCommitHorizontal } from "lucide-react";
import type { CaseFile } from "@/content/cases";
import type { Endorsement } from "@/content/endorsements";
import { useTorch } from "@/components/providers/torch";
import { TorchSecret } from "@/components/torch/torch-secret";
import { Modal } from "@/components/ui/modal";
import { Surface } from "@/components/ui/surface";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { playSfx } from "@/lib/audio";
import { cn, pad } from "@/lib/utils";
import { ExhibitMock } from "./exhibit-mock";
import { ClassifiedStamp } from "./case-card";

type Clues = { torch: boolean; print: boolean; ledger: boolean; lead: boolean };

function useClues(id: string) {
  const key = `case-clues:${id}`;
  const [clues, setClues] = useState<Clues>({ torch: false, print: false, ledger: false, lead: false });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setClues((c) => ({ ...c, ...JSON.parse(raw) }));
    } catch {}
  }, [key]);
  const mark = (k: keyof Clues) =>
    setClues((c) => {
      if (c[k]) return c;
      const next = { ...c, [k]: true };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  return [clues, mark] as const;
}

function ClueChip({ done, children, onClick }: { done: boolean; children: React.ReactNode; onClick?: () => void }) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1.5 font-typewriter text-[0.72rem] tracking-wide shadow-[1px_1px_0_0_color-mix(in_oklab,var(--foreground)_15%,transparent)]",
        done ? "border-foreground/40 text-foreground/50 line-through decoration-[var(--rust)]" : "border-foreground/30 text-foreground",
        onClick && "cursor-pointer hover:bg-foreground/5",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", done ? "bg-[var(--rust)]" : "bg-foreground/60")} />
      {children}
    </Tag>
  );
}

function Redacted({ children, reveal }: { children: string; reveal: boolean }) {
  return reveal ? (
    <span className="text-[var(--amber)]">{children}</span>
  ) : (
    <span className="bg-foreground/85 text-transparent select-none" aria-label="redacted">
      {"█".repeat(Math.max(6, children.length))}
    </span>
  );
}

export function Dossier({ c, testimonies }: { c: CaseFile; testimonies: Endorsement[] }) {
  const { torchEnabled } = useTorch();
  const [clues, mark] = useClues(c.id);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const read = useInView(summary, { once: true, amount: 0.8 });

  useEffect(() => {
    if (torchEnabled) mark("torch");
  }, [torchEnabled]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (read) mark("lead");
  }, [read]); // eslint-disable-line react-hooks/exhaustive-deps

  const print = async () => {
    if (!sheet.current) return;
    setPrinting(true);
    playSfx("flash", 0.4);
    try {
      const { toPng } = await import("html-to-image");
      await document.fonts.ready;
      const bg = getComputedStyle(document.body).backgroundColor;
      const url = await toPng(sheet.current, { pixelRatio: 2, backgroundColor: bg, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `case-${pad(Number(c.id))}-dossier.png`;
      a.click();
      mark("print");
    } finally {
      setPrinting(false);
    }
  };

  const visit = c.links[0];

  return (
    <>
      <div ref={sheet} className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] bg-background">
        <aside className="space-y-6 self-start md:sticky md:top-28">
          <figure className="border border-foreground/40 p-2">
            <div className="relative aspect-[4/3] overflow-hidden border border-foreground/10 text-foreground">
              <ExhibitMock kind={c.exhibit} className="h-full w-full sepia-[0.35] dark:sepia-0" />
              <div className="absolute inset-0 opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none" style={{ backgroundImage: "var(--tex-grain)" }} />
              <ClassifiedStamp />
            </div>
            <figcaption className="pt-2 text-center font-serif italic text-xs text-muted-foreground">Exhibit A — Photographic Evidence</figcaption>
          </figure>

          <div className="border border-foreground/40 p-5">
            <div className="text-center">
              <span className="inline-block border border-foreground/50 px-3 py-1 type-label text-[0.65rem]">Investigation Dossier</span>
            </div>
            <dl className="mt-4 divide-y divide-foreground/15 border-y border-foreground/15 font-serif text-sm">
              {[
                ["Case No.", pad(Number(c.id))],
                ["Filed", String(c.year)],
                ["Disposition", "Classified"],
                ["File Reference", "████████████"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-3">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="font-typewriter tracking-wider uppercase text-xs">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 overflow-hidden whitespace-nowrap type-label text-[0.55rem] text-[var(--rust)]">
              CONFIDENTIAL • INVESTIGATIVE MATERIAL • CONFIDENTIAL • INVESTIGATIVE MATERIAL
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-10">
          <header className="flex items-start justify-between gap-4 border-b border-foreground/20 pb-6">
            <div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl">{c.title}</h2>
              <p className="font-serif italic text-muted-foreground">{c.subtitle}</p>
            </div>
            {visit && (
              <a
                href={visit.url}
                target={visit.url.startsWith("/") ? undefined : "_blank"}
                rel="noreferrer"
                className="shrink-0 border border-foreground/40 px-3 py-1.5 font-typewriter text-xs uppercase tracking-wider shadow-[1px_1px_0_0_color-mix(in_oklab,var(--foreground)_20%,transparent)] hover:bg-foreground hover:text-background transition-colors"
              >
                Visit Case
              </a>
            )}
          </header>

          <section className="relative border border-foreground/25 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-foreground/15 pb-3">
              <h3 className="type-label tracking-[0.3em] text-foreground/75">Statement for the Record</h3>
              <span className="border border-foreground/60 px-2 py-0.5 type-label text-[0.6rem]">Summary</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <ClueChip done={clues.torch}>Clue #1: Truth hides in the dark — shine a torch to reveal it.</ClueChip>
              <ClueChip done={clues.print} onClick={print}>
                {printing ? "Developing the print…" : "Print this for the records"}
              </ClueChip>
              <ClueChip
                done={clues.ledger}
                onClick={() => {
                  setLedgerOpen(true);
                  mark("ledger");
                }}
              >
                Inspect the commit ledger
              </ClueChip>
              <ClueChip done={clues.lead}>{clues.lead ? "Lead noted: summary recorded" : "Lead pending: read the statement"}</ClueChip>
            </div>
            <div ref={summary} className="mt-6 border-l border-foreground/30 pl-6">
              <p className="drop-cap font-serif text-[1rem] leading-relaxed text-justify text-foreground">{c.summary}</p>
            </div>
            <p className="mt-6 flex items-center gap-3 type-label text-[0.6rem] text-muted-foreground before:h-px before:flex-1 before:bg-foreground/20 after:h-px after:flex-1 after:bg-foreground/20">
              — Lead Investigator · Filed Under: Digital Investigations
            </p>
            <TorchSecret id={`case-${c.id}`} hand={c.clue} style={{ right: "1rem", bottom: "-2.5rem" }} rotate={-3} />
          </section>

          <section
            className="border border-foreground/25"
            style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 27px, color-mix(in oklab, var(--foreground) 12%, transparent) 27px 28px)" }}
          >
            <div className="grid md:grid-cols-2 gap-x-8 px-6 pt-7 pb-6">
              {[
                ["Recorded Difficulties", c.obstacles],
                ["Remedial Actions", c.solutions],
              ].map(([title, items]) => (
                <div key={title as string}>
                  <h3 className="type-label tracking-[0.3em] text-foreground/75 leading-[28px]">{title as string}</h3>
                  <ul className="mt-[28px]">
                    {(items as string[]).map((t) => (
                      <li key={t} className="flex gap-3 font-serif text-[0.98rem] leading-[28px] text-foreground/90">
                        <span className="mt-[9px] h-2.5 w-2.5 shrink-0 border border-foreground/60" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-3 font-serif font-bold text-xl before:h-px before:w-4 before:bg-foreground">EVIDENCE DOCKET</h3>
            <h4 className="mt-5 font-serif font-bold text-sm">CATALOGUED EXHIBITS</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.evidence.map((t) => (
                <Link key={t} href={`/cases/?tag=${encodeURIComponent(t)}`} className="border border-foreground/30 bg-foreground/[0.04] px-3 py-1.5 font-typewriter text-xs uppercase tracking-wider hover:border-foreground/60">
                  {c.redacted.includes(t) ? <Redacted reveal={torchEnabled}>{t}</Redacted> : t}
                </Link>
              ))}
            </div>
            <h4 className="mt-7 font-serif font-bold text-sm">FINDINGS &amp; DETERMINATIONS</h4>
            <ul className="mt-3 space-y-2.5 font-serif text-[0.95rem] text-foreground/85">
              {c.results.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/50" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t-2 border-double border-foreground/20 pt-8">
            <h3 className="flex items-center gap-3 font-serif font-bold text-xl before:h-px before:w-4 before:bg-foreground">CASEFILE CHRONOLOGY</h3>
            <ol className="mt-5">
              {c.timeline.map((t) => (
                <li key={t.date + t.note} className="grid grid-cols-[7rem_1fr] border-b border-foreground/15 py-3">
                  <span className="font-typewriter text-xs tracking-[0.2em] text-foreground/70 border-r border-foreground/20 pr-3">{t.date}</span>
                  <span className="pl-4 font-serif text-[0.95rem] text-foreground/90">{t.note}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-t-2 border-double border-foreground/20 pt-8">
            <h3 className="flex items-center gap-3 font-serif font-bold text-xl before:h-px before:w-4 before:bg-foreground">SUPPLEMENTARY MATERIALS</h3>
            <div className="mt-5 grid gap-8 sm:grid-cols-[12rem_1fr]">
              <div>
                <h4 className="type-label text-[0.65rem] text-muted-foreground">Case References</h4>
                <ul className="mt-3 space-y-2">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.url} target={l.url.startsWith("/") ? undefined : "_blank"} rel="noreferrer" className="font-serif underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {testimonies.length > 0 && (
                <div>
                  <h4 className="type-label text-[0.65rem] text-muted-foreground">Testimonies</h4>
                  <ul className="mt-3 space-y-4">
                    {testimonies.map((t) => (
                      <li key={t.id}>
                        <Link href="/#endorsements" className="inline-flex items-center gap-2 font-serif underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground">
                          {t.name} <Feather className="h-3.5 w-3.5" />
                        </Link>
                        <p className="font-serif text-xs text-muted-foreground">{t.role}</p>
                        {t.link && (
                          <a href={t.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-serif text-xs text-muted-foreground underline decoration-dotted">
                            <LinkedinIcon className="h-3 w-3" /> LinkedIn
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Modal open={ledgerOpen} onClose={() => setLedgerOpen(false)} label="The commit ledger">
        <Surface id={`ledger-${c.id}`} variant="index-card" lift="deep" className="p-7 text-[var(--ink-900)]">
          <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Exhibit C · The Commit Ledger</p>
          <h3 className="mt-1 font-serif font-bold text-xl">{c.title}</h3>
          <ol className="mt-5 space-y-3 font-typewriter text-[0.78rem]">
            {c.commits.map((m) => (
              <li key={m.hash} className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-dashed border-[var(--ink-900)]/20 pb-2">
                <GitCommitHorizontal className="row-span-2 mt-0.5 h-4 w-4 text-[var(--rust)]" />
                <span>
                  <span className="text-[var(--rust)]">{m.hash}</span> <span className="text-[var(--ink-400)]">{m.date}</span>
                </span>
                <span>{m.message}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 font-serif italic text-xs text-[var(--ink-600)]">Hashes are illustrative. The real ledger is sealed.</p>
        </Surface>
      </Modal>
    </>
  );
}
