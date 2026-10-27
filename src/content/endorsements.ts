// Placeholder testimonials. The people and quotes are fictional stand-ins
// for real letters; replace them with endorsements you actually received.

export type Endorsement = {
  id: string;
  name: string;
  role: string;
  date: string;
  link?: string;
  quote: string;
  letter: string[];
};

export const endorsements: Endorsement[] = [
  {
    id: "mabel",
    name: "Mabel Thornquist",
    role: "Head of Payments at Larkspur",
    date: "Mar 2, 2026",
    link: "https://example.com/",
    quote:
      "Ezra treats a ledger the way a good editor treats a manuscript: every number must earn its place. Our month-end close went from dread to a routine afternoon, and he made it look like nothing happened at all.",
    letter: [
      "To whom it may concern,",
      "Ezra treats a ledger the way a good editor treats a manuscript: every number must earn its place. When he joined, our month-end close took two people two days and a great deal of coffee.",
      "He did not start by writing code. He sat with finance for a week, wrote down every exception they handled by hand, and only then designed the matcher. Our close is now a routine afternoon.",
      "I would hire him again without a second interview.",
    ],
  },
  {
    id: "osric",
    name: "Osric Bellweather",
    role: "Engineering Manager at Northwind",
    date: "Oct 12, 2025",
    link: "https://example.com/",
    quote:
      "Calm under pressure is a cliché until you watch someone debug a failed payout run at two in the morning without raising his voice once. Ezra writes the runbook while he fixes the problem.",
    letter: [
      "Calm under pressure is a cliché until you watch someone debug a failed payout run at two in the morning without raising his voice once.",
      "Ezra writes the runbook while he fixes the problem, which is why the next person who meets that problem fixes it in ten minutes.",
      "He was the engineer other engineers went to when a question had no owner.",
    ],
  },
  {
    id: "ines",
    name: "Inès Marchetti",
    role: "Founder at Copperline",
    date: "Apr 3, 2023",
    quote:
      "Clients asked for Ezra by name. He has the rare habit of explaining a technical trade-off so plainly that the client chooses the boring, correct option — and thanks him for it.",
    letter: [
      "Clients asked for Ezra by name.",
      "He has the rare habit of explaining a technical trade-off so plainly that the client chooses the boring, correct option — and thanks him for it.",
      "Our shared component kit is still in use, two years after he left.",
    ],
  },
  {
    id: "dov",
    name: "Dov Abernathy",
    role: "Senior Engineer at Northwind",
    date: "Sep 30, 2025",
    link: "https://example.com/",
    quote:
      "His pull requests read like case notes: what was wrong, what he tried, what he ruled out, and why the fix is the fix. Reviewing them taught me more than most books.",
    letter: [
      "His pull requests read like case notes: what was wrong, what he tried, what he ruled out, and why the fix is the fix.",
      "Reviewing them taught me more than most books did, and I have read a number of books.",
    ],
  },
  {
    id: "priya",
    name: "Priya Lindqvist",
    role: "QA Lead at Larkspur",
    date: "Feb 18, 2026",
    link: "https://example.com/",
    quote:
      "Ezra asks QA what scares us before he writes a line. The result is software that fails loudly in staging and quietly never in production. A pleasure to break things with.",
    letter: [
      "Ezra asks QA what scares us before he writes a line.",
      "The result is software that fails loudly in staging and quietly never in production. A pleasure to break things with.",
    ],
  },
  {
    id: "teodor",
    name: "Teodor Achterberg",
    role: "Owner, Wheelhouse Bicycle Co-op",
    date: "Jan 9, 2021",
    quote:
      "We ran the whole co-op off a spreadsheet nobody understood. Ezra turned it into a little app our volunteers actually like using, and taught us how to look after it ourselves.",
    letter: [
      "We ran the whole co-op off a spreadsheet nobody understood.",
      "Ezra turned it into a little app our volunteers actually like using, and he taught us how to look after it ourselves, which is the part I value most.",
    ],
  },
];
