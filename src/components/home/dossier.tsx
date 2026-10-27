"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Download } from "lucide-react";
import { persona } from "@/content/site";
import { playSfx } from "@/lib/audio";
import { asset } from "@/lib/utils";
import { VintageButton } from "@/components/ui/vintage-button";

const TOASTS = [
  "Headquarters notified 📡",
  "Intruder detected — securing dossier 🚨",
  "Unauthorized extraction attempt logged 🔐",
  "HQ alert: file pull flagged as suspicious 🛰️",
  "Perimeter breached — dispatch notified 📟",
  "Classified document access recorded 🗄️",
];

/** "Request access": a camera flash, an after-glow, a toast, then the download. */
export function Dossier() {
  const [flash, setFlash] = useState(false);
  const [glow, setGlow] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const request = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const filename = e.currentTarget.getAttribute("download") ?? "resume.pdf";
    playSfx("flash", 0.5);
    setToast(TOASTS[Math.floor(Math.random() * TOASTS.length)]);
    window.setTimeout(() => setFlash(true), 480);
    window.setTimeout(() => {
      setFlash(false);
      setGlow(true);
    }, 780);
    window.setTimeout(() => setGlow(false), 2300);
    window.setTimeout(() => setToast(null), 5000);
    window.setTimeout(() => {
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, 900);
  };

  return (
    <div className="mt-10 relative">
      <div className="absolute inset-0 border-2 border-foreground/10 -z-10 pointer-events-none" />
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 sm:px-4 bg-background text-xs uppercase tracking-widest font-serif whitespace-nowrap">
        Professional Dossier
      </div>
      <div className="p-6 md:p-8 text-center">
        <h3 className="text-lg font-serif font-bold mb-3">OFFICIAL CURRICULUM VITAE</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          For your perusal, I present my professional credentials and accomplishments in an official capacity.
        </p>
        <VintageButton asChild>
          <a href={asset(persona.resume)} download={`${persona.name} - Resume.pdf`} onClick={request}>
            Request Access <Download className="h-4 w-4" />
          </a>
        </VintageButton>
        <p className="text-xs text-muted-foreground mt-4 italic font-serif">
          <span className="inline-block border-t border-foreground/10 pt-2">Archive Ref. No. 2026-10 • Classification: Public Release</span>
        </p>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {flash && <div className="fixed inset-0 bg-white z-[9999] pointer-events-none" style={{ animation: "flash 0.3s" }} />}
            {glow && (
              <div
                className="fixed inset-0 z-[9998] pointer-events-none"
                style={{
                  animation: "after-glow 1.5s forwards",
                  background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 45%, rgba(0,0,0,0.3) 100%)",
                }}
              />
            )}
            {toast && (
              <div
                role="status"
                className="fixed top-20 right-3 z-[9999] bg-foreground text-background px-4 py-2 rounded shadow-lg font-mono text-sm"
                style={{ animation: "fade-in 0.25s ease-out" }}
              >
                {toast}
              </div>
            )}
          </>,
          document.body,
        )}
    </div>
  );
}
