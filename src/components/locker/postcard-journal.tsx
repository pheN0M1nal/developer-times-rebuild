"use client";

import { useState } from "react";
import { postcards, type Postcard } from "@/content/postcards";
import { PostageStamp } from "@/components/home/correspondence";
import { asset, cn } from "@/lib/utils";
import { Journal, type Tab } from "./journal";

export function PostcardFront({ p, small = false, className }: { p: Postcard; small?: boolean; className?: string }) {
  return (
    <div className={cn("relative aspect-[3/2] overflow-hidden bg-[#2a2016]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(p.image)} alt="" className="absolute inset-0 h-full w-full object-cover sepia-[0.55] contrast-[1.05]" loading="lazy" />
      <div className="absolute inset-0 mix-blend-color opacity-60" style={{ background: p.tint }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      <div className="absolute inset-x-0 bottom-[10%] text-center text-[#f6ead2] [text-shadow:0_2px_0_#3a2414,0_0_12px_#000a]">
        {!small && <div className="font-pen text-2xl sm:text-3xl -mb-2">Greetings from</div>}
        <div className={cn("font-serif font-black uppercase leading-[0.9]", small ? "text-sm" : "text-4xl sm:text-5xl")}>{p.city}</div>
        {!small && <div className="mt-2 type-label text-[0.55rem] tracking-[0.35em]">{p.region}</div>}
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: string }) {
  return <span aria-hidden className={cn("absolute h-7 w-7 bg-[#2b2118]", pos)} />;
}

function Postmark({ text, className }: { text: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="60" cy="60" r="44" fill="none" stroke="#5c4a31" strokeWidth="3" opacity="0.65" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="#5c4a31" strokeWidth="1.2" opacity="0.6" />
      <text x="60" y="56" textAnchor="middle" fontSize="9" fill="#5c4a31" opacity="0.75" fontFamily="var(--font-typewriter)">
        KESTREL BAY
      </text>
      <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#5c4a31" opacity="0.75" fontFamily="var(--font-typewriter)">
        {text}
      </text>
    </svg>
  );
}

function RouteMap({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const pts = postcards.map((p) => p.route);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x * 4} ${p.y * 3}`).join(" ");
  return (
    <svg viewBox="0 0 400 300" className="w-full" role="img" aria-label="The route between the postcards">
      <rect x="2" y="2" width="396" height="296" fill="none" stroke="#5c4a31" strokeOpacity="0.3" />
      <path d="M0 240 C 80 220, 120 260, 200 236 S 330 210, 400 226" fill="none" stroke="#5c4a31" strokeOpacity="0.25" strokeWidth="10" />
      <path d={d} fill="none" stroke="#923719" strokeWidth="1.6" strokeDasharray="5 4" />
      {pts.map((p, i) => (
        <g key={postcards[i].id} onClick={() => onPick(i)} className="cursor-pointer">
          <circle cx={p.x * 4} cy={p.y * 3} r={i === active ? 7 : 4.5} fill={i === active ? "#923719" : "#f0deb7"} stroke="#2c2216" strokeWidth="1.4" />
          <text x={p.x * 4 + (p.x > 80 ? -10 : 10)} y={p.y * 3 - 9} textAnchor={p.x > 80 ? "end" : "start"} fontSize="10" fill="#2c2216" fontFamily="var(--font-typewriter)">
            {postcards[i].city}
          </text>
        </g>
      ))}
      <text x="390" y="290" textAnchor="end" fontSize="8" fill="#5c4a31" fontFamily="var(--font-typewriter)">
        NOT TO SCALE · ROUTE AS POSTED
      </text>
    </svg>
  );
}

export function PostcardJournal() {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("album");
  const p = postcards[index];

  const tabs: Tab[] = [
    { id: "album", label: "The Album" },
    { id: "postmark", label: "Postmark" },
    { id: "route", label: "The Route" },
    { id: "overview", label: "Overview" },
  ];

  let left: React.ReactNode;
  let right: React.ReactNode;

  const back = (
    <div className="relative border border-[var(--ink-900)]/25 bg-[var(--parchment-100)]/60 p-5 shadow-[0_8px_20px_-12px_#140c04aa]">
      <div className="absolute right-4 top-4 flex items-start">
        <Postmark text={p.postmark} className="-mr-6 mt-3 h-20 w-20" />
        <PostageStamp className="w-14 rotate-[4deg]" />
      </div>
      <p className="type-label text-sm tracking-[0.4em]">Post Card</p>
      <p className="font-typewriter text-[0.55rem] text-[var(--ink-600)] uppercase">
        {p.publisher} · {p.year}
      </p>
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-4">
        <div className="border-r border-[var(--ink-900)]/20 pr-4">
          <p className="font-caveat text-xl leading-snug">{p.message}</p>
          <p className="mt-2 font-caveat text-lg">— {p.signed}</p>
        </div>
        <div className="w-36 space-y-4 pt-10 font-caveat text-lg">
          {["The Editorial Board", "The Developer Times", "Letters Column"].map((l) => (
            <p key={l} className="border-b border-[var(--ink-900)]/25">
              {l}
            </p>
          ))}
        </div>
      </div>
      <p className="mt-4 font-typewriter text-[0.5rem] uppercase tracking-wider text-[var(--ink-600)]">
        {p.id} · {p.process}
      </p>
    </div>
  );

  if (tab === "album") {
    left = (
      <div className="text-center">
        <h2 className="font-serif text-3xl">{p.city}</h2>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)] tracking-[0.3em]">{p.region}</p>
        <div className="relative mx-auto mt-5 max-w-md">
          <Corner pos="-left-3 -top-3 [clip-path:polygon(0_0,100%_0,0_100%)]" />
          <Corner pos="-right-3 -top-3 [clip-path:polygon(0_0,100%_0,100%_100%)]" />
          <Corner pos="-left-3 -bottom-3 [clip-path:polygon(0_0,0_100%,100%_100%)]" />
          <Corner pos="-right-3 -bottom-3 [clip-path:polygon(100%_0,0_100%,100%_100%)]" />
          <div className="bg-[#f4ead4] p-3 pb-2 shadow-[0_10px_24px_-10px_#140c04b0] rotate-[-0.6deg]">
            <PostcardFront p={p} />
            <div className="mt-2 flex items-baseline justify-between gap-3 text-left">
              <span className="font-serif italic text-sm text-[var(--ink-600)]">{p.caption}</span>
              <span className="font-typewriter text-[0.6rem] text-[var(--ink-600)]">{p.id}</span>
            </div>
          </div>
        </div>
        <p className="mt-6 type-label text-[0.55rem] text-[var(--ink-600)]">
          {p.id} · {p.publisher} · {p.year}
        </p>
      </div>
    );
    right = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Postcards — The Album</p>
        <div className="mt-4">{back}</div>
        <h3 className="mt-6 type-label text-[0.7rem] tracking-[0.25em]">In the Margin</h3>
        <p className="mt-2 font-caveat text-2xl leading-snug">{p.margin}</p>
      </div>
    );
  } else if (tab === "postmark") {
    left = (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative">
          <PostageStamp className="w-48 rotate-[-3deg] drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]" />
          <Postmark text={p.postmark} className="absolute -right-20 top-10 h-40 w-40" />
        </div>
        <p className="mt-8 font-typewriter text-lg tracking-widest">{p.postmark}</p>
      </div>
    );
    right = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Postcards — Postmark</p>
        <dl className="mt-5 divide-y divide-[var(--ink-900)]/15 border-y border-[var(--ink-900)]/15 font-typewriter text-sm">
          {[
            ["Card", p.id],
            ["Posted at", p.city],
            ["Date", p.postmark],
            ["Publisher", p.publisher],
            ["Printed", String(p.year)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <dt className="uppercase tracking-widest text-[0.65rem] text-[var(--ink-600)]">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-6 type-label text-[0.7rem] tracking-[0.25em]">Process</h3>
        <p className="mt-2 font-sans">{p.process}.</p>
      </div>
    );
  } else if (tab === "route") {
    left = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">The Route — as posted</p>
        <div className="mt-4">
          <RouteMap active={index} onPick={setIndex} />
        </div>
      </div>
    );
    right = (
      <ol className="space-y-3">
        {postcards.map((x, i) => (
          <li key={x.id}>
            <button type="button" onClick={() => setIndex(i)} className={cn("w-full text-left cursor-pointer", i === index && "text-[var(--rust)]")}>
              <span className="font-typewriter text-xs">{x.postmark}</span> — <span className="font-serif text-lg">{x.city}</span>
              <span className="block font-serif italic text-sm text-[var(--ink-600)]">{x.caption}</span>
            </button>
          </li>
        ))}
      </ol>
    );
  } else {
    left = (
      <div className="grid grid-cols-2 gap-3">
        {postcards.map((x, i) => (
          <button key={x.id} type="button" onClick={() => setIndex(i)} className={cn("bg-[#f4ead4] p-1.5 shadow cursor-pointer", i === index && "outline outline-2 outline-[var(--rust)]")}>
            <PostcardFront p={x} small />
          </button>
        ))}
      </div>
    );
    right = (
      <div>
        <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Postcards — Overview</p>
        <p className="mt-4 font-sans text-[1.02rem] leading-relaxed">
          Six cards, six towns, one route from the harbour to the end of the line. The senders sign with initials; the records on the shelf share
          them. Read the album in order and the last card tells you where the sealed record went.
        </p>
        <p className="mt-6 font-caveat text-2xl text-[var(--rust)] rotate-[-1deg]">follow the postmarks, not the pictures</p>
      </div>
    );
  }

  return (
    <Journal
      section="postcards"
      tabs={tabs}
      tab={tab}
      onTab={setTab}
      meter={{ label: "Cards in the Album", value: postcards.length, total: postcards.length }}
      spreadKey={`${tab}-${p.id}`}
      left={left}
      right={right}
      strip={{
        label: "The Album",
        index,
        onSelect: setIndex,
        items: postcards.map((x) => ({ key: x.id, label: x.city, node: <PostcardFront p={x} small className="shadow" /> })),
      }}
    />
  );
}
