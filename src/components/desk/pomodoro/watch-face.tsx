"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CYCLES_BEFORE_LONG, PHASE_LABEL, formatClock, usePomodoro, type Phase } from "./provider";

/** The watch, out of the pocket: a large clock, phase tabs, rounds and a pendulum. */
export function WatchFace() {
  const p = usePomodoro();
  const box = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    p.dispatch({ type: "OPEN" });
    return () => p.dispatch({ type: "MINIMIZE" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const prev = document.title;
    if (p.running) document.title = `${formatClock(p.secondsLeft)} · ${PHASE_LABEL[p.phase]}`;
    return () => {
      document.title = prev;
    };
  }, [p.running, p.secondsLeft, p.phase]);

  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await box.current?.requestFullscreen();
    } catch {}
  };

  const phases: Phase[] = ["inquiry", "recess", "long"];
  const doneInSet = p.phase === "inquiry" ? p.round - 1 : p.round;

  return (
    <div
      ref={box}
      className={cn(
        "relative mx-auto max-w-2xl border border-foreground/25 bg-background p-6 sm:p-10 shadow-[0_2px_6px_-3px_#140c0440] overflow-hidden",
        full && "flex max-w-none flex-col justify-center border-0",
      )}
    >
      {/* Breathing blobs behind the dial, only while running. */}
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 transition-opacity duration-1000", p.running ? "opacity-100" : "opacity-0")}>
        <span className="absolute -left-10 top-10 h-60 w-60 rounded-full bg-[var(--amber)]/10 blur-3xl" style={{ animation: "pomodoro-blob 14s ease-in-out infinite alternate" }} />
        <span className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[var(--rust)]/10 blur-3xl" style={{ animation: "pomodoro-blob 18s ease-in-out infinite alternate-reverse" }} />
      </div>

      <button type="button" onClick={toggleFull} className="absolute right-4 top-4 p-1.5 text-foreground/70 hover:text-foreground cursor-pointer" aria-label={full ? "Leave full screen" : "Full screen"}>
        {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      <div className="relative flex justify-center gap-8" role="tablist" aria-label="Phase">
        {phases.map((ph) => (
          <button
            key={ph}
            type="button"
            role="tab"
            aria-selected={p.phase === ph}
            onClick={() => p.dispatch({ type: "SET_PHASE", phase: ph })}
            className={cn("pb-1 font-serif text-sm tracking-[0.25em] lowercase cursor-pointer", p.phase === ph ? "border-b border-foreground text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {PHASE_LABEL[ph]}
          </button>
        ))}
      </div>

      <div className="relative mt-8 flex items-center justify-center gap-6">
        <svg viewBox="0 0 40 120" className="hidden sm:block h-28 w-10 text-foreground/50" aria-hidden>
          <g style={{ transformOrigin: "20px 4px", animation: p.running ? "pomodoro-pendulum 2s ease-in-out infinite alternate" : undefined, transform: p.running ? undefined : "rotate(0deg)" }}>
            <line x1="20" y1="4" x2="20" y2="96" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="104" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </g>
          <circle cx="20" cy="4" r="2.5" fill="currentColor" />
        </svg>
        <div
          role="timer"
          aria-live="off"
          className={cn("font-serif tabular-nums leading-none text-foreground", full ? "text-[min(28vw,16rem)]" : "text-7xl sm:text-9xl")}
          style={{ filter: p.running ? "url(#pomodoro-wobble)" : undefined }}
        >
          {formatClock(p.secondsLeft)}
        </div>
      </div>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="pomodoro-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={9} result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale={1.1} />
        </filter>
      </svg>

      <div className="relative mx-auto mt-6 h-px max-w-sm bg-foreground/20">
        <div className="h-px bg-[var(--rust)] transition-[width] duration-500" style={{ width: `${p.progress * 100}%` }} />
      </div>

      <div className="relative mt-5 flex justify-center gap-3" aria-label={`Round ${p.round} of ${CYCLES_BEFORE_LONG}`}>
        {Array.from({ length: CYCLES_BEFORE_LONG }, (_, i) => (
          <span key={i} className={cn("h-2 w-2 rounded-full border border-foreground/50", i < doneInSet && "bg-foreground")} />
        ))}
      </div>

      <div className="relative mt-8 flex justify-center gap-3">
        <button type="button" onClick={p.toggle} className="min-w-24 bg-foreground px-6 py-3 font-serif uppercase tracking-wider text-sm text-background hover:opacity-90 cursor-pointer">
          {p.running ? "Pause" : p.secondsLeft < (p.phase === "inquiry" ? 1500 : p.phase === "recess" ? 300 : 900) ? "Resume" : "Begin"}
        </button>
        <button type="button" onClick={() => p.dispatch({ type: "RESET" })} className="border border-foreground/40 px-6 py-3 font-serif uppercase tracking-wider text-sm hover:bg-foreground/5 cursor-pointer">
          Reset
        </button>
        <button type="button" onClick={() => p.dispatch({ type: "SKIP" })} className="border border-foreground/20 px-4 py-3 font-serif uppercase tracking-wider text-xs text-muted-foreground hover:text-foreground cursor-pointer">
          Skip
        </button>
      </div>

      <div className="relative mt-8 flex items-center justify-between border-t border-dotted border-foreground/30 pt-5">
        <span className="type-label text-[0.6rem] text-muted-foreground tracking-[0.3em]">
          Cycle · {Math.min(doneInSet, CYCLES_BEFORE_LONG)} / {CYCLES_BEFORE_LONG} · {p.completed} filed
        </span>
        <button type="button" onClick={() => p.dispatch({ type: "TOGGLE_CHIME" })} className="font-serif text-sm tracking-[0.15em] hover:underline cursor-pointer">
          Wind the Watch · {p.chime ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
