"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImagePlus, RotateCcw } from "lucide-react";
import { moments } from "@/content/lifestyle";
import { playSfx } from "@/lib/audio";
import { asset, cn } from "@/lib/utils";
import { develop } from "./develop";
import { STOCKS, type Stock } from "./stocks";

const PREVIEW = 1100;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function drawInstant(ctx: CanvasRenderingContext2D, img: CanvasImageSource, w: number, h: number, caption: string) {
  // The frame: an even border on three sides, a deep one at the foot.
  const side = Math.round(Math.min(w, h) * 0.06);
  const foot = Math.round(Math.min(w, h) * 0.22);
  ctx.canvas.width = w + side * 2;
  ctx.canvas.height = h + side + foot;
  ctx.fillStyle = "#f3efe4";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(img, side, side, w, h);
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.strokeRect(side, side, w, h);
  if (caption) {
    ctx.fillStyle = "#2c2a3a";
    ctx.font = `${Math.round(foot * 0.36)}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-caveat-face") || "cursive"}, cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(caption, ctx.canvas.width / 2, h + side + foot / 2, w);
  }
}

export function Darkroom() {
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("photograph");
  const [stock, setStock] = useState<Stock>(STOCKS[0]);
  const [strength, setStrength] = useState(1);
  const [grain, setGrain] = useState(true);
  const [halation, setHalation] = useState(true);
  const [instant, setInstant] = useState(false);
  const [caption, setCaption] = useState("");
  const [developing, setDeveloping] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const small = useRef<ImageData | null>(null);

  // A preview-sized copy of the plate, kept as raw pixels.
  useEffect(() => {
    if (!source) return;
    const k = Math.min(1, PREVIEW / Math.max(source.naturalWidth, source.naturalHeight));
    const w = Math.round(source.naturalWidth * k);
    const h = Math.round(source.naturalHeight * k);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(source, 0, 0, w, h);
    small.current = g.getImageData(0, 0, w, h);
    setDeveloping(true);
    const t = setTimeout(() => setDeveloping(false), 2400);
    return () => clearTimeout(t);
  }, [source]);

  const render = useCallback(() => {
    const el = canvas.current;
    const src = small.current;
    if (!el || !src) return;
    const out = develop(src, stock, strength, { grain, halation });
    const ctx = el.getContext("2d")!;
    if (instant || stock.frame === "instant") {
      const tmp = document.createElement("canvas");
      tmp.width = out.width;
      tmp.height = out.height;
      tmp.getContext("2d")!.putImageData(out, 0, 0);
      drawInstant(ctx, tmp, out.width, out.height, caption);
    } else {
      el.width = out.width;
      el.height = out.height;
      ctx.putImageData(out, 0, 0);
    }
  }, [stock, strength, grain, halation, instant, caption]);

  useEffect(() => {
    const id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, [render, source]);

  const accept = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = await loadImage(url);
    setName(file.name.replace(/\.[^.]+$/, ""));
    setSource(img);
  };

  const borrow = async (src: string, title: string) => {
    const img = await loadImage(asset(src));
    setName(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    setSource(img);
  };

  const print = async () => {
    if (!source) return;
    setPrinting(true);
    playSfx("flash", 0.35);
    await new Promise((r) => setTimeout(r, 60));
    try {
      const c = document.createElement("canvas");
      c.width = source.naturalWidth;
      c.height = source.naturalHeight;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(source, 0, 0);
      const out = develop(g.getImageData(0, 0, c.width, c.height), stock, strength, { grain, halation });
      g.putImageData(out, 0, 0);
      let final = c;
      if (instant || stock.frame === "instant") {
        final = document.createElement("canvas");
        drawInstant(final.getContext("2d")!, c, c.width, c.height, caption);
      }
      const blob: Blob = await new Promise((r) => final.toBlob((b) => r(b!), "image/jpeg", 0.92));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${name}-${stock.id}.jpg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } finally {
      setPrinting(false);
    }
  };

  if (!source) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) accept(f);
        }}
        className={cn("mx-auto max-w-5xl border border-dashed p-10 sm:p-20 text-center transition-colors", dragOver ? "border-[var(--rust)] bg-[var(--rust)]/5" : "border-foreground/30")}
        style={{ background: dragOver ? undefined : "radial-gradient(ellipse 45% 50% at 50% 45%, color-mix(in oklab, var(--foreground) 4%, transparent), transparent)" }}
      >
        <ImagePlus className="mx-auto h-7 w-7 text-foreground/70" />
        <h2 className="mt-3 font-sans text-3xl">Lay a photograph on the plate</h2>
        <label className="mt-5 inline-block cursor-pointer bg-[var(--rust)] px-5 py-2.5 type-label text-[0.62rem] text-[#f6e6d6] hover:opacity-90">
          Choose a photograph
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && accept(e.target.files[0])} />
        </label>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm text-foreground/75">
          It never leaves this page. Everything is developed in the browser, and there is nothing to upload.
        </p>
        <p className="mt-8 type-label text-[0.55rem] text-muted-foreground">Or borrow one from the gallery</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {moments.slice(0, 8).map((m) => (
            <button key={m.src} type="button" onClick={() => borrow(m.src, m.title)} className="h-12 w-12 overflow-hidden border border-foreground/30 hover:border-foreground cursor-pointer" aria-label={`Use gallery photograph ${m.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(m.src.replace(".jpg", "-thumb.jpg"))} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <div className="relative grid min-h-[60vh] place-items-center bg-[#1a1410] p-4 sm:p-8 shadow-inner">
          <canvas
            ref={canvas}
            className="max-h-[75vh] max-w-full shadow-[0_18px_40px_-16px_#000]"
            style={{
              filter: developing ? "invert(1) hue-rotate(180deg) sepia(0.35) brightness(0.85) contrast(1.15)" : "none",
              transition: developing ? "none" : "filter 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
            }}
            aria-label={`${name}, developed on ${stock.name}`}
            role="img"
          />
          {developing && <span className="absolute bottom-4 left-1/2 -translate-x-1/2 type-label text-[0.6rem] text-[#e8b080]">Developing · keep the door shut</span>}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(120,20,10,0.25))" }} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setSource(null)} className="inline-flex items-center gap-2 type-label text-[0.62rem] text-muted-foreground hover:text-foreground cursor-pointer">
            <RotateCcw className="h-3.5 w-3.5" /> Another photograph
          </button>
          <button type="button" onClick={print} disabled={printing} className="inline-flex items-center gap-2 bg-foreground px-5 py-3 font-serif text-sm uppercase tracking-wider text-background disabled:opacity-60 cursor-pointer">
            <Download className="h-4 w-4" /> {printing ? "Printing…" : "Print at full resolution"}
          </button>
        </div>
      </div>

      <aside className="space-y-6">
        <div>
          <p className="type-label text-[0.62rem] text-muted-foreground">Film stock</p>
          <ul className="mt-3 max-h-[46vh] space-y-1 overflow-y-auto pr-1" data-lenis-prevent>
            {STOCKS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setStock(s);
                    playSfx("click", 0.3);
                  }}
                  aria-pressed={stock.id === s.id}
                  className={cn("w-full border px-3 py-2 text-left transition-colors cursor-pointer", stock.id === s.id ? "border-[var(--rust)] bg-[var(--rust)]/5" : "border-transparent hover:border-foreground/20")}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-serif">{s.name}</span>
                    <span className="font-typewriter text-xs text-muted-foreground">{s.year}</span>
                  </span>
                  <span className="block font-sans text-xs text-muted-foreground">{s.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label htmlFor="dk-strength" className="flex justify-between type-label text-[0.62rem] text-muted-foreground">
            Strength <span>{Math.round(strength * 100)}%</span>
          </label>
          <input id="dk-strength" type="range" min={0} max={1} step={0.01} value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="mt-2 w-full accent-[var(--rust)]" />
        </div>
        <div className="space-y-2 font-serif text-sm">
          {[
            ["Grain", grain, setGrain],
            ["Halation", halation, setHalation],
            ["Instant frame", instant || stock.frame === "instant", setInstant],
          ].map(([label, on, set]) => (
            <label key={label as string} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={on as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} className="h-4 w-4 accent-[var(--rust)]" />
              {label as string}
            </label>
          ))}
        </div>
        {(instant || stock.frame === "instant") && (
          <div>
            <label htmlFor="dk-caption" className="type-label text-[0.62rem] text-muted-foreground">
              Write on the frame
            </label>
            <input id="dk-caption" value={caption} maxLength={40} onChange={(e) => setCaption(e.target.value)} placeholder="summer, the long one" className="mt-2 w-full border-b border-foreground/40 bg-transparent py-1 font-caveat text-2xl focus:outline-none" />
          </div>
        )}
      </aside>
    </div>
  );
}
