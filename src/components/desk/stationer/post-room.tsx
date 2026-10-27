"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { decodeLetter, encodeLetter, type Letter } from "@/lib/letter-codec";
import { playSfx } from "@/lib/audio";
import { WaxSeal } from "@/components/locker/fittings";
import { Surface } from "@/components/ui/surface";
import { DeedSheet, LetterSheet, PosySheet } from "./sheets";

type State = { kind: "loading" } | { kind: "empty" } | { kind: "broken" } | { kind: "letter"; letter: Letter };

function Envelope({ letter, onOpen }: { letter: Letter; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group mx-auto block w-full max-w-lg cursor-pointer" aria-label="Break the seal and open the letter">
      <Surface id="envelope" variant="parchment" lift="deep" tilt={1.5} className="aspect-[16/10]" contentClassName="!absolute inset-0">
        <svg viewBox="0 0 160 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
          <path d="M0 0 L80 52 L160 0" fill="none" stroke="#5c4a3166" strokeWidth="0.6" />
          <path d="M0 100 L62 46 M160 100 L98 46" fill="none" stroke="#5c4a3133" strokeWidth="0.5" />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center translate-y-16">
            <p className="font-caveat text-3xl text-[var(--print-ink)]">{letter.to || "By hand"}</p>
            <p className="mt-1 type-label text-[0.55rem] text-[var(--print-ink-soft)]">Sealed at the Stationer&apos;s Cabinet</p>
          </div>
        </div>
        <WaxSeal label="OPEN" className="absolute left-1/2 top-[52%] z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110" rotate={-8} />
      </Surface>
      <p className="mt-6 text-center type-label text-[0.62rem] text-muted-foreground">Break the seal</p>
    </button>
  );
}

function ReplyCard({ to }: { to: string }) {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  return (
    <Surface id="reply" variant="index-card" lift="raised" className="p-6 text-[var(--print-ink)]">
      <p className="type-label text-[0.6rem] text-[var(--print-ink-soft)]">A card for your reply</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Write back…" className="mt-3 w-full resize-none border-b border-[var(--print-ink)]/30 bg-transparent font-caveat text-2xl focus:outline-none" />
      <button
        type="button"
        disabled={!text.trim()}
        onClick={async () => {
          const tok = await encodeLetter({ v: 1, hand: "pen", size: 100, dateline: new Date().toDateString(), salutation: `Dear ${to || "friend"},`, to: to || "", body: text, valediction: "Yours,", signed: "", reply: true });
          const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
          setLink(`${window.location.origin}${base}/post/#${tok}`);
          playSfx("seal", 0.4);
        }}
        className="mt-4 bg-[var(--print-ink)] px-4 py-2 font-serif text-sm uppercase tracking-wider text-[#f4eee0] disabled:opacity-40 cursor-pointer"
      >
        Seal the reply
      </button>
      {link && (
        <p className="mt-3 break-all font-typewriter text-xs">
          Send this link back: <a href={link} className="underline">{link}</a>
        </p>
      )}
    </Surface>
  );
}

export function PostRoom() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const read = async () => {
      const token = window.location.hash.slice(1);
      if (!token) return setState({ kind: "empty" });
      const letter = await decodeLetter(token);
      setState(letter ? { kind: "letter", letter } : { kind: "broken" });
      setOpen(false);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (state.kind === "loading") return <p className="text-center font-serif italic text-muted-foreground">Sorting the post…</p>;
  if (state.kind !== "letter")
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="font-serif text-2xl">{state.kind === "empty" ? "No letter in this envelope." : "This envelope arrived torn."}</p>
        <p className="mt-3 font-serif italic text-muted-foreground">
          {state.kind === "empty" ? "Letters arrive as links written at the stationer's cabinet." : "The link may have been cut short in transit. Ask the sender for it again."}
        </p>
        <Link href="/desk/stationer/" className="mt-6 inline-block border border-foreground/40 px-5 py-2 font-serif uppercase tracking-wider text-sm hover:bg-foreground hover:text-background">
          Write one yourself
        </Link>
      </div>
    );

  const { letter } = state;
  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <motion.div key="env" exit={{ opacity: 0, y: -20, rotate: -2 }} transition={{ duration: 0.4 }}>
          <Envelope
            letter={letter}
            onOpen={() => {
              playSfx("seal", 0.5);
              setTimeout(() => playSfx("rustle", 0.3), 250);
              setOpen(true);
            }}
          />
        </motion.div>
      ) : (
        <motion.div key="contents" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 0.68, 0.28, 1] }} className="mx-auto max-w-2xl space-y-8">
          <LetterSheet letter={letter} />
          {letter.deed && <DeedSheet letter={letter} />}
          {letter.posy && letter.posy.length > 0 && <PosySheet ids={letter.posy} />}
          {letter.reply && <ReplyCard to={letter.signed} />}
          <p className="text-center font-serif italic text-sm text-muted-foreground">
            This letter lives in its link and nowhere else. <Link href="/desk/stationer/" className="underline">Write one back</Link>.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
