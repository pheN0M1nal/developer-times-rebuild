import type { Record } from "@/content/records";
import { cn } from "@/lib/utils";

/** A 78 drawn in CSS: grooves stay still, only the conic sheen turns. */
export function Disc({ record, spinning = false, className }: { record: Pick<Record, "title" | "artist" | "year" | "disc">; spinning?: boolean; className?: string }) {
  return (
    <div className={cn("disc", className)} data-spinning={spinning ? "true" : "false"}>
      <div className="disc__sheen" />
      <div className="disc__label" style={{ background: `radial-gradient(circle at 40% 35%, color-mix(in oklab, ${record.disc} 80%, white), ${record.disc} 60%)` }}>
        <div className="px-[12%] leading-tight text-[#f6ead2]">
          <div className="font-typewriter text-[0.42rem] sm:text-[0.5rem] uppercase tracking-wider line-clamp-2">{record.title}</div>
          <div className="mt-0.5 font-typewriter text-[0.36rem] sm:text-[0.42rem] uppercase opacity-80 line-clamp-1">{record.artist}</div>
          <div className="mt-0.5 font-typewriter text-[0.36rem] sm:text-[0.42rem] opacity-70">{record.year}</div>
        </div>
      </div>
      <div className="disc__spindle" />
    </div>
  );
}

/** A worn card sleeve with the title blocked in gilt. */
export function Sleeve({ record, className, small = false }: { record: Pick<Record, "title" | "artist" | "sleeve" | "id">; className?: string; small?: boolean }) {
  return (
    <div
      className={cn("relative aspect-square overflow-hidden shadow-[0_8px_18px_-8px_#000000b0]", className)}
      style={{ backgroundColor: record.sleeve }}
    >
      <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: "var(--tex-hide)", backgroundSize: "200px" }} />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 40px #000000a0" }} />
      <div className={cn("absolute border border-[#d8b67a]/40", small ? "inset-[8%]" : "inset-[7%]")} />
      <div className="absolute inset-0 grid place-items-center p-[14%] text-center">
        <div>
          <div className={cn("font-serif uppercase text-[#ecdcbc] leading-tight", small ? "text-[0.5rem]" : "text-sm sm:text-base")}>{record.title}</div>
          {!small && <div className="mt-2 font-typewriter text-[0.5rem] uppercase tracking-widest text-[#ecdcbc]/50">{record.artist}</div>}
        </div>
      </div>
    </div>
  );
}
