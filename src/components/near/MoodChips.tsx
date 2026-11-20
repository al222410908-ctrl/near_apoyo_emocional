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

const MOOD_EDITORIAL: Record<
  MoodId,
  {
    icon: LucideIcon;
    activeClass: string;
    subtitle: string;
  }
> = {
  calmado: {
    icon: Sun,
    activeClass: "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]",
    subtitle: "En paz",
  },
  esperanzado: {
    icon: Sparkles,
    activeClass: "border-[#1C1917] bg-[#B85A3A] text-[#FFFDF9]",
    subtitle: "Con ánimo",
  },
  cansado: {
    icon: BatteryLow,
    activeClass: "border-[#1C1917] bg-[#5C5248] text-[#FFFDF9]",
    subtitle: "Agotado",
  },
  ansioso: {
    icon: Activity,
    activeClass: "border-[#1C1917] bg-[#B85A3A] text-[#FFFDF9]",
    subtitle: "Con presión",
  },
  abrumado: {
    icon: CloudRain,
    activeClass: "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]",
    subtitle: "Saturado",
  },
};

export function MoodChips() {
  const { todayMood, logMood, showPill } = useNear();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-1.5">
        {MOODS.map((m) => {
          const active = todayMood?.mood === m.id;
          const meta = MOOD_EDITORIAL[m.id];
          const Icon = meta.icon;
          const shortLabel = m.id === "cansado" ? "Cansado" : m.label;

          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                logMood(m.id);
                showPill({
                  title: `Estado: ${m.label} (+15 XP)`,
                  subtitle: "Guardado en tu bitácora",
                  emoji: "🌿",
                  tone: "primary",
                });
                toast.success(`Estado registrado: ${m.label}`);
              }}
              className={cn(
                "relative flex flex-col items-center justify-between gap-1.5 rounded-2xl border-2 px-1 py-2.5 text-center transition-all active:translate-y-0.5",
                active
                  ? cn("shadow-[0_3px_0_#1C1917]", meta.activeClass)
                  : "border-[#1C1917]/15 bg-[#FFFDF9] text-[#1C1917] hover:border-[#B85A3A] dark:border-white/15 dark:bg-[#262421] dark:text-[#F4EFE6]",
              )}
              aria-pressed={active}
            >
              {active && (
                <span className="absolute -top-1.5 -right-1 grid size-4.5 place-items-center rounded-full border border-[#1C1917] bg-[#FFFDF9] text-[#1C1917]">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
              )}

              <span
                className={cn(
                  "grid size-8 place-items-center rounded-xl transition-colors",
                  active
                    ? "bg-white/15 text-[#FFFDF9]"
                    : "bg-[#F4EFE6] text-[#284B3C] dark:bg-white/10 dark:text-[#F4EFE6]",
                )}
              >
                <Icon className="size-4 stroke-[2.2]" />
              </span>

              <div className="leading-tight">
                <span className="block text-[11px] font-bold tracking-tight">{shortLabel}</span>
                <span className="block text-[9px] opacity-70">{meta.subtitle}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
