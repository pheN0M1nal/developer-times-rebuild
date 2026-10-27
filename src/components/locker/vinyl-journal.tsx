"use client";

import { useEffect, useRef, useState } from "react";
import { Flashlight, Footprints, Music2, Pause, Play } from "lucide-react";
import { records, type Record } from "@/content/records";
import { isUnlocked, type UnlockRule } from "@/lib/signals";
import { playPressing, type Pressing } from "@/lib/phonograph";
import { TorchSecret } from "@/components/torch/torch-secret";
import { cn, pad } from "@/lib/utils";
import { Disc, Sleeve } from "./disc";
import { WaxSeal } from "./fittings";
import { Journal, type Tab } from "./journal";
import { useSignals } from "./use-signals";

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function RuleIcon({ rule, className }: { rule: UnlockRule; className?: string }) {
  if (rule.kind === "visit") return <Footprints className={className} />;
  return <Flashlight className={className} />;
}

function Player({ record, peaks, onPlaying }: { record: Record; peaks: number[]; onPlaying: (v: boolean) => void }) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const pressing = useRef<Pressing | null>(null);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      setT(pressing.current?.elapsed() ?? 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(
    () => () => {
      pressing.current?.stop();
    },
    [record.id],
  );

  const stop = () => {
    pressing.current?.stop();
    pressing.current = null;
    setPlaying(false);
    onPlaying(false);
  };

  const toggle = () => {
    if (playing) return stop();
    setT(0);
    pressing.current = playPressing({
      seed: record.id,
      key: record.key,
      tempo: record.tempo,
      mood: record.mood,
      onEnd: () => {
        setPlaying(false);
        onPlaying(false);
        setT(0);
      },
    });
    setPlaying(true);
    onPlaying(true);
  };

  const progress = t / 20;
  return (
    <div className="mt-5 flex items-center gap-4 border-t border-[var(--ink-900)]/15 pt-4">
      <button
        type="button"
        onClick={toggle}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--ink-900)]/50 hover:bg-black/5 cursor-pointer"
        aria-label={playing ? "Lift the needle" : "Play the preview"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between type-label text-[0.55rem] text-[var(--ink-600)]">
          <span>Preview Recording</span>
          <span>
            {fmt(t)} / 0:20
          </span>
        </div>
        <div className="mt-1.5 flex h-9 items-center gap-[2px]" aria-hidden>
          {peaks.map((p, i) => (
            <span
              key={i}
              className="w-[2px] flex-1 rounded-full transition-colors"
              style={{ height: `${p * 100}%`, background: i / peaks.length < progress ? "var(--rust)" : "color-mix(in oklab, var(--ink-900) 55%, transparent)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function VinylJournal({ peaks }: { peaks: { [id: string]: number[] } }) {
  const signals = useSignals();
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("record");
  const [spinning, setSpinning] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = (r: Record) => mounted && isUnlocked(r.unlock, signals);
  const unlockedCount = records.filter(open).length;
  const sealed = records.filter((r) => !open(r));
  const r = records[index];
  const isOpen = open(r);

  const tabs: Tab[] = [
    { id: "record", label: "The Record" },
    { id: "notes", label: "Liner Notes" },
    { id: "wanted", label: "Wanted", dot: sealed.length > 0 },
  ];

  const sealedLeft = (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <WaxSeal label={pad(r.ord)} className="h-24 w-24" rotate={-8} />
      <p className="mt-6 font-serif text-2xl">Still sealed</p>
      <p className="mt-2 type-label text-[0.6rem] text-[var(--ink-600)]">Record {pad(r.ord)} · {r.unlock.kind === "default" ? "" : r.unlock.label}</p>
    </div>
  );
  const sealedRight = (
    <div>
      <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Vinyl Records — Wanted</p>
      <h3 className="mt-3 flex items-center gap-2 type-label text-[0.7rem]">
        <RuleIcon rule={r.unlock} className="h-3.5 w-3.5" /> How to unseal it
      </h3>
      <p className="mt-3 font-sans text-[1.05rem] leading-relaxed">{r.unlock.kind === "default" ? "" : r.unlock.hint}</p>
      <p className="mt-6 font-caveat text-2xl text-[var(--rust)] rotate-[-1.5deg]">the shelf remembers what you have done</p>
    </div>
  );

  let left: React.ReactNode;
  let right: React.ReactNode;

  if (tab === "wanted") {
    left = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Wanted — {sealed.length} still sealed</p>
        <ul className="mt-5 space-y-3">
          {records.map((x, i) => (
            <li key={x.id}>
              <button type="button" onClick={() => setIndex(i)} className="flex w-full items-center gap-3 text-left cursor-pointer">
                {open(x) ? <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--ink-900)]/40 text-xs">✓</span> : <WaxSeal label={pad(x.ord)} className="h-8 w-8" />}
                <span className={cn("font-serif", !open(x) && "text-[var(--ink-600)]")}>{open(x) ? x.title : `Record ${pad(x.ord)}`}</span>
                {!open(x) && <RuleIcon rule={x.unlock} className="ml-auto h-3.5 w-3.5 text-[var(--ink-600)]" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
    right = isOpen ? (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="font-serif text-2xl">{r.title}</p>
        <p className="mt-2 type-label text-[0.6rem] text-[var(--ink-600)]">Already on the shelf</p>
      </div>
    ) : (
      sealedRight
    );
  } else if (!isOpen) {
    left = sealedLeft;
    right = sealedRight;
  } else if (tab === "notes") {
    left = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Liner Notes</p>
        <h2 className="mt-3 font-serif text-3xl">{r.title}</h2>
        <dl className="mt-6 divide-y divide-[var(--ink-900)]/15 border-y border-[var(--ink-900)]/15 font-typewriter text-sm">
          {[
            ["Artist", r.artist],
            ["Label", r.label],
            ["Catalogue", r.catalog],
            ["Recorded", String(r.year)],
            ["Speed", "78 rpm · shellac"],
            ["Tempo", `${r.tempo} bpm`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <dt className="uppercase tracking-widest text-[0.65rem] text-[var(--ink-600)]">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
    right = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">In the margin</p>
        <p className="mt-4 font-caveat text-3xl leading-snug text-[var(--rust)] rotate-[-1deg]">{r.margin}</p>
        <blockquote className="mt-8 border-l-2 border-[var(--ink-900)]/30 pl-4 font-serif italic text-lg">“{r.quote}”</blockquote>
      </div>
    );
  } else {
    left = (
      <div className="text-center">
        <h2 className="font-serif text-3xl">{r.title}</h2>
        <p className="mt-1 type-label text-[0.62rem] text-[var(--ink-600)] tracking-[0.3em]">{r.artist}</p>
        <div className="relative mx-auto mt-5 h-48 w-[22rem] max-w-full">
          <div
            className="absolute top-2 h-44 w-44 transition-transform duration-700"
            style={{ left: "calc(50% - 4rem)", transform: spinning ? "translateX(3.5rem)" : "translateX(2rem)" }}
          >
            <Disc record={r} spinning={spinning} className="h-full w-full" />
          </div>
          <Sleeve record={r} className="absolute left-[calc(50%-11rem)] top-0 h-48 w-48" />
        </div>
        <p className="mt-5 font-serif italic text-lg leading-snug text-[var(--ink-600)]">{r.quote}</p>
        <Music2 className="mx-auto mt-2 h-4 w-4 text-[var(--ink-600)]" />
        <Player record={r} peaks={peaks[r.id]} onPlaying={setSpinning} />
        <p className="mt-3 type-label text-[0.55rem] text-[var(--ink-600)]">
          {r.label} · {r.catalog} · {r.year}
        </p>
      </div>
    );
    right = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Vinyl Records — Archive</p>
        <h3 className="mt-3 type-label text-[0.7rem] tracking-[0.25em]">♪ About the Artist</h3>
        <div className="mt-3">
          <div className="float-left mr-4 mb-2 grid h-20 w-20 place-items-center border border-[var(--ink-900)]/25 bg-[var(--parchment-300)]/40 text-center type-label text-[0.5rem] text-[var(--ink-600)]">
            No image
            <br />
            on file
          </div>
          <p className="font-sans text-[1.02rem] leading-relaxed">{r.about}</p>
        </div>
        <div className="clear-both my-5 gilt-rule text-xs">✒</div>
        <h3 className="type-label text-[0.7rem] tracking-[0.25em]">❏ Why this record is here</h3>
        <p className="mt-3 font-sans text-[1.02rem] leading-relaxed">{r.why}</p>
      </div>
    );
  }

  return (
    <Journal
      section="vinyl"
      tabs={tabs}
      tab={tab}
      onTab={setTab}
      meter={{ label: "Records Collected", value: unlockedCount, total: records.length }}
      spreadKey={`${tab}-${r.id}-${isOpen}`}
      left={left}
      right={
        <>
          {right}
          <TorchSecret id="margin-note" hand="the second side is the one that matters" style={{ right: "0.75rem", top: "-0.25rem" }} rotate={4} />
        </>
      }
      strip={{
        label: "Vinyl Collection",
        note: sealed.length > 0 && (
          <button type="button" onClick={() => setTab("wanted")} className="type-label text-[0.55rem] text-[var(--rust)] underline decoration-dotted cursor-pointer">
            {sealed.length} more to find
          </button>
        ),
        index,
        onSelect: (i) => setIndex(i),
        items: records.map((x) => ({
          key: x.id,
          label: open(x) ? x.title : `${pad(x.ord)}`,
          node: open(x) ? (
            <Sleeve record={x} small className="w-full" />
          ) : (
            <div className="relative grid aspect-square place-items-center bg-[var(--parchment-100)] shadow-inner">
              <span className="absolute inset-[12%] border border-dashed border-[var(--ink-900)]/20" />
              <WaxSeal label={pad(x.ord)} className="h-10 w-10" rotate={(x.ord * 37) % 20 - 10} />
              <RuleIcon rule={x.unlock} className="absolute bottom-1.5 left-1.5 h-3 w-3 text-[var(--ink-600)]" />
            </div>
          ),
        })),
      }}
    />
  );
}
