"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordEvent, recordPath } from "@/lib/signals";
import { useTorch } from "./torch";

/** Files every page visit and torch use as a signal for the Evidence Locker. */
export function SignalsTracker() {
  const pathname = usePathname();
  const { torchEnabled } = useTorch();

  useEffect(() => {
    if (pathname) recordPath(pathname);
  }, [pathname]);

  useEffect(() => {
    if (torchEnabled) recordEvent("torch-on");
  }, [torchEnabled]);

  useEffect(() => {
    try {
      if (localStorage.getItem("onboard_seen")) recordEvent("onboard-complete");
    } catch {}
  }, [pathname]);

  return null;
}
