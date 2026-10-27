import { cn } from "@/lib/utils";

export function Paperclip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 64" className={cn("pointer-events-none", className)} aria-hidden>
      <path
        d="M8 54 V14 a6 6 0 0 1 12 0 v38 a9 9 0 0 1 -18 0 V18"
        fill="none"
        stroke="#9a948a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M8 54 V14 a6 6 0 0 1 12 0 v38 a9 9 0 0 1 -18 0 V18" fill="none" stroke="#e8e4dc" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function WaxSeal({ label, className, rotate = 0 }: { label: string; className?: string; rotate?: number }) {
  return (
    <span className={cn("wax-seal grid place-content-center", className)} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <span className="type-label text-[0.55rem]" style={{ color: "rgba(255,225,205,.62)", letterSpacing: "0.1em" }}>
        {label}
      </span>
    </span>
  );
}

export function Tape({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden className={cn("tape absolute block h-6 w-20", className)} style={style} />;
}
