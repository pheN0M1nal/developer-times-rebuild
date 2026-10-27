"use client";

// One shared Web Audio graph for the whole site. Everything that makes a
// sound connects to `bus()`, so a single master gain governs it all.
// Sound effects are synthesised on the fly: no audio files ship with the site.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

export function audioContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function bus(): GainNode {
  audioContext();
  return master!;
}

/** Two seconds of white noise, reused by every noise-based effect. */
export function whiteNoise(): AudioBuffer {
  const ac = audioContext();
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/** Route an <audio> element through the shared bus (once per element). */
const connected = new WeakSet<HTMLMediaElement>();
export function connectElementToBus(el: HTMLMediaElement) {
  if (connected.has(el)) return;
  try {
    const ac = audioContext();
    const src = ac.createMediaElementSource(el);
    src.connect(bus());
    connected.add(el);
  } catch {
    /* cross-origin or already connected: plays directly instead */
  }
}

function noiseBurst(opts: {
  at?: number;
  duration: number;
  volume: number;
  type?: BiquadFilterType;
  freq: number;
  q?: number;
  attack?: number;
}) {
  const ac = audioContext();
  const t = (opts.at ?? ac.currentTime) + 0.005;
  const src = ac.createBufferSource();
  src.buffer = whiteNoise();
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const f = ac.createBiquadFilter();
  f.type = opts.type ?? "bandpass";
  f.frequency.value = opts.freq;
  f.Q.value = opts.q ?? 1;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.volume, t + (opts.attack ?? 0.004));
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
  src.connect(f).connect(g).connect(bus());
  src.start(t, Math.random() * 1.5);
  src.stop(t + opts.duration + 0.05);
}

function tone(opts: { at?: number; freq: number; duration: number; volume: number; type?: OscillatorType; slideTo?: number }) {
  const ac = audioContext();
  const t = (opts.at ?? ac.currentTime) + 0.005;
  const o = ac.createOscillator();
  o.type = opts.type ?? "sine";
  o.frequency.setValueAtTime(opts.freq, t);
  if (opts.slideTo) o.frequency.exponentialRampToValueAtTime(opts.slideTo, t + opts.duration);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.volume, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
  o.connect(g).connect(bus());
  o.start(t);
  o.stop(t + opts.duration + 0.05);
}

export type Sfx = "rustle" | "stamp" | "switch-on" | "switch-off" | "flash" | "chime" | "tick" | "click" | "seal" | "needle";

export function playSfx(name: Sfx, volume = 0.4) {
  if (typeof window === "undefined") return;
  try {
    const ac = audioContext();
    const now = ac.currentTime;
    switch (name) {
      case "rustle":
        for (let i = 0; i < 5; i++)
          noiseBurst({ at: now + i * 0.06 + Math.random() * 0.03, duration: 0.09 + Math.random() * 0.08, volume: volume * 0.5, freq: 2400 + Math.random() * 2600, q: 0.7 });
        break;
      case "stamp":
        tone({ freq: 130, slideTo: 55, duration: 0.18, volume: volume * 1.1 });
        noiseBurst({ duration: 0.08, volume: volume * 0.6, type: "lowpass", freq: 1800 });
        break;
      case "seal":
        tone({ freq: 90, slideTo: 40, duration: 0.3, volume: volume });
        noiseBurst({ duration: 0.25, volume: volume * 0.3, type: "lowpass", freq: 700 });
        break;
      case "switch-on":
      case "switch-off":
        noiseBurst({ duration: 0.025, volume: volume * 0.9, type: "highpass", freq: name === "switch-on" ? 3200 : 2200, q: 0.5 });
        tone({ freq: name === "switch-on" ? 320 : 240, slideTo: 120, duration: 0.05, volume: volume * 0.5, type: "triangle" });
        break;
      case "flash":
        tone({ freq: 2600, slideTo: 7800, duration: 0.5, volume: volume * 0.12, type: "sine" });
        noiseBurst({ at: now + 0.48, duration: 0.12, volume: volume * 0.9, type: "highpass", freq: 1500 });
        tone({ at: now + 0.48, freq: 160, slideTo: 60, duration: 0.15, volume: volume * 0.6 });
        break;
      case "chime":
        [1, 2.76, 5.4].forEach((m, i) => tone({ freq: 880 * m, duration: 2.2 - i * 0.6, volume: volume * (0.4 / (i + 1)) }));
        [1, 2.76].forEach((m, i) => tone({ at: now + 0.45, freq: 659 * m, duration: 2 - i * 0.6, volume: volume * (0.35 / (i + 1)) }));
        break;
      case "tick":
        noiseBurst({ duration: 0.012, volume: volume * 0.5, type: "highpass", freq: 5000 });
        break;
      case "click":
        noiseBurst({ duration: 0.02, volume: volume * 0.7, type: "bandpass", freq: 3200, q: 2 });
        break;
      case "needle":
        noiseBurst({ duration: 0.06, volume: volume * 0.8, type: "lowpass", freq: 900 });
        tone({ freq: 70, slideTo: 40, duration: 0.12, volume: volume * 0.6 });
        break;
    }
  } catch {
    /* audio unavailable: stay silent */
  }
}

export const pageTurn = () => playSfx("rustle", 0.22);
