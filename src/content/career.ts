// Placeholder employment history. Every company and figure is invented.

export type Role = {
  period: string;
  title: string;
  company: string;
  place: string;
  href?: string;
  bullets: { lead: string; text: string }[];
};

export const career: Role[] = [
  {
    period: "Nov 2025 - Present",
    title: "Senior Software Engineer",
    company: "Larkspur Labs",
    place: "Remote",
    href: "https://example.com/larkspur",
    bullets: [
      { lead: "Payments Platform", text: "Owns the payout service end to end, from webhook intake to settlement reports, across three payment providers." },
      { lead: "Reconciliation Engine", text: "Built a nightly matcher that pairs ledger entries with bank lines, cutting manual review from two days to an afternoon." },
      { lead: "Idempotent Everything", text: "Introduced idempotency keys and an outbox table so retries never double-pay a supplier." },
      { lead: "Operator Tools", text: "Shipped an internal console for finance to replay, annotate and close exceptions without engineering help." },
      { lead: "Mentoring", text: "Runs a fortnightly code-reading club for the backend guild." },
    ],
  },
  {
    period: "Apr 2023 - Oct 2025",
    title: "Software Engineer II",
    company: "Northwind Ledger Co.",
    place: "Harbourtown",
    href: "https://example.com/northwind",
    bullets: [
      { lead: "Multi-Currency Wallets", text: "Designed balance snapshots and FX conversion records so every cent could be traced to its source." },
      { lead: "ERP Sync", text: "Wrote the sync between the product ledger and the accounting system, with drift alerts when the two disagreed." },
      { lead: "Query Tuning", text: "Rewrote the heaviest report queries with covering indexes, taking the monthly close from 40 minutes to 9." },
      { lead: "Testing Culture", text: "Added contract tests around every provider integration; regressions in that area fell to near zero." },
      { lead: "On-Call", text: "Wrote the runbooks the team still uses for failed-payout incidents." },
    ],
  },
  {
    period: "Jan 2021 - Mar 2023",
    title: "Full Stack Developer",
    company: "Copperline Studio",
    place: "Old Quarter",
    href: "https://example.com/copperline",
    bullets: [
      { lead: "Client Products", text: "Delivered seven client web apps in React and Node, most from first sketch to launch in under ten weeks." },
      { lead: "Design Systems", text: "Built the studio's shared component kit, which became the starting point for every new project." },
      { lead: "Performance", text: "Brought a marketplace's largest page under one second to interactive with code splitting and image work." },
      { lead: "Infrastructure", text: "Moved hosting to containers with a single deploy pipeline per client." },
    ],
  },
  {
    period: "Jun 2019 - Dec 2020",
    title: "Freelance Full Stack Developer",
    company: "Independent",
    place: "Remote",
    bullets: [
      { lead: "Small Businesses", text: "Built booking, invoicing and inventory tools for a bakery, a print shop and a bicycle co-op." },
      { lead: "APIs", text: "Wrote REST and GraphQL APIs in Node and Python for mobile clients." },
      { lead: "Data", text: "Turned spreadsheets that ran entire businesses into proper databases, gently." },
      { lead: "Communication", text: "Learned that the hardest bug is usually a missing conversation." },
    ],
  },
];
