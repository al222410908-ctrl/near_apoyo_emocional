import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  BookHeart,
  Bot,
  Check,
  ChevronRight,
  Clock,
  Crown,
  EyeOff,
  Flame,
  Gift,
  GraduationCap,
  HeartHandshake,
  MessageSquareHeart,
  MoonStar,
  Play,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Sun,
  Target,
  UserCheck,
  WandSparkles,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { AppScreen } from "@/components/near/AppScreen";
import { InteractiveLessonModal } from "@/components/near/InteractiveLessonModal";
import { NearMark } from "@/components/near/Logo";
import { MoodChips } from "@/components/near/MoodChips";
import {
  AcademicBalanceRadar,
  CompassionatePomodoroTool,
  ThoughtReframerTool,
} from "@/components/near/PreventiveToolsPack";
import { SosDialog } from "@/components/near/SosDialog";
import { StreakWidget } from "@/components/near/StreakWidget";
import { UnifiedAiStage } from "@/components/near/UnifiedAiStage";
import { useNear } from "@/context/NearContext";
import { WELLNESS_LESSONS, type InteractiveLesson } from "@/services/lessonsData";
import { quoteOfTheDay } from "@/services/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Inicio · Near Apoyo Emocional" },
      {
        name: "description",
        content: "Centro unificado de Voice Chat y Chat con Near IA, cápsulas preventivas, radar escolar y laboratorio de calma.",
      },
      { property: "og:title", content: "Inicio · Near Apoyo Emocional" },
      {
        property: "og:description",
        content: "Centro unificado de Voice Chat y Chat con Near IA, cápsulas preventivas y laboratorio de calma.",
      },
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

type ThematicModuleId = "ia" | "capsulas" | "laboratorio" | "perfil";

const THEMATIC_MODULES: {
  id: ThematicModuleId;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  activeColor: string;
}[] = [
  {
    id: "ia",
    label: "Near IA",
    subtitle: "Voz y Chat",
    icon: Bot,
    activeColor: "border-primary border-b-[#693222] bg-clay text-primary-foreground",
  },
  {
    id: "capsulas",
    label: "Cápsulas",
    subtitle: "Ruta & Radar",
    icon: GraduationCap,
    activeColor: "border-emerald-600 border-b-emerald-800 bg-emerald-600 text-white",
  },
  {
    id: "laboratorio",
    label: "Laboratorio",
    subtitle: "Tools & Calma",
    icon: WandSparkles,
    activeColor: "border-indigo-600 border-b-indigo-800 bg-indigo-600 text-white",
  },
  {
    id: "perfil",
    label: "Mi Perfil",
    subtitle: "Nivel & Racha",
    icon: UserCheck,
    activeColor: "border-secondary border-b-slate-800 bg-secondary text-secondary-foreground",
  },
];

function Dashboard() {
  const { user, settings, xp, todayMood, completedLessons, messages, streak } = useNear();
  const [activeModule, setActiveModule] = useState<ThematicModuleId>("ia");
  const [activeLesson, setActiveLesson] = useState<InteractiveLesson | null>(null);

  const quote = quoteOfTheDay();
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
    <div className="space-y-4 bg-sanctuary px-4 pt-3 pb-4">
      {/* =====================================================================
          1. BARRA SUPERIOR ESTÁTICA (Sticky Header + Menú Didáctico de Módulos)
         ===================================================================== */}
      <div className="sticky top-2 z-30 space-y-2">
        <header className="flex items-center justify-between gap-2 rounded-2xl border border-b-[3px] border-border/90 border-b-neutral-300 bg-surface/95 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-b-neutral-800">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-primary-tint">
              <NearMark className="size-5" />
            </div>
            <div className="leading-none">
              <span className="block font-display text-sm font-extrabold tracking-tight text-heading">Near</span>
              <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">IA Preventiva</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveModule("perfil")}
              className="inline-flex items-center gap-1 rounded-xl border border-amber-300/90 bg-amber-50/90 px-2 py-1 text-[11px] font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              title="Ver Racha de Calma"
            >
              <Flame className="size-3.5 fill-amber-500 text-amber-600" />
              <span>{streak}d</span>
            </button>

            <motion.button
              type="button"
              key={xp}
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              onClick={() => setActiveModule("perfil")}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-300/90 bg-emerald-50/90 px-2 py-1 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
              title="Puntos de Bienestar (XP)"
            >
              <Sprout className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{xp} XP</span>
            </motion.button>

            <button
              type="button"
              onClick={() => setActiveModule("perfil")}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-2 py-1 text-[11px] font-bold text-heading"
              title={`Nivel ${level}`}
            >
              <Crown className="size-3.5 text-primary" />
              <span>Nv.{level}</span>
            </button>

            <SosDialog
              trigger={
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  className="inline-flex items-center gap-1 rounded-xl border border-b-[2px] border-rose-700 border-b-rose-900 bg-sos px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-sos-foreground shadow-2xs"
                >
                  <ShieldAlert className="size-3.5" />
                  <span>SOS</span>
                </motion.button>
              }
            />
          </div>
        </header>

        {/* MENÚ DIDÁCTICO POR MÓDULOS TEMÁTICOS (Estático al hacer scroll) */}
        <nav
          aria-label="Módulos temáticos de Near"
          className="grid grid-cols-4 gap-1.5 rounded-2xl border border-b-[3px] border-border/90 border-b-neutral-300 bg-surface/95 p-1.5 shadow-sm backdrop-blur-xl dark:border-b-neutral-800"
        >
          {THEMATIC_MODULES.map((mod) => {
            const isSelected = activeModule === mod.id;
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModule(mod.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-2 text-center transition-all",
                  isSelected
                    ? cn("border border-b-[3px] shadow-xs", mod.activeColor)
                    : "text-muted-foreground hover:bg-surface-2 hover:text-heading",
                )}
              >
                <Icon className={cn("size-4", isSelected && "stroke-[2.3]")} />
                <span className="block text-[11px] font-extrabold leading-tight">{mod.label}</span>
                <span className={cn("block text-[9px] leading-none", isSelected ? "opacity-90" : "opacity-70")}>
                  {mod.subtitle}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================================
          2. CONTENIDO DEL MÓDULO SELECCIONADO
         ===================================================================== */}
      <AnimatePresence mode="wait">
        {/* -------------------------------------------------------------------
            MÓDULO 1 (PRINCIPAL AL ABRIR): NEAR IA (VOICECHAT + CHAT UNIFICADO)
           ------------------------------------------------------------------- */}
        {activeModule === "ia" && (
          <motion.div
            key="module-ia"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {/* Escenario Unificado de VoiceChat + Chat con Simulación Viva */}
            <UnifiedAiStage />

            {/* Sincronizador de Estado Emocional con Iconos + Emojis */}
            <section className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
              <div className="mb-2.5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-sm font-bold text-heading">
                    Sincroniza tu estado emocional con Near IA
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Al seleccionar cómo te sientes, la burbuja de voz adapta su respuesta
                  </p>
                </div>
                <span className="rounded-lg bg-primary-tint px-2 py-0.5 text-[10px] font-bold text-primary">
                  +15 XP
                </span>
              </div>
              <MoodChips />
            </section>

            {/* Tarjeta Resumen de Accesos a los Otros Módulos Didácticos */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Mini Card -> Cápsula Sugerida */}
              <button
                type="button"
                onClick={() => setActiveLesson(recommendedLesson)}
                className="group flex flex-col justify-between gap-2.5 rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-3.5 text-left shadow-xs transition-all hover:border-emerald-400 active:translate-y-0.5 dark:border-b-neutral-800"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-xl border border-b-[2px] text-white",
                      recommendedLesson.palette.bg,
                      recommendedLesson.palette.border,
                      recommendedLesson.palette.lip,
                    )}
                  >
                    <RecommendedIcon className="size-4.5" />
                  </span>
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                    +{recommendedLesson.xpReward} XP
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-primary">
                    Cápsula Sugerida · {recommendedLesson.duration}
                  </span>
                  <h3 className="mt-0.5 line-clamp-1 font-display text-xs font-bold text-heading">
                    {recommendedLesson.title}
                  </h3>
                </div>
              </button>

              {/* Mini Card -> Laboratorio Preventivo */}
              <button
                type="button"
                onClick={() => setActiveModule("laboratorio")}
                className="group flex flex-col justify-between gap-2.5 rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-3.5 text-left shadow-xs transition-all hover:border-indigo-400 active:translate-y-0.5 dark:border-b-neutral-800"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl border border-b-[2px] border-indigo-600 bg-indigo-500 text-white">
                    <WandSparkles className="size-4.5" />
                  </span>
                  <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300">
                    Interactivo
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                    Laboratorio Mental
                  </span>
                  <h3 className="mt-0.5 line-clamp-1 font-display text-xs font-bold text-heading">
                    Reencuadre & Pomodoro 25/5
                  </h3>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            MÓDULO 2: CÁPSULAS DIDÁCTICAS & RADAR DE BALANCE ESCOLAR
           ------------------------------------------------------------------- */}
        {activeModule === "capsulas" && (
          <motion.div
            key="module-capsulas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {/* Cápsula Sugerida Destacada */}
            <div className="rounded-3xl border border-b-[4px] border-emerald-400/80 border-b-emerald-600 bg-surface p-4 shadow-xs dark:border-emerald-800 dark:border-b-emerald-950">
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
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300">
                    Cápsula Recomendada Hoy · +{recommendedLesson.xpReward} XP
                  </span>
                  <h3 className="mt-1 truncate font-display text-base font-bold text-heading">
                    U{recommendedLesson.unitNumber}: {recommendedLesson.title}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">{recommendedLesson.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveLesson(recommendedLesson)}
                className={cn(
                  "mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-b-[4px] py-2.5 text-xs font-extrabold tracking-wide text-white shadow-sm transition-all active:translate-y-0.5",
                  recommendedLesson.palette.bg,
                  recommendedLesson.palette.border,
                  recommendedLesson.palette.lip,
                )}
              >
                <Play className="size-3.5 fill-current" />
                <span>Iniciar Entrenamiento Interactivo ({recommendedLesson.duration})</span>
              </button>
            </div>

            {/* Ruta de 5 Unidades Temáticas Universitarias */}
            <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-heading">Ruta Preventiva Universitaria</h3>
                  <p className="text-xs text-muted-foreground">5 temáticas clave para proteger tu semestre</p>
                </div>
                <span className="rounded-xl bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {completedLessons.length}/{WELLNESS_LESSONS.length} listas
                </span>
              </div>

              <div className="space-y-2.5">
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
                        "group flex w-full items-center gap-3 rounded-2xl border border-b-[3px] p-3 text-left transition-all active:translate-y-0.5",
                        isCurrent
                          ? "border-primary/50 border-b-primary bg-primary-tint/20"
                          : isCompleted
                            ? "border-emerald-300/80 border-b-emerald-500 bg-emerald-50/40 dark:border-emerald-800/80 dark:bg-emerald-950/20"
                            : "border-border bg-background hover:bg-surface-2",
                      )}
                    >
                      <div
                        className={cn(
                          "relative grid size-11 shrink-0 place-items-center rounded-xl border border-b-[3px] text-white",
                          lesson.palette.bg,
                          lesson.palette.border,
                          lesson.palette.lip,
                        )}
                      >
                        <LessonIcon className="size-5" />
                        {isCompleted && (
                          <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full border border-white bg-amber-400 text-amber-950">
                            <Crown className="size-2.5 fill-current" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase text-muted-foreground">
                            Unidad {lesson.unitNumber} · {lesson.category}
                          </span>
                          <span className="text-[10px] font-bold text-primary">+{lesson.xpReward} XP</span>
                        </div>
                        <h4 className="truncate font-display text-sm font-bold text-heading">{lesson.title}</h4>
                        <p className="truncate text-xs text-muted-foreground">{lesson.subtitle}</p>
                      </div>

                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-xl border",
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-border bg-surface text-heading group-hover:bg-primary group-hover:text-primary-foreground",
                        )}
                      >
                        {isCompleted ? <Check className="size-4 stroke-[3]" /> : <Play className="size-3.5 fill-current" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NUEVO: Radar Interactivo de Balance Escolar */}
            <AcademicBalanceRadar />
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            MÓDULO 3: LABORATORIO DE CALMA (REENCUADRE, POMODORO, 4-7-8, SONIDOS)
           ------------------------------------------------------------------- */}
        {activeModule === "laboratorio" && (
          <motion.div
            key="module-laboratorio"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {/* Accesos Rápidos a Herramientas Sensoriales */}
            <div className="grid grid-cols-3 gap-2.5">
              <Link
                to="/respiracion"
                className="flex flex-col items-center gap-2 rounded-2xl border border-b-[4px] border-sky-300 border-b-sky-500 bg-sky-50/80 p-3 text-center transition-transform active:translate-y-0.5 dark:border-sky-800 dark:bg-sky-950/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-sky-500 text-white shadow-2xs">
                  <Wind className="size-5" />
                </span>
                <div>
                  <span className="block text-xs font-extrabold text-heading">Respirar 4-7-8</span>
                  <span className="block text-[10px] text-muted-foreground">Guía háptica</span>
                </div>
              </Link>

              <Link
                to="/sonidos"
                className="flex flex-col items-center gap-2 rounded-2xl border border-b-[4px] border-teal-300 border-b-teal-500 bg-teal-50/80 p-3 text-center transition-transform active:translate-y-0.5 dark:border-teal-800 dark:bg-teal-950/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-teal-600 text-white shadow-2xs">
                  <Waves className="size-5" />
                </span>
                <div>
                  <span className="block text-xs font-extrabold text-heading">Sonidos Zen</span>
                  <span className="block text-[10px] text-muted-foreground">Audio en vivo</span>
                </div>
              </Link>

              <Link
                to="/bitacora"
                className="flex flex-col items-center gap-2 rounded-2xl border border-b-[4px] border-violet-300 border-b-violet-500 bg-violet-50/80 p-3 text-center transition-transform active:translate-y-0.5 dark:border-violet-800 dark:bg-violet-950/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white shadow-2xs">
                  <BookHeart className="size-5" />
                </span>
                <div>
                  <span className="block text-xs font-extrabold text-heading">Mi Bitácora</span>
                  <span className="block text-[10px] text-muted-foreground">Gráficas y diario</span>
                </div>
              </Link>
            </div>

            {/* NUEVO: Transformador de Pensamientos Intrusivos */}
            <ThoughtReframerTool />

            {/* NUEVO: Temporizador Pomodoro Compasivo Anti-Burnout */}
            <CompassionatePomodoroTool />
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            MÓDULO 4: MI PERFIL UNIVERSITARIO, MISIONES Y RACHA
           ------------------------------------------------------------------- */}
        {activeModule === "perfil" && (
          <motion.div
            key="module-perfil"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {/* Pasaporte Universitario del Estudiante */}
            <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative grid size-14 shrink-0 place-items-center rounded-2xl border border-b-[3px] border-secondary/30 border-b-secondary/60 bg-secondary-tint text-secondary">
                    {settings.anonymousMode ? (
                      <EyeOff className="size-6" />
                    ) : (
                      <GraduationCap className="size-7" />
                    )}
                    <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border border-white bg-primary text-[10px] font-black text-primary-foreground">
                      {level}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-display text-lg font-bold text-heading">
                        {settings.anonymousMode ? "Estudiante (Anónimo)" : (user?.name ?? "Estudiante")}
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        <SlidersHorizontal className="size-2.5 text-primary" /> IA {styleLabel}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.major ?? "Ingeniería TIC"} · UTVT
                    </p>
                  </div>
                </div>

                <Link
                  to="/perfil"
                  className="inline-flex items-center gap-1 rounded-xl border border-b-[3px] border-border bg-background px-3 py-2 text-xs font-bold text-heading hover:bg-surface-2"
                >
                  <Settings2 className="size-3.5 text-primary" />
                  <span>Ajustes</span>
                </Link>
              </div>

              {/* Barra de Progreso de Nivel */}
              <div className="mt-4 rounded-2xl border border-border bg-background p-3">
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1 text-heading">
                    <Award className="size-4 text-primary" /> Nivel {level} · Bienestar Preventivo
                  </span>
                  <span className="text-primary">{levelProgress}/100 XP para Nivel {level + 1}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2 p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(10, levelProgress)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Misiones Diarias */}
            <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-heading">Misiones del Día</h3>
                  <p className="text-xs text-muted-foreground">Tus 3 micro-hábitos preventivos de hoy</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-xl border border-amber-300/80 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <Gift className="size-3.5 text-amber-600" /> {questsDoneCount}/3
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "q1",
                    title: "Sincroniza tu estado emocional",
                    subtitle: "Registra cómo te sientes hoy",
                    xp: "+15 XP",
                    done: quest1Done,
                    icon: Sun,
                    iconTone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                  },
                  {
                    id: "q2",
                    title: "Conversa con Near IA (Voz o Chat)",
                    subtitle: "Usa la burbuja interactiva principal",
                    xp: "+20 XP",
                    done: quest3Done,
                    icon: MessageSquareHeart,
                    iconTone: "bg-primary-tint text-primary",
                  },
                  {
                    id: "q3",
                    title: "Completa una Cápsula Preventiva",
                    subtitle: "Termina 1 entrenamiento en el módulo Cápsulas",
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
            </div>

            {/* Racha Semanal */}
            <StreakWidget />

            {/* Frase del Día */}
            <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary">
                <Sparkles className="size-3.5" /> Reflexión del Día
              </span>
              <p className="mt-1.5 font-display text-sm italic leading-relaxed text-heading">
                “{quote.text}”
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
