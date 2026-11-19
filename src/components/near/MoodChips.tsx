import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MOODS } from "@/services/mockData";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";
import type { MoodId } from "@/types";

const moodBg: Record<MoodId, string> = {
  calmado: "bg-mood-calmado",
  cansado: "bg-mood-cansado",
  ansioso: "bg-mood-ansioso",
  abrumado: "bg-mood-abrumado",
  esperanzado: "bg-mood-esperanzado",
};
export { moodBg };

const MOOD_3D_STYLES: Record<
  MoodId,
  {
    idle: string;
    active: string;
    badge: string;
    subtitle: string;
  }
> = {
  calmado: {
    idle: "border-emerald-300 border-b-emerald-500 bg-emerald-50/90 text-emerald-950 hover:bg-emerald-100/80 dark:border-emerald-800 dark:border-b-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100",
    active: "border-emerald-600 border-b-emerald-800 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-400/30",
    badge: "bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200",
    subtitle: "En paz",
  },
  esperanzado: {
    idle: "border-amber-300 border-b-amber-500 bg-amber-50/90 text-amber-950 hover:bg-amber-100/80 dark:border-amber-800 dark:border-b-amber-950 dark:bg-amber-950/50 dark:text-amber-100",
    active: "border-amber-600 border-b-amber-800 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/30",
    badge: "bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200",
    subtitle: "Con ánimo",
  },
  cansado: {
    idle: "border-indigo-300 border-b-indigo-500 bg-indigo-50/90 text-indigo-950 hover:bg-indigo-100/80 dark:border-indigo-800 dark:border-b-indigo-950 dark:bg-indigo-950/50 dark:text-indigo-100",
    active: "border-indigo-600 border-b-indigo-800 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-400/30",
    badge: "bg-indigo-200/80 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200",
    subtitle: "Batería baja",
  },
  ansioso: {
    idle: "border-orange-300 border-b-orange-500 bg-orange-50/90 text-orange-950 hover:bg-orange-100/80 dark:border-orange-800 dark:border-b-orange-950 dark:bg-orange-950/50 dark:text-orange-100",
    active: "border-orange-600 border-b-orange-800 bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-400/30",
    badge: "bg-orange-200/80 text-orange-900 dark:bg-orange-900 dark:text-orange-200",
    subtitle: "Con nervios",
  },
  abrumado: {
    idle: "border-sky-300 border-b-sky-500 bg-sky-50/90 text-sky-950 hover:bg-sky-100/80 dark:border-sky-800 dark:border-b-sky-950 dark:bg-sky-950/50 dark:text-sky-100",
    active: "border-sky-600 border-b-sky-800 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 ring-4 ring-sky-400/30",
    badge: "bg-sky-200/80 text-sky-900 dark:bg-sky-900 dark:text-sky-200",
    subtitle: "Saturado",
  },
};

export function MoodChips() {
  const { todayMood, logMood, showPill } = useNear();

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-5 gap-2">
        {MOODS.map((m) => {
          const active = todayMood?.mood === m.id;
          const style = MOOD_3D_STYLES[m.id];
          const shortLabel = m.id === "cansado" ? "Cansado" : m.label;

          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                logMood(m.id);
                showPill({
                  title: `Ánimo: ${m.label} (+15 XP)`,
                  subtitle: "Guardado en tu bitácora de calma",
                  emoji: m.emoji,
                  tone: "gold",
                });
                toast.success(`Registrado: ${m.label} ${m.emoji}`, {
                  description: "Ganaste +15 Semillas de Calma por escucharte hoy.",
                });
              }}
              className={cn(
                "relative flex flex-col items-center justify-between gap-1.5 rounded-2xl border-2 border-b-[5px] px-1.5 py-3 text-center transition-all active:translate-y-0.5 active:border-b-2",
                active ? style.active : style.idle,
              )}
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-1.5 grid size-5 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white shadow"
                >
                  <Check className="size-3 stroke-[3]" />
                </motion.span>
              )}

              <motion.span
                animate={active ? { rotate: [0, -12, 12, -6, 6, 0], scale: [1, 1.25, 1] } : undefined}
                transition={{ duration: 0.55 }}
                className="text-2xl leading-none drop-shadow-xs"
              >
                {m.emoji}
              </motion.span>

              <div className="leading-tight">
                <span className="block text-[11px] font-extrabold tracking-tight">{shortLabel}</span>
                <span className={cn("mt-0.5 block text-[9px] font-semibold opacity-80")}>
                  {style.subtitle}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {todayMood ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl border-2 border-emerald-300/80 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
        >
          <span>
            ✨ Hoy registraste sentirte <strong className="underline">{todayMood.mood}</strong>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
            <Sparkles className="size-2.5" /> +15 XP
          </span>
        </motion.div>
      ) : (
        <p className="px-1 text-xs font-semibold text-muted-foreground">
          👆 Toca cómo te sientes hoy para ganar <span className="font-extrabold text-amber-600 dark:text-amber-400">+15 XP</span>
        </p>
      )}
    </div>
  );
}
