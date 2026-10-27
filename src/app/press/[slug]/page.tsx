import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, formatDate, getArticle, sortedArticles } from "@/content/press";
import { getCase } from "@/content/cases";
import { persona } from "@/content/site";
import { Section } from "@/components/layout/section";
import { ShareRow, TableOfContents } from "@/components/press/article-chrome";
import { HireCta } from "@/components/press/hire-cta";
import { readingMinutes } from "@/components/press/reading-time";

const bodies = {
  "first-edition": () => import("@/content/press/first-edition.mdx"),
  "ledger-that-lied": () => import("@/content/press/ledger-that-lied.mdx"),
  "tracing-the-signal": () => import("@/content/press/tracing-the-signal.mdx"),
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.dek } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  const load = bodies[slug as keyof typeof bodies];
  if (!a || !load) notFound();
  const { default: Body } = await load();
  const minutes = await readingMinutes(slug);
  const related = sortedArticles.filter((x) => x.slug !== slug).slice(0, 3);
  const relatedCase = a.relatedCase ? getCase(a.relatedCase) : undefined;

  return (
    <main className="py-6">
      <Section title="The Developer Times • Est. 2000 • Volume V" heading={a.title} tagline={a.dek} decorativeText="PRESS" headingAs="h1">
        <div className="space-y-3">
          <p className="font-grotesk text-xs uppercase tracking-widest text-muted-foreground">
            {formatDate(a.date)} • {a.category} • {minutes} min read
          </p>
          <ShareRow title={a.title} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <article id="article-body" className="min-w-0">
            <p className="type-label text-muted-foreground tracking-[0.3em]">{a.caseNote}</p>
            <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl">{a.headline}</h2>
            <p className="mt-3 font-serif text-[0.65rem] uppercase tracking-widest text-muted-foreground">By {persona.name}</p>
            <p className="mt-4 font-grotesk italic text-[1.05rem] leading-relaxed text-foreground/90">{a.standfirst}</p>
            <div className="article-body">
              <Body />
            </div>

            <footer className="mt-12 border-t border-foreground/20 pt-6">
              <div className="flex flex-wrap gap-2">
                {a.tags.map((t) => (
                  <span key={t} className="text-[10px] font-serif uppercase border border-foreground/60 px-2 py-1">
                    #{t}
                  </span>
                ))}
              </div>
              {relatedCase && (
                <p className="mt-6 font-serif">
                  Filed alongside{" "}
                  <Link href={`/cases/${relatedCase.id}/`} className="underline underline-offset-4">
                    {relatedCase.title}
                  </Link>
                  .
                </p>
              )}
              {related.length > 0 && (
                <div className="mt-8">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-grotesk">Related Dispatches</div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/press/${r.slug}/`} className="block p-3 border border-foreground/20 hover:bg-foreground/[0.03]">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-grotesk">{r.category}</div>
                        <div className="font-serif font-semibold text-sm leading-snug">{r.title}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <HireCta />
            </footer>
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents target="article-body" />
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
