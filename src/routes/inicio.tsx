import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookHeart,
  Check,
  Crown,
  Gift,
  Heart,
  MessageCircleHeart,
  Mic,
  Play,
  Sparkles,
  Target,
  Waves,
  Wind,
} from "lucide-react";
import { useState } from "react";
import { AppScreen } from "@/components/near/AppScreen";
import { InteractiveLessonModal } from "@/components/near/InteractiveLessonModal";
import { MoodChips } from "@/components/near/MoodChips";
import { NearMascotHero } from "@/components/near/NearMascotHero";
import { StreakWidget } from "@/components/near/StreakWidget";
import { useNear } from "@/context/NearContext";
import { WELLNESS_LESSONS, type InteractiveLesson } from "@/services/lessonsData";
import { quoteOfTheDay } from "@/services/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Inicio · Near Apoyo Emocional" },
      { name: "description", content: "Tu camino interactivo de calma, misiones diarias, registro de ánimo y apoyo emocional." },
      { property: "og:title", content: "Inicio · Near Apoyo Emocional" },
      { property: "og:description", content: "Tu camino interactivo de calma, misiones diarias y apoyo emocional." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen emergency>
      <Dashboard />
    </AppScreen>
  ),
});

const fade = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.04 * i, duration: 0.35 },
});

const PATH_OFFSETS = ["translate-x-0", "translate-x-3", "-translate-x-2", "translate-x-2", "translate-x-0"];

function Dashboard() {
  const { favorites, toggleFavorite, todayMood, completedLessons, messages } = useNear();
  const [activeLesson, setActiveLesson] = useState<InteractiveLesson | null>(null);
  const quote = quoteOfTheDay();
  const fav = favorites.includes(quote.id);

  // Determine the next recommended active lesson
  const nextActiveLessonId =
    WELLNESS_LESSONS.find((l) => !completedLessons.includes(l.id))?.id ?? WELLNESS_LESSONS[0]!.id;

  // Daily Quests calculation
  const quest1Done = Boolean(todayMood);
  const quest2Done = completedLessons.length >= 2;
  const quest3Done = messages.length > 1;
  const questsDoneCount = [quest1Done, quest2Done, quest3Done].filter(Boolean).length;

  return (
    <div className="space-y-6 bg-sanctuary px-4 pt-5 pb-6">
      {/* 1. Gamified HUD + Interactive Animated Mascot Hero */}
      <motion.div {...fade(0)}>
        <NearMascotHero />
      </motion.div>

      {/* 2. Tactile 3D Colorful Mood Check-in */}
      <motion.section
        {...fade(1)}
        className="rounded-[28px] border-2 border-b-[6px] border-border border-b-neutral-300 bg-surface p-4 shadow-md dark:border-b-neutral-800"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-extrabold text-heading">¿Cómo llega tu mente hoy?</h2>
            <p className="text-xs font-medium text-muted-foreground">Tu refugio adapta sus colores a lo que sientes</p>
          </div>
          <span className="rounded-xl bg-amber-500/15 px-2.5 py-1 text-[11px] font-black text-amber-700 dark:text-amber-300">
            Check-in Diario
          </span>
        </div>
        <MoodChips />
      </motion.section>

      {/* 3. Duolingo-Style Winding Interactive Wellness Path */}
      <motion.section
        {...fade(2)}
        className="relative overflow-hidden rounded-[30px] border-2 border-b-[6px] border-emerald-400/80 border-b-emerald-600 bg-gradient-to-b from-emerald-50/90 via-surface to-sky-50/70 p-5 shadow-lg dark:border-emerald-800 dark:border-b-emerald-950 dark:from-emerald-950/30 dark:via-surface dark:to-sky-950/20"
      >
        {/* Section Header Banner */}
        <div className="mb-5 flex items-center justify-between rounded-2xl border-2 border-b-4 border-emerald-600 border-b-emerald-800 bg-gradient-to-r from-emerald-500 to-teal-600 p-3.5 text-white shadow-md">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-100">
              <Sparkles className="size-3" /> Ruta Preventiva Universitaria
            </span>
            <h2 className="font-display text-lg font-black leading-tight text-white">
              Camino de Calma
            </h2>
          </div>
          <div className="rounded-xl bg-black/20 px-3 py-1.5 text-center backdrop-blur-xs">
            <span className="block font-display text-base font-black leading-none text-yellow-300">
              {completedLessons.length}/{WELLNESS_LESSONS.length}
            </span>
            <span className="text-[9px] font-bold uppercase text-white/90">Unidades</span>
          </div>
        </div>

        <p className="mb-5 text-center text-xs font-semibold text-muted-foreground">
          Toca cualquier isla para iniciar una cápsula interactiva de 2 min 👇
        </p>

        {/* Winding Nodes Trail */}
        <div className="relative space-y-4">
          {/* Vertical Connecting Trail Line */}
          <div className="pointer-events-none absolute top-8 bottom-8 left-10 w-1.5 rounded-full bg-gradient-to-b from-emerald-400 via-sky-400 to-rose-400 opacity-35" />

          {WELLNESS_LESSONS.map((lesson, idx) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isCurrent = lesson.id === nextActiveLessonId;

            return (
              <motion.div
                key={lesson.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className={cn("relative z-10 transition-transform", PATH_OFFSETS[idx])}
              >
                {isCurrent && (
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="mb-1.5 ml-3 inline-flex items-center gap-1 rounded-full border-2 border-amber-400 bg-amber-400 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-md"
                  >
                    <Play className="size-2.5 fill-current" /> ¡Siguiente Cápsula Recomendada!
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveLesson(lesson)}
                  className={cn(
                    "group flex w-full items-center gap-3.5 rounded-3xl border-2 border-b-[6px] p-3.5 text-left transition-all active:translate-y-1 active:border-b-2",
                    isCurrent
                      ? "border-sky-400 border-b-sky-600 bg-white shadow-xl ring-4 ring-sky-400/25 dark:bg-neutral-900"
                      : isCompleted
                        ? "border-emerald-300 border-b-emerald-500 bg-white/95 shadow-md dark:border-emerald-800 dark:border-b-emerald-950 dark:bg-neutral-900/90"
                        : "border-border border-b-neutral-300 bg-surface/95 shadow-sm hover:border-primary/40 dark:border-b-neutral-800",
                  )}
                >
                  {/* 3D Island Node Circle */}
                  <div
                    className={cn(
                      "relative grid size-15 shrink-0 place-items-center rounded-2xl border-2 border-b-[5px] text-2xl text-white shadow-md transition-transform group-hover:scale-105",
                      lesson.palette.bg,
                      lesson.palette.border,
                      lesson.palette.lip,
                    )}
                  >
                    <span>{lesson.emoji}</span>
                    {isCompleted && (
                      <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border-2 border-white bg-amber-400 text-amber-950 shadow">
                        <Crown className="size-3.5 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Lesson Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase",
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
                        )}
                      >
                        Unidad {lesson.unitNumber}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                        +{lesson.xpReward} XP
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        • {lesson.duration}
                      </span>
                    </div>

                    <h3 className="mt-1 truncate font-display text-base font-extrabold text-heading">
                      {lesson.title}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">
                      {lesson.subtitle}
                    </p>
                  </div>

                  {/* Action Pill */}
                  <div
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-2xl border-2 border-b-4 font-black transition-transform group-hover:scale-105",
                      isCompleted
                        ? "border-emerald-400 border-b-emerald-600 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                        : "border-amber-500 border-b-amber-700 bg-amber-400 text-amber-950",
                    )}
                  >
                    {isCompleted ? <Check className="size-5 stroke-[3]" /> : <Play className="size-4 fill-current" />}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 4. Daily Quests / Misiones del Día (Duolingo Quests Style) */}
      <motion.section
        {...fade(3)}
        className="rounded-[28px] border-2 border-b-[6px] border-amber-300 border-b-amber-500 bg-gradient-to-br from-amber-50/90 via-surface to-orange-50/60 p-5 shadow-md dark:border-amber-800 dark:border-b-amber-950 dark:from-amber-950/30 dark:via-surface dark:to-orange-950/20"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl border-2 border-b-4 border-amber-600 bg-amber-400 text-amber-950 shadow-xs">
              <Target className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold text-heading">Misiones del Día</h2>
              <p className="text-xs font-medium text-muted-foreground">
                Completa tus 3 micro-hábitos para abrir el cofre
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl border-2 border-amber-400 bg-amber-100/80 px-3 py-1.5 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <Gift className="size-4 text-amber-600" />
            <span>{questsDoneCount}/3</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              id: "q1",
              title: "Escucha tu interior",
              subtitle: "Registra tu estado de ánimo de hoy",
              xp: "+15 XP",
              done: quest1Done,
              emoji: "😌",
            },
            {
              id: "q2",
              title: "Mente preventiva",
              subtitle: "Completa una cápsula interactiva del Camino",
              xp: "+30 XP",
              done: quest2Done,
              emoji: "🎓",
            },
            {
              id: "q3",
              title: "Suelta la carga",
              subtitle: "Platica con Near en el chat o por voz",
              xp: "+20 XP",
              done: quest3Done,
              emoji: "💬",
            },
          ].map((q) => (
            <div
              key={q.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 border-b-4 p-3 transition-all",
                q.done
                  ? "border-emerald-400 border-b-emerald-600 bg-emerald-50/90 dark:bg-emerald-950/40"
                  : "border-border border-b-neutral-300 bg-background/90 dark:border-b-neutral-800",
              )}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-lg">
                {q.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs font-extrabold text-heading">{q.title}</p>
                  <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">{q.xp}</span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{q.subtitle}</p>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    className={cn("h-full rounded-full", q.done ? "bg-emerald-500" : "bg-amber-400")}
                    initial={{ width: 0 }}
                    animate={{ width: q.done ? "100%" : "20%" }}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border-2",
                  q.done
                    ? "border-emerald-600 bg-emerald-500 text-white"
                    : "border-border bg-surface text-muted-foreground",
                )}
              >
                {q.done && <Check className="size-4 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5. Streak Widget */}
      <motion.div {...fade(4)}>
        <StreakWidget />
      </motion.div>

      {/* 6. Vibrant Multi-Color 3D Action Arcade (Chat, Voice, Breathing, Sounds) */}
      <motion.section {...fade(5)} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-lg font-extrabold text-heading">Cabina de Apoyo Directo</h2>
          <span className="text-xs font-bold text-primary">24/7 Confidencial</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Chat IA 3D Card */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/chat"
              className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-3xl border-2 border-b-[6px] border-rose-600 border-b-rose-800 bg-gradient-to-br from-rose-500 to-orange-500 p-4 text-white shadow-lg shadow-rose-500/20 transition-all active:translate-y-1 active:border-b-2"
            >
              <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/15 blur-lg" />
              <span className="grid size-12 place-items-center rounded-2xl border-2 border-white/40 bg-white/20 text-white shadow-xs transition-transform group-hover:scale-110">
                <MessageCircleHeart className="size-6" />
              </span>
              <div>
                <span className="inline-block rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-black uppercase">
                  IA Empática
                </span>
                <span className="mt-1 block font-display text-lg font-black leading-tight">Chatear</span>
                <span className="block text-xs text-white/90">Desahógate sin juicios</span>
              </div>
            </Link>
          </motion.div>

          {/* Voice IA 3D Card */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/voz"
              className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-3xl border-2 border-b-[6px] border-indigo-600 border-b-indigo-800 bg-gradient-to-br from-indigo-500 to-violet-600 p-4 text-white shadow-lg shadow-indigo-500/20 transition-all active:translate-y-1 active:border-b-2"
            >
              <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/15 blur-lg" />
              <span className="grid size-12 place-items-center rounded-2xl border-2 border-white/40 bg-white/20 text-white shadow-xs transition-transform group-hover:scale-110">
                <Mic className="size-6" />
              </span>
              <div>
                <span className="inline-block rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-black uppercase">
                  Modo Voz
                </span>
                <span className="mt-1 block font-display text-lg font-black leading-tight">Hablar</span>
                <span className="block text-xs text-white/90">Diálogo cálido en vivo</span>
              </div>
            </Link>
          </motion.div>

          {/* Breathing 4-7-8 3D Card */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/respiracion"
              className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-3xl border-2 border-b-[6px] border-sky-600 border-b-sky-800 bg-gradient-to-br from-sky-500 to-cyan-600 p-4 text-white shadow-lg shadow-sky-500/20 transition-all active:translate-y-1 active:border-b-2"
            >
              <span className="grid size-11 place-items-center rounded-2xl border-2 border-white/40 bg-white/20 text-white transition-transform group-hover:scale-110">
                <Wind className="size-5" />
              </span>
              <div>
                <span className="block font-display text-base font-black leading-tight">Respirar 4-7-8</span>
                <span className="mt-0.5 block text-xs text-white/90">Háptica + Guía 3 min</span>
              </div>
            </Link>
          </motion.div>

          {/* Ambient Sounds 3D Card */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/sonidos"
              className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-3xl border-2 border-b-[6px] border-teal-600 border-b-teal-800 bg-gradient-to-br from-teal-500 to-emerald-600 p-4 text-white shadow-lg shadow-teal-500/20 transition-all active:translate-y-1 active:border-b-2"
            >
              <span className="grid size-11 place-items-center rounded-2xl border-2 border-white/40 bg-white/20 text-white transition-transform group-hover:scale-110">
                <Waves className="size-5" />
              </span>
              <div>
                <span className="block font-display text-base font-black leading-tight">Sonidos Zen</span>
                <span className="mt-0.5 block text-xs text-white/90">Lluvia, bosque y olas</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* 7. Bitácora Emocional Banner Card */}
      <motion.div {...fade(6)} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/bitacora"
          className="flex items-center gap-4 rounded-3xl border-2 border-b-[6px] border-violet-400 border-b-violet-600 bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-white shadow-lg shadow-violet-500/20 transition-all active:translate-y-1 active:border-b-2"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-white/40 bg-white/20 text-white">
            <BookHeart className="size-6" />
          </span>
          <span className="flex-1">
            <span className="inline-block rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-black uppercase">
              Estadísticas & Diario
            </span>
            <span className="mt-0.5 block font-display text-lg font-black">Mi Bitácora Emocional</span>
            <span className="block text-xs text-white/90">Gráficas de ánimo y reflexiones semanales</span>
          </span>
        </Link>
      </motion.div>

      {/* 8. Daily Collectible Quote Card */}
      <motion.section
        {...fade(7)}
        className="relative overflow-hidden rounded-3xl border-2 border-b-[6px] border-slate-700 border-b-slate-900 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
            <Sparkles className="size-3.5" /> Cápsula de Sabiduría
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            animate={fav ? { scale: [1, 1.3, 1] } : undefined}
            onClick={() => toggleFavorite(quote.id)}
            className="grid size-10 place-items-center rounded-2xl border-2 border-white/25 bg-white/10 shadow-xs"
            aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-pressed={fav}
          >
            <Heart className={cn("size-5 transition-colors", fav ? "fill-rose-400 text-rose-400" : "text-white")} />
          </motion.button>
        </div>
        <p className="mt-3 font-display text-lg font-bold leading-snug text-white">“{quote.text}”</p>
      </motion.section>

      {/* Interactive Duolingo-Style Lesson Modal */}
      <AnimatePresence>
        {activeLesson && (
          <InteractiveLessonModal
            lesson={activeLesson}
            onClose={() => setActiveLesson(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
