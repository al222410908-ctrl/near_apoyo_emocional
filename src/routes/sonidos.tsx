import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, Pause, Play, Timer, Volume1, Volume2 } from "lucide-react";
import { AppScreen, ScreenHeader } from "@/components/near/AppScreen";
import { Slider } from "@/components/ui/slider";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useNear } from "@/context/NearContext";
import { SOUNDS } from "@/services/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sonidos")({
  head: () => ({
    meta: [
      { title: "Sonidos de Calma · Near Apoyo Emocional" },
      { name: "description", content: "Lluvia suave, olas de mar, fogata y bosque sereno para estudiar, descansar o dormir." },
      { property: "og:title", content: "Sonidos de Calma · Near Apoyo Emocional" },
      { property: "og:description", content: "Lluvia suave, olas de mar, fogata y bosque sereno para estudiar, descansar o dormir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen nav={false}>
      <Sounds />
    </AppScreen>
  ),
});

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Sounds() {
  const { playing, volume, setVolume, toggle } = useAmbientSound();
  const { checkInToday } = useNear();
  const [elapsed, setElapsed] = useState(0);
  const current = SOUNDS.find((s) => s.id === playing);

  useEffect(() => {
    setElapsed(0);
    if (!playing) return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [playing]);

  useEffect(() => {
    if (elapsed === 120) checkInToday(); // 2 minutes of calm counts for the streak
  }, [elapsed, checkInToday]);

  return (
    <div className="flex min-h-screen flex-col bg-sanctuary pb-8">
      <ScreenHeader
        title="Sonidos de Calma"
        subtitle="Elige un paisaje y deja que te envuelva."
        back={
          <Link to="/calma" className="mt-0.5 grid size-10 place-items-center rounded-full bg-background/70 text-heading" aria-label="Volver">
            <ChevronLeft className="size-5" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 px-5">
        {SOUNDS.map((s) => {
          const on = playing === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(s.id)}
              className={cn(
                "relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl border p-4 text-left transition-colors",
                on ? "border-transparent bg-slate-grad text-secondary-foreground shadow-lift" : "border-border bg-surface",
              )}
              aria-pressed={on}
            >
              <span className="text-4xl">{s.emoji}</span>
              <span>
                <span className={cn("block font-display text-lg font-semibold", on ? "text-secondary-foreground" : "text-heading")}>{s.label}</span>
                <span className={cn("block text-xs", on ? "opacity-85" : "text-muted-foreground")}>{s.description}</span>
              </span>
              <span className={cn("absolute top-4 right-4 grid size-9 place-items-center rounded-full", on ? "bg-secondary-foreground/20" : "bg-background")}>
                {on ? <Pause className="size-4" /> : <Play className="size-4 text-secondary" />}
              </span>
              {on && (
                <span className="absolute right-4 bottom-4 flex h-4 items-end gap-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.span key={i} className="w-1 rounded-full bg-secondary-foreground" animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto px-5 pt-8">
        <div className="rounded-3xl border border-border bg-background p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current?.emoji ?? "🎧"}</span>
            <div className="flex-1">
              <p className="font-semibold text-heading">{current?.label ?? "Nada sonando"}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="size-3" /> {playing ? `${fmt(elapsed)} de calma` : "Toca un paisaje para comenzar"}
              </p>
            </div>
            <button
              type="button"
              disabled={!playing}
              onClick={() => playing && toggle(playing)}
              className="grid size-12 place-items-center rounded-full bg-clay text-primary-foreground disabled:opacity-40"
              aria-label="Pausar"
            >
              {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </button>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Volume1 className="size-4 text-muted-foreground" />
            <Slider value={[volume * 100]} max={100} step={1} onValueChange={([v]) => setVolume((v ?? 0) / 100)} aria-label="Volumen" className="flex-1" />
            <Volume2 className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
