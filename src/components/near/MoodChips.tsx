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
  const { todayMood, logMood } = useNear();
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => {
        const active = todayMood?.mood === m.id;
        return (
          <motion.button
            key={m.id}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              logMood(m.id);
              toast.success(`Registrado: ${m.label} ${m.emoji}`, { description: "Gracias por escucharte hoy." });
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
              active ? cn(moodBg[m.id], "border-heading/20 text-heading shadow-soft") : "border-border bg-surface text-foreground",
            )}
            aria-pressed={active}
          >
            <span>{m.emoji}</span>
            {m.label}
          </motion.button>
        );
      })}
    </div>
  );
}
