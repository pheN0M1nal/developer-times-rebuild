"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CARRIERS, LAYERS, SCENES, WirelessEngine, type LayerId } from "@/lib/wireless-engine";
import { playSfx } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { Knob } from "./knob";

const MIN = 55;
const MAX = 160;
const pct = (kc: number) => ((kc - MIN) / (MAX - MIN)) * 100;

const wood: React.CSSProperties = {
  background:
    "repeating-linear-gradient(92deg, #ffffff06 0 2px, transparent 2px 7px), repeating-linear-gradient(88deg, #00000014 0 1px, transparent 1px 11px), radial-gradient(ellipse at 30% 10%, #7a4e2a, #4a2c16 55%, #2b180b)",
};

function Meter({ value, label, variant }: { value: number; label: string; variant: "vu" | "signal" }) {
  const a = -50 + value * 100;
  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative overflow-hidden border-[6px] border-[#1d140c] bg-[radial-gradient(ellipse_at_50%_100%,#f6e7c4,#e6d0a0)] shadow-[inset_0_2px_10px_#0006]", variant === "vu" ? "h-24 w-32 sm:h-28 sm:w-44 rounded-sm" : "h-24 w-32 sm:h-28 sm:w-40 rounded-t-[4rem] sm:rounded-t-[5rem] rounded-b-md")}>
        <svg viewBox="0 0 160 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M30 78 A 62 62 0 0 1 130 78" fill="none" stroke="#3a2a1a" strokeWidth="1" />
          {Array.from({ length: 11 }, (_, i) => {
            const t = ((-50 + i * 10) * Math.PI) / 180;
            return <line key={i} x1={80 + Math.sin(t) * 56} y1={96 - Math.cos(t) * 56} x2={80 + Math.sin(t) * (i % 5 === 0 ? 64 : 61)} y2={96 - Math.cos(t) * (i % 5 === 0 ? 64 : 61)} stroke={variant === "vu" && i > 8 ? "#b0302a" : "#3a2a1a"} strokeWidth="1.2" />;
          })}
          <text x="80" y="22" textAnchor="middle" fontSize="13" fill="#3a2a1a" fontFamily="var(--font-serif)">
            {variant === "vu" ? "VU" : "SIGNAL"}
          </text>
          <g style={{ transformOrigin: "80px 96px", transform: `rotate(${a}deg)`, transition: "transform 0.12s ease-out" }}>
            <line x1="80" y1="96" x2="80" y2="30" stroke="#1d140c" strokeWidth="1.4" />
          </g>
          <circle cx="80" cy="96" r="6" fill="#1d140c" />
        </svg>
      </div>
      <span className="mt-2 font-serif text-xs uppercase tracking-[0.3em] text-[#e6d3a8]">{label}</span>
    </div>
  );
}

function MagicEye({ signal, on }: { signal: number; on: boolean }) {
  const open = on ? 70 - signal * 66 : 0; // the shadow wedge closes as you tune in
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" aria-label={`Tuning eye, signal ${Math.round(signal * 100)}%`} role="img">
      <circle cx="20" cy="20" r="18" fill="#0d1a10" stroke="#3a2a1a" strokeWidth="2" />
      {on && (
        <>
          <circle cx="20" cy="20" r="15" fill="#3fd07a" opacity={0.55 + signal * 0.4} />
          <path d={`M20 20 L ${20 + 15 * Math.sin(((-open / 2) * Math.PI) / 180)} ${20 - 15 * Math.cos(((-open / 2) * Math.PI) / 180)} A 15 15 0 0 1 ${20 + 15 * Math.sin(((open / 2) * Math.PI) / 180)} ${20 - 15 * Math.cos(((open / 2) * Math.PI) / 180)} Z`} fill="#0d1a10" />
        </>
      )}
      <circle cx="20" cy="20" r="5" fill="#0d1a10" />
    </svg>
  );
}

export function WirelessSet() {
  const engine = useRef<WirelessEngine | null>(null);
  const [on, setOn] = useState(false);
  const [warm, setWarm] = useState(false);
  const [kc, setKc] = useState(60);
  const [volume, setVolume] = useState(6);
  const [tone, setTone] = useState(0.55);
  const [noise, setNoise] = useState(0.2);
  const [activity, setActivity] = useState(0.2);
  const [layers, setLayers] = useState<Record<LayerId, number>>(() => Object.fromEntries(LAYERS.map((l) => [l, 0])) as Record<LayerId, number>);
  const [scene, setScene] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const dial = useRef<HTMLDivElement>(null);

  const near = CARRIERS.reduce((b, c) => (Math.abs(c.kc - kc) < Math.abs(b.kc - kc) ? c : b), CARRIERS[0]);
  const signal = Math.max(0, 1 - Math.abs(kc - near.kc) / 3.2);
  const tuned = signal > 0.6;

  const ensure = useCallback(() => {
    if (!engine.current) {
      const e = new WirelessEngine();
      e.setTuning(kc);
      e.setVolume(volume);
      e.setTone(tone);
      e.setNoise(noise);
      e.setActivity(activity);
      engine.current = e;
    }
    return engine.current;
  }, [kc, volume, tone, noise, activity]);

  useEffect(() => () => engine.current?.dispose(), []);
  useEffect(() => engine.current?.setTuning(kc), [kc]);
  useEffect(() => engine.current?.setVolume(volume), [volume]);
  useEffect(() => engine.current?.setTone(tone), [tone]);
  useEffect(() => engine.current?.setNoise(noise), [noise]);
  useEffect(() => engine.current?.setActivity(activity), [activity]);

  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const loop = () => {
      setLevel((l) => l * 0.6 + (engine.current?.level() ?? 0) * 0.4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  const mains = () => {
    const e = ensure();
    playSfx(on ? "switch-off" : "switch-on", 0.5);
    if (on) {
      e.powerOff();
      setOn(false);
      setWarm(false);
      setLevel(0);
    } else {
      e.powerOn();
      setOn(true);
      setTimeout(() => setWarm(true), 2400);
    }
  };

  const setLayer = (id: LayerId, v: number) => {
    setLayers((x) => ({ ...x, [id]: v }));
    setScene(null);
    ensure().setLayer(id, v);
  };

  const applyScene = (id: string) => {
    const s = SCENES.find((x) => x.id === id)!;
    const e = ensure();
    const next = Object.fromEntries(LAYERS.map((l) => [l, s.layers[l] ?? 0])) as Record<LayerId, number>;
    LAYERS.forEach((l) => e.setLayer(l, next[l]));
    setLayers(next);
    if (s.tone !== undefined) setTone(s.tone);
    if (s.noise !== undefined) setNoise(s.noise);
    if (s.activity !== undefined) setActivity(s.activity);
    setScene(id);
    playSfx("click", 0.3);
  };

  const tuneFromPointer = (clientX: number) => {
    const r = dial.current?.getBoundingClientRect();
    if (!r) return;
    const t = Math.min(1, Math.max(0, (clientX - r.left - r.width * 0.04) / (r.width * 0.92)));
    setKc(Math.round((MIN + t * (MAX - MIN)) * 2) / 2);
  };

  const ticks = Array.from({ length: 12 }, (_, i) => Math.round(MIN + (i * (MAX - MIN)) / 11));
  const statusLine = `${Math.round(kc)} KC · ${on ? (warm ? "WARM" : "COLD") : "OFF"} — ${signal > 0.15 ? near.name.toUpperCase() : "BETWEEN STATIONS"}`;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-t-[3.5rem] sm:rounded-t-[7rem] rounded-b-xl p-4 sm:p-8 shadow-[0_40px_80px_-30px_#000000cc]" style={wood}>
        <div className="mx-auto w-fit rounded-full border border-[#c9a66a]/50 bg-[#3a2414]/60 whitespace-nowrap px-4 sm:px-5 py-1.5 font-serif text-[0.6rem] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.35em] text-[#d9bf86]">
          Bureau Wireless · Model No. III
        </div>

        {/* Dial */}
        <div
          ref={dial}
          className="relative mt-6 h-40 cursor-ew-resize rounded-sm border-4 border-[#3a2414] shadow-[inset_0_0_30px_#a0703055,0_2px_0_#c9a66a55] select-none"
          style={{ background: on ? "radial-gradient(ellipse at 50% 60%, #fbefc8, #ead39a 70%, #d9b878)" : "linear-gradient(#e6d6b0, #cdb98c)", touchAction: "none" }}
          onPointerDown={(e) => {
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
            tuneFromPointer(e.clientX);
          }}
          onPointerMove={(e) => e.buttons && tuneFromPointer(e.clientX)}
          role="slider"
          tabIndex={0}
          aria-label="Tuning dial"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={kc}
          aria-valuetext={`${kc} kilocycles, ${near.name}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setKc((k) => Math.min(MAX, k + (e.shiftKey ? 5 : 0.5)));
            if (e.key === "ArrowLeft") setKc((k) => Math.max(MIN, k - (e.shiftKey ? 5 : 0.5)));
          }}
        >
          <div className="absolute inset-x-[4%] top-2 h-8">
            {Array.from({ length: 43 }, (_, i) => (
              <span key={i} className="absolute top-0 w-px bg-[#3a2a1a]/60" style={{ left: `${(i / 42) * 100}%`, height: i % 4 === 0 ? 14 : 7 }} />
            ))}
            {ticks.map((t, i) => (
              <span key={t} className={cn("absolute top-5 -translate-x-1/2 font-serif text-[0.6rem] sm:text-[0.7rem] text-[#3a2a1a]/80", i % 2 === 1 && "hidden sm:inline")} style={{ left: `${pct(t)}%` }}>
                {t}
              </span>
            ))}
          </div>
          <p className="absolute inset-x-0 top-[3.6rem] text-center font-serif text-[0.65rem] uppercase tracking-[0.35em] text-[#5a4632]/80">Kilocycles · Medium Wave</p>
          <div className="absolute inset-x-[4%] bottom-3 h-12">
            {CARRIERS.map((c, i) => (
              <span key={c.id} className={cn("absolute -translate-x-1/2 font-serif text-[0.5rem] sm:text-[0.78rem] uppercase", i % 2 ? "top-0" : "top-5", near.id === c.id && tuned ? "text-[#a0281e]" : "text-[#3a2a1a]/80")} style={{ left: `${pct(c.kc)}%` }}>
                {c.genre}
              </span>
            ))}
          </div>
          <div className="absolute inset-x-[4%] inset-y-1 pointer-events-none">
            <span className="absolute top-0 bottom-0 w-[2px] -translate-x-1/2 bg-[#a0281e] shadow-[0_0_4px_#a0281e88] transition-[left] duration-75" style={{ left: `${pct(kc)}%` }} />
          </div>
        </div>

        {/* Display strip */}
        <div className="mt-3 flex items-center justify-between gap-2 rounded-sm border border-[#1d140c] bg-[#1a120a] px-3 py-1.5">
          <span className={cn("truncate font-typewriter text-[0.65rem] sm:text-sm tracking-[0.1em] sm:tracking-[0.2em]", on ? "text-[#9fe0a8] [text-shadow:0_0_6px_#3fd07a88]" : "text-[#4a5a4a]")} aria-live="polite">
            {statusLine}
          </span>
          <MagicEye signal={signal} on={on && warm} />
        </div>

        {/* Meters and speaker */}
        <div className="mt-5 grid grid-cols-2 items-end justify-items-center gap-4 sm:gap-6 sm:grid-cols-[auto_1fr_auto]">
          <Meter value={on ? level : 0} label="Output" variant="vu" />
          <div className="col-span-2 order-first flex w-full flex-col items-center sm:col-span-1 sm:order-none">
            <div className="relative h-44 sm:h-56 w-full max-w-xs overflow-hidden rounded-sm border-4 border-[#1d140c]" style={{ background: "repeating-linear-gradient(45deg, #2a1d12 0 2px, #3a2a1a 2px 4px), repeating-linear-gradient(-45deg, #00000033 0 2px, transparent 2px 4px)" }}>
              <div className="absolute inset-0 flex items-stretch justify-center gap-5 px-10 py-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-b from-[#e8c98a] via-[#b8955a] to-[#8a6a3a]"
                    style={{ transform: `scaleY(${0.96 + (on ? level : 0) * 0.05})`, transition: "transform 80ms" }}
                  />
                ))}
              </div>
            </div>
            <span className="mt-2 font-serif text-xs uppercase tracking-[0.3em] text-[#e6d3a8]">Moving coil · 8 in.</span>
          </div>
          <Meter value={on ? signal : 0} label="Carrier" variant="signal" />
        </div>

        {/* Controls */}
        <div className="mt-8 rounded-md border border-[#c9a66a]/30 bg-[#1d140c]/60 p-5">
          <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-6">
            <Knob label="Tuning" size="lg" value={kc} min={MIN} max={MAX} step={0.5} onChange={setKc} readout={near.name} ends={["55", "160"]} />
            <Knob label="Volume" value={volume} min={0} max={10} step={0.5} onChange={setVolume} readout={String(volume)} ends={["0", "10"]} />
            <Knob label="Tone" value={tone} min={0} max={1} onChange={setTone} readout={`${Math.round(900 * Math.pow(14, tone))} Hz`} ends={["Mellow", "Bright"]} />
            <Knob label="Noise" value={noise} min={0} max={1} onChange={setNoise} readout={noise < 0.34 ? "Clean" : noise < 0.67 ? "House" : "Tired"} ends={["Clean", "Tired"]} />
            <Knob label="Activity" value={activity} min={0} max={1} onChange={setActivity} readout={activity === 0 ? "Off" : activity < 0.5 ? "Sparse" : "Busy"} ends={["Off", "Busy"]} />
            <div className="flex flex-col items-center pt-3">
              <button
                type="button"
                onClick={mains}
                aria-pressed={on}
                className="relative h-16 w-12 rounded-md border-2 border-[#b8955a] bg-[#2a1d12] shadow-[inset_0_2px_6px_#000a] cursor-pointer"
                aria-label={on ? "Switch the set off" : "Switch the set on"}
              >
                <span className={cn("absolute left-1/2 h-6 w-5 -translate-x-1/2 rounded-sm bg-gradient-to-b from-[#f3dca0] to-[#b8955a] shadow transition-all duration-200", on ? "top-2" : "top-8")} />
              </button>
              <span className="mt-2 font-serif text-sm uppercase tracking-[0.2em] text-[#e6d3a8]">Mains · {on ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mixing panel */}
      <div className="mt-6 rounded-md border-[6px] border-[#b8955a] p-5 sm:p-6 shadow-[0_20px_40px_-20px_#000a]" style={{ background: "repeating-linear-gradient(90deg, #ffffff05 0 2px, transparent 2px 6px), #1d140c" }}>
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-[#e6d3a8]">
          Scenes &amp; Mixing Panel <span className="ml-2 font-typewriter normal-case tracking-normal text-[#c9b48c]/70">{scene ? SCENES.find((s) => s.id === scene)?.name : Object.values(layers).some((v) => v > 0) ? "custom" : "idle"}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => applyScene(s.id)}
              aria-pressed={scene === s.id}
              className={cn("border px-3 py-1.5 font-serif text-sm uppercase tracking-wider cursor-pointer", scene === s.id ? "border-[#e6d3a8] bg-[#e6d3a8]/10 text-[#f3e3bd]" : "border-[#c9a66a]/40 text-[#d9bf86] hover:border-[#c9a66a]")}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {LAYERS.map((l) => (
            <div key={l} className="relative flex flex-col items-center rounded-sm border border-[#c9a66a]/15 bg-black/20 py-3">
              <span className={cn("absolute top-1.5 h-1.5 w-1.5 rounded-full", layers[l] > 0 ? "bg-amber-300 shadow-[0_0_6px_#fcd34d]" : "bg-[#3a2a1a]")} />
              <Knob label={l === "cafe" ? "Café" : l} size="sm" value={layers[l]} min={0} max={1} step={0.05} clickStep={0.25} onChange={(v) => setLayer(l, v)} readout={layers[l] ? `${Math.round(layers[l] * 100)}` : "—"} />
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-[#c9a66a]/20 pt-4 font-serif italic text-sm text-[#d9bf86]/80">
          A scene sets the whole room — layers, tone, and how often the building interrupts. Or work the trimmers yourself: click to step one up, drag or
          scroll for fine work. Layers play even with the set switched off.
        </p>
      </div>

      {/* Register */}
      <div className="mt-8 border-t border-foreground/20 pt-5">
        <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-foreground/80">Station Register</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {CARRIERS.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => setKc(c.kc)} className={cn("font-serif text-lg hover:underline cursor-pointer", near.id === c.id && tuned && "underline decoration-dotted")}>
                {c.name}
              </button>{" "}
              <span className="font-typewriter text-xs text-muted-foreground">{c.kc} kc</span> {c.stream && <span className="type-label text-[0.5rem] text-muted-foreground">Live</span>}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-typewriter text-xs text-muted-foreground">
          Live carriers stream from{" "}
          <a href="https://somafm.com/" target="_blank" rel="noreferrer" className="underline">
            SomaFM
          </a>
          , listener-supported and advertising-free. House stations are composed in your browser as you listen.
        </p>
      </div>
    </div>
  );
}
