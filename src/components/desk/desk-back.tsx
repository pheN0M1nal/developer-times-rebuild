import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** The little "← The Desk · Bureau Tool No. 00x" bar above each instrument. */
export function DeskBack({ no, right }: { no: string; right?: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-8">
      <Link href="/desk/" className="inline-flex items-center gap-2 type-label text-[0.6rem] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> The Desk
      </Link>
      <span className="type-label text-[0.6rem] text-muted-foreground tracking-[0.3em]">Bureau Tool No. {no}</span>
      <span className="min-w-20 flex justify-end">{right}</span>
    </div>
  );
}
