"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Printer } from "lucide-react";
import { specimens } from "@/content/specimens";
import { HANDS, encodeLetter, type Letter } from "@/lib/letter-codec";
import { playSfx } from "@/lib/audio";
import { asset, cn } from "@/lib/utils";
import { Flower } from "./flower";
import { DeedSheet, LetterSheet, PosySheet } from "./sheets";

const NAMES = ["Margaret", "Thomas", "my dear Ada", "Uncle Leopold", "Mrs. Fairweather", "the Night Editor", "Cousin Theo", "Eleanor"];
const SIGNS = ["E. Quill", "Your loving niece", "A friend of the paper", "Ottoline", "J. Ashdown", "The Archivist"];
const KEY = "stationer-draft-v1";

const field =
  "w-full border border-foreground/30 bg-transparent px-3 py-2 font-serif placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/70 shadow-[2px_2px_0_0_color-mix(in_oklab,var(--foreground)_10%,transparent)]";
const lab = "mb-1.5 block font-grotesk text-[0.68rem] uppercase tracking-[0.25em] text-foreground/80";

function datelineFor(d: Date) {
  const ord = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth", "thirty-first"];
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  return `The ${ord[d.getDate() - 1]} of ${month}, ${d.getFullYear()}`;
}

const starter: Letter = {
  v: 1,
  hand: "pen",
  size: 100,
  dateline: "",
  salutation: "My dear friend,",
  to: "",
  body:
    "It has been a week of small weather and I have thought of you in most of it. The garden is doing what it does in June, which is to say too much at once, and I have given up trying to keep the border in any order.\n\nWrite when you have a moment. There is no news here worth the postage, but I would rather hear yours than have none.",
  valediction: "Yours affectionately,",
  signed: "",
};

export function Cabinet() {
  const [mode, setMode] = useState<"letter" | "posy">("letter");
  const [letter, setLetter] = useState<Letter>(starter);
  const [deedOn, setDeedOn] = useState(false);
  const [gift, setGift] = useState("one afternoon, unhurried, at a time of your choosing");
  const [posy, setPosy] = useState<string[]>(["forget-me-not", "rosemary", "daisy"]);
  const [enclose, setEnclose] = useState({ posy: false, reply: false });
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setLetter({ ...starter, ...d.letter });
        if (d.posy) setPosy(d.posy);
        if (d.gift) setGift(d.gift);
      } else setLetter((l) => ({ ...l, dateline: datelineFor(new Date()) }));
    } catch {
      setLetter((l) => ({ ...l, dateline: datelineFor(new Date()) }));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ letter, posy, gift }));
    } catch {}
  }, [letter, posy, gift, loaded]);

  const sealed: Letter = useMemo(
    () => ({ ...letter, deed: deedOn ? { gift } : undefined, posy: enclose.posy ? posy : undefined, reply: enclose.reply || undefined }),
    [letter, deedOn, gift, posy, enclose],
  );

  useEffect(() => {
    let live = true;
    encodeLetter(sealed).then((tok) => {
      if (!live) return;
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      setLink(`${window.location.origin}${base}/post/#${tok}`);
    });
    return () => {
      live = false;
    };
  }, [sealed]);

  const set = <K extends keyof Letter>(k: K, v: Letter[K]) => setLetter((l) => ({ ...l, [k]: v }));
  const togglePosy = (id: string) => setPosy((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 9 ? p : [...p, id]));
  const len = link.length;
  const meter = Math.min(1, len / 2000);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex gap-2" role="tablist">
          {(["letter", "posy"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn("px-4 py-2 font-grotesk text-xs uppercase tracking-[0.25em] border cursor-pointer", mode === m ? "bg-foreground text-background border-foreground" : "border-foreground/30 hover:bg-foreground/5")}
            >
              {m === "letter" ? "Letter" : "Posy sheet"}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 bg-foreground px-5 py-3 font-serif text-sm uppercase tracking-wider text-background hover:opacity-90 cursor-pointer">
          <Printer className="h-4 w-4" /> Print this sheet
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5 print:hidden">
          {mode === "letter" ? (
            <>
              <div>
                <span className={lab}>The hand</span>
                <div className="flex flex-wrap gap-2">
                  {HANDS.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => set("hand", h.id)}
                      aria-pressed={letter.hand === h.id}
                      className={cn("px-4 py-2 font-grotesk text-xs uppercase tracking-[0.2em] border cursor-pointer", letter.hand === h.id ? "bg-foreground text-background border-foreground" : "border-foreground/30 hover:bg-foreground/5")}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 font-serif italic text-sm text-muted-foreground">{HANDS.find((h) => h.id === letter.hand)?.note}</p>
              </div>
              <div>
                <label className={lab} htmlFor="st-size">Size</label>
                <input id="st-size" type="range" min={80} max={140} value={letter.size} onChange={(e) => set("size", Number(e.target.value))} className="w-full accent-[var(--rust)]" />
              </div>
              <div>
                <label className={lab} htmlFor="st-date">Dateline</label>
                <input id="st-date" className={field} value={letter.dateline} onChange={(e) => set("dateline", e.target.value)} />
              </div>
              <div>
                <label className={lab} htmlFor="st-sal">Salutation</label>
                <input id="st-sal" className={field} value={letter.salutation} onChange={(e) => set("salutation", e.target.value)} />
              </div>
              <div>
                <label className={lab} htmlFor="st-to">Addressed to</label>
                <div className="flex gap-2">
                  <input id="st-to" className={field} placeholder="Follows the salutation" value={letter.to} onChange={(e) => set("to", e.target.value)} />
                  <button type="button" onClick={() => set("to", NAMES[Math.floor(Math.random() * NAMES.length)])} className="shrink-0 border border-foreground/30 px-3 font-grotesk text-xs uppercase tracking-[0.2em] hover:bg-foreground/5 cursor-pointer">
                    Suggest
                  </button>
                </div>
                <p className="mt-1.5 font-serif italic text-xs text-muted-foreground">Written on the face of the envelope, and taken as the deed&apos;s donee.</p>
              </div>
              <div>
                <label className={lab} htmlFor="st-body">The letter</label>
                <textarea id="st-body" className={cn(field, "h-56 resize-y leading-relaxed")} value={letter.body} onChange={(e) => set("body", e.target.value)} />
              </div>
              <div>
                <label className={lab} htmlFor="st-val">Valediction</label>
                <input id="st-val" className={field} value={letter.valediction} onChange={(e) => set("valediction", e.target.value)} />
              </div>
              <div>
                <label className={lab} htmlFor="st-sig">Signed</label>
                <div className="flex gap-2">
                  <input id="st-sig" className={field} placeholder="Your name, in a pen" value={letter.signed} onChange={(e) => set("signed", e.target.value)} />
                  <button type="button" onClick={() => set("signed", SIGNS[Math.floor(Math.random() * SIGNS.length)])} className="shrink-0 border border-foreground/30 px-3 font-grotesk text-xs uppercase tracking-[0.2em] hover:bg-foreground/5 cursor-pointer">
                    Suggest
                  </button>
                </div>
              </div>
              <div className="border-t border-foreground/20 pt-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={deedOn} onChange={(e) => setDeedOn(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--rust)]" />
                  <span>
                    <span className="font-serif">Enclose a deed of gift</span>
                    <span className="block font-serif italic text-xs text-muted-foreground">A second sheet, executed the same day, in the same name</span>
                  </span>
                </label>
                {deedOn && <input className={cn(field, "mt-3")} aria-label="The gift" value={gift} onChange={(e) => setGift(e.target.value)} />}
              </div>
            </>
          ) : (
            <div>
              <span className={lab}>The specimen drawer · choose up to nine</span>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {specimens.map((s) => {
                  const on = posy.includes(s.id);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => togglePosy(s.id)}
                        aria-pressed={on}
                        className={cn("relative w-full border p-2 text-center transition-colors cursor-pointer", on ? "border-[var(--rust)] bg-[var(--rust)]/5" : "border-foreground/15 hover:border-foreground/40")}
                      >
                        <span className="absolute left-1.5 top-1 font-typewriter text-[0.55rem] text-muted-foreground">{String(s.ord).padStart(2, "0")}</span>
                        {on && <Check className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-[var(--rust)]" />}
                        <Flower s={s} className="mx-auto h-20 w-auto" />
                        <span className="mt-1 block font-serif text-xs">{s.name}</span>
                        <span className="block font-serif italic text-[0.6rem] text-muted-foreground leading-tight">{s.meaning}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="border border-foreground/25 bg-foreground/[0.03] p-5">
            <p className="font-grotesk text-xs uppercase tracking-[0.3em]">Seal the envelope</p>
            <p className="mt-2 font-serif text-sm leading-relaxed text-foreground/85">
              The whole envelope is folded into the link itself — the link <em>is</em> the letter, so there is nothing to expire and nothing for the other
              person to lose access to. Whoever opens it gets a sealed envelope with your name on it and takes out what you put in.
            </p>
            <ul className="mt-4 divide-y divide-foreground/15 border-y border-foreground/15">
              <li className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 text-[var(--rust)]" />
                <span>
                  <span className="font-serif">The letter</span>
                  <span className="block font-serif italic text-xs text-muted-foreground">{letter.to ? `Addressed to ${letter.to}` : "No name yet — fill in “Addressed to” or it goes out “By hand”"}</span>
                </span>
              </li>
              <li className="flex items-start gap-3 py-3">
                <input type="checkbox" checked={deedOn} onChange={(e) => setDeedOn(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--rust)]" aria-label="Enclose the deed of gift" />
                <span>
                  <span className="font-serif">The deed of gift</span>
                  <span className="block font-serif italic text-xs text-muted-foreground">{deedOn ? gift : "Off. Tick it here or on the letter to engross one"}</span>
                </span>
              </li>
              <li className="flex items-start gap-3 py-3">
                <input type="checkbox" checked={enclose.posy} onChange={(e) => setEnclose((x) => ({ ...x, posy: e.target.checked }))} className="mt-1 h-4 w-4 accent-[var(--rust)]" aria-label="Enclose the posy sheet" />
                <span>
                  <span className="font-serif">The posy sheet</span>
                  <span className="block font-serif italic text-xs text-muted-foreground">{posy.length} specimens from the drawer</span>
                </span>
              </li>
              <li className="flex items-start gap-3 py-3">
                <input type="checkbox" checked={enclose.reply} onChange={(e) => setEnclose((x) => ({ ...x, reply: e.target.checked }))} className="mt-1 h-4 w-4 accent-[var(--rust)]" aria-label="Enclose a reply card" />
                <span>
                  <span className="font-serif">A card for their reply</span>
                  <span className="block font-serif italic text-xs text-muted-foreground">{enclose.reply ? "On. They can write back from the page." : "Off. A letter without one cannot be answered from the page"}</span>
                </span>
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <input readOnly value={link} aria-label="The sealed letter link" className="min-w-0 flex-1 border border-foreground/30 bg-background px-3 py-2 font-typewriter text-xs" onFocus={(e) => e.currentTarget.select()} />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(link);
                    setCopied(true);
                    playSfx("seal", 0.4);
                    setTimeout(() => setCopied(false), 1600);
                  } catch {}
                }}
                className="shrink-0 bg-foreground px-5 font-serif text-sm uppercase tracking-wider text-background cursor-pointer"
              >
                {copied ? "Sealed" : "Copy link"}
              </button>
            </div>
            <div className="mt-3 h-1 bg-foreground/10">
              <div className={cn("h-full transition-[width]", len > 2000 ? "bg-[var(--rust)]" : "bg-foreground/60")} style={{ width: `${meter * 100}%` }} />
            </div>
            <p className="mt-2 font-serif text-xs text-muted-foreground">
              {len} characters — {len > 2000 ? "long for some chat apps; email will carry it fine." : "comfortably inside what every app carries."}
            </p>
            <a href={link || asset("/post/")} target="_blank" rel="noreferrer" className="mt-2 inline-block font-serif italic text-sm underline decoration-dotted underline-offset-4">
              Open it yourself first
            </a>
          </div>
        </div>

        <div className="space-y-6 print:col-span-2">
          <p className={cn(lab, "print:hidden")}>Proof</p>
          {mode === "letter" ? (
            <>
              <LetterSheet letter={letter} />
              {deedOn && <DeedSheet letter={{ ...letter, deed: { gift } }} />}
            </>
          ) : (
            <PosySheet ids={posy} />
          )}
        </div>
      </div>
    </div>
  );
}
