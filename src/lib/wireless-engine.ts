"use client";

import { audioContext, bus, whiteNoise } from "./audio";

// The Bureau Wireless: a valve receiver simulated in Web Audio.
// House stations are composed live; live carriers are SomaFM streams.
// Everything passes the set's tone control; static fills the gaps between
// carriers, and a heterodyne whistle sings when you are nearly on one.

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export type HouseKind = "jazz" | "fireside" | "cafe" | "street" | "nightdesk" | "copydesk";
export type Carrier = { id: string; kc: number; name: string; genre: string; house?: HouseKind; stream?: string; page?: string };

export const CARRIERS: Carrier[] = [
  { id: "jazz-hour", kc: 60, name: "Jazz Hour", genre: "Jazz", house: "jazz" },
  { id: "boot-liquor", kc: 69, name: "Boot Liquor", genre: "Roots", stream: "https://ice1.somafm.com/bootliquor-128-mp3", page: "https://somafm.com/bootliquor/" },
  { id: "fireside-hour", kc: 79, name: "Fireside Hour", genre: "Fireside", house: "fireside" },
  { id: "underground-80s", kc: 88, name: "Underground 80s", genre: "Synth", stream: "https://ice1.somafm.com/u80s-128-mp3", page: "https://somafm.com/u80s/" },
  { id: "cafe-continental", kc: 98, name: "Café Continental", genre: "Café", house: "cafe" },
  { id: "deep-space-one", kc: 108, name: "Deep Space One", genre: "Space", stream: "https://ice1.somafm.com/deepspaceone-128-mp3", page: "https://somafm.com/deepspaceone/" },
  { id: "thoroughfare", kc: 117, name: "Thoroughfare", genre: "Street", house: "street" },
  { id: "drone-zone", kc: 127, name: "Drone Zone", genre: "Drone", stream: "https://ice1.somafm.com/dronezone-128-mp3", page: "https://somafm.com/dronezone/" },
  { id: "night-desk", kc: 136, name: "Night Desk", genre: "Desk", house: "nightdesk" },
  { id: "groove-salad", kc: 146, name: "Groove Salad", genre: "Groove", stream: "https://ice1.somafm.com/groovesalad-128-mp3", page: "https://somafm.com/groovesalad/" },
  { id: "copy-desk", kc: 155, name: "Copy Desk", genre: "Pen", house: "copydesk" },
];

export const LAYERS = ["jazz", "rain", "hearth", "cafe", "street", "keys", "pen", "static", "clock", "wind"] as const;
export type LayerId = (typeof LAYERS)[number];

export const SCENES: { id: string; name: string; layers: Partial<Record<LayerId, number>>; tone?: number; noise?: number; activity?: number }[] = [
  { id: "rainy-night", name: "Rainy Night", layers: { rain: 0.8, wind: 0.3, clock: 0.3, jazz: 0.3 }, tone: 0.35, activity: 0.15 },
  { id: "cafe-table", name: "Café Table", layers: { cafe: 0.8, street: 0.3, jazz: 0.4 }, tone: 0.6, activity: 0.4 },
  { id: "night-desk", name: "Night Desk", layers: { keys: 0.5, pen: 0.4, clock: 0.5, hearth: 0.3 }, tone: 0.45, activity: 0.2 },
  { id: "storm-watch", name: "Storm Watch", layers: { rain: 1, wind: 0.8, static: 0.4 }, tone: 0.3, noise: 0.6, activity: 0.1 },
  { id: "small-hours", name: "Small Hours", layers: { hearth: 0.6, clock: 0.6, rain: 0.2 }, tone: 0.3, activity: 0 },
  { id: "ballroom", name: "Ballroom", layers: { jazz: 0.9, cafe: 0.5 }, tone: 0.7, activity: 0.3 },
  { id: "clear", name: "Clear", layers: {}, activity: 0 },
];

type Voice = { stop: () => void; out: AudioNode };

function noiseSource(ac: AudioContext, rate = 1) {
  const s = ac.createBufferSource();
  s.buffer = whiteNoise();
  s.loop = true;
  s.playbackRate.value = rate;
  s.start(ac.currentTime, Math.random() * 1.5);
  return s;
}

function impulse(ac: AudioContext, seconds = 2.2, decay = 2.6) {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

/** A look-ahead scheduler: calls `beat(time, n)` for every beat up to 0.5s ahead. */
function sequencer(ac: AudioContext, bpm: number, beat: (t: number, n: number) => void) {
  const spb = 60 / bpm;
  let next = ac.currentTime + 0.1;
  let n = 0;
  const tick = () => {
    while (next < ac.currentTime + 0.5) {
      beat(next, n++);
      next += spb;
    }
  };
  tick();
  const id = window.setInterval(tick, 120);
  return () => window.clearInterval(id);
}

function pluck(ac: AudioContext, dest: AudioNode, at: number, midi: number, vol: number, dur: number, type: OscillatorType = "triangle") {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = hz(midi);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(dest);
  o.start(at);
  o.stop(at + dur + 0.05);
}

function reed(ac: AudioContext, dest: AudioNode, at: number, midi: number, vol: number, dur: number) {
  const f = ac.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 2200;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.04);
  g.gain.setValueAtTime(vol, at + dur * 0.8);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  f.connect(g).connect(dest);
  [-6, 7].forEach((det) => {
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = hz(midi);
    o.detune.value = det;
    o.connect(f);
    o.start(at);
    o.stop(at + dur + 0.05);
  });
}

function click(ac: AudioContext, dest: AudioNode, at: number, vol: number, freq: number, len = 0.02) {
  const s = ac.createBufferSource();
  s.buffer = whiteNoise();
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  f.Q.value = 2;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  s.connect(f).connect(g).connect(dest);
  s.start(at, Math.random() * 1.5);
  s.stop(at + len + 0.02);
}

/** House stations, composed as they play. */
function houseVoice(ac: AudioContext, kind: HouseKind, reverb: AudioNode): Voice {
  const out = ac.createGain();
  const wet = ac.createGain();
  wet.gain.value = kind === "nightdesk" ? 0.5 : 0.22;
  out.connect(wet).connect(reverb);
  let stop: () => void = () => {};
  const rnd = Math.random;

  if (kind === "jazz") {
    const prog = [[62, 65, 69, 72], [67, 71, 74, 77], [60, 64, 67, 71], [57, 61, 64, 67]]; // ii V I VI
    const scale = [0, 2, 3, 5, 7, 9, 10];
    stop = sequencer(ac, 112, (t, n) => {
      const bar = Math.floor(n / 4) % 4;
      const chord = prog[bar];
      const b = n % 4;
      pluck(ac, out, t, chord[0] - 24 + [0, 7, 12, 10][b], 0.28, 0.5, "sine");
      if (b === 1 || b === 3) chord.forEach((c) => pluck(ac, out, t + 0.06, c - 12, 0.05, 0.4));
      click(ac, out, t + (b % 2 ? 0.12 : 0), 0.05, 7000, 0.06); // brushes
      if (rnd() < 0.65) pluck(ac, out, t + (rnd() < 0.5 ? 0.21 : 0), chord[0] + scale[Math.floor(rnd() * scale.length)], 0.1, 0.45);
    });
  } else if (kind === "fireside") {
    const chords = [[55, 59, 62, 67], [52, 55, 59, 64], [48, 52, 55, 60], [50, 54, 57, 62]];
    stop = sequencer(ac, 150, (t, n) => {
      const c = chords[Math.floor(n / 8) % 4];
      pluck(ac, out, t, c[[0, 2, 1, 3, 2, 1, 3, 2][n % 8]], n % 8 === 0 ? 0.16 : 0.1, 1.4);
    });
  } else if (kind === "cafe") {
    const mel = [76, 74, 72, 74, 76, 76, 76, 74, 74, 74, 76, 79, 79, 76, 74, 72];
    stop = sequencer(ac, 150, (t, n) => {
      const b = n % 3;
      const root = [48, 43, 48, 43][Math.floor(n / 6) % 4];
      if (b === 0) pluck(ac, out, t, root, 0.22, 0.35, "sine");
      else [4, 7, 12].forEach((i) => pluck(ac, out, t, root + 12 + i, 0.03, 0.2, "square"));
      if (b === 0) reed(ac, out, t, mel[Math.floor(n / 3) % mel.length], 0.05, 0.9);
    });
  } else if (kind === "nightdesk") {
    const chords = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62]];
    stop = sequencer(ac, 54, (t, n) => {
      const c = chords[Math.floor(n / 4) % 4];
      if (n % 4 === 0) c.forEach((m, i) => pluck(ac, out, t + i * 0.03, m, 0.06, 3.5));
      if (rnd() < 0.7) pluck(ac, out, t + 0.5, c[Math.floor(rnd() * 4)] + 12, 0.07, 2.2);
    });
  } else if (kind === "copydesk") {
    stop = sequencer(ac, 300, (t, n) => {
      if (rnd() < 0.75) click(ac, out, t, 0.25, 2600 + rnd() * 1800, 0.03);
      if (n % 64 === 63) pluck(ac, out, t, 96, 0.12, 0.8, "sine"); // carriage bell
      if (n % 16 === 0) click(ac, out, t + 0.05, 0.15, 900, 0.08); // teletype thump
    });
  } else {
    // street: traffic swells and a distant tram bell
    const n1 = noiseSource(ac, 0.6);
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 500;
    const g = ac.createGain();
    g.gain.value = 0.25;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ac.createGain();
    lg.gain.value = 0.15;
    lfo.connect(lg).connect(g.gain);
    lfo.start();
    n1.connect(f).connect(g).connect(out);
    const bells = sequencer(ac, 6, (t) => {
      if (rnd() < 0.3) [0, 0.35].forEach((d) => pluck(ac, out, t + d, 88, 0.05, 1.2, "sine"));
    });
    stop = () => {
      bells();
      n1.stop();
      lfo.stop();
    };
  }
  return { out, stop };
}

/** Ambience layers for the mixing panel, all generated. */
function layerVoice(ac: AudioContext, id: LayerId, reverb: AudioNode): Voice {
  const out = ac.createGain();
  const stops: (() => void)[] = [];
  const rnd = Math.random;
  const noiseThrough = (type: BiquadFilterType, freq: number, q: number, vol: number, rate = 1) => {
    const n = noiseSource(ac, rate);
    const f = ac.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ac.createGain();
    g.gain.value = vol;
    n.connect(f).connect(g).connect(out);
    stops.push(() => n.stop());
    return { f, g };
  };

  switch (id) {
    case "rain": {
      noiseThrough("highpass", 1800, 0.5, 0.18);
      noiseThrough("bandpass", 600, 0.6, 0.08, 0.7);
      stops.push(sequencer(ac, 600, (t) => rnd() < 0.5 && click(ac, out, t + rnd() * 0.1, 0.05 + rnd() * 0.08, 3000 + rnd() * 4000, 0.01)));
      break;
    }
    case "hearth": {
      noiseThrough("lowpass", 300, 0.7, 0.35, 0.5);
      stops.push(sequencer(ac, 240, (t) => rnd() < 0.35 && click(ac, out, t + rnd() * 0.2, 0.1 + rnd() * 0.3, 1200 + rnd() * 2400, 0.008 + rnd() * 0.02)));
      break;
    }
    case "cafe": {
      const { f } = noiseThrough("bandpass", 650, 1.6, 0.25, 0.9);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.9;
      const lg = ac.createGain();
      lg.gain.value = 180;
      lfo.connect(lg).connect(f.frequency);
      lfo.start();
      stops.push(() => lfo.stop());
      stops.push(sequencer(ac, 30, (t) => rnd() < 0.4 && pluck(ac, out, t + rnd(), 96 + Math.floor(rnd() * 5), 0.03, 0.25, "sine")));
      break;
    }
    case "street": {
      const { g } = noiseThrough("lowpass", 420, 0.5, 0.3, 0.6);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.05;
      const lg = ac.createGain();
      lg.gain.value = 0.18;
      lfo.connect(lg).connect(g.gain);
      lfo.start();
      stops.push(() => lfo.stop());
      break;
    }
    case "keys": {
      stops.push(sequencer(ac, 420, (t) => rnd() < 0.55 && click(ac, out, t, 0.2 + rnd() * 0.1, 2400 + rnd() * 1500, 0.025)));
      break;
    }
    case "pen": {
      stops.push(
        sequencer(ac, 120, (t) => {
          if (rnd() < 0.6) {
            const s = ac.createBufferSource();
            s.buffer = whiteNoise();
            const f = ac.createBiquadFilter();
            f.type = "bandpass";
            f.frequency.value = 3500 + rnd() * 2500;
            f.Q.value = 3;
            const g = ac.createGain();
            const len = 0.1 + rnd() * 0.25;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + len);
            s.connect(f).connect(g).connect(out);
            s.start(t, rnd());
            s.stop(t + len + 0.05);
          }
        }),
      );
      break;
    }
    case "static": {
      noiseThrough("bandpass", 2500, 0.4, 0.12);
      break;
    }
    case "clock": {
      stops.push(sequencer(ac, 60, (t, n) => click(ac, out, t, 0.18, n % 2 ? 2600 : 3400, 0.015)));
      break;
    }
    case "wind": {
      const { f } = noiseThrough("bandpass", 500, 3, 0.35, 0.5);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.11;
      const lg = ac.createGain();
      lg.gain.value = 300;
      lfo.connect(lg).connect(f.frequency);
      lfo.start();
      stops.push(() => lfo.stop());
      break;
    }
    case "jazz": {
      const v = houseVoice(ac, "nightdesk", reverb);
      v.out.connect(out);
      stops.push(v.stop);
      break;
    }
  }
  return { out, stop: () => stops.forEach((s) => s()) };
}

type Live = { el: HTMLAudioElement; routed: boolean; gain?: GainNode };

export class WirelessEngine {
  ac = audioContext();
  private master = this.ac.createGain();
  private tone = this.ac.createBiquadFilter();
  private warmth = this.ac.createWaveShaper();
  readonly analyser = this.ac.createAnalyser();
  private reverb = this.ac.createConvolver();
  private radio = this.ac.createGain();
  private staticGain = this.ac.createGain();
  private whistle = this.ac.createOscillator();
  private whistleGain = this.ac.createGain();
  private house = new Map<string, { voice: Voice; gain: GainNode }>();
  private live = new Map<string, Live>();
  private layers = new Map<LayerId, { voice: Voice; gain: GainNode }>();
  private activityTimer?: number;
  private staticSrc?: AudioBufferSourceNode;
  private on = false;

  kc = 60;
  volume = 6; // 0..10
  noise = 0.2; // 0..1
  activity = 0.2; // 0..1

  constructor() {
    const ac = this.ac;
    this.tone.type = "lowpass";
    this.tone.frequency.value = 6000;
    this.tone.Q.value = 0.4;
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6); // gentle valve saturation
    }
    this.warmth.curve = curve;
    this.reverb.buffer = impulse(ac);
    this.master.gain.value = 0;
    this.analyser.fftSize = 512;

    this.radio.connect(this.warmth).connect(this.tone);
    this.reverb.connect(this.tone);
    this.staticGain.connect(this.tone);
    this.whistleGain.gain.value = 0;
    this.whistle.type = "sine";
    this.whistle.connect(this.whistleGain).connect(this.tone);
    this.whistle.start();
    this.tone.connect(this.master).connect(this.analyser);
    this.master.connect(bus());
  }

  get powered() {
    return this.on;
  }

  powerOn() {
    if (this.on) return;
    this.on = true;
    const ac = this.ac;
    const hiss = noiseSource(ac);
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 2200;
    f.Q.value = 0.5;
    hiss.connect(f).connect(this.staticGain);
    this.staticSrc = hiss;
    // Valves warm over a couple of seconds.
    this.master.gain.cancelScheduledValues(ac.currentTime);
    this.master.gain.setValueAtTime(0, ac.currentTime);
    this.master.gain.linearRampToValueAtTime(this.volume / 10, ac.currentTime + 2.4);
    this.retune();
    this.scheduleActivity();
  }

  powerOff() {
    if (!this.on) return;
    this.on = false;
    const ac = this.ac;
    this.master.gain.cancelScheduledValues(ac.currentTime);
    this.master.gain.setTargetAtTime(0, ac.currentTime, 0.25);
    window.setTimeout(() => {
      if (this.on) return;
      this.house.forEach((h) => h.voice.stop());
      this.house.clear();
      this.live.forEach((l) => l.el.pause());
      try {
        this.staticSrc?.stop();
      } catch {}
    }, 1200);
    if (this.activityTimer) window.clearTimeout(this.activityTimer);
  }

  /** How strongly each carrier comes in at the current dial position. */
  strength(c: Carrier) {
    const d = Math.abs(this.kc - c.kc);
    return Math.max(0, 1 - d / 3.2);
  }

  nearest() {
    let best = CARRIERS[0];
    for (const c of CARRIERS) if (Math.abs(c.kc - this.kc) < Math.abs(best.kc - this.kc)) best = c;
    return { carrier: best, signal: this.strength(best) };
  }

  setTuning(kc: number) {
    this.kc = kc;
    this.retune();
  }

  private retune() {
    if (!this.on) return;
    const ac = this.ac;
    let total = 0;
    for (const c of CARRIERS) {
      const s = this.strength(c);
      total = Math.max(total, s);
      const g = s * s;
      if (c.house) {
        let h = this.house.get(c.id);
        if (s > 0 && !h) {
          const gain = ac.createGain();
          gain.gain.value = 0;
          const voice = houseVoice(ac, c.house, this.reverb);
          voice.out.connect(gain).connect(this.radio);
          h = { voice, gain };
          this.house.set(c.id, h);
        }
        if (h) {
          h.gain.gain.setTargetAtTime(g, ac.currentTime, 0.08);
          if (s === 0) {
            const old = h;
            this.house.delete(c.id);
            window.setTimeout(() => old.voice.stop(), 400);
          }
        }
      } else if (c.stream) {
        let l = this.live.get(c.id);
        if (s > 0 && !l) l = this.openLive(c);
        if (l) {
          if (s > 0) {
            if (l.gain) l.gain.gain.setTargetAtTime(g, ac.currentTime, 0.08);
            else l.el.volume = Math.min(1, g * (this.volume / 10));
            if (l.el.paused) l.el.play().catch(() => {});
          } else {
            l.el.pause();
          }
        }
      }
    }
    const d = Math.min(...CARRIERS.map((c) => Math.abs(c.kc - this.kc)));
    this.staticGain.gain.setTargetAtTime((1 - total) * 0.35 + this.noise * 0.15, ac.currentTime, 0.05);
    const whistleOn = d > 0.15 && d < 2.6;
    this.whistle.frequency.setTargetAtTime(Math.max(60, d * 520), ac.currentTime, 0.03);
    this.whistleGain.gain.setTargetAtTime(whistleOn ? 0.018 * (1 - d / 2.6) : 0, ac.currentTime, 0.05);
  }

  private openLive(c: Carrier): Live {
    const el = new Audio();
    el.preload = "none";
    el.crossOrigin = "anonymous";
    el.src = c.stream!;
    const entry: Live = { el, routed: false };
    try {
      const src = this.ac.createMediaElementSource(el);
      const gain = this.ac.createGain();
      gain.gain.value = 0;
      src.connect(gain).connect(this.radio);
      entry.routed = true;
      entry.gain = gain;
    } catch {}
    // If the stream refuses CORS, fall back to playing it directly.
    el.addEventListener(
      "error",
      () => {
        if (!entry.routed) return;
        const plain = new Audio(c.stream!);
        plain.volume = 0;
        this.live.set(c.id, { el: plain, routed: false });
        this.retune();
      },
      { once: true },
    );
    this.live.set(c.id, entry);
    return entry;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.on) this.master.gain.setTargetAtTime(v / 10, this.ac.currentTime, 0.05);
    this.live.forEach((l) => {
      if (!l.routed) this.retune();
    });
  }

  /** 0 = mellow, 1 = bright */
  setTone(t: number) {
    this.tone.frequency.setTargetAtTime(900 * Math.pow(14, t), this.ac.currentTime, 0.05);
  }

  get toneHz() {
    return Math.round(this.tone.frequency.value);
  }

  setNoise(n: number) {
    this.noise = n;
    this.retune();
  }

  setActivity(a: number) {
    this.activity = a;
  }

  setLayer(id: LayerId, level: number) {
    const ac = this.ac;
    let l = this.layers.get(id);
    if (level > 0 && !l) {
      const gain = ac.createGain();
      gain.gain.value = 0;
      const voice = layerVoice(ac, id, this.reverb);
      voice.out.connect(gain).connect(this.tone);
      l = { voice, gain };
      this.layers.set(id, l);
    }
    if (!l) return;
    l.gain.gain.setTargetAtTime(level * level, ac.currentTime, 0.2);
    if (level === 0) {
      const old = l;
      this.layers.delete(id);
      window.setTimeout(() => old.voice.stop(), 900);
    }
  }

  /** The building interrupts now and then: footsteps, a door, the telephone. */
  private scheduleActivity() {
    if (!this.on) return;
    const wait = 4000 + (1 - this.activity) * 26000 + Math.random() * 8000;
    this.activityTimer = window.setTimeout(() => {
      if (this.activity > 0 && this.on) this.interrupt();
      this.scheduleActivity();
    }, wait);
  }

  private interrupt() {
    const ac = this.ac;
    const t = ac.currentTime + 0.05;
    const r = Math.random();
    const dest = this.tone;
    if (r < 0.45) {
      for (let i = 0; i < 6; i++) click(ac, dest, t + i * 0.55, 0.25, 180 + Math.random() * 60, 0.09);
    } else if (r < 0.75) {
      const s = noiseSource(ac, 0.4);
      const f = ac.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 8;
      f.frequency.setValueAtTime(300, t);
      f.frequency.linearRampToValueAtTime(900, t + 1.1);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.3);
      g.gain.linearRampToValueAtTime(0.0001, t + 1.2);
      s.connect(f).connect(g).connect(dest);
      s.stop(t + 1.3);
      click(ac, dest, t + 1.25, 0.4, 140, 0.12);
    } else {
      for (let k = 0; k < 2; k++)
        for (let i = 0; i < 12; i++) {
          const at = t + k * 2 + i * 0.05;
          pluck(ac, dest, at, 86, 0.04, 0.05, "square");
          pluck(ac, dest, at + 0.025, 89, 0.04, 0.05, "square");
        }
    }
  }

  /** Output level 0..1 for the VU meter. */
  level() {
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const routedLevel = Math.sqrt(sum / data.length) * 3;
    // Unrouted live streams can't be measured; estimate from the dial.
    const unrouted = [...this.live.entries()].some(([id, l]) => !l.routed && !l.el.paused && this.strength(CARRIERS.find((c) => c.id === id)!) > 0.5);
    return Math.min(1, unrouted ? Math.max(routedLevel, 0.35 + Math.random() * 0.25) * (this.volume / 10) : routedLevel);
  }

  dispose() {
    this.powerOff();
    this.layers.forEach((l) => l.voice.stop());
    this.layers.clear();
    this.live.forEach((l) => {
      l.el.pause();
      l.el.removeAttribute("src");
    });
    window.setTimeout(() => {
      try {
        this.whistle.stop();
      } catch {}
      this.master.disconnect();
    }, 1300);
  }
}
