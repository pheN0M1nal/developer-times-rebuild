// Placeholder case studies. Clients, numbers and timelines are invented.

export type CaseFile = {
  id: string;
  title: string;
  year: number;
  featured: boolean;
  description: string;
  subtitle: string;
  evidence: string[];
  /** Tags hidden behind redaction bars until the torch is lit. */
  redacted: string[];
  summary: string;
  obstacles: string[];
  solutions: string[];
  results: string[];
  timeline: { date: string; note: string }[];
  links: { label: string; url: string }[];
  testimonies: string[]; // endorsement ids
  commits: { hash: string; date: string; message: string }[];
  hero?: string; // image path under /public
  exhibit: "ledger" | "newspaper" | "schedule" | "tracking";
  clue: string; // pencilled torch secret for this case
  marginalia: string[];
};

export const cases: CaseFile[] = [
  {
    id: "1",
    title: "The Ledger Case",
    year: 2025,
    featured: true,
    exhibit: "ledger",
    description:
      "Money left the building and the books disagreed about where it went. The brief: make every cent traceable across three providers, two currencies and one very tired finance team.",
    subtitle: "Technical Analysis Report • Financial Forensics",
    evidence: ["NestJS", "PostgreSQL", "Stripe", "Redis", "TypeScript"],
    redacted: ["Stripe", "Redis"],
    summary:
      "Called in after a quarter-end that took nine days to close, I traced payouts from webhook to bank line and found the gaps: retries that paid twice, refunds that never reached the ledger, and FX rates applied at the wrong moment. The fix was a single source of truth for money movements, an idempotent outbox, and a matcher that pairs every ledger entry with its bank line before anyone has to ask.",
    obstacles: [
      "Webhook retries created duplicate payouts — the same suspect booked twice",
      "Refunds lived only in the provider dashboard — evidence never filed",
      "FX rates were applied at settlement, not at capture — the numbers changed their story",
      "Finance matched bank lines by hand in a spreadsheet — two days per close",
    ],
    solutions: [
      "Idempotency keys on every write and an outbox table for provider calls",
      "Ingested refund and dispute events into the same ledger as charges",
      "Recorded the rate at capture with its source, and posted FX gains separately",
      "Built a nightly matcher with a review queue for the few lines it could not pair",
    ],
    results: [
      "Zero duplicate payouts in the eleven months since — the double booking stopped cold",
      "Quarter-end close down from nine days to two",
      "92% of bank lines matched automatically on the first pass",
      "Every balance can be explained line by line, on demand",
    ],
    timeline: [
      { date: "Jan 2025", note: "Case opened after a nine-day quarter close" },
      { date: "Feb 2025", note: "Mapped every money movement and its source of truth" },
      { date: "Apr 2025", note: "Idempotent outbox in production; duplicates stop" },
      { date: "Jun 2025", note: "Refunds and disputes join the ledger" },
      { date: "Sep 2025", note: "Nightly matcher and review queue go live" },
      { date: "Dec 2025", note: "First two-day close; case marked solved" },
    ],
    links: [
      { label: "Write-up", url: "https://example.com/" },
      { label: "Design Notes", url: "https://example.com/" },
    ],
    testimonies: ["mabel", "priya"],
    commits: [
      { hash: "a41f9c2", date: "2025-12-04", message: "matcher: auto-close pairs within 1 cent rounding" },
      { hash: "7be0d13", date: "2025-09-18", message: "feat(recon): nightly bank-line matcher with review queue" },
      { hash: "c90a5e8", date: "2025-06-02", message: "ledger: ingest refund + dispute events" },
      { hash: "13d7f46", date: "2025-04-11", message: "payouts: idempotency keys + transactional outbox" },
      { hash: "f02b8aa", date: "2025-02-20", message: "docs: map of every money movement" },
    ],
    clue: "the 1 cent rounding rule saved 400 tickets",
    marginalia: ["the totals balanced — eventually", "FILE No. 0001 · SOLVED", "ask about the refund that vanished"],
  },
  {
    id: "2",
    title: "The Developer Times",
    year: 2026,
    featured: true,
    exhibit: "newspaper",
    description:
      "A portfolio that reads like a newspaper and behaves like a desk drawer full of instruments. The brief: ink over glitter, and every gadget must actually work.",
    subtitle: "Technical Analysis Report • Design Engineering",
    evidence: ["Next.js", "Tailwind CSS", "Web Audio", "MDX", "TypeScript"],
    redacted: ["Web Audio"],
    summary:
      "Assigned to build a portfolio that people would remember without shouting at them, I set the whole thing in type: a masthead, a front page, columns and rules. Then I hid things in it — a torch that reveals notes in the margins, a locker of records that unseal as you explore, and a desk of tools that run entirely in the browser.",
    obstacles: [
      "Paper textures looked like beige rectangles — the evidence was flat",
      "Random tilts differed between server and browser — hydration mismatches",
      "Audio effects as files would bloat every page — too many suspects",
      "A cursor spotlight re-rendered the whole page on every move",
    ],
    solutions: [
      "A five-layer surface recipe: fill, fibre grain, mottling, edge burn, lift",
      "Seeded variation from a hash of each id, never Math.random() at render",
      "Synthesised every sound effect with the Web Audio API",
      "Drove the beam with CSS variables updated inside requestAnimationFrame",
    ],
    results: [
      "Every page is static HTML; nothing needs a server",
      "No audio files ship for effects, ambience or surface noise",
      "The torch runs at a steady 60fps with no React re-renders",
      "Visitors find secrets they were never told about",
    ],
    timeline: [
      { date: "Jun 2026", note: "Masthead, sections and the surface recipe" },
      { date: "Jul 2026", note: "Torch, margin notes and the Evidence Locker" },
      { date: "Aug 2026", note: "The Desk: invoices, Pomodoro and the wireless" },
      { date: "Sep 2026", note: "Darkroom, turntable and the stationer's cabinet" },
    ],
    links: [{ label: "Press: First Edition", url: "/press/first-edition/" }],
    testimonies: ["dov"],
    commits: [
      { hash: "e81c0a7", date: "2026-09-21", message: "stationer: seal the whole letter into the link" },
      { hash: "5f2d9b1", date: "2026-08-30", message: "darkroom: halation pass for bright highlights" },
      { hash: "b7c4e60", date: "2026-07-14", message: "torch: move beam to css vars, drop re-renders" },
      { hash: "29aa310", date: "2026-06-03", message: "surface: five-layer paper recipe + seeded tilt" },
    ],
    clue: "the torch was the first feature, not the last",
    marginalia: ["this file is about this file", "FILE No. 0002 · ONGOING", "look under the masthead"],
  },
  {
    id: "3",
    title: "The Lantern Case",
    year: 2024,
    featured: true,
    exhibit: "schedule",
    description:
      "Field crews kept arriving at the wrong house at the wrong hour. The brief: a scheduling app that works in a basement with no signal and still agrees with the office.",
    subtitle: "Technical Analysis Report • Offline Systems",
    evidence: ["React", "PWA", "IndexedDB", "Node.js", "PostgreSQL"],
    redacted: ["IndexedDB"],
    summary:
      "The crews' phones lost signal the moment they went below ground, and the old app lost their updates with it. I rebuilt it as an offline-first PWA: every change is written locally first, queued, and replayed to the server with conflict rules the dispatchers agreed to in plain English.",
    obstacles: [
      "Updates vanished whenever a phone lost signal — witnesses went silent",
      "Two dispatchers editing one job overwrote each other",
      "The app took twelve seconds to open on older phones",
    ],
    solutions: [
      "Local-first writes to IndexedDB with a replayable change queue",
      "Field-level merge rules, with a visible note when a human must decide",
      "Pre-cached shell and lazy routes; the job list renders from local data",
    ],
    results: [
      "No lost updates reported since launch",
      "Open-to-usable time under two seconds on the oldest supported phone",
      "Missed appointments down by a third in the first quarter",
    ],
    timeline: [
      { date: "Feb 2024", note: "Rode along with two crews for a week" },
      { date: "Apr 2024", note: "Offline queue and merge rules prototyped" },
      { date: "Jul 2024", note: "Pilot with one depot" },
      { date: "Oct 2024", note: "Rolled out to all depots" },
    ],
    links: [{ label: "Case Notes", url: "https://example.com/" }],
    testimonies: ["ines"],
    commits: [
      { hash: "4c1e7d0", date: "2024-10-02", message: "release: all depots" },
      { hash: "91a0f3b", date: "2024-07-22", message: "sync: field-level merge with human-decides note" },
      { hash: "0de55c9", date: "2024-04-15", message: "offline: indexeddb change queue + replay" },
    ],
    clue: "the basement was the real client",
    marginalia: ["no signal, no excuses", "FILE No. 0003 · CLOSED", "the crews kept the old phones"],
  },
  {
    id: "4",
    title: "The Courier Case",
    year: 2023,
    featured: true,
    exhibit: "tracking",
    description:
      "Parcels moved, but the tracking page only found out an hour later. The brief: show a courier's progress in real time without melting the database.",
    subtitle: "Technical Analysis Report • Real-Time Systems",
    evidence: ["Next.js", "GraphQL", "WebSockets", "Redis", "Docker"],
    redacted: ["Redis"],
    summary:
      "The tracking page polled a reporting database that refreshed hourly. I put a small event stream between the courier app and the page: location pings flow through Redis, fan out over WebSockets, and the database only stores the stops that matter.",
    obstacles: [
      "Tracking lagged an hour behind the courier — stale testimony",
      "Polling every customer page hammered the reporting database",
      "Ping storms during rush hour dropped messages",
    ],
    solutions: [
      "An event stream from courier app to page through Redis pub/sub",
      "WebSocket fan-out with per-parcel channels; the database stores stops only",
      "Back-pressure and coalescing so only the latest ping per courier is sent",
    ],
    results: [
      "Tracking updates arrive within two seconds",
      "Database load from tracking down by 85%",
      "Support tickets asking 'where is my parcel' fell by half",
    ],
    timeline: [
      { date: "Mar 2023", note: "Measured the lag and the polling load" },
      { date: "May 2023", note: "Event stream and fan-out in staging" },
      { date: "Jul 2023", note: "Live for one city" },
      { date: "Sep 2023", note: "Live everywhere; polling retired" },
    ],
    links: [{ label: "Architecture Sketch", url: "https://example.com/" }],
    testimonies: ["osric"],
    commits: [
      { hash: "8f0c2e4", date: "2023-09-12", message: "chore: retire tracking poller" },
      { hash: "d3b19a7", date: "2023-07-03", message: "ws: coalesce pings, latest per courier" },
      { hash: "62ae0f5", date: "2023-05-19", message: "feat: redis pubsub tracking stream" },
    ],
    clue: "the hour of lag was a cron job",
    marginalia: ["they never stop moving", "FILE No. 0004 · CLOSED", "check the rush-hour logs"],
  },
];

export const allEvidenceTags = Array.from(new Set(cases.flatMap((c) => c.evidence))).sort();

export function getCase(id: string) {
  return cases.find((c) => c.id === id);
}
