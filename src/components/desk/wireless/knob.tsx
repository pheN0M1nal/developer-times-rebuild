"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  readout?: string;
  ends?: [string, string];
  size?: "lg" | "md" | "sm";
  /** Click steps the value up by this much, wrapping to min (mixing trimmers). */
  clickStep?: number;
  className?: string;
};

/** A bakelite knob: drag up/down or scroll for fine work, arrows on the keyboard. */
export function Knob({ label, value, min, max, step = 0.01, onChange, readout, ends, size = "md", clickStep, className }: Props) {
  const drag = useRef<{ y: number; v: number; moved: boolean } | null>(null);
  const t = (value - min) / (max - min);
  const angle = -135 + t * 270;
  const px = size === "lg" ? 88 : size === "md" ? 64 : 56;
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));

  return (
    <div className={cn("flex flex-col items-center select-none", className)}>
      <div className="relative" style={{ width: px + 36, height: px + 22 }}>
        {ends && (
          <>
            <span className="absolute bottom-0 left-0 font-serif text-[0.6rem] uppercase tracking-wider text-[#c9b48c]/80">{ends[0]}</span>
            <span className="absolute bottom-0 right-0 font-serif text-[0.6rem] uppercase tracking-wider text-[#c9b48c]/80">{ends[1]}</span>
          </>
        )}
        <svg viewBox="0 0 100 100" className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: px + 22, height: px + 22 }} aria-hidden>
          {Array.from({ length: 11 }, (_, i) => {
            const a = ((-135 + i * 27) * Math.PI) / 180;
            return <line key={i} x1={50 + Math.sin(a) * 44} y1={50 - Math.cos(a) * 44} x2={50 + Math.sin(a) * 48} y2={50 - Math.cos(a) * 48} stroke="#c9b48c" strokeOpacity="0.5" strokeWidth="1.2" />;
          })}
        </svg>
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={Number(value.toFixed(2))}
          aria-valuetext={readout}
          className="absolute left-1/2 top-[11px] -translate-x-1/2 rounded-full cursor-ns-resize focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
          style={{
            width: px,
            height: px,
            touchAction: "none",
            background: "radial-gradient(circle at 35% 30%, #5a4632, #2a1d12 55%, #140c06)",
            boxShadow: "0 6px 12px -2px #000a, inset 0 2px 3px #ffffff1f, inset 0 -3px 6px #0008, 0 0 0 3px #b8955a55",
            transform: `rotate(${angle}deg)`,
          }}
          onPointerDown={(e) => {
            drag.current = { y: e.clientY, v: value, moved: false };
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dy = drag.current.y - e.clientY;
            if (Math.abs(dy) > 3) drag.current.moved = true;
            onChange(clamp(drag.current.v + (dy / 160) * (max - min)));
          }}
          onPointerUp={() => {
            if (drag.current && !drag.current.moved && clickStep) {
              const next = value + clickStep > max + 1e-6 ? min : value + clickStep;
              onChange(clamp(next));
            }
            drag.current = null;
          }}
          onWheel={(e) => {
            onChange(clamp(value - Math.sign(e.deltaY) * (max - min) * 0.02));
          }}
          onKeyDown={(e) => {
            const big = (max - min) / 20;
            if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(clamp(value + (e.shiftKey ? big : step * 5)));
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(clamp(value - (e.shiftKey ? big : step * 5)));
          }}
        >
          <span className="absolute left-1/2 top-[8%] h-[38%] w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#f3dca0] to-[#b8955a]" />
          <span className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a66a] shadow-inner" />
        </div>
      </div>
      <span className="mt-1 font-serif text-sm uppercase tracking-[0.2em] text-[#e6d3a8]">{label}</span>
      {readout !== undefined && <span className="font-typewriter text-xs text-[#c9b48c]/80">{readout}</span>}
    </div>
  );
}
