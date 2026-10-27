"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { PHASE_LABEL, formatClock, usePomodoro } from "./provider";

/** The watch, minimised: it keeps ticking in the corner on every other page. */
export function PocketWatch() {
  const pathname = usePathname();
  const p = usePomodoro();
  const onPage = pathname?.startsWith("/desk/pomodoro");
  const show = p.active && !onPage;
  const angle = p.progress * 360;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pocket-watch"
          initial={{ opacity: 0, y: 24, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 24, rotate: 8 }}
          transition={{ duration: 0.46, ease: [0.22, 0.68, 0.28, 1] }}
          className="fixed bottom-5 right-5 z-[45] flex items-center gap-3 rounded-full border border-foreground/20 bg-background/95 backdrop-blur pl-2 pr-3 py-2 shadow-[0_12px_30px_-12px_#140c049e]"
          role="timer"
          aria-label={`${PHASE_LABEL[p.phase]}: ${formatClock(p.secondsLeft)} left`}
        >
          <Link href="/desk/pomodoro/" className="relative block h-11 w-11 rounded-full border-2 border-foreground/60" title="Open the pocket-watch">
            <svg viewBox="0 0 44 44" className="absolute inset-0" aria-hidden>
              <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke={p.phase === "inquiry" ? "var(--rust)" : "var(--gilt)"}
                strokeWidth="3"
                strokeDasharray={`${p.progress * 113.1} 113.1`}
                transform="rotate(-90 22 22)"
              />
              <line x1="22" y1="22" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${angle} 22 22)`} />
              <circle cx="22" cy="22" r="1.8" fill="currentColor" />
            </svg>
          </Link>
          <div className="leading-tight">
            <div className="type-label text-[0.55rem] text-muted-foreground">{PHASE_LABEL[p.phase]}</div>
            <div className="font-typewriter text-lg tabular-nums text-foreground">{formatClock(p.secondsLeft)}</div>
          </div>
          <button type="button" onClick={p.toggle} className="p-1.5 rounded-full hover:bg-foreground/10 cursor-pointer" aria-label={p.running ? "Pause" : "Resume"}>
            {p.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => p.dispatch({ type: "CLOSE" })} className="p-1.5 rounded-full hover:bg-foreground/10 cursor-pointer" aria-label="Put the watch away">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
