"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type TorchState = {
  torchEnabled: boolean;
  setTorchEnabled: (v: boolean) => void;
  isDesktop: boolean;
};

const TorchContext = createContext<TorchState | null>(null);

export function TorchProvider({ children }: { children: React.ReactNode }) {
  const [torchEnabled, setTorch] = useState(false);
  const [isDesktop, setDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const check = () => {
      const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setDesktop(!touch || window.screen.width >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    try {
      const saved = localStorage.getItem("torch-enabled");
      if (saved !== null) setTorch(saved === "true");
    } catch {}
    return () => window.removeEventListener("resize", check);
  }, []);

  const setTorchEnabled = (v: boolean) => {
    setTorch(v);
    try {
      localStorage.setItem("torch-enabled", String(v));
    } catch {}
  };

  // The torch only makes sense in the dark: leaving dark mode puts it out.
  useEffect(() => {
    if (mounted && resolvedTheme && resolvedTheme !== "dark" && torchEnabled) setTorchEnabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, mounted]);

  return (
    <TorchContext.Provider value={{ torchEnabled: mounted && torchEnabled, setTorchEnabled, isDesktop }}>
      {children}
    </TorchContext.Provider>
  );
}

export function useTorch() {
  const ctx = useContext(TorchContext);
  if (!ctx) throw new Error("useTorch must be used within a TorchProvider");
  return ctx;
}
