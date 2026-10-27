"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Maximize2, Minimize2, Volume2, AudioLines } from "lucide-react";
import { VINYL_COLOURS, parseSpotify, somafm, spotifyShelf, type LiveStation } from "@/content/stations";
import { SurfaceNoise } from "@/lib/surface-noise";
import { playSfx } from "@/lib/audio";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Arm angles in degrees around the pivot (93%, 7%). The stylus sits 45.5%
// from the pivot, so these place it off the record, on the outer groove,
// and at the label's edge.
const REST = -22;
const LEAD_IN = -10;
const RUN_OUT = 28;
const ARM_BASE = 98.84; // direction of the arm at 0°, from the pivot

function stylusAt(angle: number) {
  const t = (angle * Math.PI) / 180;
  return { x: 93 + (-7 * Math.cos(t) - 45 * Math.sin(t)), y: 7 + (-7 * Math.sin(t) + 45 * Math.cos(t)) };
}

function Sleeve({ s, onPick, dragging }: { s: LiveStation; onPick: () => void; dragging: boolean }) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/station", s.id);
        e.dataTransfer.effectAllowed = "copy";
      }}
      onClick={onPick}
      className={cn("group relative h-28 w-28 cursor-grab text-left active:cursor-grabbing", dragging && "opacity-60")}
      aria-label={`Put ${s.name} on the platter`}
    >
      <span className="absolute -top-3 left-4 h-24 w-24 rounded-full bg-[#141210] transition-transform duration-300 group-hover:-translate-y-2" />
      <span className="absolute inset-0 shadow-[0_8px_18px_-8px_#000000b0]" style={{ backgroundColor: s.sleeve }}>
        <span className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: "var(--tex-hide)", backgroundSize: "160px" }} />
        <span className="absolute left-2.5 top-8 right-2 font-sans text-[0.9rem] uppercase leading-tight text-[#f2e6cf]">{s.name}</span>
        <span className="absolute left-2.5 bottom-6 type-label text-[0.45rem] text-[#f2e6cf]/60">SomaFM</span>
      </span>
    </button>
  );
}

export function Turntable() {
  const [station, setStation] = useState<LiveStation | null>(null);
  const [angle, setAngle] = useState(REST);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [noise, setNoise] = useState(0.5);
  const [colour, setColour] = useState<(typeof VINYL_COLOURS)[number]>(VINYL_COLOURS[0]);
  const [aux, setAux] = useState(true);
  const [spotify, setSpotify] = useState<string | null>(null);
  const [paste, setPaste] = useState("");
  const [over, setOver] = useState(false);
  const [full, setFull] = useState(false);

  const wrap = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const crackle = useRef<SurfaceNoise | null>(null);
  const dragArm = useRef(false);

  const needleDown = angle >= LEAD_IN - 1;
  const grit = Math.max(0, Math.min(1, (angle - LEAD_IN) / (RUN_OUT - LEAD_IN)));

  // Sound follows the arm: needle on a loaded record means music plus crackle.
  useEffect(() => {
    const shouldPlay = needleDown && !!station;
    if (shouldPlay && !playing) {
      if (!audio.current) {
        const el = new Audio();
        el.preload = "none";
        el.addEventListener("playing", () => setBuffering(false));
        el.addEventListener("waiting", () => setBuffering(true));
        audio.current = el;
      }
      const el = audio.current;
      if (el.src !== station.stream) el.src = station.stream;
      el.volume = volume;
      setBuffering(true);
      el.play().catch(() => setBuffering(false));
      crackle.current ??= new SurfaceNoise();
      crackle.current.setLevel(noise * volume);
      crackle.current.start();
      playSfx("needle", 0.4);
      setPlaying(true);
    } else if (!shouldPlay && playing) {
      audio.current?.pause();
      crackle.current?.stop();
      setPlaying(false);
      setBuffering(false);
    }
  }, [needleDown, station, playing, volume, noise]);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
    crackle.current?.setLevel(noise * volume);
  }, [volume, noise]);

  useEffect(() => {
    crackle.current?.setGrit(grit);
  }, [grit]);

  // While playing, the arm creeps inward like a real stylus.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (!dragArm.current) setAngle((a) => Math.min(RUN_OUT, a + 0.02));
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(
    () => () => {
      audio.current?.pause();
      crackle.current?.dispose();
    },
    [],
  );

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const load = useCallback((s: LiveStation) => {
    setStation(s);
    setSpotify(null);
    playSfx("click", 0.3);
  }, []);

  // Tonearm: pivot is at the top right of the deck.
  const onArmDown = (e: React.PointerEvent) => {
    dragArm.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onArmMove = (e: React.PointerEvent) => {
    if (!dragArm.current || !deck.current) return;
    const r = deck.current.getBoundingClientRect();
    const px = r.left + r.width * 0.93;
    const py = r.top + r.height * 0.07;
    const a = (Math.atan2(e.clientY - py, e.clientX - px) * 180) / Math.PI - ARM_BASE;
    setAngle(Math.max(REST, Math.min(RUN_OUT, a)));
  };
  const onArmUp = () => {
    dragArm.current = false;
  };

  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrap.current?.requestFullscreen();
    } catch {}
  };

  const label = station ? station.sleeve : "#2a2420";

  return (
    <div ref={wrap} className={cn("tt relative bg-background", full && "overflow-y-auto p-6")}>
      <button type="button" onClick={toggleFull} className="absolute right-0 top-0 z-10 border border-foreground/30 p-2.5 hover:bg-foreground/5 cursor-pointer" aria-label={full ? "Leave full screen" : "Full screen"}>
        {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div
            ref={deck}
            className={cn("relative mx-auto aspect-square w-full max-w-[38rem] select-none", over && "outline outline-2 outline-dashed outline-[var(--rust)] outline-offset-8")}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              const s = somafm.find((x) => x.id === e.dataTransfer.getData("text/station"));
              if (s) load(s);
            }}
          >
            {/* Platter and record */}
            <div
              className="absolute inset-[4%] rounded-full shadow-[0_30px_60px_-24px_#000000aa]"
              style={{
                background: `repeating-radial-gradient(circle at 50% 50%, ${colour.base} 0 1.5px, ${colour.groove} 1.5px 3px), ${colour.base}`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0 8%, #ffffff1c 12%, transparent 18% 50%, #ffffff14 58%, transparent 64% 100%)",
                  mixBlendMode: "screen",
                  animation: playing ? "disc-spin 1.8s linear infinite" : undefined,
                }}
              />
              <div
                className="absolute inset-[34%] rounded-full grid place-items-center text-center"
                style={{ background: station ? `radial-gradient(circle at 40% 35%, color-mix(in oklab, ${label} 75%, white), ${label} 65%)` : "transparent", animation: playing ? "disc-spin 1.8s linear infinite" : undefined }}
              >
                {station ? (
                  <div className="text-[#f6ead2]">
                    <div className="font-sans text-sm sm:text-lg uppercase">{station.name}</div>
                    <div className="type-label text-[0.45rem] opacity-70">SomaFM · live</div>
                  </div>
                ) : (
                  <span className="max-w-[60%] type-label text-[0.55rem] leading-relaxed text-foreground/30">Drag a record onto the platter</span>
                )}
              </div>
              <div className="absolute left-1/2 top-1/2 h-[3%] w-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b9a27a] shadow" />
            </div>

            {/* Tonearm */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <g style={{ transformOrigin: "93px 7px", transform: `rotate(${angle}deg)`, transition: dragArm.current ? "none" : "transform 0.6s cubic-bezier(0.22,0.68,0.28,1)" }}>
                <line x1="93" y1="7" x2="86" y2="52" stroke="#8a7a5e" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="93" y1="7" x2="86" y2="52" stroke="#d8c8a2" strokeWidth="0.4" strokeLinecap="round" />
                <rect x="83.2" y="51" width="5" height="7" rx="1" fill="#5a4e3e" transform="rotate(-8 86 54)" />
                <circle cx="93" cy="7" r="4" fill="#2a2420" stroke="#5a4e3e" strokeWidth="1" />
                <circle cx="93" cy="7" r="1.6" fill="#b9a27a" />
              </g>
            </svg>
            <div
              role="slider"
              tabIndex={0}
              aria-label="Tonearm"
              aria-valuemin={REST}
              aria-valuemax={RUN_OUT}
              aria-valuenow={Math.round(angle)}
              aria-valuetext={needleDown ? "Needle on the record" : "Arm at rest"}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") setAngle((a) => Math.min(RUN_OUT, Math.max(LEAD_IN, a + 2)));
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") setAngle((a) => Math.max(REST, a - 2));
              }}
              onPointerDown={onArmDown}
              onPointerMove={onArmMove}
              onPointerUp={onArmUp}
              className="absolute h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--rust)]"
              style={{ touchAction: "none", left: `${stylusAt(angle).x}%`, top: `${stylusAt(angle).y}%` }}
              title="Drag the arm onto the record"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="type-label text-[0.55rem] text-muted-foreground">Pressed in</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {VINYL_COLOURS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColour(c)}
                  aria-pressed={colour.id === c.id}
                  className={cn("inline-flex items-center gap-2 border px-2.5 py-1.5 type-label text-[0.55rem] cursor-pointer", colour.id === c.id ? "border-foreground" : "border-foreground/20 hover:border-foreground/50")}
                >
                  <span className="h-3 w-3 rounded-full border border-black/20" style={{ background: c.base }} /> {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="pr-14 font-sans text-lg leading-relaxed text-foreground/85">
            Five sides in the rack. Drag one across, or drop the arm on it — the crackle underneath is generated, not a loop, and it gets grittier as the
            needle works inward.
          </p>
          <div className="mt-5 flex gap-2">
            <button type="button" disabled={!station || needleDown} onClick={() => setAngle(LEAD_IN + 0.5)} className="flex-1 bg-[var(--rust)] px-4 py-3 type-label text-[0.6rem] text-[#f6e6d6] disabled:opacity-40 cursor-pointer">
              Drop the needle
            </button>
            <button type="button" disabled={!needleDown} onClick={() => setAngle(REST)} className="flex-1 border border-foreground/30 px-4 py-3 type-label text-[0.6rem] disabled:opacity-40 cursor-pointer">
              Take it off
            </button>
          </div>
          <p className="mt-2 h-4 font-typewriter text-xs text-muted-foreground" aria-live="polite">
            {buffering ? "Warming the valves…" : playing && station ? `On air · ${station.name}` : station ? `${station.name} on the platter` : ""}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2" title="Volume">
              <Volume2 className="h-4 w-4 shrink-0" />
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-[var(--rust)]" aria-label="Volume" />
            </label>
            <label className="flex items-center gap-2" title="Surface noise">
              <AudioLines className="h-4 w-4 shrink-0" />
              <input type="range" min={0} max={1} step={0.01} value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="w-full accent-[var(--gilt)]" aria-label="Surface noise" />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-5">
            {somafm.map((s) => (
              <Sleeve key={s.id} s={s} onPick={() => load(s)} dragging={station?.id === s.id} />
            ))}
          </div>
          {station && <p className="mt-4 font-serif italic text-sm text-muted-foreground">{station.blurb}</p>}
        </div>
      </div>

      <div className="mt-10 text-center">
        <button type="button" onClick={() => setAux((a) => !a)} className="inline-flex items-center gap-2 border border-foreground/30 px-4 py-2 type-label text-[0.58rem] hover:bg-foreground/5 cursor-pointer">
          {aux ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />} {aux ? "Hide" : "Show"} auxiliary input
        </button>
      </div>
      {aux && (
        <div className="mx-auto mt-6 max-w-3xl border border-foreground/20 p-5">
          <p className="type-label text-[0.6rem] text-muted-foreground">Auxiliary Input · Line in · Spotify</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {spotifyShelf.map((p) => (
              <button key={p.id} type="button" onClick={() => setSpotify(p.uri)} className={cn("border px-3 py-1.5 font-serif text-sm cursor-pointer", spotify === p.uri ? "border-foreground bg-foreground/5" : "border-foreground/25 hover:border-foreground/60")}>
                {p.label}
              </button>
            ))}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const p = parseSpotify(paste);
              if (p) setSpotify(p);
            }}
          >
            <input value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="Spotify playlist, album or track link" className="min-w-0 flex-1 border border-foreground/30 bg-transparent px-3 py-2 font-serif text-sm focus:outline-none" aria-label="Spotify link" />
            <button type="submit" className="bg-foreground px-4 type-label text-[0.6rem] text-background cursor-pointer">
              Patch in
            </button>
          </form>
          {spotify && (
            <iframe
              title="Spotify player"
              src={`https://open.spotify.com/embed/${spotify}?utm_source=generator&theme=0`}
              className="mt-4 h-[352px] w-full rounded-xl border-0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          )}
          <p className="mt-3 font-serif italic text-xs text-muted-foreground">
            Whole tracks play for listeners already signed in to Spotify Premium. Everyone else gets Spotify&apos;s thirty-second previews — their rule, not the
            deck&apos;s.
          </p>
        </div>
      )}
      <p className="mx-auto mt-8 max-w-3xl text-center font-serif text-sm text-muted-foreground">
        The pressings proper are filed on the{" "}
        <Link href="/locker/vinyl/" className="underline">
          record shelf
        </Link>
        , one drawer of the Evidence Locker. Stations are provided by{" "}
        <a href="https://somafm.com/" target="_blank" rel="noreferrer" className="underline">
          SomaFM
        </a>
        , listener-supported and advertising-free. If you leave this on, go and donate to them.
      </p>
    </div>
  );
}
