import { specimens } from "@/content/specimens";
import { HANDS, type Letter } from "@/lib/letter-codec";
import { Surface } from "@/components/ui/surface";
import { WaxSeal } from "@/components/locker/fittings";
import { cn } from "@/lib/utils";
import { Flower } from "./flower";

export function handOf(letter: Pick<Letter, "hand" | "size">) {
  const h = HANDS.find((x) => x.id === letter.hand) ?? HANDS[0];
  return { fontFamily: h.font, fontSize: `${(letter.size / 100) * h.scale}rem` };
}

export function LetterSheet({ letter, id = "letter", className }: { letter: Letter; id?: string; className?: string }) {
  const style = handOf(letter);
  const paras = letter.body.split(/\n\s*\n/).filter((p) => p.trim());
  return (
    <Surface id={id} variant="parchment-light" lift="raised" className={cn("stationer-sheet p-8 sm:p-12 text-[var(--print-ink)]", className)}>
      <p className="type-label text-[0.55rem] text-[var(--print-ink-faint)]">{letter.dateline}</p>
      <div className="mt-6 leading-[1.75]" style={style}>
        <p>{letter.salutation}</p>
        {paras.map((p, i) => (
          <p key={i} className="mt-4 whitespace-pre-line">
            {p}
          </p>
        ))}
        <p className="mt-8">{letter.valediction}</p>
        {letter.signed && <p className="mt-2 text-[1.5em] leading-none">{letter.signed}</p>}
      </div>
    </Surface>
  );
}

export function DeedSheet({ letter, id = "deed" }: { letter: Letter; id?: string }) {
  return (
    <Surface id={id} variant="parchment" lift="raised" foxed className="stationer-sheet p-8 sm:p-12 text-[var(--print-ink)]">
      <div className="border-4 border-double border-[var(--print-ink-soft)]/50 p-6 sm:p-8 text-center">
        <p className="type-label text-[0.6rem] text-[var(--print-ink-soft)] tracking-[0.4em]">Deed of Gift</p>
        <p className="mt-6 font-pen text-3xl leading-relaxed">Know all by these presents</p>
        <p className="mt-4 font-serif italic leading-relaxed">
          that I, <span className="font-pen text-2xl not-italic">{letter.signed || "the undersigned"}</span>, being of sound mind and warm heart, do hereby give
          and grant unto <span className="font-pen text-2xl not-italic">{letter.to || "the bearer"}</span>, freely and for no consideration whatsoever,
        </p>
        <p className="mt-5 font-pen text-3xl leading-snug text-[var(--print-ink)]">{letter.deed?.gift || "one afternoon, unhurried"}</p>
        <p className="mt-5 font-serif italic">to have and to hold, from this day forward.</p>
        <p className="mt-8 type-label text-[0.58rem] text-[var(--print-ink-soft)]">Executed {letter.dateline}</p>
        <div className="mt-6 flex items-center justify-center gap-6">
          <span className="font-pen text-3xl">{letter.signed}</span>
          <WaxSeal label="SEAL" className="h-14 w-14" rotate={-8} />
        </div>
      </div>
    </Surface>
  );
}

export function PosySheet({ ids, id = "posy" }: { ids: string[]; id?: string }) {
  const picked = ids.map((x) => specimens.find((s) => s.id === x)).filter(Boolean) as typeof specimens;
  return (
    <Surface id={id} variant="parchment-light" lift="raised" className="stationer-sheet p-8 sm:p-10 text-[var(--print-ink)]">
      <p className="text-center type-label text-[0.6rem] text-[var(--print-ink-soft)] tracking-[0.4em]">A Posy · Pressed &amp; Mounted</p>
      {picked.length === 0 ? (
        <p className="mt-10 text-center font-serif italic text-[var(--print-ink-soft)]">The sheet is empty. Choose specimens from the drawer.</p>
      ) : (
        <ul className={cn("mt-6 grid gap-6", picked.length > 4 ? "grid-cols-3" : "grid-cols-2")}>
          {picked.map((s) => (
            <li key={s.id} className="text-center">
              <Flower s={s} className="mx-auto h-40 w-auto" />
              <p className="mt-1 font-serif text-lg">{s.name}</p>
              <p className="font-serif italic text-xs text-[var(--print-ink-soft)]">{s.latin}</p>
              <p className="mt-1 font-caveat text-lg leading-tight">{s.meaning}</p>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}
