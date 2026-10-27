"use client";

import { useRef, useState } from "react";
import { ArrowRight, Download, PenLine } from "lucide-react";
import { endorsements, type Endorsement } from "@/content/endorsements";
import { persona } from "@/content/site";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { Marquee } from "@/components/ui/marquee";
import { Modal } from "@/components/ui/modal";
import { Surface } from "@/components/ui/surface";
import { VintageButton } from "@/components/ui/vintage-button";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { pageTurn } from "@/lib/audio";

function clip(s: string, n = 220) {
  return s.length > n ? `${s.slice(0, n).trimEnd()}...` : s;
}

function EndorsementCard({ e, onRead }: { e: Endorsement; onRead: (e: Endorsement) => void }) {
  return (
    <figure className="w-[340px] sm:w-[380px] shrink-0 border border-foreground/30 bg-background p-6 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-serif font-bold text-xl text-foreground">{e.name}</h4>
          <p className="type-label text-[0.62rem] text-muted-foreground">{e.role}</p>
          <p className="mt-1 font-serif italic text-xs text-muted-foreground">{e.date}</p>
        </div>
        <button
          type="button"
          onClick={() => onRead(e)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-foreground/30 bg-foreground/[0.04] px-3 py-1.5 font-serif text-xs hover:bg-foreground/10 cursor-pointer"
        >
          <PenLine className="h-3 w-3" /> Read Letter
        </button>
      </div>
      {e.link && (
        <a href={e.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-serif text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground" title="View professional reference">
          <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn Directory
        </a>
      )}
      <blockquote className="mt-5 border-l-2 border-foreground/30 pl-4 font-serif italic text-[0.95rem] leading-relaxed text-foreground/85">
        “{clip(e.quote)}”
      </blockquote>
    </figure>
  );
}

function Letter({ e }: { e: Endorsement }) {
  const sheet = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!sheet.current) return;
    setSaving(true);
    try {
      const { toJpeg } = await import("html-to-image");
      await document.fonts.ready;
      const url = await toJpeg(sheet.current, { quality: 0.92, pixelRatio: 2, backgroundColor: "#ead09e" });
      const a = document.createElement("a");
      a.href = url;
      a.download = `letter-from-${e.id}.jpg`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={sheet}>
      <Surface id={`letter-${e.id}`} variant="parchment-light" lift="deep" edge="deckle" className="p-8 sm:p-10 text-[var(--ink-900)]">
        <div className="flex items-baseline justify-between border-b border-[var(--ink-900)]/20 pb-3">
          <span className="type-label text-[0.6rem] text-[var(--ink-600)]">Letter of Reference · On File</span>
          <span className="font-serif italic text-xs text-[var(--ink-600)]">{e.date}</span>
        </div>
        <div className="mt-6 space-y-4 font-sans text-[0.95rem] leading-relaxed">
          {e.letter.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 text-right">
          <p className="font-pen text-4xl leading-none text-[var(--ink-900)]">{e.name}</p>
          <p className="mt-2 type-label text-[0.6rem] text-[var(--ink-600)]">{e.role}</p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--ink-900)]/20 pt-4">
          <span className="font-typewriter text-[0.65rem] text-[var(--ink-400)]">Re: {persona.name} · placeholder letter</span>
          <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 type-label text-[0.6rem] text-[var(--rust)] hover:underline cursor-pointer disabled:opacity-50">
            <Download className="h-3 w-3" /> {saving ? "Developing…" : "Keep a copy"}
          </button>
        </div>
      </Surface>
    </div>
  );
}

function ShareForm({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>;
    if (!persona.formEndpoint) {
      const body = `${data.message}\n\n— ${data.name}, ${data.role}${data.linkedin ? `\n${data.linkedin}` : ""}`;
      window.location.href = `mailto:${persona.email}?subject=${encodeURIComponent(`A letter of reference from ${data.name}`)}&body=${encodeURIComponent(body)}`;
      setState("sent");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(persona.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  const field = "w-full border-b border-[var(--ink-900)]/30 bg-transparent py-2 font-sans text-sm text-[var(--ink-900)] placeholder:text-[var(--ink-400)] focus:outline-none focus:border-[var(--ink-900)]";

  return (
    <Surface id="share-form" variant="parchment-light" lift="deep" className="p-8 sm:p-10 text-[var(--ink-900)]">
      <p className="type-label text-[0.6rem] text-[var(--ink-600)]">Dispatches of Praise · Submission</p>
      <h3 className="mt-2 font-serif font-bold text-2xl">Share Your Experience</h3>
      <p className="mt-1 font-serif italic text-sm text-[var(--ink-600)]">Your feedback helps me improve and grow.</p>
      {state === "sent" ? (
        <div className="mt-8 text-center">
          <p className="font-serif text-lg">Filed with thanks.</p>
          <button type="button" onClick={onDone} className="mt-4 type-label text-[var(--rust)] hover:underline cursor-pointer">
            Close the folder
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input name="name" required placeholder="Your name" className={field} autoComplete="name" />
          <input name="role" required placeholder="Role and company" className={field} autoComplete="organization-title" />
          <input name="linkedin" placeholder="LinkedIn profile (optional)" className={field} />
          <textarea name="message" required rows={5} placeholder="A few words for the record…" className={`${field} resize-none`} />
          {state === "error" && <p className="text-sm text-[var(--rust)]">The wire went dead. Please try again.</p>}
          <div className="pt-2">
            <VintageButton type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Dispatching…" : "Dispatch"} <ArrowRight className="h-4 w-4" />
            </VintageButton>
          </div>
        </form>
      )}
    </Surface>
  );
}

export function Endorsements() {
  const [reading, setReading] = useState<Endorsement | null>(null);
  const [sharing, setSharing] = useState(false);
  const half = Math.ceil(endorsements.length / 2);
  const open = (e: Endorsement) => {
    pageTurn();
    setReading(e);
  };

  return (
    <div id="endorsements" className="relative scroll-mt-20">
      <Section
        title="Dispatches of Praise • Volume III"
        heading="ENDORSEMENTS & ACCOLADES"
        tagline="In the Words of Those Who've Borne Witness to my Craft"
        decorativeText="PRAISE"
        fullWidth
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "5%" }, rotate: -5, font: "hand", children: "all six speak too well ↓" },
            { at: { top: "5rem", right: "6%" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "SWORN · UNDER OATH · MOSTLY" },
            { at: { bottom: "7rem", left: "3%" }, rotate: 6, font: "hand", hue: "violet", children: "watch the unsolicited praise" },
            { at: { bottom: "2rem", right: "4%" }, rotate: -3, font: "hand", children: "— E.Q., not yet convinced" },
          ]}
        />
        <div className="space-y-2">
          <Marquee duration="60s" repeat={4}>
            {endorsements.slice(0, half).map((e) => (
              <EndorsementCard key={e.id} e={e} onRead={open} />
            ))}
          </Marquee>
          <Marquee duration="60s" repeat={4} reverse>
            {endorsements.slice(half).map((e) => (
              <EndorsementCard key={e.id} e={e} onRead={open} />
            ))}
          </Marquee>
        </div>
        <div className="mt-10 text-center">
          <VintageButton onClick={() => setSharing(true)}>
            Share Your Experience <ArrowRight className="h-4 w-4" />
          </VintageButton>
          <p className="mt-3 text-xs italic text-muted-foreground font-grotesk">Your feedback helps me improve and grow</p>
        </div>
      </Section>
      <Modal open={!!reading} onClose={() => setReading(null)} label={reading ? `Letter from ${reading.name}` : "Letter"}>
        {reading && <Letter e={reading} />}
      </Modal>
      <Modal open={sharing} onClose={() => setSharing(false)} label="Share your experience">
        <ShareForm onDone={() => setSharing(false)} />
      </Modal>
    </div>
  );
}
