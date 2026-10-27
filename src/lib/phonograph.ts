"use client";

import { audioContext, bus, whiteNoise } from "./audio";
import { seeded } from "./utils";

// A twenty-second "recording", composed from a seed and played through a
// gramophone horn: band-limited, a little wow, and a bed of surface crackle.

export type Mood = "rag" | "blues" | "stomp" | "lament";

const SCALES: Record<Mood, number[]> = {
  rag: [0, 2, 4, 5, 7, 9, 11, 12],
  stomp: [0, 2, 4, 7, 9, 12, 14],
  blues: [0, 3, 5, 6, 7, 10, 12],
  lament: [0, 2, 3, 5, 7, 8, 10, 12],
};

const PROGRESSIONS: Record<Mood, number[][]> = {
  rag: [[0, 4, 7], [9, 12, 16], [2, 5, 9], [7, 11, 14]],
  stomp: [[0, 4, 7, 10], [5, 9, 12], [7, 11, 14, 17], [0, 4, 7]],
  blues: [[0, 4, 7, 10], [5, 9, 12, 15], [0, 4, 7, 10], [7, 11, 14, 17]],
  lament: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 11, 14]],
};

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export type Pressing = {
  duration: number;
  stop: () => void;
  elapsed: () => number;
};

export function playPressing(opts: { seed: string; key: number; tempo: number; mood: Mood; duration?: number; onEnd?: () => void }): Pressing {
  const ac = audioContext();
  const duration = opts.duration ?? 20;
  const rnd = seeded(opts.seed);
  const t0 = ac.currentTime + 0.08;
  const beat = 60 / opts.tempo;

  // The horn: everything passes through a narrow band and a touch of wow.
  const horn = ac.createBiquadFilter();
  horn.type = "bandpass";
  horn.frequency.value = 1300;
  horn.Q.value = 0.55;
  const warmth = ac.createBiquadFilter();
  warmth.type = "lowshelf";
  warmth.frequency.value = 400;
  warmth.gain.value = 4;
  const master = ac.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.8, t0 + 0.4);
  master.gain.setValueAtTime(0.8, t0 + duration - 1.2);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  horn.connect(warmth).connect(master).connect(bus());

  const wow = ac.createOscillator();
  wow.frequency.value = 0.55;
  const wowDepth = ac.createGain();
  wowDepth.gain.value = 6; // cents
  wow.connect(wowDepth);
  wow.start(t0);
  wow.stop(t0 + duration);

  const voices: AudioScheduledSourceNode[] = [wow];

  const note = (midi: number, at: number, len: number, vol: number, kind: "piano" | "horn" | "bass" | "clarinet") => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = hz(midi);
    wowDepth.connect(o.detune);
    if (kind === "piano") {
      o.type = "triangle";
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol, at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + Math.min(len * 2.2, 1.6));
    } else if (kind === "bass") {
      o.type = "sine";
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len * 0.9);
    } else {
      o.type = kind === "horn" ? "sawtooth" : "square";
      const vib = ac.createOscillator();
      vib.frequency.value = 5.2;
      const vd = ac.createGain();
      vd.gain.value = 14;
      vib.connect(vd).connect(o.detune);
      vib.start(at);
      vib.stop(at + len + 0.1);
      voices.push(vib);
      const tone = ac.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.value = kind === "horn" ? 1800 : 1400;
      o.connect(tone).connect(g);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol, at + 0.05);
      g.gain.setValueAtTime(vol, at + len * 0.75);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len);
      g.connect(horn);
      o.start(at);
      o.stop(at + len + 0.05);
      voices.push(o);
      return;
    }
    o.connect(g).connect(horn);
    o.start(at);
    o.stop(at + len * 2.4 + 0.05);
    voices.push(o);
  };

  const scale = SCALES[opts.mood];
  const prog = PROGRESSIONS[opts.mood];
  const swing = opts.mood === "rag" ? 0 : 0.12;
  const lead: "horn" | "clarinet" | "piano" = opts.mood === "lament" ? "piano" : rnd() > 0.5 ? "clarinet" : "horn";
  let t = t0;
  let bar = 0;
  let degree = 4;
  while (t < t0 + duration - 1) {
    const chord = prog[bar % prog.length];
    // Left hand: bass on 1 and 3, chord on 2 and 4 (a stride, roughly).
    for (let b = 0; b < 4; b++) {
      const at = t + b * beat;
      if (at > t0 + duration - 1) break;
      if (b % 2 === 0) note(opts.key - 24 + chord[0] + (b === 2 ? 7 : 0), at, beat, 0.3, "bass");
      else chord.forEach((c) => note(opts.key - 12 + c, at, beat * 0.5, 0.07, "piano"));
    }
    // Right hand / front line: a wandering melody that leans on chord tones.
    let s = 0;
    while (s < 4) {
      const len = [0.5, 0.5, 1, 1, 1.5, 2][Math.floor(rnd() * 6)];
      const at = t + s * beat + (Math.floor(s * 2) % 2 === 1 ? swing * beat : 0);
      degree = Math.max(0, Math.min(scale.length - 1, degree + Math.round((rnd() - 0.5) * 3)));
      if (rnd() > 0.15 && at < t0 + duration - 1.2) note(opts.key + 12 + scale[degree], at, Math.min(len, 4 - s) * beat, lead === "piano" ? 0.16 : 0.09, lead);
      s += len;
    }
    t += 4 * beat;
    bar++;
  }

  // Surface noise: a hiss bed plus random pops and crackles.
  const hiss = ac.createBufferSource();
  hiss.buffer = whiteNoise();
  hiss.loop = true;
  const hf = ac.createBiquadFilter();
  hf.type = "bandpass";
  hf.frequency.value = 3200;
  hf.Q.value = 0.6;
  const hg = ac.createGain();
  hg.gain.value = 0.025;
  hiss.connect(hf).connect(hg).connect(master);
  hiss.start(t0);
  hiss.stop(t0 + duration);
  voices.push(hiss);
  for (let i = 0; i < duration * 9; i++) {
    const at = t0 + rnd() * duration;
    const pop = ac.createBufferSource();
    pop.buffer = whiteNoise();
    const pg = ac.createGain();
    const v = rnd() < 0.08 ? 0.35 : 0.08;
    pg.gain.setValueAtTime(v, at);
    pg.gain.exponentialRampToValueAtTime(0.0001, at + 0.004 + rnd() * 0.01);
    pop.connect(pg).connect(master);
    pop.start(at, rnd() * 1.5);
    pop.stop(at + 0.02);
    voices.push(pop);
  }

  let stopped = false;
  const end = window.setTimeout(() => {
    if (!stopped) opts.onEnd?.();
  }, (duration + 0.1) * 1000);

  return {
    duration,
    elapsed: () => Math.max(0, Math.min(duration, ac.currentTime - t0)),
    stop: () => {
      if (stopped) return;
      stopped = true;
      window.clearTimeout(end);
      const now = ac.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      window.setTimeout(() => {
        voices.forEach((v) => {
          try {
            v.stop();
          } catch {}
        });
        master.disconnect();
      }, 300);
    },
  };
}
