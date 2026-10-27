import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";

export function DeskTeaser() {
  return (
    <div id="desk" className="relative scroll-mt-20">
      <Section
        title="Bureau Notice · The Backroom"
        heading="THE DETECTIVE'S DESK"
        tagline="An inner-office, opened to the public — pay a visit at any hour."
        decorativeText="DESK"
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "0" }, rotate: -4, font: "hand", children: "knock twice · three means trouble" },
            { at: { top: "6rem", right: "0" }, rotate: 3, font: "hand", hue: "violet", children: "the wireless picks up odd frequencies" },
            { at: { bottom: "1rem", left: "40%" }, rotate: -2, font: "mono", size: "text-xs", hue: "blue", children: "OFFICE OPEN · WATCH YOUR BACK" },
          ]}
        />
        <div className="rounded-sm border border-foreground/25 p-6 sm:p-8 shadow-[0_2px_6px_-3px_#140c0440]">
          <p className="font-sans text-[0.95rem] leading-relaxed text-foreground/85">
            Pay a call upon the back-office of this publication. A wireless set hums with jazz and gentle rainfall, a pocket-watch ticks for those
            who require focus, a darkroom develops whatever you bring it, and a clerk&apos;s apparatus pens invoices in bureau livery. The door is
            open at all hours — kindly let yourself in.
          </p>
          <div className="mt-6 border-t border-dotted border-foreground/30 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="type-label text-[0.62rem] text-muted-foreground tracking-[0.3em]">Bureau Backroom · Open at All Hours</span>
            <Link href="/desk/" className="inline-flex items-center gap-3 border border-foreground/40 px-7 py-3 font-serif text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors">
              Step Inside <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
