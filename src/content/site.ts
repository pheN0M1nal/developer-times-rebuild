// Every name, employer, date and quote in src/content is a placeholder.
// Swap these files for real details; no component hard-codes copy.

export const persona = {
  name: "Ezra Quill",
  short: "E.Q.",
  initials: "EQ",
  role: "Senior Software Engineer",
  location: "Kestrel Bay, Nowhere County",
  email: "ezra.quill@example.com",
  linkedin: { label: "linkedin.com/in/ezra-quill", href: "https://www.linkedin.com/" },
  github: "https://github.com/",
  resume: "/resume/ezra-quill-resume.pdf",
  years: 6,
  established: { year: 2019, roman: "MMXIX" },
  volume: "V",
};

export const nav = [
  { label: "Front Page", href: "/#front-page" },
  { label: "Career", href: "/#career-ledger" },
  { label: "Cases", href: "/cases/" },
  { label: "Endorsements", href: "/#endorsements" },
  { label: "Correspondence", href: "/#correspondence" },
  { label: "Press", href: "/press/" },
  { label: "Lifestyle", href: "/lifestyle/", highlight: true },
] as const;

export const masthead = {
  kicker: `Portfolio Chronicle • Est. 2000 • Volume ${persona.volume}`,
  title: "THE DEVELOPER TIMES",
  tagline: "MVPs to SaaS • Full‑Stack Product Engineering",
  taglineTorch: "Confidential Briefing • MVPs, SaaS & Evidence‑Driven Engineering",
};

export const hero = {
  headline: "Quietly Building Software That Holds Up: Six Years in the Field",
  deck: "Full-Stack Engineering | Payments & Ledgers | Calm Architecture",
  lede: `${persona.name}, a full‑stack engineer and product builder, takes ideas from a napkin to a running service. Over six years he has untangled legacy systems, reconciled ledgers that refused to balance, and shipped features that people actually use.`,
  ledeTorch: `${persona.name} operates off the record — a full‑stack detective brought in when systems go silent and clues hide in the stack. Over six years he has traced slow queries to their lair, reconciled ledgers that lied, and closed tickets nobody else would touch.`,
  body: "His toolkit spans React, Next.js, Node and Python, with a soft spot for boring, well-tested backends — from discovery and scoping, through sprinted MVPs, to hardening for production. The approach blends clean code, measured performance work, and plain product sense.",
  caption: `${persona.name}, ${persona.role}`,
  highlights: [
    { value: "6+", label: "Years Experience" },
    { value: "40%", label: "Fewer Failed Payouts" },
    { value: "3×", label: "Faster Reconciliation" },
  ],
  ctas: [
    { label: "Open a Case File (20 Minutes)", hover: "Let’s examine the evidence together and crack your project mystery." },
    { label: "Meet at the Detective’s Desk", hover: "A confidential briefing awaits — bring your best hunches." },
    { label: "Brief Me on the Case", hover: "Got clues? I’ve got the time. Let’s investigate." },
  ],
};

export const arsenal = [
  { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { title: "Backend", skills: ["Node.js", "NestJS", "Python", "GraphQL"] },
  { title: "Database", skills: ["PostgreSQL", "Redis", "MongoDB", "SQLite"] },
  { title: "DevOps", skills: ["Docker", "AWS", "GitHub Actions", "Terraform"] },
];

export const correspondence = {
  intro:
    "Whether you carry tidings of great opportunity, seek counsel, or simply wish to exchange pleasantries, do not hesitate to make contact. Replies are often dispatched within one or two days of receipt.",
  motto: "No unwanted missives — only messages of worth.",
};

export const footer = {
  motto: "Where the quill meets the pixel, and tradition embraces innovation",
};
