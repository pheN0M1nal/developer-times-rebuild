"use client";

import { useState } from "react";
import { records } from "@/content/records";
import { Surface, type SurfaceVariant } from "@/components/ui/surface";
import { seeded } from "@/lib/utils";
import { Disc, Sleeve } from "./disc";
import { Paperclip, Tape, WaxSeal } from "./fittings";

function Heading({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-20 mb-8 grid gap-x-6 gap-y-2 border-t border-[var(--ink-900)]/15 dark:border-white/10 pt-14 sm:grid-cols-[auto_auto_1fr] sm:items-baseline">
      <span className="font-typewriter text-xs text-[var(--rust)]">{n}</span>
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="max-w-2xl font-sans text-[0.98rem] leading-relaxed text-foreground/80">{children}</p>
    </div>
  );
}

const PALETTE: [string, [string, string][]][] = [
  ["Leather / shell", [["--void", "page ground"], ["--leather-900", "spine"], ["--leather-800", "cover"], ["--leather-700", "raised panel"]]],
  ["Paper", [["--parchment-100", "page highlight"], ["--parchment-200", "page body"], ["--parchment-300", "gutter shade"], ["--manila-400", "folder card"], ["--manila-500", "folder tab"]]],
  ["Ink", [["--ink-900", "body"], ["--ink-600", "secondary"], ["--ink-400", "metadata"], ["--ink-inv-900", "body, dark bg"], ["--ink-inv-600", "secondary, dark bg"]]],
  ["Accent", [["--gilt", "hairline rules"], ["--rust", "tab marks, labels"], ["--amber", "active glow"]]],
];

const RECIPE = [
  { label: "1 · Base fill", note: "A flat token colour. Unmistakably a div.", style: { "--surface-grain-opacity": 0, "--surface-mottle-opacity": 0, "--surface-burn-size": "0px" } },
  { label: "2 · + Fibre grain", note: "Tiled feTurbulence, overlay blend. Texture, but still flat.", style: { "--surface-mottle-opacity": 0, "--surface-burn-size": "0px" } },
  { label: "3 · + Mottling", note: "Oversized radial stains, multiply. This is the layer that does the work.", style: { "--surface-burn-size": "0px" } },
  { label: "4 · + Edge burn", note: "Inset shadow. Aged paper is always darkest at the perimeter.", style: {} },
  { label: "5 · + Lift", note: "Warm-tinted drop shadow and a sub-degree tilt. Now it's an object.", style: {}, lift: true },
] as const;

const VARIANTS: [SurfaceVariant, string][] = [
  ["parchment", "Journal page body"],
  ["parchment-light", "Inset panels, index cards"],
  ["manila", "Folder cards on the hub"],
  ["leather", "Book cover, sidebar rail"],
  ["void", "Page ground, locked slots"],
  ["index-card", "The property-of card"],
];

function seededClip(id: string) {
  const r = seeded(id);
  const pts: string[] = [];
  for (let i = 0; i <= 10; i++) pts.push(`${i * 10}% ${(r() * 3).toFixed(1)}%`);
  for (let i = 1; i <= 10; i++) pts.push(`${100 - r() * 2}% ${i * 10}%`);
  for (let i = 9; i >= 0; i--) pts.push(`${i * 10}% ${100 - r() * 3}%`);
  for (let i = 9; i >= 1; i--) pts.push(`${r() * 2}% ${i * 10}%`);
  return `polygon(${pts.join(",")})`;
}

export function TextureLab() {
  const [spin, setSpin] = useState(false);
  const [moving, setMoving] = useState(false);
  const r = records[0];

  return (
    <div data-surface="locker" className="mx-auto max-w-6xl px-4 sm:px-8 pb-16">
      <p className="type-label text-[0.62rem] text-[var(--rust)]">Increment 00 · not linked from navigation</p>
      <h1 className="mt-6 font-serif text-6xl">Texture Lab</h1>
      <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-foreground/85">
        Every surface, edge, fitting and curve the Evidence Locker is built from, on one page. Sign this off before any feature work — iterating on a
        swatch sheet is far cheaper than iterating on a finished spread.
      </p>
      <p className="mt-4 max-w-2xl font-sans leading-relaxed text-foreground/75">
        Grain is generated with <code className="font-mono text-sm">feTurbulence</code> data-URIs rather than bitmap tiles: zero bytes over the wire,
        seamless via <code className="font-mono text-sm">stitchTiles</code>, and each surface dials its own coarseness.
      </p>

      <Heading n="01" title="Palette">
        Scoped tokens so the newspaper theme is untouched. Two ink ramps — the hub prints light-on-black at night, the journal always prints
        dark-on-paper.
      </Heading>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PALETTE.map(([group, swatches]) => (
          <div key={group}>
            <p className="type-label text-[0.6rem] text-muted-foreground">{group}</p>
            <ul className="mt-4 space-y-3">
              {swatches.map(([token, use]) => (
                <li key={token} className="flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-[2px] border border-black/10" style={{ background: `var(${token})` }} />
                  <span>
                    <span className="block type-label text-[0.55rem] text-muted-foreground">{token}</span>
                    <span className="font-sans text-sm">{use}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Heading n="02" title="The surface recipe">
        Five layers, always in this order. The third is the one that decides whether this looks like paper or like a beige rectangle — grain alone
        never gets there.
      </Heading>
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {RECIPE.map((s, i) => (
          <div key={s.label}>
            <Surface id={`recipe-${i}`} variant="parchment" lift={"lift" in s ? "raised" : "none"} tilt={"lift" in s ? 1.2 : 0} className="aspect-[3/4]" style={s.style as React.CSSProperties} />
            <p className="mt-4 type-label text-[0.58rem] text-[var(--rust)]">{s.label}</p>
            <p className="mt-1 font-sans text-sm text-foreground/80">{s.note}</p>
          </div>
        ))}
      </div>

      <Heading n="03" title="Variants">
        Same recipe, different tokens. If a new panel needs bespoke CSS, the recipe is missing a variant.
      </Heading>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {VARIANTS.map(([v, use]) => (
          <div key={v}>
            <Surface id={`variant-${v}`} variant={v} lift="raised" tilt={1} className="aspect-[4/3]" contentClassName="h-full flex items-end p-5">
              <span className={v === "leather" ? "type-label text-[0.62rem] text-[#a29070]" : "type-label text-[0.62rem] text-[var(--ink-900)]"}>{v}</span>
            </Surface>
            <p className="mt-3 type-label text-[0.55rem] text-muted-foreground">{use}</p>
          </div>
        ))}
      </div>

      <Heading n="04" title="Edges">
        Straight border-radius reads as digital. The displacement filter is applied to the sheet only, never to a node containing text — otherwise the
        glyphs wobble too.
      </Heading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(["clean", "deckle", "torn"] as const).map((e) => (
          <div key={e}>
            <Surface id={`edge-${e}`} variant="parchment" edge={e} lift="soft" className="aspect-[4/3]" contentClassName="p-5">
              <span className="type-label text-[0.62rem] text-[var(--ink-900)]">{e}</span>
              <p className="mt-2 font-sans text-sm text-[var(--ink-900)]">Type stays crisp</p>
            </Surface>
            <p className="mt-3 font-sans text-sm text-foreground/80">
              {e === "clean" ? "Machine-trimmed. Cheapest — box-shadow lift." : e === "deckle" ? "Hand-made paper. 6px throw, drop-shadow follows the alpha." : "Ripped. 13px throw, coarser turbulence."}
            </p>
          </div>
        ))}
        <div>
          <div className="aspect-[4/3] drop-shadow-[0_8px_12px_#140c0466]">
            <Surface id="edge-clip" variant="parchment" lift="none" className="h-full" style={{ clipPath: seededClip("edge-clip") }} contentClassName="p-5">
              <span className="type-label text-[0.62rem] text-[var(--ink-900)]">seeded clip-path</span>
            </Surface>
          </div>
          <p className="mt-3 font-sans text-sm text-foreground/80">No filter at all — a seeded polygon. Cheapest ragged edge.</p>
        </div>
      </div>

      <Heading n="05" title="Seeded variation">
        Six cards, identical markup. Tilt, grain offset and stain placement all derive from hash(id) — so every card differs, and every card is
        identical on the server and after hydration. Math.random() at render time would mismatch.
      </Heading>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Surface key={n} id={`A-00${n}`} variant="index-card" lift="raised" tilt={2.5} className="aspect-[3/4]" contentClassName="p-3">
            <span className="type-label text-[0.6rem] text-[var(--ink-900)]">A-00{n}</span>
          </Surface>
        ))}
      </div>

      <Heading n="06" title="Ink">
        Two voices, kept strictly apart: typewriter for the hub, serif for the journal. Letterpress puts the highlight below the glyph, where light
        catches the lip of the impression.
      </Heading>
      <div className="grid gap-8 md:grid-cols-2">
        <Surface id="ink-hub" variant="leather" lift="raised" className="p-8">
          <p className="type-label text-[0.62rem] text-[#a29070]">type-label · Courier Prime</p>
          <p className="mt-4 font-worn text-3xl uppercase tracking-[0.12em] engraved">The Evidence Locker</p>
          <p className="mt-3 type-label text-[0.6rem] text-[#b1b1b1]">Access level: visitor</p>
          <p className="mt-6 type-label text-[0.55rem] text-[#868686]">.engraved — catch-light below, cut into the hide</p>
        </Surface>
        <Surface id="ink-journal" variant="parchment" lift="raised" className="p-8">
          <p className="type-label text-[0.62rem] text-[var(--ink-600)]">Audio Evidence #01</p>
          <p className="mt-3 font-serif text-3xl letterpress">{r.title}</p>
          <p className="type-label text-[0.6rem] text-[var(--ink-600)]">{r.artist}</p>
          <p className="mt-4 font-sans text-[var(--ink-900)]">{r.quote}</p>
          <p className="mt-4 font-caveat text-2xl text-[var(--rust)]">“{r.margin}”</p>
        </Surface>
      </div>

      <Heading n="07" title="Fittings">
        Tabs are trapezoids, not rounded rectangles. Hardware must overhang its host — tape that respects the box looks printed on.
      </Heading>
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <Surface id="fit-folder" variant="manila" lift="soft" className="relative p-4 pt-10 text-[var(--ink-900)]">
            <span className="folder-tab absolute -top-0 left-0 bg-[var(--manila-500)] px-4 py-1.5 pr-10 type-label text-[0.6rem]">Case Files</span>
            <p className="type-label text-[0.58rem]">001</p>
            <p className="mt-2 font-sans text-sm">Client work and shipped products.</p>
          </Surface>
          <p className="mt-3 type-label text-[0.55rem] text-muted-foreground">Folder tab · trapezoid clip-path</p>
        </div>
        <div>
          <div className="flex items-end">
            {["Overview", "Evidence", "Archive"].map((t, i) => (
              <span key={t} className={`chrome-tab px-5 py-2 type-label text-[0.58rem] ${i === 2 ? "bg-[var(--manila-400)] pb-3 text-[var(--ink-900)]" : "bg-[var(--panel-700)] text-[var(--ink-600)]"}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="h-12 bg-[var(--manila-400)]" />
          <p className="mt-3 type-label text-[0.55rem] text-muted-foreground">Chrome tab · the active one merges into the page</p>
        </div>
        <div className="relative">
          <Surface id="fit-tape" variant="parchment-light" lift="raised" tilt={2} className="h-28 p-4">
            <span className="type-label text-[0.6rem] text-[var(--ink-900)]">Exhibit 002</span>
          </Surface>
          <Tape className="-top-3 left-6 rotate-[-6deg]" />
          <Paperclip className="absolute -top-4 right-10 h-12 w-5" />
          <WaxSeal label="TEL" className="absolute -bottom-4 right-4 h-12 w-12" rotate={-10} />
          <p className="mt-6 type-label text-[0.55rem] text-muted-foreground">Tape overhangs · wax seal for locked slots</p>
        </div>
      </div>

      <Heading n="08" title="The disc & the player">
        Both built in CSS. Waveform peaks are precomputed at build time into the record&apos;s data — no runtime decodeAudioData. Grooves are static; only
        the conic sheen rotates. Spinning the grooves themselves strobes into a bullseye.
      </Heading>
      <div className="flex flex-wrap items-center gap-10">
        <div className="relative h-56 w-80">
          <Disc record={r} spinning={spin} className="absolute left-24 top-2 h-52 w-52" />
          <Sleeve record={r} className="absolute left-0 top-0 h-56 w-56" />
        </div>
        <button type="button" onClick={() => setSpin((s) => !s)} className="border border-foreground/40 px-4 py-2 type-label text-[0.62rem] cursor-pointer hover:bg-foreground/5">
          {spin ? "■ Stop" : "▶ Spin"}
        </button>
      </div>

      <Heading n="09" title="Motion">
        Heavy, damped, slightly reluctant. Nothing bounces, nothing is faster than 180ms, hover lifts are ≤4px. All of it collapses under
        prefers-reduced-motion.
      </Heading>
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          ["ease-paper", "460", "Pages, cards, anything with mass", "var(--ease-paper)", "var(--dur-page)"],
          ["ease-mechanism", "200", "Latches, tabs, switches", "var(--ease-mechanism)", "var(--dur-latch)"],
        ].map(([name, ms, use, ease, dur]) => (
          <div key={name} className="border border-foreground/15 p-5">
            <div className="h-12 relative">
              <span
                className="absolute top-1 h-10 w-10 rounded-[2px] bg-[var(--manila-400)] shadow"
                style={{ left: moving ? "calc(100% - 2.5rem)" : "0", transition: `left ${dur} ${ease}` }}
              />
            </div>
            <p className="mt-3 font-typewriter text-sm">
              {name} <span className="text-muted-foreground">· {ms}ms</span>
            </p>
            <p className="font-sans text-sm text-foreground/75">{use}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setMoving((m) => !m)} className="mt-4 border border-foreground/40 px-4 py-2 type-label text-[0.62rem] cursor-pointer hover:bg-foreground/5">
        ▶ Play both
      </button>
    </div>
  );
}
