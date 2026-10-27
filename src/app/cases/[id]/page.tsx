import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases, getCase } from "@/content/cases";
import { endorsements } from "@/content/endorsements";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { Dossier } from "@/components/cases/dossier";
import { pad } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = getCase((await params).id);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const c = getCase((await params).id);
  if (!c) notFound();
  const testimonies = endorsements.filter((e) => c.testimonies.includes(e.id));

  return (
    <main className="py-6">
      <Section
        title="Investigation Bureau • Est. 2019 • Volume IV"
        heading={c.title.toUpperCase()}
        tagline={c.description}
        decorativeText="CASE"
        headingSize="large"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "0.5rem", left: "0" }, rotate: -5, font: "hand", children: `the ${c.title.replace("The ", "")} affair — still warm` },
            { at: { top: "4rem", right: "0.5rem" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: `FILE No. ${pad(Number(c.id))} · ${c.year}` },
            { at: { top: "9rem", left: "0.5rem" }, rotate: 4, font: "hand", hue: "violet", children: c.marginalia[2] },
            { at: { top: "16rem", right: "0" }, rotate: -4, font: "hand", children: `prints lifted: ${c.evidence[0]} ↓` },
            { at: { bottom: "16rem", left: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: `evidence count: ${c.evidence.length} · M.O. matches` },
            { at: { bottom: "6rem", right: "0.5rem" }, rotate: -6, font: "hand", hue: "violet", children: "someone scrubbed paragraph 4" },
            { at: { bottom: "1rem", left: "35%" }, rotate: 2, font: "mono", size: "text-[0.65rem]", children: "E.Q. · pending · 03:42" },
          ]}
        />
        <Dossier c={c} testimonies={testimonies} />
      </Section>
    </main>
  );
}
