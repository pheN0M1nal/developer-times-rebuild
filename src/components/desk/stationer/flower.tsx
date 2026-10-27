import type { Specimen } from "@/content/specimens";
import { seeded } from "@/lib/utils";

/**
 * A pressed specimen, generated: a curved stem, leaves along it, and a
 * head built from petals of one of five shapes. Same specimen, same flower.
 */
export function Flower({ s, className }: { s: Specimen; className?: string }) {
  const rnd = seeded(s.id);
  const W = 120;
  const H = 180;
  const hx = 60 + s.lean * 22;
  const hy = 52;
  const stem = `M60 176 C ${60 - s.lean * 18} 140, ${hx + s.lean * 26} 96, ${hx} ${hy}`;

  const leaves = Array.from({ length: s.leaves }, (_, i) => {
    const t = 0.35 + (i / Math.max(1, s.leaves)) * 0.55;
    const y = 176 - t * (176 - hy);
    const x = 60 + (hx - 60) * t;
    const side = i % 2 === 0 ? 1 : -1;
    const len = 14 + rnd() * 12;
    const ang = side * (35 + rnd() * 25);
    return { x, y, len, ang };
  });

  const petals: React.ReactNode[] = [];
  for (let L = s.layers - 1; L >= 0; L--) {
    const r = s.size * 1.45 * (1 - L * 0.22);
    const off = L * (180 / s.petals);
    for (let i = 0; i < s.petals; i++) {
      const a = (i / s.petals) * 360 + off + rnd() * 6;
      const shade = L === 0 ? 1 : 0.82 + L * 0.06;
      const key = `${L}-${i}`;
      const common = { fill: s.petal, fillOpacity: 0.86 * shade, stroke: "#00000022", strokeWidth: 0.5, transform: `rotate(${a} ${hx} ${hy})` };
      if (s.shape === "round") petals.push(<ellipse key={key} cx={hx} cy={hy - r * 0.55} rx={r * 0.48} ry={r * 0.62} {...common} />);
      else if (s.shape === "pointed") petals.push(<path key={key} d={`M${hx} ${hy} Q ${hx + r * 0.32} ${hy - r * 0.55} ${hx} ${hy - r * 1.1} Q ${hx - r * 0.32} ${hy - r * 0.55} ${hx} ${hy}`} {...common} />);
      else if (s.shape === "ray") petals.push(<ellipse key={key} cx={hx} cy={hy - r * 0.62} rx={r * 0.13} ry={r * 0.52} {...common} />);
      else if (s.shape === "bell") {
        const by = hy + i * 13 - 8;
        const bx = hx + (i % 2 ? 9 : -9);
        petals.push(
          <g key={key}>
            <path d={`M${hx} ${by - 8} Q ${bx} ${by - 6} ${bx} ${by}`} fill="none" stroke="#5d6b3a" strokeWidth="1" />
            <path d={`M${bx - 6} ${by + 10} Q ${bx - 6} ${by} ${bx} ${by} Q ${bx + 6} ${by} ${bx + 6} ${by + 10} Q ${bx + 3} ${by + 8} ${bx} ${by + 11} Q ${bx - 3} ${by + 8} ${bx - 6} ${by + 10}`} fill={s.petal} fillOpacity={0.9} stroke="#00000022" strokeWidth="0.5" />
          </g>,
        );
      } else {
        // spray: small florets climbing the top of the stem
        const k = 3 + i * 3;
        for (let j = 0; j < k && j < 9; j++) {
          const t = j / 9;
          const fy = hy - 14 + t * 44;
          const fx = hx + (j % 2 ? 1 : -1) * (3 + rnd() * 4) * (1 - t * 0.5);
          petals.push(<circle key={`${key}-${j}`} cx={fx} cy={fy} r={2.4 + rnd() * 1.6} fill={s.petal} fillOpacity={0.85} />);
        }
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`Pressed ${s.name}`}>
      <g style={{ filter: "drop-shadow(0 1px 1px rgba(60,40,20,0.25))" }}>
        <path d={stem} fill="none" stroke="#5d6b3a" strokeWidth="1.6" strokeLinecap="round" />
        {leaves.map((l, i) => (
          <path
            key={i}
            d={`M${l.x} ${l.y} q ${l.len * 0.5} -${l.len * 0.35} ${l.len} 0 q -${l.len * 0.5} ${l.len * 0.35} -${l.len} 0`}
            fill="#6f7d4a"
            fillOpacity="0.8"
            transform={`rotate(${l.ang} ${l.x} ${l.y})`}
          />
        ))}
        {petals}
        {s.shape !== "bell" && s.shape !== "spray" && <circle cx={hx} cy={hy} r={Math.max(3, s.size * 0.32)} fill={s.centre} />}
      </g>
    </svg>
  );
}
