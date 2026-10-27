import type { Tool } from "@/content/desk";

/** Line drawings for each instrument, inked in the tool's tint. */
export function ToolIcon({ kind, className }: { kind: Tool["icon"]; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden {...common}>
      {kind === "invoice" && (
        <>
          <path d="M10 5h15l6 6v24H10z" />
          <path d="M25 5v6h6M14 16h10M14 21h13M14 26h8" />
          <circle cx="27" cy="29" r="3.5" />
        </>
      )}
      {kind === "watch" && (
        <>
          <circle cx="20" cy="23" r="12" />
          <path d="M20 11V8M17 5h6M20 23V16M20 23l5 3" />
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M20 13v2" transform={`rotate(${a} 20 23)`} />
          ))}
        </>
      )}
      {kind === "wireless" && (
        <>
          <path d="M8 34V14a12 12 0 0 1 24 0v20z" />
          <rect x="13" y="13" width="14" height="7" rx="1" />
          <circle cx="15" cy="27" r="2" />
          <circle cx="20" cy="27" r="2" />
          <circle cx="25" cy="27" r="2" />
        </>
      )}
      {kind === "turntable" && (
        <>
          <circle cx="18" cy="22" r="12" />
          <circle cx="18" cy="22" r="7" opacity="0.6" />
          <circle cx="18" cy="22" r="2.5" />
          <path d="M33 6l-4 13-6 6" />
          <circle cx="33" cy="6" r="1.8" />
        </>
      )}
      {kind === "darkroom" && (
        <>
          <circle cx="20" cy="20" r="13" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M20 7l6 9" transform={`rotate(${a} 20 20)`} />
          ))}
        </>
      )}
      {kind === "stationer" && (
        <>
          <path d="M30 6c-8 4-14 12-18 24l-2 5 4-3c6-2 12-8 16-17" />
          <path d="M12 30l7-7M22 14c2 2 4 3 7 3" />
        </>
      )}
    </svg>
  );
}
