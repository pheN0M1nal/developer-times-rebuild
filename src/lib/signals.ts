"use client";

// The Evidence Locker remembers what a visitor has done: pages visited and
// events (torch switched on, secrets found). Records unseal against these.

export type Signals = { paths: string[]; events: string[] };

const KEY = "locker:signals";
const EVENT = "locker:signals";
const EMPTY = '{"paths":[],"events":[]}';

export function parseSignals(raw: string | null): Signals {
  try {
    const v = JSON.parse(raw ?? EMPTY);
    return {
      paths: Array.isArray(v.paths) ? v.paths : [],
      events: Array.isArray(v.events) ? v.events : [],
    };
  } catch {
    return { paths: [], events: [] };
  }
}

function read(): Signals {
  try {
    return parseSignals(localStorage.getItem(KEY));
  } catch {
    return { paths: [], events: [] };
  }
}

function write(s: Signals) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage blocked: progress lives only for this page view */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function normalisePath(p: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  let path = p.startsWith(base) ? p.slice(base.length) : p;
  path = path.replace(/\/+$/, "");
  return path || "/";
}

export function recordPath(path: string) {
  const p = normalisePath(path);
  const s = read();
  if (!s.paths.includes(p)) write({ ...s, paths: [...s.paths, p] });
}

export function recordEvent(id: string) {
  const s = read();
  if (!s.events.includes(id)) write({ ...s, events: [...s.events, id] });
}

export const secretEvent = (id: string) => `secret:${id}`;

export function subscribeSignals(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function signalsSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

export const signalsServerSnapshot = () => EMPTY;

export type UnlockRule =
  | { kind: "default" }
  | { kind: "visit"; path: string; label: string; hint: string }
  | { kind: "event"; id: string; label: string; hint: string }
  | { kind: "secret"; id: string; label: string; hint: string };

export function isUnlocked(rule: UnlockRule, s: Signals) {
  switch (rule.kind) {
    case "default":
      return true;
    case "event":
      return s.events.includes(rule.id);
    case "secret":
      return s.events.includes(secretEvent(rule.id));
    case "visit": {
      const p = normalisePath(rule.path);
      return s.paths.some((x) => x === p || x.startsWith(`${p}/`));
    }
  }
}
