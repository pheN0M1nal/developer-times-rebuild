"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { playSfx } from "@/lib/audio";

export const INQUIRY_SEC = 25 * 60;
export const RECESS_SEC = 5 * 60;
export const LONG_SEC = 15 * 60;
export const CYCLES_BEFORE_LONG = 4;

export type Phase = "inquiry" | "recess" | "long";

export const PHASE_LABEL: Record<Phase, string> = {
  inquiry: "Inquiry",
  recess: "Recess",
  long: "Long Recess",
};

export const phaseLength = (p: Phase) => (p === "inquiry" ? INQUIRY_SEC : p === "recess" ? RECESS_SEC : LONG_SEC);

type State = {
  phase: Phase;
  round: number; // 1-based inquiry count within the current set
  completed: number; // inquiries completed overall
  running: boolean;
  endsAt: number | null; // epoch ms while running
  remaining: number; // seconds left while paused
  active: boolean; // the watch is out of the pocket
  expanded: boolean;
  chime: boolean;
};

const initial: State = {
  phase: "inquiry",
  round: 1,
  completed: 0,
  running: false,
  endsAt: null,
  remaining: INQUIRY_SEC,
  active: false,
  expanded: false,
  chime: true,
};

type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "SKIP" }
  | { type: "ADVANCE" }
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "OPEN" }
  | { type: "MINIMIZE" }
  | { type: "CLOSE" }
  | { type: "TOGGLE_CHIME" }
  | { type: "HYDRATE"; partial: Partial<State> };

function next(state: State): Pick<State, "phase" | "round" | "completed"> {
  if (state.phase === "inquiry") {
    const completed = state.completed + 1;
    return state.round >= CYCLES_BEFORE_LONG
      ? { phase: "long", round: state.round, completed }
      : { phase: "recess", round: state.round, completed };
  }
  return { phase: "inquiry", round: state.phase === "long" ? 1 : state.round + 1, completed: state.completed };
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "START":
      return { ...state, running: true, active: true, endsAt: Date.now() + state.remaining * 1000 };
    case "PAUSE": {
      const remaining = state.endsAt ? Math.max(0, Math.round((state.endsAt - Date.now()) / 1000)) : state.remaining;
      return { ...state, running: false, endsAt: null, remaining };
    }
    case "RESET":
      return { ...state, running: false, endsAt: null, remaining: phaseLength(state.phase) };
    case "SKIP":
    case "ADVANCE": {
      const n = next(state);
      const keepRunning = a.type === "ADVANCE" && state.running;
      const remaining = phaseLength(n.phase);
      return { ...state, ...n, remaining, running: keepRunning, endsAt: keepRunning ? Date.now() + remaining * 1000 : null };
    }
    case "SET_PHASE":
      return { ...state, phase: a.phase, running: false, endsAt: null, remaining: phaseLength(a.phase) };
    case "OPEN":
      return { ...state, expanded: true };
    case "MINIMIZE":
      return { ...state, expanded: false };
    case "CLOSE":
      return { ...state, expanded: false, active: false, running: false, endsAt: null };
    case "TOGGLE_CHIME":
      return { ...state, chime: !state.chime };
    case "HYDRATE":
      return { ...state, ...a.partial };
  }
}

const KEY = "pomodoro-state-v1";

type Ctx = State & {
  secondsLeft: number;
  progress: number; // 0..1 through the current phase
  dispatch: React.Dispatch<Action>;
  toggle: () => void;
};

const PomodoroContext = createContext<Ctx | null>(null);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const fired = useRef<number | null>(null);

  // Rehydrate from storage, measuring elapsed time against the clock, so a
  // closed tab or a sleeping laptop never makes the watch run slow.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "HYDRATE", partial: JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const { phase, round, completed, running, endsAt, remaining, active, chime } = state;
      localStorage.setItem(KEY, JSON.stringify({ phase, round, completed, running, endsAt, remaining, active, chime }));
    } catch {}
  }, [state, hydrated]);

  useEffect(() => {
    if (!state.running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    const onVis = () => document.visibilityState === "visible" && setNow(Date.now());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [state.running]);

  const secondsLeft = state.running && state.endsAt ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : state.remaining;

  useEffect(() => {
    if (!state.running || !state.endsAt || secondsLeft > 0) return;
    if (fired.current === state.endsAt) return;
    fired.current = state.endsAt;
    if (state.chime) playSfx("chime", 0.5);
    dispatch({ type: "ADVANCE" });
  }, [secondsLeft, state.running, state.endsAt, state.chime]);

  const toggle = useCallback(() => dispatch({ type: state.running ? "PAUSE" : "START" }), [state.running]);
  const total = phaseLength(state.phase);
  const progress = 1 - secondsLeft / total;

  return (
    <PomodoroContext.Provider value={{ ...state, secondsLeft, progress, dispatch, toggle }}>{children}</PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within a PomodoroProvider");
  return ctx;
}

export function formatClock(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
