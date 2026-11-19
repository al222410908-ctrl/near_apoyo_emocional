import { motion } from "framer-motion";
import { Check, Flame, Sparkles, Trophy } from "lucide-react";
import { useNear } from "@/context/NearContext";
import { currentWeek } from "@/services/streak";
import { cn } from "@/lib/utils";

export function StreakWidget() {
  const { streak, checkIns } = useNear();
  const week = currentWeek(checkIns);
  const completedInWeek = week.filter((d) => d.done).length;
  const badge =
    streak >= 7 ? "¡Semana Épica! 🏆" : streak >= 5 ? "¡En Llamas! 🔥" : streak >= 3 ? "¡Gran Ritmo! ✨" : "¡Sigue Así! 🌱";

  return (
    <section className="relative overflow-hidden rounded-[28px] border-2 border-b-[6px] border-border border-b-neutral-300 bg-surface p-5 shadow-md dark:border-b-neutral-800">
      {/* Subtle Top Accent Glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-orange-400/15 blur-2xl" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <motion.div
            animate={{ scale: [1, 1.07, 1], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity }}
            className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-b-4 border-orange-500 border-b-orange-700 bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md shadow-orange-500/25"
          >
            <Flame className="size-8 fill-yellow-200 text-white" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Racha de Calma
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                {badge}
              </span>
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <motion.span
                key={streak}
                initial={{ scale: 1.35, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl font-black text-heading"
              >
                {streak} {streak === 1 ? "día" : "días"}
              </motion.span>
              <span className="text-xs font-semibold text-muted-foreground">
                seguidos cuidándote
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            <Trophy className="size-3.5" /> {completedInWeek}/7 sem.
          </span>
        </div>
      </div>

      {/* 7-Day Duolingo-Style Tactile Day Circles */}
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {week.map((d) => (
          <div key={d.key} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "text-[10px] font-extrabold uppercase",
                d.isToday ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground",
              )}
            >
              {d.label}
            </span>
            <motion.div
              whileHover={{ y: -2, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={d.isToday && !d.done ? { scale: [1, 1.08, 1] } : undefined}
              transition={d.isToday ? { duration: 2.2, repeat: Infinity } : undefined}
              className={cn(
                "relative grid size-10 place-items-center rounded-2xl border-2 border-b-4 text-xs font-black transition-all",
                d.done
                  ? "border-amber-500 border-b-amber-700 bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-sm shadow-orange-500/20"
                  : d.isToday
                    ? "border-dashed border-orange-400 border-b-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"
                    : "border-border border-b-neutral-300 bg-surface-2 text-muted-foreground dark:border-b-neutral-700",
              )}
            >
              {d.done ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                >
                  <Check className="size-4.5 stroke-[3.5]" />
                </motion.span>
              ) : d.isToday ? (
                <Sparkles className="size-4 text-orange-500" />
              ) : (
                <span className="size-1.5 rounded-full bg-muted-foreground/35" />
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
