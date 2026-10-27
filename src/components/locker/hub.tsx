"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { records } from "@/content/records";
import { isUnlocked } from "@/lib/signals";
import { Surface } from "@/components/ui/surface";
import { TorchSecret } from "@/components/torch/torch-secret";
import { asset, cn, pad } from "@/lib/utils";
import { Paperclip, Tape, WaxSeal } from "./fittings";
import { useSignals } from "./use-signals";

type Drawer = { n: number; tab: string; text: string; cta: string; href?: string; image: string; sealed?: boolean };

export function LockerHub() {
  const signals = useSignals();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const found = mounted ? records.filter((r) => isUnlocked(r.unlock, signals)).length : 0;
  // The archive drawer opens once both journals have been read.
  const archiveOpen = mounted && ["/locker/vinyl", "/locker/postcards"].every((p) => signals.paths.includes(p));

  const drawers: Drawer[] = [
    { n: 1, tab: "Case Files", text: "Client work and shipped products. Each case is an investigation waiting to be read.", cta: "Open files", href: "/cases/", image: "/images/scenes/venetian-blinds-thumb.jpg" },
    { n: 2, tab: "Exhibits", text: "Photography and visual inspiration. Fragments of places, people, and moments.", cta: "View exhibits", href: "/lifestyle/", image: "/images/scenes/harbour-dusk-thumb.jpg" },
    { n: 3, tab: "Audio Evidence", text: `Records recovered from various sources, catalogued and annotated. ${found} of ${records.length} unsealed. Press play with caution.`, cta: "Listen", href: "/locker/vinyl/", image: "/images/scenes/lantern-market-thumb.jpg" },
    { n: 4, tab: "Incident Reports", text: "Written dispatches, engineering notes, and other documented observations.", cta: "Read reports", href: "/press/", image: "/images/scenes/desk-lamp-thumb.jpg" },
    {
      n: 5,
      tab: "Archive",
      text: archiveOpen ? "Postcards from six towns, and the route between them. The last one is unsigned." : "Everything, sorted by date or tag. Sealed until both journals have been read.",
      cta: archiveOpen ? "Open the album" : "Sealed",
      href: archiveOpen ? "/locker/postcards/" : undefined,
      image: "/images/scenes/railway-thumb.jpg",
      sealed: !archiveOpen,
    },
    { n: 6, tab: "About the Archivist", text: "Who's behind the locker? Why it exists. And what it all means.", cta: "Read profile", href: "/#front-page", image: "/images/scenes/city-night-thumb.jpg" },
  ];

  return (
    <div data-surface="locker" className="mx-auto max-w-[1400px] px-4 sm:px-8 pb-10">
      <Surface id="locker-ground" variant="void" lift="none" className="border border-[var(--ink-400)]/20 dark:border-white/10 p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="relative text-[var(--ink-900)] dark:text-[var(--ink-inv-900)]">
            <h1 className="font-worn text-5xl leading-[1.05] tracking-[0.12em] uppercase">
              The
              <br />
              Evidence
              <br />
              Locker
            </h1>
            <p className="mt-8 type-label text-[0.62rem]">
              Access level: <span className="text-[var(--rust)] dark:text-[#d66643]">Visitor</span>
            </p>
            <p className="mt-4 type-label text-[0.62rem] leading-relaxed text-[var(--ink-600)] dark:text-[var(--ink-inv-600)]">Recovered materials currently in storage.</p>
            <hr className="my-8 border-[var(--ink-900)]/20 dark:border-white/15" />
            <div className="relative mx-auto w-48 rotate-[-2deg]">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-[3deg]" />
              <div className="bg-[#efe3c4] p-2.5 pb-8 shadow-[0_14px_28px_-12px_#000000aa]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/images/scenes/rain-street-thumb.jpg")} alt="A street at night, taped to the locker wall" className="aspect-[3/4] w-full object-cover sepia-[0.4]" />
                <p className="absolute bottom-2 left-0 right-0 text-center font-caveat text-lg text-[var(--ink-900)]">the night it started</p>
              </div>
            </div>
            <div className="relative h-24">
              <TorchSecret id="locker-note" hand="crate 8 · the one with no label" style={{ left: "1rem", top: "1.5rem" }} rotate={-5} />
            </div>
            <p className="type-label text-[0.62rem] text-[var(--rust)] dark:text-[#d66643]">Archivist’s note:</p>
            <div className="mt-4 space-y-4 type-label text-[0.62rem] leading-[1.9] text-[var(--ink-600)] dark:text-[var(--ink-inv-600)]">
              <p>Some people collect photographs. Some collect records. I collect evidence that stories happened.</p>
              <p>This locker exists somewhere between a personal archive, a crime scene, and a notebook left open at three in the morning.</p>
              <p>Nothing here is arranged by importance. Only by discovery.</p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="relative mt-4 ml-2">
                <Paperclip className="absolute -left-3 -top-4 h-12 w-5 rotate-[-6deg] z-10" />
                <Surface id="catalog-label" variant="parchment-light" lift="raised" tilt={1.5} className="px-6 py-3">
                  <span className="type-label text-[0.7rem] tracking-[0.3em] text-[var(--ink-900)]">Catalog Overview</span>
                </Surface>
              </div>
              <Surface id="property-card" variant="index-card" lift="raised" tilt={2} className="px-5 py-4 text-[var(--ink-900)]">
                <p className="type-label text-[0.58rem] leading-relaxed">
                  Property of
                  <br />
                  The Evidence Locker
                </p>
                <p className="mt-2 type-label text-[0.55rem] text-[var(--ink-600)]">Est. 06.26.26</p>
                <p className="mt-1 text-right type-label text-[0.55rem] text-[var(--rust)]">002726</p>
              </Surface>
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {drawers.map((d) => {
                const body = (
                  <Surface id={`drawer-${d.n}`} variant="manila" lift="soft" className={cn("group h-full p-4 text-[var(--ink-900)]", d.href && "transition-transform duration-300 hover:-translate-y-1")}>
                    <p className="type-label text-[0.58rem]">{pad(d.n)}</p>
                    <div className="relative mt-2 aspect-[16/10] overflow-hidden bg-[#140d08]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(d.image)} alt="" className={cn("h-full w-full object-cover sepia-[0.5] opacity-80 transition duration-500 group-hover:opacity-100 group-hover:sepia-[0.2]", d.sealed && "blur-[2px] grayscale")} loading="lazy" />
                      <Paperclip className="absolute right-6 -top-2 h-12 w-5" />
                      <span className="folder-tab absolute bottom-0 left-0 bg-[var(--manila-500)] px-4 py-2 pr-10 type-label text-[0.62rem] tracking-[0.3em] text-[var(--ink-900)]">{d.tab}</span>
                    </div>
                    <p className="mt-4 min-h-[4.5rem] type-label text-[0.6rem] leading-[1.9] text-[var(--ink-900)]/85">{d.text}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={cn("inline-flex items-center gap-1 type-label text-[0.6rem]", d.sealed ? "text-[var(--rust)]" : "text-[var(--rust)] group-hover:underline")}>
                        {d.sealed ? `Sealed — ${pad(d.n)}` : d.cta} {!d.sealed && <ChevronRight className="h-3 w-3" />}
                      </span>
                      {d.sealed && <WaxSeal label={pad(d.n)} className="h-9 w-9" rotate={-12} />}
                    </div>
                  </Surface>
                );
                return <li key={d.n}>{d.href ? <Link href={d.href}>{body}</Link> : <div aria-disabled>{body}</div>}</li>;
              })}
            </ul>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--ink-900)]/20 dark:border-white/15 pt-5 type-label text-[0.58rem] text-[var(--ink-600)] dark:text-[var(--ink-inv-600)]">
              <span>All material is recovered. Nothing is invented.</span>
              <span>Handle with curiosity.</span>
              <span className="font-pen text-2xl normal-case tracking-normal text-[var(--rust)] dark:text-[#d66643]">T.E.L</span>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
