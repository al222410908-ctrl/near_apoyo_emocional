import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookHeart,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Crown,
  EyeOff,
  Flame,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  Layers,
  MessageSquareHeart,
  MoonStar,
  Play,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  UserCheck,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
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
      { name: "description", content: "Módulos de Chat y Voice Chat con Near IA, perfil emocional, cápsulas preventivas y misiones diarias." },
      { property: "og:title", content: "Inicio · Near Apoyo Emocional" },
      { property: "og:description", content: "Módulos de Chat y Voice Chat con Near IA, perfil emocional y cápsulas preventivas." },
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

const LESSON_ICONS: Record<string, LucideIcon> = {
  u1: Target,
  u2: Zap,
  u3: ShieldCheck,
  u4: MoonStar,
  u5: HeartHandshake,
};

type HabitsTab = "misiones" | "kit";

function Dashboard() {
  const { user, settings, xp, favorites, toggleFavorite, todayMood, completedLessons, messages, streak } = useNear();
  const [habitsTab, setHabitsTab] = useState<HabitsTab>("misiones");
  const [showAllCapsules, setShowAllCapsules] = useState(false);
  const [activeLesson, setActiveLesson] = useState<InteractiveLesson | null>(null);
  const [quoteExpanded, setQuoteExpanded] = useState(false);

  const quote = quoteOfTheDay();
  const fav = favorites.includes(quote.id);

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  // Recommended next lesson
  const recommendedLesson =
    WELLNESS_LESSONS.find((l) => !completedLessons.includes(l.id)) ?? WELLNESS_LESSONS[0]!;
  const RecommendedIcon = LESSON_ICONS[recommendedLesson.id] ?? GraduationCap;

  // Daily Quests calculation
  const quest1Done = Boolean(todayMood);
  const quest2Done = completedLessons.length >= 2;
  const quest3Done = messages.length > 1;
  const questsDoneCount = [quest1Done, quest2Done, quest3Done].filter(Boolean).length;

  const styleLabel =
    settings.companionStyle === "calido"
      ? "Cálido"
      : settings.companionStyle === "directo"
        ? "Directo"
        : "Silencioso";

  return (
    <div className="space-y-5 bg-sanctuary px-4 pt-3 pb-4">
      {/* =====================================================================
          MÓDULO 0 & 1: BARRA SUPERIOR ESTÁTICA + CENTRO PRINCIPAL NEAR IA
         ===================================================================== */}
      <NearMascotHero />

      {/* =====================================================================
          MÓDULO 2: SECCIÓN DE PERFIL & ESTADO EMOCIONAL
         ===================================================================== */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-secondary uppercase">
            <UserCheck className="size-3.5" /> Módulo de Perfil · Estado y Nivel
          </span>
          <Link
            to="/perfil"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
          >
            <Settings2 className="size-3" /> Configurar
          </Link>
        </div>

        <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
          {/* Tarjeta Resumen de Perfil */}
          <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-b-[3px] border-secondary/30 border-b-secondary/60 bg-secondary-tint text-secondary">
                {settings.anonymousMode ? (
                  <EyeOff className="size-5" />
                ) : (
                  <GraduationCap className="size-6" />
                )}
                <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border border-white bg-primary text-[9px] font-black text-primary-foreground">
                  {level}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-display text-base font-bold text-heading">
                    {settings.anonymousMode ? "Estudiante (Modo Anónimo)" : (user?.name ?? "Estudiante")}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    <SlidersHorizontal className="size-2.5 text-primary" /> IA {styleLabel}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.major ?? "Ingeniería TIC"} · UTVT
                </p>

                {/* Mini Barra de Nivel */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(10, levelProgress)}%` }}
                    />
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary">
                    <Award className="size-3" /> Nivel {level} ({levelProgress}/100 XP)
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/perfil"
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-b-[3px] border-border bg-background text-muted-foreground transition-colors hover:text-heading active:translate-y-0.5"
              aria-label="Ir a mi perfil completo"
            >
              <ChevronRight className="size-4.5" />
            </Link>
          </div>

          {/* Sub-bloque: Check-in de Estado Emocional con Iconos + Emojis */}
          <div className="pt-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-heading">¿Cómo te sientes en este momento?</span>
              <span className="rounded-lg bg-primary-tint px-2 py-0.5 text-[10px] font-bold text-primary">
                Check-in · +15 XP
              </span>
            </div>
            <MoodChips />
          </div>
        </div>
      </section>

      {/* =====================================================================
          MÓDULO 3: CÁPSULA PREVENTIVA SUGERIDA & RUTA DIDÁCTICA
         ===================================================================== */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
            <GraduationCap className="size-3.5" /> Módulo Didáctico · Cápsula Sugerida
          </span>
          <span className="text-[11px] font-bold text-muted-foreground">
            {completedLessons.length}/{WELLNESS_LESSONS.length} completadas
          </span>
        </div>

        <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
          {/* Tarjeta Principal de la Cápsula Sugerida */}
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "relative grid size-14 shrink-0 place-items-center rounded-2xl border border-b-[4px] text-white shadow-sm",
                recommendedLesson.palette.bg,
                recommendedLesson.palette.border,
                recommendedLesson.palette.lip,
              )}
            >
              <RecommendedIcon className="size-7 stroke-[2.2]" />
              <span className="absolute -right-1.5 -bottom-1.5 grid size-6 place-items-center rounded-full border border-border bg-background text-xs shadow-2xs">
                {recommendedLesson.emoji}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-primary-tint px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary">
                  Unidad {recommendedLesson.unitNumber} · {recommendedLesson.category}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  +{recommendedLesson.xpReward} XP
                </span>
              </div>
              <h3 className="mt-1 truncate font-display text-base font-bold text-heading">
                {recommendedLesson.title}
              </h3>
              <p className="truncate text-xs text-muted-foreground">{recommendedLesson.subtitle}</p>
            </div>
          </div>

          {/* Botones de Acción de la Cápsula */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveLesson(recommendedLesson)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border border-b-[4px] py-2.5 text-xs font-extrabold tracking-wide text-white shadow-sm transition-all active:translate-y-0.5",
                recommendedLesson.palette.bg,
                recommendedLesson.palette.border,
                recommendedLesson.palette.lip,
              )}
            >
              <Play className="size-3.5 fill-current" />
              <span>Iniciar Cápsula ({recommendedLesson.duration})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAllCapsules((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-b-[3px] border-border bg-background px-3 py-2.5 text-xs font-bold text-heading transition-colors hover:bg-surface-2"
            >
              <Layers className="size-3.5 text-primary" />
              <span>Ruta ({completedLessons.length}/5)</span>
              <ChevronDown className={cn("size-3.5 transition-transform", showAllCapsules && "rotate-180")} />
            </button>
          </div>

          {/* Lista Desplegable de las 5 Unidades con Iconos Vectoriales */}
          <AnimatePresence>
            {showAllCapsules && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3.5 space-y-2 border-t border-border/70 pt-3.5">
                  {WELLNESS_LESSONS.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = lesson.id === recommendedLesson.id;
                    const LessonIcon = LESSON_ICONS[lesson.id] ?? GraduationCap;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveLesson(lesson)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl border border-b-[3px] p-2.5 text-left transition-all active:translate-y-0.5",
                          isCurrent
                            ? "border-primary/50 border-b-primary bg-primary-tint/20"
                            : isCompleted
                              ? "border-emerald-300/80 border-b-emerald-500 bg-emerald-50/40 dark:border-emerald-800/80 dark:bg-emerald-950/20"
                              : "border-border bg-background hover:bg-surface-2",
                        )}
                      >
                        <div
                          className={cn(
                            "relative grid size-10 shrink-0 place-items-center rounded-xl border border-b-[2px] text-white",
                            lesson.palette.bg,
                            lesson.palette.border,
                            lesson.palette.lip,
                          )}
                        >
                          <LessonIcon className="size-5" />
                          {isCompleted && (
                            <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full border border-white bg-amber-400 text-amber-950">
                              <Crown className="size-2.5 fill-current" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-muted-foreground">
                              U{lesson.unitNumber} · {lesson.emoji}
                            </span>
                            <span className="text-[10px] font-bold text-primary">+{lesson.xpReward} XP</span>
                          </div>
                          <h4 className="truncate text-xs font-bold text-heading">{lesson.title}</h4>
                        </div>

                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-lg border",
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border bg-surface text-heading",
                          )}
                        >
                          {isCompleted ? <Check className="size-3.5 stroke-[3]" /> : <Play className="size-3 fill-current" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* =====================================================================
          MÓDULO 4: MISIONES DIARIAS & KIT DE CALMA RÁPIDA
         ===================================================================== */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-heading uppercase">
            <Compass className="size-3.5 text-primary" /> Módulo de Hábitos · Misiones y Calma
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
            <Gift className="size-3" /> {questsDoneCount}/3 hoy
          </span>
        </div>

        {/* Selector Conmutable del Módulo 4 */}
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-b-[3px] border-border bg-surface-2/90 p-1.5">
          {[
            { id: "misiones" as const, label: "Misiones del Día", badge: `${questsDoneCount}/3`, icon: Target },
            { id: "kit" as const, label: "Racha & Kit de Calma", badge: `${streak}d`, icon: Flame },
          ].map((tab) => {
            const isSelected = habitsTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setHabitsTab(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all",
                  isSelected
                    ? "border border-b-[3px] border-border border-b-neutral-300 bg-background text-heading shadow-2xs dark:border-b-neutral-700"
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

        <AnimatePresence mode="wait">
          {habitsTab === "misiones" ? (
            <motion.div
              key="habits-misiones"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800"
            >
              <div className="space-y-2.5">
                {[
                  {
                    id: "q1",
                    title: "Registro emocional de hoy",
                    subtitle: "Selecciona tu estado en el Módulo de Perfil",
                    xp: "+15 XP",
                    done: quest1Done,
                    icon: Sun,
                    iconTone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                  },
                  {
                    id: "q2",
                    title: "Conversa con Near IA (Chat o Voz)",
                    subtitle: "Expresa cómo va tu día en el Módulo Principal",
                    xp: "+20 XP",
                    done: quest3Done,
                    icon: MessageSquareHeart,
                    iconTone: "bg-primary-tint text-primary",
                  },
                  {
                    id: "q3",
                    title: "Completa una Cápsula Preventiva",
                    subtitle: "Realiza 1 entrenamiento de 2 minutos",
                    xp: "+30 XP",
                    done: quest2Done,
                    icon: GraduationCap,
                    iconTone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                  },
                ].map((q) => {
                  const QuestIcon = q.icon;
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border border-b-[3px] p-3 transition-all",
                        q.done
                          ? "border-emerald-300 border-b-emerald-500 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/30"
                          : "border-border border-b-neutral-200 bg-background dark:border-b-neutral-800",
                      )}
                    >
                      <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", q.iconTone)}>
                        <QuestIcon className="size-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-xs font-bold text-heading">{q.title}</p>
                          <span className="text-[11px] font-extrabold text-primary">{q.xp}</span>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">{q.subtitle}</p>
                      </div>
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full border",
                          q.done
                            ? "border-emerald-600 bg-emerald-500 text-white"
                            : "border-border bg-surface-2 text-muted-foreground",
                        )}
                      >
                        {q.done && <Check className="size-3.5 stroke-[3]" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="habits-kit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Acordeón Plegable: Reflexión Preventiva del Día */}
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

      {/* Modal de Cápsula Interactiva */}
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
