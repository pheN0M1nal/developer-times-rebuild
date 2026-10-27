"use client";

import { useTorch } from "@/components/providers/torch";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { hero, masthead, persona } from "@/content/site";
import { asset } from "@/lib/utils";
import { Dossier } from "./dossier";
import { Arsenal } from "./arsenal";

export function FrontPage() {
  const { torchEnabled } = useTorch();

  return (
    <Section
      id="front-page"
      title={masthead.kicker}
      heading={masthead.title}
      tagline={torchEnabled ? masthead.taglineTorch : masthead.tagline}
      decorativeText={torchEnabled ? "CASE" : "CODE"}
      headingSize="large"
      headingAs="h1"
    >
      <MarginNotes
        notes={[
          { at: { top: "8px", right: "1.5rem" }, rotate: -6, font: "hand", size: "text-base", children: "subject knows you're reading" },
          { at: { top: "180px", left: "0.5rem" }, rotate: 4, font: "mono", size: "text-xs", hue: "blue", children: "FILE No. 0612 · STILL OPEN" },
          { at: { top: "20rem", right: "0.5rem" }, rotate: -3, font: "hand", size: "text-sm", hue: "violet", children: "↗ ask about the quiet year" },
          { at: { bottom: "14rem", right: "0.75rem" }, rotate: -12, font: "hand", size: "text-lg", hue: "violet", children: "M.O.: reads the logs first" },
          { at: { bottom: "10rem", left: "1rem" }, rotate: 3, font: "hand", size: "text-sm", children: "the bio is rehearsed" },
          { at: { bottom: "4rem", right: "2rem" }, rotate: -4, font: "mono", size: "text-xs", hue: "blue", children: 'alias — "the quill" · believe it?' },
          { at: { bottom: "1rem", left: "40%" }, rotate: 2, font: "mono", size: "text-[0.65rem]", hue: "violet", children: "DOSSIER · 03:14 AM · NOT FOR FILE" },
        ]}
      />
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <figure className="border border-foreground p-2 self-start md:sticky md:top-28">
          <div className="relative aspect-[3/4] overflow-hidden bg-foreground/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/images/portrait.jpg")}
              alt={`${persona.name}, portrait withheld`}
              className="absolute inset-0 h-full w-full object-cover grayscale-[20%] dark:grayscale-50"
            />
            <span
              className="absolute bottom-3 right-3 rotate-[-8deg] border-2 border-[var(--rust)] px-2 py-0.5 type-label text-[0.6rem] text-[var(--rust)] bg-background/40"
              aria-hidden
            >
              Likeness withheld
            </span>
          </div>
          <figcaption className="pt-2 text-center font-serif italic text-xs">{hero.caption}</figcaption>
        </figure>

        <article className="min-w-0">
          <h2 className="font-serif font-bold text-2xl md:text-[2rem] leading-tight text-foreground">{hero.headline}</h2>
          <p className="mt-2 font-serif italic text-sm text-muted-foreground">{hero.deck}</p>
          <p className="drop-cap mt-6 font-serif text-[0.95rem] leading-relaxed text-left sm:text-justify [hyphens:auto] text-foreground">
            {torchEnabled ? hero.ledeTorch : hero.lede}
          </p>
          <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-left sm:text-justify [hyphens:auto] text-muted-foreground">{hero.body}</p>

          <div className="mt-6 border border-foreground p-4 bg-muted/20">
            <div className="text-xs uppercase tracking-wider font-bold mb-3 text-center font-serif">Career Highlights</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {hero.highlights.map((h) => (
                <div key={h.label}>
                  <div className="text-xl font-bold font-serif">{h.value}</div>
                  <div className="text-[0.65rem] sm:text-xs md:text-sm uppercase font-sans tracking-wide mt-1">{h.label}</div>
                </div>
              ))}
            </div>
          </div>

          <Dossier />
          <Arsenal />
        </article>
      </div>
    </Section>
  );
}
