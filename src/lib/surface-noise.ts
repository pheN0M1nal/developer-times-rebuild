"use client";

import { audioContext, bus, whiteNoise } from "./audio";

/**
 * Record surface noise, generated rather than looped: a band-limited hiss,
 * a low rumble, and pops and ticks scheduled at random. `grit` (0..1)
 * raises the pop rate and loudness as the needle works inward.
 */
export class SurfaceNoise {
  private ctx = audioContext();
  private out = this.ctx.createGain();
  private hiss?: AudioBufferSourceNode;
  private rumble?: AudioBufferSourceNode;
  private timer?: number;
  private grit = 0.2;
  private level = 0.5;

  constructor() {
    this.out.gain.value = 0;
    this.out.connect(bus());
  }

  start() {
    const ac = this.ctx;
    this.stopSources();
    const hiss = ac.createBufferSource();
    hiss.buffer = whiteNoise();
    hiss.loop = true;
    const hf = ac.createBiquadFilter();
    hf.type = "bandpass";
    hf.frequency.value = 4200;
    hf.Q.value = 0.7;
    const hg = ac.createGain();
    hg.gain.value = 0.05;
    hiss.connect(hf).connect(hg).connect(this.out);

    const rumble = ac.createBufferSource();
    rumble.buffer = whiteNoise();
    rumble.loop = true;
    rumble.playbackRate.value = 0.5;
    const rf = ac.createBiquadFilter();
    rf.type = "lowpass";
    rf.frequency.value = 90;
    const rg = ac.createGain();
    rg.gain.value = 0.35;
    rumble.connect(rf).connect(rg).connect(this.out);

    hiss.start();
    rumble.start(ac.currentTime, Math.random());
    this.hiss = hiss;
    this.rumble = rumble;

    this.out.gain.cancelScheduledValues(ac.currentTime);
    this.out.gain.setTargetAtTime(this.level, ac.currentTime, 0.15);

    this.timer = window.setInterval(() => this.schedulePops(), 100);
  }

  private schedulePops() {
    const ac = this.ctx;
    const rate = 1.5 + this.grit * 14; // pops per 100ms window, on average ×0.1
    const n = Math.floor(rate / 10 + Math.random() * (rate / 10));
    for (let i = 0; i < n + (Math.random() < (rate % 10) / 10 ? 1 : 0); i++) {
      const at = ac.currentTime + 0.02 + Math.random() * 0.1;
      const src = ac.createBufferSource();
      src.buffer = whiteNoise();
      const f = ac.createBiquadFilter();
      f.type = Math.random() < 0.3 ? "lowpass" : "highpass";
      f.frequency.value = f.type === "lowpass" ? 900 : 2500 + Math.random() * 3000;
      const g = ac.createGain();
      const loud = Math.random() < 0.06 + this.grit * 0.08;
      const v = (loud ? 0.5 : 0.12) * (0.6 + this.grit * 0.8);
      g.gain.setValueAtTime(v, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + (loud ? 0.012 : 0.004) + Math.random() * 0.006);
      src.connect(f).connect(g).connect(this.out);
      src.start(at, Math.random() * 1.8);
      src.stop(at + 0.03);
    }
  }

  setGrit(v: number) {
    this.grit = Math.max(0, Math.min(1, v));
  }

  setLevel(v: number) {
    this.level = v;
    this.out.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
  }

  private stopSources() {
    try {
      this.hiss?.stop();
      this.rumble?.stop();
    } catch {}
    this.hiss = this.rumble = undefined;
    if (this.timer) window.clearInterval(this.timer);
    this.timer = undefined;
  }

  stop() {
    this.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    window.setTimeout(() => this.stopSources(), 400);
  }

  dispose() {
    this.stopSources();
    this.out.disconnect();
  }
}
