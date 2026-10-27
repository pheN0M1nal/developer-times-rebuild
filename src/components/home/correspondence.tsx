"use client";

import { useEffect, useState } from "react";
import { Feather, Map } from "lucide-react";
import { correspondence, persona } from "@/content/site";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { useHireMode } from "@/components/providers/hire-mode";

/** A perforated postage stamp, drawn rather than photographed. */
export function PostageStamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden>
      <defs>
        <mask id="perf">
          <rect width="120" height="140" fill="white" />
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <circle cx={5 + i * 10} cy="0" r="3.4" fill="black" />
              <circle cx={5 + i * 10} cy="140" r="3.4" fill="black" />
            </g>
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i}>
              <circle cx="0" cy={5 + i * 10} r="3.4" fill="black" />
              <circle cx="120" cy={5 + i * 10} r="3.4" fill="black" />
            </g>
          ))}
        </mask>
      </defs>
      <g mask="url(#perf)">
        <rect width="120" height="140" fill="#f3e6c8" />
        <rect x="10" y="10" width="100" height="120" fill="#8a2f22" />
        <rect x="16" y="16" width="88" height="108" fill="none" stroke="#f3e6c8" strokeWidth="1" />
        <path d="M60 42 l6 14 h15 l-12 9 5 15 -14 -9 -14 9 5 -15 -12 -9 h15z" fill="#f3e6c8" />
        <text x="60" y="100" textAnchor="middle" fontSize="10" fill="#f3e6c8" fontFamily="var(--font-serif)" letterSpacing="2">BUREAU</text>
        <text x="60" y="114" textAnchor="middle" fontSize="8" fill="#f3e6c8" fontFamily="var(--font-typewriter)">POST · 2d</text>
      </g>
    </svg>
  );
}

function Postmark({ date }: { date: string }) {
  return (
    <svg viewBox="0 0 160 90" className="absolute -left-16 top-4 w-36 opacity-70 text-[var(--ink-900)] dark:text-foreground pointer-events-none" aria-hidden>
      <circle cx="45" cy="45" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="45" cy="45" r="26" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text x="45" y="42" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="var(--font-typewriter)">KESTREL BAY</text>
      <text x="45" y="53" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="var(--font-typewriter)">{date}</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M85 ${27 + i * 9} q 9 -5 18 0 t 18 0 t 18 0 t 18 0`} fill="none" stroke="currentColor" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

export function Correspondence() {
  const hire = useHireMode();
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
  }, []);
  const short = today.toUpperCase();

  return (
    <div id="correspondence" className="relative scroll-mt-20">
      <Section
        title="Letters & Dispatches"
        heading="CORRESPONDENCE"
        tagline="Send your words by post, wire, or raven — they shall reach me."
        decorativeText="POST"
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "0" }, rotate: -5, font: "hand", children: "letters get opened · rumour says" },
            { at: { top: "6rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "SECURE LINE · 48 HRS · MAYBE" },
            { at: { bottom: "6rem", left: "0.5rem" }, rotate: 4, font: "hand", hue: "violet", children: "the post office knows" },
            { at: { bottom: "1rem", right: "1rem" }, rotate: -4, font: "hand", children: "— E.Q. · expect a reply, or don't" },
          ]}
        />
        <div className="rounded-sm border border-foreground/25 p-6 sm:p-8 shadow-[0_2px_6px_-3px_#140c0440]">
          <p className="font-sans text-[0.95rem] leading-relaxed text-foreground/85">{correspondence.intro}</p>
          <div className="mt-6 border-t border-foreground/15 pt-6 grid gap-8 sm:grid-cols-[1fr_auto] items-end">
            <ul className="space-y-4 font-sans text-sm text-foreground order-2 sm:order-1">
              <li className="flex items-start gap-3">
                <Map className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  {persona.location}
                  {hire && <span className="block text-[0.7rem] text-muted-foreground">Available for remote engagements worldwide</span>}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Feather className="h-4 w-4 shrink-0" />
                <a href={`mailto:${persona.email}`} className="hover:underline underline-offset-4">
                  {persona.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <LinkedinIcon className="h-4 w-4 shrink-0" />
                <a href={persona.linkedin.href} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">
                  {persona.linkedin.label}
                </a>
              </li>
              {hire && (
                <li className="type-label text-[0.6rem] text-[var(--rust)]">Now taking new cases · reply within 24 hours</li>
              )}
            </ul>
            <div className="relative order-1 sm:order-2 text-right min-w-[220px]">
              <p className="font-pen text-5xl leading-none text-foreground pr-2">{persona.name}</p>
              <div className="mt-3 ml-auto w-28 border-t border-foreground/40" />
              <p className="mt-1 font-typewriter italic text-xs text-muted-foreground min-h-4">{today}</p>
              <div className="relative mt-4 inline-block">
                {short && <Postmark date={short} />}
                <PostageStamp className="w-16 rotate-[6deg] drop-shadow-[1px_2px_2px_rgba(0,0,0,0.25)]" />
              </div>
            </div>
          </div>
          <p className="mt-6 border-t border-dotted border-foreground/30 pt-5 text-center font-serif italic text-sm text-muted-foreground">
            “{correspondence.motto}”
          </p>
        </div>
      </Section>
    </div>
  );
}
