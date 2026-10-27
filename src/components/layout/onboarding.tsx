"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { recordEvent } from "@/lib/signals";

const STEPS = [
  { icon: "💿", title: "Spin the Record", content: "For the true experience: drop the needle, cue the jazz.", selector: "#vinyl" },
  { icon: "🔦", title: "Light the Torch", content: "Shine the beam — secrets don't like the dark.", selector: "#torch" },
];

type Rect = { top: number; left: number; width: number; height: number };

function confetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647;width:100vw;height:100vh";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const g = canvas.getContext("2d")!;
  const colours = ["#704214", "#c7955a", "#923719", "#f4eee0", "#d0ab73", "#2c2216"];
  const parts = Array.from({ length: 160 }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 6 + Math.random() * 9;
    return {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      c: colours[Math.floor(Math.random() * colours.length)],
    };
  });
  let frame = 0;
  const tick = () => {
    frame++;
    g.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of parts) {
      p.vy += 0.22;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      g.save();
      g.globalAlpha = Math.max(0, 1 - frame / 220);
      g.translate(p.x, p.y);
      g.rotate(p.r);
      g.fillStyle = p.c;
      g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      g.restore();
    }
    if (frame < 220) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

/** A two-step spotlight tour on the first visit, after the intro has played. */
export function Onboarding() {
  const [step, setStep] = useState(-1);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    let seen = true;
    try {
      seen = !!localStorage.getItem("onboard_seen");
    } catch {}
    if (seen) return;
    // Wait for the intro curtain to lift before pointing at anything.
    const start = () => setStep(0);
    const wait = window.setInterval(() => {
      if (!document.querySelector("[data-intro-layer]") && !document.documentElement.hasAttribute("data-intro")) {
        window.clearInterval(wait);
        window.setTimeout(start, 900);
      }
    }, 300);
    return () => window.clearInterval(wait);
  }, []);

  const measure = useCallback(() => {
    if (step < 0) return;
    const el = document.querySelector(STEPS[step].selector);
    if (!el) return setRect(null);
    const r = el.getBoundingClientRect();
    if (r.width === 0) return setRect(null);
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const close = (celebrate: boolean) => {
    try {
      localStorage.setItem("onboard_seen", "1");
    } catch {}
    recordEvent("onboard-complete");
    setStep(-1);
    if (celebrate) confetti();
  };

  if (step < 0 || typeof document === "undefined") return null;
  const s = STEPS[step];
  const pad = 16;
  const last = step === STEPS.length - 1;

  return createPortal(
    <AnimatePresence>
      {rect && (
        <motion.div key="tour" className="fixed inset-0 z-[150]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            animate={{ top: rect.top - pad / 2, left: rect.left - pad / 2, width: rect.width + pad, height: rect.height + pad }}
            transition={{ type: "spring", duration: 0.6 }}
            style={{ boxShadow: "0 0 0 9999px rgba(38,32,28,0.6)" }}
          />
          <motion.div
            role="dialog"
            aria-label={s.title}
            className="absolute w-[230px] sm:w-[250px] bg-foreground text-background border border-current/30 rounded-[3px] shadow-[2px_3px_8px_rgba(0,0,0,0.45)] font-serif tracking-wide p-4"
            animate={{ top: rect.top + rect.height + 22, left: Math.max(12, Math.min(window.innerWidth - 262, rect.left + rect.width / 2 - 125)) }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <button type="button" onClick={() => close(false)} className="absolute top-2 right-2 opacity-70 hover:opacity-100 cursor-pointer" aria-label="Skip the tour">
              <X className="h-4 w-4" />
            </button>
            <p className="text-lg font-semibold flex items-center gap-2">
              <span aria-hidden>{s.icon}</span> {s.title}
            </p>
            <p className="mt-2 text-sm font-sans leading-relaxed opacity-90">{s.content}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="type-label text-[0.6rem] opacity-70">
                {step + 1} of {STEPS.length}
              </span>
              <div className="flex gap-2">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="type-label text-[0.6rem] px-2 py-1 border border-current/40 cursor-pointer">
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (last ? close(true) : setStep(step + 1))}
                  className="type-label text-[0.6rem] px-2 py-1 bg-background text-foreground cursor-pointer"
                >
                  {last ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
