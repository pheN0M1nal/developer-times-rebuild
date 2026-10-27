"use client";

import { createContext, useContext, useEffect, useState } from "react";

// `?available=1` switches on hire mode for the session (availability lines
// appear); a bare `?available` switches it off. The param is then removed.
const HireModeContext = createContext(false);

export function HireModeProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    if (p.get("available") === "1") {
      try {
        sessionStorage.setItem("hire_mode", "1");
      } catch {}
      setOn(true);
    } else if (p.has("available")) {
      try {
        sessionStorage.removeItem("hire_mode");
      } catch {}
      setOn(false);
    } else {
      try {
        setOn(sessionStorage.getItem("hire_mode") === "1");
      } catch {}
    }
    if (p.has("available")) {
      p.delete("available");
      window.history.replaceState(null, "", url.pathname + (p.size ? `?${p}` : "") + url.hash);
    }
  }, []);

  return <HireModeContext.Provider value={on}>{children}</HireModeContext.Provider>;
}

export const useHireMode = () => useContext(HireModeContext);
