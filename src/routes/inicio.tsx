import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  BookHeart,
  Bot,
  Check,
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
  Sprout,
  Sun,
  Target,
  UserCheck,
  WandSparkles,
  Waves,
  Wind,
  Zap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { AppScreen } from "@/components/near/AppScreen";
import { GardenWidget } from "@/components/near/GardenWidget";
import { InteractiveLessonModal } from "@/components/near/InteractiveLessonModal";
import { NearMark } from "@/components/near/Logo";
import { MoodChips } from "@/components/near/MoodChips";
import { NearActivityGuide } from "@/components/near/NearActivityGuide";
import {
  AcademicBalanceRadar,
  CompassionatePomodoroTool,
  ThoughtReframerTool,
} from "@/components/near/PreventiveToolsPack";
import { SosDialog } from "@/components/near/SosDialog";
import { StreakWidget } from "@/components/near/StreakWidget";
import { TactileEmotionUntangler } from "@/components/near/TactileEmotionUntangler";
import { UnifiedAiStage } from "@/components/near/UnifiedAiStage";
import { VentAndDissolveModal } from "@/components/near/VentAndDissolveModal";
import { useNear } from "@/context/NearContext";
import { WELLNESS_LESSONS, type InteractiveLesson } from "@/services/lessonsData";
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
    <AppScreen nav={false} emergency={false}>
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
type CapsulasSubTab = "ruta" | "radar";
type LabSubTab = "reencuadre" | "pomodoro" | "sensorial";
type PerfilSubTab = "misiones" | "racha";

const THEMATIC_MODULES: {
  id: ThematicModuleId;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  activeColor: string;
}[] = [
  {
    id: "ia",
    label: "Near",
    subtitle: "Tu refugio",
    icon: Bot,
    activeColor: "border-[#1C1917] bg-[#B85A3A] text-[#FFFDF9]",
  },
  {
    id: "capsulas",
    label: "Aprende",
    subtitle: "2 minutos",
    icon: GraduationCap,
    activeColor: "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]",
  },
  {
    id: "laboratorio",
    label: "Pausas",
    subtitle: "Claridad",
    icon: WandSparkles,
    activeColor: "border-[#1C1917] bg-[#C88A2B] text-[#FFFDF9]",
  },
  {
    id: "perfil",
    label: "Mi Jardín",
    subtitle: "Cuidado",
    icon: Sprout,
    activeColor: "border-[#1C1917] bg-[#2E5844] text-[#FFFDF9]",
  },
];

function Dashboard() {
  const { user, settings, xp, todayMood, completedLessons, messages, streak } = useNear();
  const [activeModule, setActiveModule] = useState<ThematicModuleId>("ia");
  const [capsulasSubTab, setCapsulasSubTab] = useState<CapsulasSubTab>("ruta");
  const [labSubTab, setLabSubTab] = useState<LabSubTab>("reencuadre");
  const [perfilSubTab, setPerfilSubTab] = useState<PerfilSubTab>("misiones");
  const [activeLesson, setActiveLesson] = useState<InteractiveLesson | null>(null);
  const [showVentModal, setShowVentModal] = useState(false);
  const [showUntanglerModal, setShowUntanglerModal] = useState(false);

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
    <div className="space-y-3.5 bg-sanctuary px-4 pt-3 pb-36">
      {/* =====================================================================
          1. ENCABEZADO SUPERIOR LIMPIO Y DESPEJADO
         ===================================================================== */}
      <header className="sticky top-2 z-30 flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-surface/95 px-3.5 py-2.5 shadow-xs backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-primary-tint">
            <NearMark className="size-5" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-sm font-extrabold tracking-tight text-heading">Near</span>
            <span className="text-[10px] font-medium text-muted-foreground">Apoyo Emocional</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cápsula Unificada de Progreso (Racha + XP) */}
          <button
            type="button"
            onClick={() => setActiveModule("perfil")}
            className="inline-flex items-center gap-2 rounded-xl border border-border/90 bg-surface-2/80 px-2.5 py-1 text-xs font-bold text-heading transition-colors hover:bg-surface-2"
            title="Ver progreso y racha"
          >
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
              <Flame className="size-3.5 fill-current" />
              <span>{streak}d</span>
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <Sprout className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{xp} XP</span>
            </span>
          </button>

          {/* Botón SOS Discreto y Claro */}
          <SosDialog
            trigger={
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                className="inline-flex items-center gap-1 rounded-xl bg-sos px-2.5 py-1 text-xs font-extrabold tracking-wide text-sos-foreground shadow-2xs transition-transform"
                title="Línea de emergencia y apoyo en crisis"
              >
                <ShieldAlert className="size-3.5" />
                <span>SOS</span>
              </motion.button>
            }
          />
        </div>
      </header>

      {/* =====================================================================
          2. VISTAS MODULARES LIMPIAS (Una sola actividad enfocada a la vez)
         ===================================================================== */}
      <AnimatePresence mode="wait">
        {/* -------------------------------------------------------------------
            MÓDULO 1: NEAR IA (ESPACIO DE ESCUCHA PURO Y EXPANDIDO)
           ------------------------------------------------------------------- */}
        {activeModule === "ia" && (
          <motion.div
            key="module-ia"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-0"
          >
            {/* Cabina Unificada de VoiceChat + Chat: El ÚNICO foco de la pantalla */}
            <UnifiedAiStage />
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            MÓDULO 2: CÁPSULAS DIDÁCTICAS & RADAR (Con Avatar Guía Near)
           ------------------------------------------------------------------- */}
        {activeModule === "capsulas" && (
          <motion.div
            key="module-capsulas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            {/* Avatar Guía Near explicando la actividad activa */}
            <NearActivityGuide
              title={capsulasSubTab === "ruta" ? "Near · Guía de Cápsulas" : "Near · Guía del Radar Escolar"}
              explanation={
                capsulasSubTab === "ruta"
                  ? `Aquí entrenamos habilidades preventivas en 2 minutos. Hoy te sugiero la Unidad ${recommendedLesson.unitNumber}: "${recommendedLesson.title}". ¡Tócala para que la hagamos juntos!`
                  : "En este radar evaluaremos cómo sientes tu descanso, entregas, enfoque y calma física para armar tu plan de equilibrio de hoy."
              }
            />

            {/* Sub-selector para no saturar la pantalla */}
            <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-b-[3px] border-border bg-surface-2/90 p-1.5">
              <button
                type="button"
                onClick={() => setCapsulasSubTab("ruta")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all",
                  capsulasSubTab === "ruta"
                    ? "border border-b-[3px] border-border bg-background text-heading shadow-2xs"
                    : "text-muted-foreground hover:text-heading",
                )}
              >
                <GraduationCap className="size-3.5 text-emerald-600" />
                <span>Cápsulas ({completedLessons.length}/5)</span>
              </button>
              <button
                type="button"
                onClick={() => setCapsulasSubTab("radar")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all",
                  capsulasSubTab === "radar"
                    ? "border border-b-[3px] border-border bg-background text-heading shadow-2xs"
                    : "text-muted-foreground hover:text-heading",
                )}
              >
                <Activity className="size-3.5 text-indigo-600" />
                <span>Radar de Balance</span>
              </button>
            </div>

            {capsulasSubTab === "ruta" ? (
              <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
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
                            ? "border-emerald-400 border-b-emerald-600 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30"
                            : isCompleted
                              ? "border-border bg-surface-2/60"
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
                              U{lesson.unitNumber} · {lesson.category}
                            </span>
                            {isCurrent && (
                              <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[9px] font-black text-white uppercase">
                                Sugerida
                              </span>
                            )}
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
            ) : (
              <AcademicBalanceRadar />
            )}
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            MÓDULO 3: LABORATORIO DE CALMA (Una sola actividad visible a la vez)
           ------------------------------------------------------------------- */}
        {activeModule === "laboratorio" && (
          <motion.div
            key="module-laboratorio"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            {/* Avatar Guía Near explicando la herramienta activa */}
            <NearActivityGuide
              title="Near · Guía de Laboratorio"
              explanation={
                labSubTab === "reencuadre"
                  ? "Elige o escribe una preocupación escolar que te esté dando vueltas. Yo te ayudaré a transformarla en una perspectiva preventiva y una micro-acción de 5 minutos."
                  : labSubTab === "pomodoro"
                    ? "Estudiar de corrido sin pausas agota tu memoria. Define una micro-meta pequeña y trabajemos 25 minutos con calma."
                    : "Elige una pausa sensorial guiada para relajar tu sistema nervioso en menos de 3 minutos."
              }
            />

            {/* Sub-selector de Herramienta para evitar saturación */}
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-b-[3px] border-border bg-surface-2/90 p-1.5">
              {[
                { id: "reencuadre" as const, label: "Reencuadre", icon: WandSparkles },
                { id: "pomodoro" as const, label: "Pomodoro", icon: Clock },
                { id: "sensorial" as const, label: "Sensorial", icon: Wind },
              ].map((t) => {
                const Icon = t.icon;
                const active = labSubTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLabSubTab(t.id)}
                    className={cn(
                      "flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all",
                      active
                        ? "border border-b-[3px] border-border bg-background text-heading shadow-2xs"
                        : "text-muted-foreground hover:text-heading",
                    )}
                  >
                    <Icon className={cn("size-3.5", active ? "text-indigo-600" : "text-muted-foreground")} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {labSubTab === "reencuadre" && <ThoughtReframerTool />}
            {labSubTab === "pomodoro" && <CompassionatePomodoroTool />}
            {labSubTab === "sensorial" && (
              <div className="grid grid-cols-1 gap-2.5">
                {/* 1. Desahogo Sin Filtro y Disolver */}
                <button
                  type="button"
                  onClick={() => setShowVentModal(true)}
                  className="flex items-center gap-3.5 rounded-3xl border-2 border-rose-300/35 bg-[#FFFDF9] p-4 text-left shadow-[0_3px_0_rgba(28,25,23,0.08)] transition-transform active:translate-y-0.5 dark:border-rose-500/25 dark:bg-[#262421]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
                    <Flame className="size-6" />
                  </span>
                  <div className="flex-1">
                    <span className="block font-display text-base font-bold text-heading">
                      Desahogo Sin Filtro & Disolver
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Escribe o dicta todo sin censura y desintégralo sin dejar rastro · +25 XP
                    </span>
                  </div>
                </button>

                {/* 2. El Desempaquetador Táctil */}
                <button
                  type="button"
                  onClick={() => setShowUntanglerModal(true)}
                  className="flex items-center gap-3.5 rounded-3xl border-2 border-indigo-300/35 bg-[#FFFDF9] p-4 text-left shadow-[0_3px_0_rgba(28,25,23,0.08)] transition-transform active:translate-y-0.5 dark:border-indigo-500/25 dark:bg-[#262421]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="size-6" />
                  </span>
                  <div className="flex-1">
                    <span className="block font-display text-base font-bold text-heading">
                      El Desempaquetador Táctil
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Cero texto: identifica qué tienes por cómo se siente en tu cuerpo · +20 XP
                    </span>
                  </div>
                </button>

                <Link
                  to="/respiracion"
                  className="flex items-center gap-3.5 rounded-3xl border-2 border-[#1C1917]/15 bg-[#FFFDF9] p-4 shadow-[0_3px_0_rgba(28,25,23,0.08)] transition-transform active:translate-y-0.5 dark:border-white/15 dark:bg-[#262421]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#284B3C] text-[#FFFDF9]">
                    <Wind className="size-6" />
                  </span>
                  <div className="flex-1">
                    <span className="block font-display text-base font-bold text-heading">Respiración Guiada 4-7-8</span>
                    <span className="block text-xs text-muted-foreground">
                      Inhala 4s, retén 7s, exhala 8s con vibración háptica y campana · +20 XP
                    </span>
                  </div>
                </Link>

                <Link
                  to="/sonidos"
                  className="flex items-center gap-3.5 rounded-3xl border-2 border-[#1C1917]/15 bg-[#FFFDF9] p-4 shadow-[0_3px_0_rgba(28,25,23,0.08)] transition-transform active:translate-y-0.5 dark:border-white/15 dark:bg-[#262421]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#B85A3A] text-[#FFFDF9]">
                    <Waves className="size-6" />
                  </span>
                  <div className="flex-1">
                    <span className="block font-display text-base font-bold text-heading">Paisajes Sonoros</span>
                    <span className="block text-xs text-muted-foreground">
                      Lluvia suave, olas, fogata y bosque sintetizados en tiempo real
                    </span>
                  </div>
                </Link>

                <Link
                  to="/bitacora"
                  className="flex items-center gap-3.5 rounded-3xl border-2 border-[#1C1917]/15 bg-[#FFFDF9] p-4 shadow-[0_3px_0_rgba(28,25,23,0.08)] transition-transform active:translate-y-0.5 dark:border-white/15 dark:bg-[#262421]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#C88A2B] text-[#FFFDF9]">
                    <BookHeart className="size-6" />
                  </span>
                  <div className="flex-1">
                    <span className="block font-display text-base font-bold text-heading">Mi Bitácora</span>
                    <span className="block text-xs text-muted-foreground">
                      Analítica semanal de estados de ánimo, detonantes y diario privado
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* -------------------------------------------------------------------
            MÓDULO 4: MI PERFIL UNIVERSITARIO (Con Avatar Guía Near)
           ------------------------------------------------------------------- */}
        {activeModule === "perfil" && (
          <motion.div
            key="module-perfil"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            {/* Avatar Guía Near explicando el progreso del estudiante */}
            <NearActivityGuide
              title="Near · Tu Progreso de Bienestar"
              explanation={`¡Vas en el Nivel ${level} con ${streak} días de racha y ${questsDoneCount} de 3 misiones cumplidas hoy! Cada pequeño hábito suma a tu tranquilidad en el semestre.`}
            />

            {/* Tarjeta Compacta de Pasaporte Universitario */}
            <div className="overflow-hidden rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div className="relative grid size-11 shrink-0 place-items-center rounded-2xl border border-b-[3px] border-secondary/30 border-b-secondary/60 bg-secondary-tint text-secondary">
                    {settings.anonymousMode ? <EyeOff className="size-5" /> : <GraduationCap className="size-5" />}
                    <span className="absolute -right-1 -bottom-1 grid size-4.5 place-items-center rounded-full border border-white bg-primary text-[9px] font-black text-primary-foreground">
                      {level}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h2 className="max-w-[140px] truncate font-display text-sm font-bold text-heading sm:max-w-[180px] sm:text-base">
                        {settings.anonymousMode ? "Estudiante (Anónimo)" : (user?.name ?? "Estudiante")}
                      </h2>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                        <SlidersHorizontal className="size-2.5 text-primary" /> IA {styleLabel}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{user?.major ?? "Ingeniería TIC"} · UTVT</p>
                  </div>
                </div>

                <Link
                  to="/perfil"
                  className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-border/90 bg-background px-2.5 py-1.5 text-xs font-bold text-heading hover:bg-surface-2"
                  title="Ajustes de perfil"
                >
                  <Settings2 className="size-3.5 text-primary" />
                  <span>Ajustes</span>
                </Link>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(10, levelProgress)}%` }}
                  />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                  <Award className="size-3.5" /> {levelProgress}/100 XP
                </span>
              </div>
            </div>

            {/* Jardín de Calma (Crecimiento de tu plantita en vez de solo números) */}
            <GardenWidget />

            {/* Sub-selector: Pausas de hoy vs Racha Semanal */}
            <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-b-[3px] border-border bg-surface-2/90 p-1.5">
              <button
                type="button"
                onClick={() => setPerfilSubTab("misiones")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all",
                  perfilSubTab === "misiones"
                    ? "border border-b-[3px] border-border bg-background text-heading shadow-2xs"
                    : "text-muted-foreground hover:text-heading",
                )}
              >
                <Gift className="size-3.5 text-emerald-600" />
                <span>Pausas de hoy ({questsDoneCount}/3)</span>
              </button>
              <button
                type="button"
                onClick={() => setPerfilSubTab("racha")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all",
                  perfilSubTab === "racha"
                    ? "border border-b-[3px] border-border bg-background text-heading shadow-2xs"
                    : "text-muted-foreground hover:text-heading",
                )}
              >
                <Flame className="size-3.5 text-amber-600" />
                <span>Racha de Calma ({streak}d)</span>
              </button>
            </div>

            {perfilSubTab === "misiones" ? (
              <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
                <div className="space-y-2.5">
                  {[
                    {
                      id: "q1",
                      title: "Registra tu ánimo de hoy",
                      subtitle: "Check-in emocional diario",
                      xp: "+15 XP",
                      done: quest1Done,
                      icon: Sun,
                      iconTone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                    },
                    {
                      id: "q2",
                      title: "Conversa con Near IA",
                      subtitle: "Usa el espacio de voz o texto",
                      xp: "+20 XP",
                      done: quest3Done,
                      icon: MessageSquareHeart,
                      iconTone: "bg-primary-tint text-primary",
                    },
                    {
                      id: "q3",
                      title: "Completa una Cápsula",
                      subtitle: "1 lección preventiva de 2 min",
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
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-bold text-heading">{q.title}</p>
                            <span className="shrink-0 whitespace-nowrap text-[11px] font-extrabold text-primary">{q.xp}</span>
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
            ) : (
              <StreakWidget />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          3. MENÚ DE NAVEGACIÓN FIJO ABAJO (Fixed Bottom Dock)
         ===================================================================== */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-3 pb-3 pb-safe">
        <nav
          aria-label="Módulos temáticos principales"
          className="pointer-events-auto grid grid-cols-4 gap-1.5 rounded-3xl border border-b-[4px] border-border/90 border-b-neutral-300 bg-surface/95 p-1.5 shadow-2xl backdrop-blur-2xl dark:border-b-neutral-800"
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
                  "flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 py-2 text-center transition-all",
                  isSelected
                    ? cn("border border-b-[3px] shadow-xs", mod.activeColor)
                    : "text-muted-foreground hover:bg-surface-2 hover:text-heading",
                )}
              >
                <Icon className={cn("size-4.5", isSelected && "stroke-[2.3]")} />
                <span className="block text-[11px] font-extrabold leading-tight">{mod.label}</span>
                <span className={cn("block text-[9px] leading-none", isSelected ? "opacity-90" : "opacity-70")}>
                  {mod.subtitle}
                </span>
              </button>
            );
          })}
        </nav>
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

      {/* Modales de Herramientas Táctiles Inmediatas */}
      <AnimatePresence>
        {showVentModal && (
          <VentAndDissolveModal
            isOpen={showVentModal}
            onClose={() => setShowVentModal(false)}
            onSeekPerspective={() => {
              setShowVentModal(false);
              setActiveModule("ia");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUntanglerModal && (
          <TactileEmotionUntangler
            isOpen={showUntanglerModal}
            onClose={() => setShowUntanglerModal(false)}
            onOpenChatWithTopic={() => {
              setShowUntanglerModal(false);
              setActiveModule("ia");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
