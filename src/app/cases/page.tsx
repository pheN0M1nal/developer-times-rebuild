import { Suspense } from "react";
import type { Metadata } from "next";
import { cases } from "@/content/cases";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { Archive } from "@/components/cases/archive";

export const metadata: Metadata = {
  title: "The Archive of Cases",
  description: "Case files from the engineering desk: what was broken, what was tried, and what fixed it.",
};

export default function CasesPage() {
  return (
    <main className="py-6">
      <Section
        title="Case Files Archive • Volume IV"
        heading="THE ARCHIVE OF CASES"
        tagline="A dossier of solved mysteries, coded conspiracies, and digital breakthroughs meticulously investigated across my developer journey."
        decorativeText="CASES"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "0" }, rotate: -5, font: "hand", children: `${cases.length} on record · I trust 3` },
            { at: { top: "5rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "VAULT 04 · ROW B · FILES" },
            { at: { top: "9rem", left: "0" }, rotate: 4, font: "hand", hue: "violet", children: "search the archive ↑" },
            { at: { top: "12rem", right: "0.5rem" }, rotate: -3, font: "hand", children: "filter by evidence ↓" },
            { at: { bottom: "3rem", left: "0" }, rotate: 3, font: "hand", hue: "violet", children: "more in cold storage — they don't want you reading those" },
            { at: { bottom: "0.5rem", right: "1rem" }, rotate: -4, font: "mono", size: "text-xs", hue: "blue", children: "FOIA · REQUEST PENDING · 03:14 AM" },
          ]}
        />
        <Suspense fallback={null}>
          <Archive />
        </Suspense>
      </Section>
    </main>
  );
}
