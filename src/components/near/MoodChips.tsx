import { motion } from "framer-motion";
import { Activity, BatteryLow, Check, CloudRain, Sparkles, Sun, type LucideIcon } from "lucide-react";
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

const MOOD_STYLES: Record<
  MoodId,
  {
    icon: LucideIcon;
    iconBoxIdle: string;
    iconBoxActive: string;
    idle: string;
    active: string;
    subtitle: string;
  }
> = {
  calmado: {
    icon: Sun,
    iconBoxIdle: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    iconBoxActive: "bg-white/20 text-white",
    idle: "border-emerald-300/80 border-b-emerald-400 bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100/70 dark:border-emerald-800 dark:border-b-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    active: "border-emerald-600 border-b-emerald-800 bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30",
    subtitle: "En paz",
  },
  esperanzado: {
    icon: Sparkles,
    iconBoxIdle: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    iconBoxActive: "bg-white/20 text-white",
    idle: "border-amber-300/80 border-b-amber-400 bg-amber-50/70 text-amber-950 hover:bg-amber-100/70 dark:border-amber-800 dark:border-b-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
    active: "border-amber-600 border-b-amber-800 bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/30",
    subtitle: "Con ánimo",
  },
  cansado: {
    icon: BatteryLow,
    iconBoxIdle: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    iconBoxActive: "bg-white/20 text-white",
    idle: "border-indigo-300/80 border-b-indigo-400 bg-indigo-50/70 text-indigo-950 hover:bg-indigo-100/70 dark:border-indigo-800 dark:border-b-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100",
    active: "border-indigo-600 border-b-indigo-800 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/30",
    subtitle: "Agotado",
  },
  ansioso: {
    icon: Activity,
    iconBoxIdle: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    iconBoxActive: "bg-white/20 text-white",
    idle: "border-orange-300/80 border-b-orange-400 bg-orange-50/70 text-orange-950 hover:bg-orange-100/70 dark:border-orange-800 dark:border-b-orange-900 dark:bg-orange-950/40 dark:text-orange-100",
    active: "border-orange-600 border-b-orange-800 bg-orange-600 text-white shadow-sm ring-2 ring-orange-400/30",
    subtitle: "Inquieto",
  },
  abrumado: {
    icon: CloudRain,
    iconBoxIdle: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    iconBoxActive: "bg-white/20 text-white",
    idle: "border-sky-300/80 border-b-sky-400 bg-sky-50/70 text-sky-950 hover:bg-sky-100/70 dark:border-sky-800 dark:border-b-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
    active: "border-sky-600 border-b-sky-800 bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/30",
    subtitle: "Saturado",
  },
};

export function MoodChips() {
  const { todayMood, logMood, showPill } = useNear();

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-5 gap-1.5">
        {MOODS.map((m) => {
          const active = todayMood?.mood === m.id;
          const style = MOOD_STYLES[m.id];
          const Icon = style.icon;
          const shortLabel = m.id === "cansado" ? "Cansado" : m.label;

          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                logMood(m.id);
                showPill({
                  title: `Estado: ${m.label} (+15 XP)`,
                  subtitle: "Near IA adaptó tu sesión de hoy",
                  emoji: m.emoji,
                  tone: "primary",
                });
                toast.success(`Registrado: ${m.label} ${m.emoji}`, {
                  description: "Near IA ajustó tu acompañamiento preventivo.",
                });
              }}
              className={cn(
                "relative flex flex-col items-center justify-between gap-1.5 rounded-2xl border border-b-[3px] px-1 py-2.5 text-center transition-all active:translate-y-0.5",
                active ? style.active : style.idle,
              )}
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1 grid size-4.5 place-items-center rounded-full border border-white bg-emerald-500 text-white shadow-2xs"
                >
                  <Check className="size-2.5 stroke-[3]" />
                </motion.span>
              )}

              {/* Icon Badge + Micro Emoji */}
              <div className="relative">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-xl transition-colors",
                    active ? style.iconBoxActive : style.iconBoxIdle,
                  )}
                >
                  <Icon className="size-4.5 stroke-[2.2]" />
                </span>
                <span className="absolute -right-1 -bottom-1 text-[11px] leading-none">{m.emoji}</span>
              </div>

              <div className="mt-0.5 leading-tight">
                <span className="block text-[11px] font-bold tracking-tight">{shortLabel}</span>
                <span className="block text-[9px] opacity-75">{style.subtitle}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {todayMood && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300/70 bg-emerald-50/60 px-3 py-1.5 text-[11px] font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          <span>
            Estado actual: <strong className="capitalize">{todayMood.mood}</strong> ({todayMood.mood === "calmado" ? "En paz" : "Registrado"}) · Near IA sincronizado
          </span>
          <span className="inline-flex items-center gap-0.5 font-bold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-3" /> +15 XP
          </span>
        </div>
      )}
    </div>
  );
}
