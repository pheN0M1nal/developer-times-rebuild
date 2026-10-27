import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseFile } from "@/content/cases";
import { pad } from "@/lib/utils";
import { ExhibitMock } from "./exhibit-mock";

function Corners() {
  const c = "absolute h-6 w-6 border-[var(--ember)] pointer-events-none";
  return (
    <>
      <span className={`${c} top-2 right-2 border-t-2 border-r-2`} />
      <span className={`${c} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${c} bottom-2 right-2 border-b-2 border-r-2 h-3`} />
    </>
  );
}

export function ClassifiedStamp({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute left-1/2 bottom-5 -translate-x-1/2 rotate-[-10deg] border-2 border-[var(--rust)] px-2 py-0.5 font-typewriter text-[0.6rem] font-bold tracking-[0.3em] text-[var(--rust)] opacity-75 mix-blend-multiply dark:mix-blend-screen ${className}`}
    >
      CLASSIFIED
    </span>
  );
}

/** A folder print: drawn exhibit, grain, corner marks, a classified stamp. */
export function CaseCard({ c }: { c: CaseFile }) {
  return (
    <article className="group w-[300px] sm:w-[320px] shrink-0 border border-foreground/20 bg-background p-3 shadow-[0_6px_18px_-10px_#140c048c] transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/cases/${c.id}/`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border border-foreground/10 text-foreground">
          <ExhibitMock kind={c.exhibit} className="h-full w-full sepia-[0.35] dark:sepia-0 transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none" style={{ backgroundImage: "var(--tex-grain)" }} />
          <Corners />
          <ClassifiedStamp />
        </div>
      </Link>
      <h3 className="mt-3 font-serif font-bold text-lg uppercase tracking-wide text-foreground">{c.title}</h3>
      <p className="font-typewriter text-xs text-muted-foreground mt-1">
        Case #{pad(Number(c.id))} • File Ref: <span className="bg-foreground/80 text-transparent select-none">███████████</span> • {c.year}
      </p>
      <Link
        href={`/cases/${c.id}/`}
        className="mt-3 flex items-center justify-center gap-2 border border-foreground/40 py-2.5 font-serif text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
      >
        Inspect Case <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
