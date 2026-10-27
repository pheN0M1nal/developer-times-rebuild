"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseSignals, signalsServerSnapshot, signalsSnapshot, subscribeSignals } from "@/lib/signals";

/** Live view of the visitor's signals; re-renders whenever one is filed. */
export function useSignals() {
  const raw = useSyncExternalStore(subscribeSignals, signalsSnapshot, signalsServerSnapshot);
  return useMemo(() => parseSignals(raw), [raw]);
}
