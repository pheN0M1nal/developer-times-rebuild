import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cases } from "@/content/cases";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { Marquee } from "@/components/ui/marquee";
import { CaseCard } from "@/components/cases/case-card";
import { VintageButton } from "@/components/ui/vintage-button";

export function CaseMarquee() {
  const featured = cases.filter((c) => c.featured);
  return (
    <div id="case-files" className="relative scroll-mt-20">
      <Section
        title="Investigation Bureau • Est. 2019 • Volume IV"
        heading="CASE FILES & DIGITAL INVESTIGATIONS"
        tagline="Select dossiers from my archive of solved mysteries, coded conspiracies, and digital breakthroughs."
        decorativeText="CASES"
        fullWidth
      >
        <MarginNotes
          notes={[
            { at: { top: "0.5rem", left: "6%" }, rotate: -4, font: "hand", children: "12 closed · 1 with reservations" },
            { at: { top: "4rem", right: "8%" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "EVIDENCE LOG · 4 of 12 · OTHERS REDACTED" },
            { at: { bottom: "9rem", left: "4%" }, rotate: 5, font: "hand", hue: "violet", children: "the 13th is still open" },
            { at: { bottom: "5rem", right: "5%" }, rotate: -6, font: "hand", children: "↑ subjects don't know we know" },
          ]}
        />
        <Marquee duration="45s" repeat={4}>
          {featured.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </Marquee>
        <div className="mt-12 text-center">
          <VintageButton asChild>
            <Link href="/cases/">
              View All Cases <ArrowRight className="h-4 w-4" />
            </Link>
          </VintageButton>
          <p className="mt-3 text-xs italic text-muted-foreground font-grotesk">Click any case card to inspect the dossier</p>
        </div>
      </Section>
    </div>
  );
}
