import Link from "next/link";
import type { Metadata } from "next";
import { formatDate, sortedArticles } from "@/content/press";
import { Section } from "@/components/layout/section";
import { SearchPalette } from "@/components/press/search-palette";
import { readingMinutes } from "@/components/press/reading-time";

export const metadata: Metadata = {
  title: "The Morning Edition",
  description: "Filed reports from the engineering desk — case studies, methods, and notes from the night shift.",
};

export default async function PressPage() {
  const [lead, ...rest] = sortedArticles;
  const minutes = await Promise.all(sortedArticles.map((a) => readingMinutes(a.slug)));
  const mins = Object.fromEntries(sortedArticles.map((a, i) => [a.slug, minutes[i]]));

  return (
    <main className="py-6">
      <Section
        title="The Developer Times • Est. 2000 • Volume V"
        heading="THE MORNING EDITION"
        tagline="Filed reports from the engineering desk"
        decorativeText="PRESS"
        headingAs="h1"
      >
        <div className="flex justify-end mb-5">
          <SearchPalette />
        </div>
        <Link href={`/press/${lead.slug}/`} className="block border border-foreground/30 p-6 sm:p-8 hover:bg-foreground/[0.03] transition-colors">
          <span className="type-label text-[0.6rem] text-[var(--rust)]">Lead Story</span>
          <h2 className="mt-1 font-serif font-bold text-2xl md:text-4xl leading-tight">{lead.title}</h2>
          <p className="mt-3 font-serif italic text-muted-foreground">{lead.dek}</p>
          <p className="mt-4 font-grotesk text-xs uppercase tracking-widest text-muted-foreground">
            {formatDate(lead.date)} • {lead.category} • {mins[lead.slug]} min read
          </p>
        </Link>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {rest.map((a) => (
            <Link key={a.slug} href={`/press/${a.slug}/`} className="block border border-foreground/30 p-5 hover:bg-foreground/[0.03] transition-colors">
              <span className="font-grotesk text-[0.65rem] uppercase tracking-widest text-muted-foreground">{a.category}</span>
              <h3 className="mt-2 font-serif font-bold text-xl leading-snug">{a.title}</h3>
              <p className="mt-2 font-serif italic text-sm text-muted-foreground">{a.dek}</p>
              <p className="mt-3 font-grotesk text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {formatDate(a.date)} • {mins[a.slug]} min read
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
