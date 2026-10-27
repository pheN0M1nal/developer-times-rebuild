import type { CaseFile } from "@/content/cases";

// Drawn evidence: a small schematic of each product instead of a screenshot.
// Everything uses currentColor so it prints in ink on either theme.

const ink = "currentColor";

function Ledger() {
  const rows = [
    ["0412", "Payout · Lantern Co.", "1,240.00", true],
    ["0413", "Refund · R-9921", "-86.50", true],
    ["0414", "Payout · Harbour Ltd", "3,005.10", true],
    ["0415", "FX gain EUR→USD", "12.04", false],
    ["0416", "Payout · Copper & Sons", "760.00", true],
    ["0417", "Bank line #88213", "??", false],
  ] as const;
  return (
    <>
      <text x="24" y="34" fontSize="15" fontWeight="700" fill={ink} fontFamily="var(--font-serif)">Reconciliation · Night Run</text>
      <text x="376" y="34" fontSize="9" fill={ink} opacity="0.6" textAnchor="end" fontFamily="var(--font-typewriter)">92% MATCHED</text>
      <line x1="24" y1="44" x2="376" y2="44" stroke={ink} strokeOpacity="0.5" />
      {rows.map(([id, label, amt, ok], i) => {
        const y = 66 + i * 26;
        return (
          <g key={id} fontFamily="var(--font-typewriter)" fontSize="10" fill={ink}>
            <text x="24" y={y} opacity="0.55">{id}</text>
            <text x="64" y={y}>{label}</text>
            <text x="300" y={y} textAnchor="end">{amt}</text>
            <rect x="316" y={y - 10} width="60" height="14" rx="2" fill="none" stroke={ink} strokeOpacity={ok ? 0.8 : 0.35} strokeDasharray={ok ? undefined : "3 2"} />
            <text x="346" y={y} textAnchor="middle" fontSize="8" opacity={ok ? 0.9 : 0.5}>{ok ? "PAIRED" : "REVIEW"}</text>
            <line x1="24" y1={y + 8} x2="376" y2={y + 8} stroke={ink} strokeOpacity="0.12" />
          </g>
        );
      })}
      {[34, 52, 40, 70, 58, 86, 92].map((h, i) => (
        <rect key={i} x={30 + i * 20} y={286 - h * 0.6} width="12" height={h * 0.6} fill={ink} opacity={0.25 + i * 0.08} />
      ))}
      <text x="190" y="284" fontSize="9" fill={ink} opacity="0.6" fontFamily="var(--font-typewriter)">CLOSE TIME · DAYS ↓</text>
    </>
  );
}

function Newspaper() {
  return (
    <>
      <text x="200" y="40" fontSize="22" fontWeight="900" fill={ink} textAnchor="middle" fontFamily="var(--font-serif)">THE DEVELOPER TIMES</text>
      <line x1="24" y1="50" x2="376" y2="50" stroke={ink} strokeWidth="2" />
      <line x1="24" y1="54" x2="376" y2="54" stroke={ink} strokeOpacity="0.6" />
      <rect x="24" y="66" width="120" height="150" fill="none" stroke={ink} strokeOpacity="0.7" />
      <path d="M50 216 L84 120 L118 216" fill={ink} opacity="0.2" />
      <circle cx="84" cy="104" r="16" fill={ink} opacity="0.25" />
      <text x="160" y="80" fontSize="14" fontWeight="700" fill={ink} fontFamily="var(--font-serif)">Ink Over Glitter</text>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="160" y1={96 + i * 12} x2={i === 8 ? 300 : 376} y2={96 + i * 12} stroke={ink} strokeOpacity="0.35" strokeWidth="4" />
      ))}
      {[0, 1, 2].map((c) => (
        <g key={c}>
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i} x1={24 + c * 120} y1={236 + i * 10} x2={130 + c * 120} y2={236 + i * 10} stroke={ink} strokeOpacity="0.3" strokeWidth="3" />
          ))}
        </g>
      ))}
    </>
  );
}

function Schedule() {
  const jobs = [
    [0, 1, 2, "Boiler · 14 Elm"],
    [1, 0, 1, "Survey"],
    [2, 2, 3, "Meter swap · Dock Rd"],
    [3, 1, 1, "Leak"],
    [4, 3, 2, "Install · Hill St"],
  ] as const;
  return (
    <>
      <text x="24" y="34" fontSize="15" fontWeight="700" fill={ink} fontFamily="var(--font-serif)">Crew Board · Thursday</text>
      <text x="376" y="34" fontSize="9" fill={ink} opacity="0.6" textAnchor="end" fontFamily="var(--font-typewriter)">OFFLINE · 3 QUEUED</text>
      {["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => (
        <text key={d} x={60 + i * 56} y="60" fontSize="9" fill={ink} opacity="0.6" textAnchor="middle" fontFamily="var(--font-typewriter)">{d}</text>
      ))}
      {Array.from({ length: 6 }, (_, r) => (
        <line key={r} x1="32" y1={70 + r * 36} x2="316" y2={70 + r * 36} stroke={ink} strokeOpacity="0.15" />
      ))}
      {jobs.map(([d, row, len, label], i) => (
        <g key={i}>
          <rect x={36 + d * 56} y={74 + row * 36} width="48" height={len * 36 - 8} rx="3" fill={ink} opacity={0.12 + (i % 3) * 0.06} stroke={ink} strokeOpacity="0.5" />
          <text x={40 + d * 56} y={88 + row * 36} fontSize="7" fill={ink} fontFamily="var(--font-typewriter)">{label.slice(0, 9)}</text>
        </g>
      ))}
      <rect x="328" y="70" width="52" height="96" rx="8" fill="none" stroke={ink} strokeOpacity="0.7" />
      <rect x="334" y="82" width="40" height="64" fill={ink} opacity="0.12" />
      <circle cx="354" cy="156" r="3" fill={ink} opacity="0.6" />
      <text x="354" y="186" fontSize="8" fill={ink} opacity="0.6" textAnchor="middle" fontFamily="var(--font-typewriter)">PWA</text>
    </>
  );
}

function Tracking() {
  return (
    <>
      <text x="24" y="34" fontSize="15" fontWeight="700" fill={ink} fontFamily="var(--font-serif)">Parcel #A-7741 · En route</text>
      <text x="376" y="34" fontSize="9" fill={ink} opacity="0.6" textAnchor="end" fontFamily="var(--font-typewriter)">LIVE · 2s</text>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={24 + i * 44} y1="48" x2={24 + i * 44} y2="280" stroke={ink} strokeOpacity="0.1" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h${i}`} x1="24" y1={48 + i * 46} x2="376" y2={48 + i * 46} stroke={ink} strokeOpacity="0.1" />
      ))}
      <path d="M40 260 C 90 240, 80 180, 140 170 S 220 200, 250 140 S 330 90, 356 70" fill="none" stroke={ink} strokeWidth="2.5" strokeDasharray="6 5" opacity="0.8" />
      {[
        [40, 260],
        [140, 170],
        [250, 140],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="none" stroke={ink} strokeWidth="2" />
      ))}
      <circle cx="356" cy="70" r="8" fill={ink} />
      <circle cx="356" cy="70" r="16" fill="none" stroke={ink} strokeOpacity="0.4" />
    </>
  );
}

export function ExhibitMock({ kind, className }: { kind: CaseFile["exhibit"]; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Schematic of the product">
      <rect x="0" y="0" width="400" height="300" fill="var(--card)" />
      {kind === "ledger" && <Ledger />}
      {kind === "newspaper" && <Newspaper />}
      {kind === "schedule" && <Schedule />}
      {kind === "tracking" && <Tracking />}
    </svg>
  );
}
