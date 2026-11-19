import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Pause, Play, RotateCcw, Vibrate, VibrateOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppScreen, ScreenHeader } from "@/components/near/AppScreen";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/respiracion")({
  head: () => ({
    meta: [
      { title: "Respiración 4-7-8 · Near Apoyo Emocional" },
      { name: "description", content: "Pausa consciente guiada: inhala 4 segundos, retén 7 y exhala 8 para soltar la tensión." },
      { property: "og:title", content: "Respiración 4-7-8 · Near Apoyo Emocional" },
      { property: "og:description", content: "Pausa consciente guiada: inhala 4, retén 7 y exhala 8 para soltar la tensión." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen nav={false}>
      <Breathing />
    </AppScreen>
  ),
});

const PHASES = [
  { key: "inhala", label: "Inhala", hint: "por la nariz", secs: 4, scale: 1 },
  { key: "reten", label: "Retén", hint: "con suavidad", secs: 7, scale: 1 },
  { key: "exhala", label: "Exhala", hint: "por la boca, despacio", secs: 8, scale: 0.55 },
] as const;
const TARGET_CYCLES = 8; // 8 × 19 s ≈ 2.5–3 min

function triggerHaptic(pattern: number | number[]) {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignorar si el dispositivo bloquea la vibración
    }
  }
}

function playCalmChime(freq = 432) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch {
    // Audio Context no disponible
  }
}

function Breathing() {
  const { checkInToday, showPill } = useNear();
  const [running, setRunning] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [sound, setSound] = useState(true);
  const [tick, setTick] = useState({ phaseIdx: 0, remaining: PHASES[0].secs as number, cycles: 0 });
  const { phaseIdx, remaining, cycles } = tick;
  const celebrated = useRef(false);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setTick((s) => {
        if (s.remaining > 1) return { ...s, remaining: s.remaining - 1 };
        const next = (s.phaseIdx + 1) % PHASES.length;
        return { phaseIdx: next, remaining: PHASES[next]!.secs, cycles: next === 0 ? s.cycles + 1 : s.cycles };
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (haptics) {
      if (phaseIdx === 0) triggerHaptic(80); // Inhala
      else if (phaseIdx === 1) triggerHaptic([50, 60, 50]); // Retén
      else if (phaseIdx === 2) triggerHaptic(140); // Exhala
    }
    if (sound) {
      if (phaseIdx === 0) playCalmChime(392); // G4
      else if (phaseIdx === 1) playCalmChime(432); // A4
      else if (phaseIdx === 2) playCalmChime(329.6); // E4
    }
  }, [phaseIdx, running, haptics, sound]);

  useEffect(() => {
    if (cycles >= TARGET_CYCLES && !celebrated.current) {
      celebrated.current = true;
      setRunning(false);
      checkInToday();
      showPill({
        title: "Pausa Consciente Completada",
        subtitle: "+1 a tu Racha de Calma semanal (+20 XP)",
        emoji: "🌿",
        tone: "success",
      });
      if (haptics) triggerHaptic([100, 50, 100, 50, 200]);
      if (sound) playCalmChime(528);
      toast.success("Pausa completada 🌿", { description: "Sumaste un día a tu Racha de Calma." });
    }
  }, [cycles, checkInToday, haptics, sound, showPill]);

  const phase = PHASES[phaseIdx] ?? PHASES[0];
  const reset = () => {
    setRunning(false);
    setTick({ phaseIdx: 0, remaining: PHASES[0].secs, cycles: 0 });
    celebrated.current = false;
  };

  return (
    <div className="flex min-h-screen flex-col bg-sanctuary pb-10">
      <ScreenHeader
        title="Pausa Consciente"
        subtitle="Respiración 4-7-8"
        back={
          <Link to="/calma" className="mt-0.5 grid size-10 place-items-center rounded-full bg-background/70 text-heading" aria-label="Volver">
            <ChevronLeft className="size-5" />
          </Link>
        }
        right={
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setHaptics((h) => !h);
                toast(haptics ? "Vibración háptica desactivada" : "Vibración háptica activada", { duration: 1500 });
              }}
              className={`grid size-9 place-items-center rounded-full border transition-all ${haptics ? "border-primary/30 bg-primary-tint text-primary" : "border-border bg-surface-2 text-muted-foreground opacity-60"}`}
              aria-label="Alternar vibración háptica"
              title={haptics ? "Vibración activada" : "Vibración silenciada"}
            >
              {haptics ? <Vibrate className="size-4" /> : <VibrateOff className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setSound((s) => !s);
                toast(sound ? "Sonido de campana desactivado" : "Sonido de campana activado", { duration: 1500 });
              }}
              className={`grid size-9 place-items-center rounded-full border transition-all ${sound ? "border-secondary/30 bg-secondary-tint text-secondary" : "border-border bg-surface-2 text-muted-foreground opacity-60"}`}
              aria-label="Alternar sonido de campana"
              title={sound ? "Campana activada" : "Campana silenciada"}
            >
              {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="relative grid size-80 place-items-center">
          <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary-soft/40" />
          <motion.div
            className="absolute inset-4 rounded-full bg-sphere opacity-30 blur-2xl"
            animate={{ scale: running ? phase.scale : 0.55 }}
            transition={{ duration: running ? phase.secs : 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="grid size-64 place-items-center rounded-full bg-clay text-primary-foreground shadow-lift"
            initial={{ scale: 0.55 }}
            animate={{ scale: running ? phase.scale : 0.55 }}
            transition={{ duration: running ? phase.secs : 0.8, ease: "easeInOut" }}
          />
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-3xl font-semibold text-primary-foreground drop-shadow-sm">{running ? phase.label : "Listo"}</p>
              <p className="font-display text-6xl font-semibold text-primary-foreground tabular-nums drop-shadow-sm">{running ? remaining : "4·7·8"}</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm">{running ? `${phase.label} ${phase.hint} (${phase.secs}s)` : "Siéntate cómodo/a, relaja los hombros y suelta la mandíbula."}</p>

        <div className="mt-6 flex gap-2">
          {PHASES.map((p, i) => (
            <span key={p.key} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${running && i === phaseIdx ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"}`}>
              {p.label} {p.secs}s
            </span>
          ))}
        </div>
        <div className="mt-6 w-full max-w-xs">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Ciclos</span>
            <span className="tabular-nums">
              {Math.min(cycles, TARGET_CYCLES)} / {TARGET_CYCLES}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${(Math.min(cycles, TARGET_CYCLES) / TARGET_CYCLES) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 px-6">
        <Button variant="surface" size="xl" className="w-14 px-0" onClick={reset} aria-label="Reiniciar">
          <RotateCcw className="size-5" />
        </Button>
        <Button variant="clay" size="xl" className="flex-1" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause className="size-5" /> : <Play className="size-5" />}
          {running ? "Pausar" : cycles > 0 ? "Continuar" : "Comenzar"}
        </Button>
      </div>
    </div>
  );
}
