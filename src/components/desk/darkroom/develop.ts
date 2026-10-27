import type { Curve, Stock } from "./stocks";

// The chemistry: curves, mono mix, saturation, tone, fade, halation, grain
// and vignette, all on raw RGBA bytes. Nothing leaves the page.

function lut(points?: Curve) {
  const t = new Uint8ClampedArray(256);
  if (!points) {
    for (let i = 0; i < 256; i++) t[i] = i;
    return t;
  }
  const p = [...points].sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    let k = 0;
    while (k < p.length - 2 && x > p[k + 1][0]) k++;
    const [x0, y0] = p[k];
    const [x1, y1] = p[k + 1];
    const u = x1 === x0 ? 0 : Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
    const sm = u * u * (3 - 2 * u); // smoothstep keeps the joins soft
    t[i] = Math.round((y0 + (y1 - y0) * (0.5 * u + 0.5 * sm)) * 255);
  }
  return t;
}

/** Separable box blur on a single-channel float buffer, repeated for a gaussian-ish result. */
function blur(src: Float32Array, w: number, h: number, radius: number) {
  const tmp = new Float32Array(src.length);
  const a = src;
  const b = tmp;
  const r = Math.max(1, Math.round(radius));
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[y * w + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[y * w + x] = acc / (2 * r + 1);
        acc += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1);
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  return a;
}

function hash2(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function develop(src: ImageData, stock: Stock, strength: number, opts: { grain: boolean; halation: boolean; seed?: number }): ImageData {
  const { width: w, height: h } = src;
  const out = new ImageData(w, h);
  const d = src.data;
  const o = out.data;
  const lr = lut(stock.curves?.r);
  const lg = lut(stock.curves?.g);
  const lb = lut(stock.curves?.b);
  const lrgb = lut(stock.curves?.rgb);
  const sat = stock.saturation ?? 1;
  const tone = stock.tone ?? [1, 1, 1];
  const fade = stock.fade ?? 0;
  const scale = Math.max(w, h) / 1200; // effects are authored for a 1200px print

  // Halation: bright areas, blurred on a quarter-size buffer, screened back in.
  let halo: Float32Array | null = null;
  const hw = Math.max(1, Math.round(w / 4));
  const hh = Math.max(1, Math.round(h / 4));
  if (opts.halation && stock.halation) {
    const m = new Float32Array(hw * hh);
    for (let y = 0; y < hh; y++)
      for (let x = 0; x < hw; x++) {
        const i = (Math.min(h - 1, y * 4) * w + Math.min(w - 1, x * 4)) * 4;
        const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        m[y * hw + x] = Math.max(0, l - stock.halation.threshold) / (1 - stock.halation.threshold);
      }
    halo = blur(m, hw, hh, (stock.halation.radius * scale) / 1.5);
  }

  const grainAmt = opts.grain && stock.grain ? stock.grain.amount * 255 : 0;
  const grainSize = stock.grain ? Math.max(1, stock.grain.size * scale) : 1;
  const vig = stock.vignette ?? 0;
  const seed = opts.seed ?? 7;
  const cx = w / 2;
  const cy = h / 2;
  const maxD = Math.hypot(cx, cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];
      if (stock.mono) {
        const l = stock.mono[0] * r + stock.mono[1] * g + stock.mono[2] * b;
        r = g = b = l;
      } else if (sat !== 1) {
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = l + (r - l) * sat;
        g = l + (g - l) * sat;
        b = l + (b - l) * sat;
      }
      r = lr[lrgb[Math.max(0, Math.min(255, r | 0))]] * tone[0];
      g = lg[lrgb[Math.max(0, Math.min(255, g | 0))]] * tone[1];
      b = lb[lrgb[Math.max(0, Math.min(255, b | 0))]] * tone[2];
      if (fade) {
        r = fade * 255 + r * (1 - fade);
        g = fade * 255 + g * (1 - fade);
        b = fade * 255 + b * (1 - fade);
      }
      if (halo && stock.halation) {
        const hv = halo[Math.min(hh - 1, (y / 4) | 0) * hw + Math.min(hw - 1, (x / 4) | 0)] * stock.halation.amount * 255;
        const t = stock.halation.tint;
        r = 255 - ((255 - r) * (255 - hv * t[0])) / 255;
        g = 255 - ((255 - g) * (255 - hv * t[1])) / 255;
        b = 255 - ((255 - b) * (255 - hv * t[2])) / 255;
      }
      if (grainAmt) {
        const n = (hash2((x / grainSize) | 0, (y / grainSize) | 0, seed) - 0.5) * grainAmt;
        r += n;
        g += n;
        b += n;
      }
      if (vig) {
        const v = Math.hypot(x - cx, y - cy) / maxD;
        const k = 1 - vig * Math.max(0, v - 0.45) * 1.6;
        r *= k;
        g *= k;
        b *= k;
      }
      o[i] = d[i] + (r - d[i]) * strength;
      o[i + 1] = d[i + 1] + (g - d[i + 1]) * strength;
      o[i + 2] = d[i + 2] + (b - d[i + 2]) * strength;
      o[i + 3] = 255;
    }
  }
  return out;
}
