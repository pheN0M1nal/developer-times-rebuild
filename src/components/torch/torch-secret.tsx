"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useTorch } from "@/components/providers/torch";
import { playSfx } from "@/lib/audio";
import {
  parseSignals,
  recordEvent,
  secretEvent,
  signalsServerSnapshot,
  signalsSnapshot,
  subscribeSignals,
} from "@/lib/signals";

type Props = {
  id: string;
  hand: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rotate?: number;
};

/**
 * A pencilled note that fades in as the torch beam nears it. Holding the
 * beam on it for 700ms files it as found (and unseals a locker record).
 */
export function TorchSecret({ id, hand, className, style, rotate = -4 }: Props) {
  const { torchEnabled } = useTorch();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const [proximity, setProximity] = useState(0);
  const raw = useSyncExternalStore(subscribeSignals, signalsSnapshot, signalsServerSnapshot);
  const found = useMemo(() => parseSignals(raw).events.includes(secretEvent(id)), [raw, id]);

  useEffect(() => {
    if (!torchEnabled || found) return;
    const clear = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
    };
    const update = (x: number, y: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, 1 - Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) / 130);
      setProximity(p);
      if (p > 0.72) {
        if (!timer.current)
          timer.current = window.setTimeout(() => {
            recordEvent(secretEvent(id));
            playSfx("stamp", 0.3);
          }, 700);
      } else clear();
    };
    const onMouse = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      clear();
    };
  }, [torchEnabled, found, id]);

  const opacity = torchEnabled ? (found ? 0.9 : proximity) : 0;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("torch-secret", className)}
      data-found={found ? "true" : undefined}
      style={{ opacity, transform: `rotate(${rotate}deg)`, pointerEvents: "none", ...style }}
    >
      <span className="torch-secret__hand">{hand}</span>
      {found && <span className="torch-secret__stamp">noted</span>}
    </div>
  );
}
