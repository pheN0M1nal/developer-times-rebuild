import type { UnlockRule } from "@/lib/signals";
import { seeded } from "@/lib/utils";

// The record shelf. Every record, artist and label here is invented; the
// "recordings" are composed in the browser from each record's seed.

export type Record = {
  id: string;
  ord: number;
  title: string;
  artist: string;
  year: number;
  label: string;
  catalog: string;
  quote: string;
  about: string;
  why: string;
  margin: string;
  sleeve: string; // sleeve colour
  disc: string; // label colour
  key: number; // root note, MIDI
  tempo: number;
  mood: "rag" | "blues" | "stomp" | "lament";
  unlock: UnlockRule;
};

export const records: Record[] = [
  {
    id: "lamplighter-rag",
    ord: 1,
    title: "Lamplighter Rag",
    artist: "The Harbour Street Five",
    year: 1919,
    label: "Gull Records",
    catalog: "Gull 2041",
    quote: "The first record on the shelf, and the first argument about who wrote it.",
    about:
      "A five-piece band from the docks of Kestrel Bay who played the ferry crossings for tips. They cut four sides in a single afternoon in a hotel ballroom, with blankets nailed to the windows to keep the gulls out.",
    why: "Being first to ship is not the same as having invented the thing. I keep this one because it reminds me that the record shows who got to the studio, not who did the work.",
    margin: "the cornet player was never paid",
    sleeve: "#4a2a18",
    disc: "#9a3b22",
    key: 60,
    tempo: 132,
    mood: "rag",
    unlock: { kind: "default" },
  },
  {
    id: "night-ferry-one-step",
    ord: 2,
    title: "Night Ferry One-Step",
    artist: "The Harbour Street Five",
    year: 1920,
    label: "Gull Records",
    catalog: "Gull 2056",
    quote: "Faster than it needed to be. They had a boat to catch.",
    about: "The B-side of their second session, recorded twenty minutes before the last ferry. You can hear the drummer counting them home.",
    why: "Some of my best work was done against a deadline I resented. This record is the sound of that resentment turning into tempo.",
    margin: "listen for the foghorn at 0:14",
    sleeve: "#2f2a20",
    disc: "#6b4a1f",
    key: 62,
    tempo: 156,
    mood: "stomp",
    unlock: { kind: "default" },
  },
  {
    id: "cold-storage-blues",
    ord: 3,
    title: "Cold Storage Blues",
    artist: "Mae Corrigan",
    year: 1923,
    label: "Lantern Phono",
    catalog: "LP-118",
    quote: "Three verses about a warehouse, and somehow all of them are about leaving.",
    about: "A singer from the inland mill towns who recorded once, sold well, and refused every invitation to record again.",
    why: "Knowing when to stop is a skill. Mae had it in 1923; I am still practising.",
    margin: "she sang it in one take",
    sleeve: "#1f3b52",
    disc: "#24486a",
    key: 57,
    tempo: 84,
    mood: "blues",
    unlock: { kind: "visit", path: "/cases", label: "Open a case file", hint: "Go to Case Files and open any one of them. The record is filed the moment that page loads." },
  },
  {
    id: "switchboard-stomp",
    ord: 4,
    title: "Switchboard Stomp",
    artist: "Orrin Vale & His Operators",
    year: 1924,
    label: "Lantern Phono",
    catalog: "LP-131",
    quote: "A dance band named after a telephone exchange, which tells you everything about the year.",
    about: "Eleven musicians who worked days at the city telephone exchange. Their arrangements are full of call-and-response, which they insisted was a coincidence.",
    why: "Every system I have built has been a switchboard in disguise: something comes in, something decides, something goes out.",
    margin: "the bridge is a busy signal",
    sleeve: "#5d2b3f",
    disc: "#7a3350",
    key: 65,
    tempo: 144,
    mood: "stomp",
    unlock: { kind: "visit", path: "/desk", label: "Call at the desk", hint: "Go to the Desk page. Whoever signs the book gets this one." },
  },
  {
    id: "ledger-lament",
    ord: 5,
    title: "Ledger Lament",
    artist: "The Countinghouse Trio",
    year: 1926,
    label: "Gull Records",
    catalog: "Gull 2210",
    quote: "Piano, clarinet and a bookkeeper on brushes.",
    about: "Three clerks from a shipping office who played the lunchtime circuit. The pianist later became the firm's chief accountant and never mentioned the record again.",
    why: "It is the only song I know about reconciliation. It ends unresolved, which is accurate.",
    margin: "the last chord never lands",
    sleeve: "#3a3226",
    disc: "#8a6a2f",
    key: 55,
    tempo: 76,
    mood: "lament",
    unlock: { kind: "visit", path: "/press", label: "Read a press clipping", hint: "Go to the Press page and read one of the clippings. Arriving is enough." },
  },
  {
    id: "torchlight-shuffle",
    ord: 6,
    title: "Torchlight Shuffle",
    artist: "Dell Okafor's Night Owls",
    year: 1927,
    label: "Owl Electric",
    catalog: "OE-7",
    quote: "Recorded in the dark, after the studio lights failed.",
    about: "A late-night club band who finished their session by candle and a borrowed electric torch. The engineer kept the take because nobody could see well enough to stop.",
    why: "The torch on this site is named for this record. Some things are only visible when the rest is dark.",
    margin: "they kept the take",
    sleeve: "#1d1a14",
    disc: "#b0702a",
    key: 58,
    tempo: 112,
    mood: "blues",
    unlock: { kind: "event", id: "torch-on", label: "Light the torch", hint: "Switch to the night edition and strike the lamp in the header." },
  },
  {
    id: "margin-notes",
    ord: 7,
    title: "Margin Notes",
    artist: "Florentine Abernethy",
    year: 1928,
    label: "Owl Electric",
    catalog: "OE-22",
    quote: "A solo piano piece written in the margins of a hymnal.",
    about: "An organist who wrote dance tunes in pencil between the hymns and recorded exactly one of them, under a different name.",
    why: "The best ideas I have had were pencilled next to something else.",
    margin: "found under the second verse",
    sleeve: "#4a3566",
    disc: "#5e4a80",
    key: 63,
    tempo: 96,
    mood: "lament",
    unlock: {
      kind: "secret",
      id: "margin-note",
      label: "Pencilled beside the record",
      hint: "Torch work. Light the torch in the night edition, then sweep the beam over the empty margin to the upper right of this journal page and hold it there.",
    },
  },
  {
    id: "the-sealed-side",
    ord: 8,
    title: "The Sealed Side",
    artist: "Unknown",
    year: 1929,
    label: "Unlabelled test pressing",
    catalog: "—",
    quote: "No label, no artist, one word scratched in the run-out groove: LOCKER.",
    about: "Found in a crate of test pressings with no paperwork. Nobody has claimed it.",
    why: "Every archive needs one item that explains nothing. This is ours.",
    margin: "LOCKER",
    sleeve: "#20160e",
    disc: "#2e2117",
    key: 53,
    tempo: 66,
    mood: "lament",
    unlock: {
      kind: "secret",
      id: "locker-note",
      label: "Pencilled in the locker",
      hint: "Torch work, but not on this page. Go back to The Evidence Locker and light the wall below the taped photograph on the left-hand rail.",
    },
  },
];

/** Waveform peaks, computed once at build time from each record's seed. */
export function peaks(r: Record, n = 96) {
  const rnd = seeded(r.id);
  const out: number[] = [];
  let v = 0.4;
  for (let i = 0; i < n; i++) {
    const phrase = 0.55 + 0.45 * Math.sin((i / n) * Math.PI * (r.mood === "rag" ? 6 : 4));
    v = v * 0.55 + rnd() * 0.45;
    out.push(Number(Math.max(0.08, Math.min(1, v * phrase + 0.1)).toFixed(3)));
  }
  return out;
}
