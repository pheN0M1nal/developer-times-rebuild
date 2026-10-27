// Press clippings. Bodies live beside this file as MDX; this is the index.

export type Article = {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  category: string;
  caseNote: string;
  headline: string; // the in-article headline under the case note
  standfirst: string;
  tags: string[];
  relatedCase?: string;
};

export const articles: Article[] = [
  {
    slug: "ledger-that-lied",
    title: "The Night Shift: Case Notes on a Ledger That Lied",
    dek: "Three payment providers, two currencies, one balance that refused to add up — and the rounding rule that ended it.",
    date: "2026-03-14",
    category: "Investigations",
    caseNote: "Case Note #003",
    headline: "The Ledger That Lied",
    standfirst: "Filed after midnight: a reconciliation that balanced on Tuesdays and nowhere else.",
    tags: ["Payments", "PostgreSQL", "Reconciliation"],
    relatedCase: "1",
  },
  {
    slug: "tracing-the-signal",
    title: "Tracing the Signal: A Bug That Only Confessed Under Pressure",
    dek: "An after-hours investigation into a flickering failure that vanished every time someone looked at it.",
    date: "2025-11-02",
    category: "Methods",
    caseNote: "Case Note #002",
    headline: "Tracing the Signal",
    standfirst: "Bugs hide in timing. The trick is to make time visible.",
    tags: ["Debugging", "Observability"],
    relatedCase: "4",
  },
  {
    slug: "first-edition",
    title: "First Edition: On Building This Vintage Portfolio",
    dek: "A portfolio that smells like newsprint, runs like a press, and cuts glitter for ink.",
    date: "2026-06-21",
    category: "Portfolio",
    caseNote: "Case Note #001",
    headline: "Ink Over Glitter",
    standfirst: "A modest paper, folded and stapled with code. A little vintage on the outside, a little modern under the hood.",
    tags: ["Design", "Next.js", "Web Audio"],
    relatedCase: "2",
  },
];

export const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
