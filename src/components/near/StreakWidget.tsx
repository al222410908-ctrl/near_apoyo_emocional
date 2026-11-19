import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { useNear } from "@/context/NearContext";
import { currentWeek } from "@/services/streak";
import { cn } from "@/lib/utils";

export function StreakWidget() {
  const { streak, checkIns } = useNear();
  const week = currentWeek(checkIns);
  const badge = streak >= 7 ? "¡Semana completa! 🏆" : streak >= 5 ? "¡Constancia! 🌟" : streak >= 3 ? "Buen ritmo ✨" : "Cada día cuenta";

  return (
    <section className="rounded-3xl bg-clay p-5 text-primary-foreground shadow-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide uppercase opacity-80">Racha de Calma</p>
          <div className="mt-1 flex items-baseline gap-2">
            <motion.span
              key={streak}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-5xl font-semibold"
            >
              {streak}
            </motion.span>
            <span className="text-sm leading-tight">
              {streak === 1 ? "día" : "días"} cuidando
              <br />
              de ti
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <motion.span
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 }}
            className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/15"
          >
            <Flame className="size-7" />
          </motion.span>
          <span className="rounded-full bg-primary-foreground/20 px-2.5 py-1 text-[11px] font-semibold">{badge}</span>
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        {week.map((d) => (
          <div key={d.key} className="flex flex-col items-center gap-1.5">
            <motion.span
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={d.isToday ? { scale: [1, 1.08, 1] } : undefined}
              transition={d.isToday ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
              className={cn(
                "relative grid size-9 place-items-center rounded-full border-2 text-xs font-semibold shadow-xs transition-colors",
                d.done
                  ? "border-transparent bg-primary-foreground text-primary shadow-sm"
                  : d.isToday
                    ? "border-dashed border-primary-foreground/90 bg-primary-foreground/10"
                    : "border-primary-foreground/25",
              )}
            >
              {d.done ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                  <Check className="size-4" strokeWidth={3} />
                </motion.span>
              ) : null}
            </motion.span>
            <span className={cn("text-[11px]", d.isToday ? "font-bold text-primary-foreground" : "opacity-75")}>{d.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
