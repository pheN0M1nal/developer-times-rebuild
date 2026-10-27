"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { career, type Role } from "@/content/career";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { pad } from "@/lib/utils";

const N = career.length;

function Sprockets() {
  return (
    <div className="h-7 bg-[#1c1712] flex items-center gap-[14px] px-2 overflow-hidden" aria-hidden>
      {Array.from({ length: 40 }, (_, i) => (
        <span key={i} className="h-[11px] w-[18px] shrink-0 rounded-[2px] bg-[#fbf6e6]" />
      ))}
    </div>
  );
}

function FrameCard({ role, index }: { role: Role; index: number }) {
  return (
    <div>
      <div className="type-label text-[0.62rem] text-muted-foreground mb-3 tracking-[0.3em]">
        Reel · Career · {pad(index + 1, 2)} of {pad(N, 2)}
      </div>
      <div className="shadow-[0_24px_50px_-24px_#140c04aa] border-x border-[#1c1712]">
        <Sprockets />
        <div className="relative bg-[#fdf9ea] dark:bg-[#171410] px-6 sm:px-8 pt-6 pb-5 min-h-[30rem] flex flex-col">
          <div className="absolute right-6 top-5 type-label text-[0.62rem] text-foreground/60 tracking-[0.3em]">
            Frame {pad(index + 1, 2)} / {pad(N, 2)}
          </div>
          <div className="type-label text-[0.55rem] text-foreground/50 tracking-[0.4em]">Exposure</div>
          <div className="mt-1 font-serif font-bold text-xl tracking-wide">{role.period}</div>
          <h3 className="mt-4 font-serif font-bold text-3xl text-foreground">{role.title}</h3>
          <div className="mt-1 font-serif italic text-lg text-foreground/80">
            {role.href ? (
              <a href={role.href} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-4 hover:text-foreground">
                {role.company}, {role.place}
              </a>
            ) : (
              <span>
                {role.company}, {role.place}
              </span>
            )}
          </div>
          <ul className="mt-6 space-y-3 font-sans text-[0.95rem] leading-relaxed text-foreground/85">
            {role.bullets.map((b) => (
              <li key={b.lead} className="relative pl-4 before:absolute before:left-0 before:top-[0.1rem] before:content-['❖'] before:text-[0.7rem] before:text-foreground/50">
                <span className="text-foreground">{b.lead}:</span> {b.text}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <div className="border-t border-foreground/15 pt-4 text-center type-label text-[0.6rem] text-foreground/55 tracking-[0.4em]">
              Case Ledger · Field Entry
            </div>
          </div>
        </div>
        <Sprockets />
      </div>
      <div className="mt-3 text-right type-label text-[0.6rem] text-muted-foreground tracking-[0.3em]">TC · {role.period}</div>
    </div>
  );
}

function ReelFrame({ role, index, pos }: { role: Role; index: number; pos: MotionValue<number> }) {
  const d = useTransform(pos, (p) => index - p);
  const x = useTransform(d, (v) => `${v * 106}%`);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 1.2) * 0.18);
  const opacity = useTransform(d, (v) => 1 - Math.min(Math.max(Math.abs(v) - 0.2, 0), 1.2) * 0.55);
  const filter = useTransform(d, (v) => {
    const a = Math.max(Math.abs(v) - 0.3, 0);
    return `blur(${Math.min(a, 1.2) * 2.4}px) grayscale(${Math.min(a, 1) * 60}%)`;
  });
  const zIndex = useTransform(d, (v) => 10 - Math.round(Math.abs(v) * 3));

  return (
    <motion.div className="absolute left-1/2 top-1/2 w-[min(860px,70vw)] -translate-x-1/2 -translate-y-1/2" style={{ zIndex }}>
      <motion.div style={{ x, scale, opacity, filter }}>
        <FrameCard role={role} index={index} />
      </motion.div>
    </motion.div>
  );
}

function MobileLedger() {
  const [all, setAll] = useState(false);
  const shown = all ? career : career.slice(0, 2);
  return (
    <div className="lg:hidden max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      {shown.map((r, i) => (
        <FrameCard key={r.period} role={r} index={i} />
      ))}
      {!all && (
        <div className="text-center">
          <button type="button" onClick={() => setAll(true)} className="type-label border border-foreground/30 px-5 py-2 hover:bg-foreground/5 cursor-pointer">
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

/** A strip of film advanced by scrolling: the section pins and the frames slide past. */
export function CareerReel() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const pos = useTransform(scrollYProgress, [0.04, 0.96], [0, N - 1], { clamp: true });
  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, "change", (v) => setActive(Math.round(v)));

  return (
    <div id="career-ledger" className="relative scroll-mt-20">
      <Section
        title="Professional Journey"
        heading="CAREER CHRONICLE"
        tagline="From Code to Craft: A Timeline of Technical Excellence"
        decorativeText="LEDGR"
        className="pb-0"
      >
        <MarginNotes
          notes={[
            { at: { top: "2rem", left: "1rem" }, rotate: -5, font: "hand", children: "↘ check the dates again" },
            { at: { top: "7rem", right: "1rem" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "REC. LETTERS · 6 ON FILE · 1 MISSING" },
            { at: { bottom: "1rem", left: "2rem" }, rotate: 4, font: "hand", hue: "violet", children: "promoted twice · or recruited?" },
          ]}
        />
      </Section>

      <MobileLedger />

      <div ref={track} className="hidden lg:block relative" style={{ height: `${N * 85}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden" aria-label="Career timeline (horizontal reel)" role="region">
          <div className="absolute top-24 inset-x-0 text-center type-label text-muted-foreground tracking-[0.4em]">
            Reel {pad(active + 1, 2)} / {pad(N, 2)}
          </div>
          {career.map((r, i) => (
            <ReelFrame key={r.period} role={r} index={i} pos={pos} />
          ))}
          <div className="absolute bottom-8 inset-x-0 text-center type-label text-[0.62rem] text-muted-foreground tracking-[0.4em]">
            Scroll · advance reel
          </div>
        </div>
      </div>
    </div>
  );
}
