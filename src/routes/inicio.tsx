import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookHeart,
  Check,
  ChevronDown,
  Compass,
  Crown,
  Flame,
  Gift,
  Heart,
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
      { name: "description", content: "IA de apoyo emocional preventivo, misiones diarias y cápsulas interactivas para universitarios." },
      { property: "og:title", content: "Inicio · Near Apoyo Emocional" },
      { property: "og:description", content: "IA de apoyo emocional preventivo, misiones diarias y cápsulas interactivas." },
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

type DashboardSection = "misiones" | "ruta" | "racha";

function Dashboard() {
  const { favorites, toggleFavorite, todayMood, completedLessons, messages, streak } = useNear();
  const [activeTab, setActiveTab] = useState<DashboardSection>("misiones");
  const [activeLesson, setActiveLesson] = useState<InteractiveLesson | null>(null);
  const [quoteExpanded, setQuoteExpanded] = useState(false);

  const quote = quoteOfTheDay();
  const fav = favorites.includes(quote.id);

  // Recommended next lesson
  const recommendedLesson =
    WELLNESS_LESSONS.find((l) => !completedLessons.includes(l.id)) ?? WELLNESS_LESSONS[0]!;

  // Daily Quests calculation
  const quest1Done = Boolean(todayMood);
  const quest2Done = completedLessons.length >= 2;
  const quest3Done = messages.length > 1;
  const questsDoneCount = [quest1Done, quest2Done, quest3Done].filter(Boolean).length;

  return (
    <div className="space-y-4 bg-sanctuary px-4 pt-4 pb-6">
      {/* 1. PROTAGONISTA: Near AI Companion Hub */}
      <NearMascotHero />

      {/* 2. Registro Rápido de Ánimo */}
      <section className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-heading">¿Cómo te sientes en este momento?</h2>
          <span className="rounded-lg bg-primary-tint px-2 py-0.5 text-[10px] font-bold text-primary">
            Check-in · +15 XP
          </span>
        </div>
        <MoodChips />
      </section>

      {/* 3. Menú Estratégico por Secciones (Evita saturación visual) */}
      <div className="space-y-3">
        <div
          role="tablist"
          aria-label="Secciones de bienestar"
          className="grid grid-cols-3 gap-1.5 rounded-2xl border border-b-[3px] border-border bg-surface-2/90 p-1.5"
        >
          {[
            {
              id: "misiones" as const,
              label: "Misiones",
              badge: `${questsDoneCount}/3`,
              icon: Target,
            },
            {
              id: "ruta" as const,
              label: "Cápsulas",
              badge: `${completedLessons.length}/${WELLNESS_LESSONS.length}`,
              icon: Compass,
            },
            {
              id: "racha" as const,
              label: "Racha & Kit",
              badge: `${streak}d`,
              icon: Flame,
            },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all",
                  isSelected
                    ? "border border-b-[3px] border-border border-b-neutral-300 bg-background text-heading shadow-xs dark:border-b-neutral-700"
                    : "text-muted-foreground hover:text-heading",
                )}
              >
                <Icon className={cn("size-3.5", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.2 text-[10px] font-extrabold",
                    isSelected ? "bg-primary-tint text-primary" : "bg-surface text-muted-foreground",
                  )}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contenido Dinámico Debajo del Menú */}
        <AnimatePresence mode="wait">
          {activeTab === "misiones" && (
            <motion.section
              key="tab-misiones"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Misiones del Día Card */}
              <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-heading">Misiones del Día</h3>
                    <p className="text-xs text-muted-foreground">Micro-hábitos preventivos para tu jornada</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-xl border border-amber-300/80 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    <Gift className="size-3.5 text-amber-600" /> {questsDoneCount}/3
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: "q1",
                      title: "Registro emocional",
                      subtitle: "Selecciona cómo te sientes hoy arriba",
                      xp: "+15 XP",
                      done: quest1Done,
                    },
                    {
                      id: "q2",
                      title: "Conversa con Near IA",
                      subtitle: "Desahógate o pide organizar tus pendientes",
                      xp: "+20 XP",
                      done: quest3Done,
                    },
                    {
                      id: "q3",
                      title: "Cápsula preventiva",
                      subtitle: "Completa 1 unidad interactiva de 2 min",
                      xp: "+30 XP",
                      done: quest2Done,
                    },
                  ].map((q) => (
                    <div
                      key={q.id}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border border-b-[3px] p-3 transition-all",
                        q.done
                          ? "border-emerald-300 border-b-emerald-500 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/30"
                          : "border-border border-b-neutral-200 bg-background dark:border-b-neutral-800",
                      )}
                    >
                      <div
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-xl border text-xs font-bold",
                          q.done
                            ? "border-emerald-600 bg-emerald-500 text-white"
                            : "border-border bg-surface-2 text-muted-foreground",
                        )}
                      >
                        {q.done ? <Check className="size-4 stroke-[3]" /> : "•"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-xs font-bold text-heading">{q.title}</p>
                          <span className="text-[11px] font-extrabold text-primary">{q.xp}</span>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">{q.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceso Rápido a la Siguiente Cápsula Recomendada */}
              <button
                type="button"
                onClick={() => setActiveLesson(recommendedLesson)}
                className="group flex w-full items-center gap-3.5 rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 text-left shadow-xs transition-all hover:border-primary/40 active:translate-y-0.5 dark:border-b-neutral-800"
              >
                <div
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-2xl border border-b-[3px] text-xl text-white shadow-xs",
                    recommendedLesson.palette.bg,
                    recommendedLesson.palette.border,
                    recommendedLesson.palette.lip,
                  )}
                >
                  {recommendedLesson.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Cápsula Sugerida · {recommendedLesson.duration}
                  </span>
                  <h4 className="truncate font-display text-sm font-bold text-heading">
                    U{recommendedLesson.unitNumber}: {recommendedLesson.title}
                  </h4>
                  <p className="truncate text-xs text-muted-foreground">{recommendedLesson.subtitle}</p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary transition-transform group-hover:scale-105">
                  <Play className="size-4 fill-current" />
                </span>
              </button>
            </motion.section>
          )}

          {activeTab === "ruta" && (
            <motion.section
              key="tab-ruta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-heading">Ruta de Cápsulas Preventivas</h3>
                  <p className="text-xs text-muted-foreground">Entrenamiento práctico de 2 minutos por unidad</p>
                </div>
                <span className="rounded-xl bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {completedLessons.length}/{WELLNESS_LESSONS.length} listas
                </span>
              </div>

              <div className="space-y-2.5">
                {WELLNESS_LESSONS.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isRecommended = lesson.id === recommendedLesson.id;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setActiveLesson(lesson)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-2xl border border-b-[4px] p-3 text-left transition-all active:translate-y-0.5",
                        isRecommended
                          ? "border-primary/50 border-b-primary bg-primary-tint/25 shadow-xs"
                          : isCompleted
                            ? "border-emerald-300/80 border-b-emerald-500 bg-emerald-50/40 dark:border-emerald-800/80 dark:bg-emerald-950/20"
                            : "border-border border-b-neutral-300 bg-background hover:bg-surface-2 dark:border-b-neutral-800",
                      )}
                    >
                      <div
                        className={cn(
                          "relative grid size-12 shrink-0 place-items-center rounded-xl border border-b-[3px] text-lg text-white",
                          lesson.palette.bg,
                          lesson.palette.border,
                          lesson.palette.lip,
                        )}
                      >
                        <span>{lesson.emoji}</span>
                        {isCompleted && (
                          <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full border border-white bg-amber-400 text-amber-950">
                            <Crown className="size-3 fill-current" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            Unidad {lesson.unitNumber}
                          </span>
                          <span className="text-[10px] font-bold text-primary">+{lesson.xpReward} XP</span>
                          <span className="text-[10px] text-muted-foreground">· {lesson.duration}</span>
                        </div>
                        <h4 className="truncate font-display text-sm font-bold text-heading">{lesson.title}</h4>
                        <p className="truncate text-xs text-muted-foreground">{lesson.subtitle}</p>
                      </div>

                      <div
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-xl border",
                          isCompleted
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : "border-border bg-surface text-heading group-hover:bg-primary group-hover:text-primary-foreground",
                        )}
                      >
                        {isCompleted ? <Check className="size-4 stroke-[3]" /> : <Play className="size-3.5 fill-current" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {activeTab === "racha" && (
            <motion.section
              key="tab-racha"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <StreakWidget />

              <div className="grid grid-cols-3 gap-2.5">
                <Link
                  to="/respiracion"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-b-[4px] border-sky-300 border-b-sky-500 bg-sky-50/70 p-3 text-center transition-transform active:translate-y-0.5 dark:border-sky-800 dark:bg-sky-950/40"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-sky-500 text-white">
                    <Wind className="size-5" />
                  </span>
                  <span className="text-xs font-bold text-heading">Respirar 4-7-8</span>
                </Link>

                <Link
                  to="/sonidos"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-b-[4px] border-teal-300 border-b-teal-500 bg-teal-50/70 p-3 text-center transition-transform active:translate-y-0.5 dark:border-teal-800 dark:bg-teal-950/40"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-teal-600 text-white">
                    <Waves className="size-5" />
                  </span>
                  <span className="text-xs font-bold text-heading">Sonidos Zen</span>
                </Link>

                <Link
                  to="/bitacora"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-b-[4px] border-violet-300 border-b-violet-500 bg-violet-50/70 p-3 text-center transition-transform active:translate-y-0.5 dark:border-violet-800 dark:bg-violet-950/40"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white">
                    <BookHeart className="size-5" />
                  </span>
                  <span className="text-xs font-bold text-heading">Mi Bitácora</span>
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Sección Plegable: Reflexión del Día (Minimalista, sin saturar) */}
      <div className="overflow-hidden rounded-2xl border border-b-[3px] border-border bg-surface/80">
        <button
          type="button"
          onClick={() => setQuoteExpanded((x) => !x)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold text-heading">
            <Sparkles className="size-3.5 text-primary" />
            Reflexión Preventiva del Día
          </span>
          <ChevronDown
            className={cn("size-4 text-muted-foreground transition-transform", quoteExpanded && "rotate-180")}
          />
        </button>
        <AnimatePresence>
          {quoteExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border/60 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-sm italic leading-relaxed text-heading">“{quote.text}”</p>
                <button
                  type="button"
                  onClick={() => toggleFavorite(quote.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-xl border border-border bg-background"
                  aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
                >
                  <Heart className={cn("size-4", fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Lesson Modal */}
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
