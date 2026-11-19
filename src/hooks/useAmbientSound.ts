import { useCallback, useEffect, useRef, useState } from "react";
import type { SoundId } from "@/types";

/**
 * Ambient soundscapes synthesized with the Web Audio API — no audio files,
 * works offline. Each scene returns a cleanup function.
 */
type Scene = (ctx: AudioContext, out: AudioNode) => () => void;

function noiseBuffer(ctx: AudioContext, kind: "white" | "pink" | "brown", seconds = 6) {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (kind === "white") data[i] = white * 0.5;
      else if (kind === "pink") {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    }
  }
  return buf;
}

function loopNoise(ctx: AudioContext, kind: "white" | "pink" | "brown") {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, kind);
  src.loop = true;
  src.start();
  return src;
}

const scenes: Record<SoundId, Scene> = {
  lluvia: (ctx, out) => {
    const src = loopNoise(ctx, "pink");
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 500;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.value = 0.9;
    src.connect(hp).connect(lp).connect(g).connect(out);
    return () => src.stop();
  },
  olas: (ctx, out) => {
    const src = loopNoise(ctx, "brown");
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.value = 0.45;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const depth = ctx.createGain();
    depth.gain.value = 0.4;
    lfo.connect(depth).connect(g.gain);
    lfo.start();
    src.connect(lp).connect(g).connect(out);
    return () => {
      src.stop();
      lfo.stop();
    };
  },
  fogata: (ctx, out) => {
    const src = loopNoise(ctx, "brown");
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.value = 0.6;
    src.connect(lp).connect(g).connect(out);
    const crackleBuf = noiseBuffer(ctx, "white", 1);
    const timer = window.setInterval(() => {
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const c = ctx.createBufferSource();
        c.buffer = crackleBuf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1500 + Math.random() * 2500;
        const cg = ctx.createGain();
        const t = ctx.currentTime + Math.random() * 0.25;
        cg.gain.setValueAtTime(0, t);
        cg.gain.linearRampToValueAtTime(0.25 + Math.random() * 0.4, t + 0.004);
        cg.gain.exponentialRampToValueAtTime(0.001, t + 0.04 + Math.random() * 0.05);
        c.connect(bp).connect(cg).connect(out);
        c.start(t, Math.random() * 0.8, 0.12);
      }
    }, 280);
    return () => {
      window.clearInterval(timer);
      src.stop();
    };
  },
  bosque: (ctx, out) => {
    const src = loopNoise(ctx, "pink");
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1100;
    const g = ctx.createGain();
    g.gain.value = 0.35;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const depth = ctx.createGain();
    depth.gain.value = 0.15;
    lfo.connect(depth).connect(g.gain);
    lfo.start();
    src.connect(lp).connect(g).connect(out);
    const timer = window.setInterval(() => {
      if (Math.random() < 0.45) return;
      const notes = 2 + Math.floor(Math.random() * 4);
      const base = 2400 + Math.random() * 1600;
      for (let i = 0; i < notes; i++) {
        const o = ctx.createOscillator();
        o.type = "sine";
        const og = ctx.createGain();
        const t = ctx.currentTime + i * 0.13;
        o.frequency.setValueAtTime(base, t);
        o.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.4), t + 0.08);
        og.gain.setValueAtTime(0, t);
        og.gain.linearRampToValueAtTime(0.05, t + 0.02);
        og.gain.exponentialRampToValueAtTime(0.0008, t + 0.11);
        o.connect(og).connect(out);
        o.start(t);
        o.stop(t + 0.13);
      }
    }, 1800);
    return () => {
      window.clearInterval(timer);
      src.stop();
      lfo.stop();
    };
  },
};

export function useAmbientSound() {
  const [playing, setPlaying] = useState<SoundId | null>(null);
  const [volume, setVolumeState] = useState(0.6);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setPlaying(null);
  }, []);

  const play = useCallback(
    (id: SoundId) => {
      cleanupRef.current?.();
      if (!ctxRef.current) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new Ctor();
        masterRef.current = ctxRef.current.createGain();
        masterRef.current.connect(ctxRef.current.destination);
      }
      const ctx = ctxRef.current;
      void ctx.resume();
      const master = masterRef.current!;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
      cleanupRef.current = scenes[id](ctx, master);
      setPlaying(id);
    },
    [volume],
  );

  const toggle = useCallback((id: SoundId) => (playing === id ? stop() : play(id)), [playing, play, stop]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    const ctx = ctxRef.current;
    if (ctx && masterRef.current) masterRef.current.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
  }, []);

  useEffect(
    () => () => {
      cleanupRef.current?.();
      void ctxRef.current?.close();
    },
    [],
  );

  return { playing, volume, setVolume, toggle, stop };
}
