import { motion } from "framer-motion";
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

export function MoodChips() {
  const { todayMood, logMood, showPill } = useNear();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => {
          const active = todayMood?.mood === m.id;
          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.93 }}
              animate={active ? { scale: 1.03 } : { scale: 1 }}
              onClick={() => {
                logMood(m.id);
                showPill({
                  title: `Ánimo: ${m.label}`,
                  subtitle: "Registrado en tu refugio personal",
                  emoji: m.emoji,
                  type: "mood",
                });
                toast.success(`Registrado: ${m.label} ${m.emoji}`, { description: "Gracias por escucharte hoy. Lo que sientes es válido." });
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                active
                  ? cn(moodBg[m.id], "border-primary/40 font-semibold text-heading shadow-soft ring-2 ring-primary/20")
                  : "border-border bg-surface text-foreground hover:border-primary/30 hover:bg-surface-2",
              )}
              aria-pressed={active}
            >
              <motion.span
                animate={active ? { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.25, 1] } : undefined}
                transition={{ duration: 0.5 }}
                className="text-base"
              >
                {m.emoji}
              </motion.span>
              {m.label}
            </motion.button>
          );
        })}
      </div>
      {todayMood && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground/90 pl-1 italic"
        >
          ✨ Registrado hoy como <span className="font-semibold text-heading lowercase">{todayMood.mood}</span>. Puedes cambiarlo cuando gustes.
        </motion.p>
      )}
    </div>
  );
}
