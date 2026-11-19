import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Crown, Flame, MessageCircleHeart, Sparkles, Sprout } from "lucide-react";
import { useState } from "react";
import { NearMark } from "@/components/near/Logo";
import { SosDialog } from "@/components/near/SosDialog";
import { useNear } from "@/context/NearContext";
import type { MoodId } from "@/types";

const AI_INSIGHTS = [
  "Estoy listo para escucharte por texto o voz. Si sientes saturación por entregas, podemos dividir tu día en pasos simples.",
  "Recuerda: exhalar más lento de lo que inhalas reduce la activación fisiológica del estrés en menos de 90 segundos.",
  "Tu rendimiento académico depende de tu descanso. Hacer una pausa preventiva a tiempo protege tu enfoque.",
  "Puedes cambiar mi estilo de acompañamiento (Cálido, Directo o Silencioso) en cualquier momento según lo que necesites hoy.",
];

function getContextualAiGreeting(name: string, mood?: MoodId) {
  const n = name ? `, ${name}` : "";
  if (mood === "ansioso") {
    return `Noté que hoy registraste ansiedad${n}. Hablemos un momento o hagamos una pausa guiada para bajar el ritmo mental.`;
  }
  if (mood === "abrumado") {
    return `Cuando se acumulan proyectos todo parece urgente${n}. Si quieres, escríbeme y ordenamos juntos una sola prioridad.`;
  }
  if (mood === "cansado") {
    return `Hoy tu energía está baja${n}. No te exijas de más; estoy aquí si necesitas desahogarte sin filtros.`;
  }
  if (mood === "esperanzado") {
    return `Qué gusto ver que hoy te sientes con ánimo${n}. Aprovechemos esa claridad para fortalecer tu racha.`;
  }
  if (mood === "calmado") {
    return `Excelente equilibrio hoy${n}. Mantengamos esa serenidad durante el resto de tus actividades.`;
  }

  const h = new Date().getHours();
  if (h >= 5 && h < 12) return `Buen día${n}. Soy Near, tu IA de acompañamiento preventivo. ¿Cómo arrancamos tu jornada hoy?`;
  if (h >= 12 && h < 19) return `Buenas tardes${n}. Estoy activo por si necesitas despejar la mente entre clases o entregas.`;
  return `Buenas noches${n}. Es momento de soltar la carga académica; conversemos si traes algo en mente.`;
}

export function NearMascotHero() {
  const { displayName, streak, xp, todayMood, settings, addXp, showPill } = useNear();
  const [tipIndex, setTipIndex] = useState<number | null>(null);
  const [interactedToday, setInteractedToday] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  const handlePulseOrb = () => {
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 600);
    setTipIndex((prev) => (prev === null ? 0 : (prev + 1) % AI_INSIGHTS.length));

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // Ignore
      }
    }

    if (!interactedToday) {
      setInteractedToday(true);
      addXp(5);
      showPill({
        emoji: "✨",
        title: "Sincronizado con Near IA",
        subtitle: "+5 XP de Bienestar Preventivo",
        tone: "primary",
      });
    }
  };

  const activeMessage = tipIndex !== null ? AI_INSIGHTS[tipIndex] : getContextualAiGreeting(displayName, todayMood?.mood);
  const styleLabel =
    settings.companionStyle === "calido"
      ? "Cálido"
      : settings.companionStyle === "directo"
        ? "Directo"
        : "Silencioso";

  return (
    <div className="space-y-3.5">
      {/* Top Mature Gamified HUD Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Streak Pill */}
          <motion.div
            whileHover={{ y: -1 }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-b-[3px] border-amber-300/90 border-b-amber-500 bg-amber-50/90 px-2.5 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:border-b-amber-950 dark:bg-amber-950/60 dark:text-amber-300"
            title="Racha de Calma"
          >
            <Flame className="size-3.5 fill-amber-500 text-amber-600" />
            <span>{streak}d</span>
          </motion.div>

          {/* XP Seeds Pill */}
          <motion.div
            key={xp}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-b-[3px] border-emerald-300/90 border-b-emerald-500 bg-emerald-50/90 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:border-b-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300"
            title="Puntos de Bienestar (XP)"
          >
            <Sprout className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{xp} XP</span>
          </motion.div>

          {/* Level Pill */}
          <div
            className="inline-flex items-center gap-1 rounded-xl border border-b-[3px] border-slate-300 border-b-slate-400 bg-surface px-2.5 py-1 text-xs font-bold text-heading dark:border-slate-700 dark:border-b-slate-900"
            title={`Nivel ${level} (${levelProgress}/100 XP)`}
          >
            <Crown className="size-3.5 text-primary" />
            <span>Nv. {level}</span>
          </div>
        </div>

        {/* SOS Button */}
        <SosDialog
          trigger={
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              className="rounded-xl border border-b-[3px] border-rose-700 border-b-rose-900 bg-sos px-3 py-1 text-xs font-extrabold tracking-wider text-sos-foreground shadow-xs transition-all active:translate-y-0.5"
            >
              SOS
            </motion.button>
          }
        />
      </div>

      {/* Protagonist AI Companion Hub Card */}
      <section className="relative overflow-hidden rounded-[28px] border border-b-[5px] border-slate-700/80 border-b-slate-950 bg-gradient-to-br from-slate-900 via-[#1E293B] to-[#2C3E50] p-5 text-white shadow-xl">
        {/* Sophisticated Ambient Glows */}
        <div className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-primary-soft/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 size-48 rounded-full bg-sky-400/20 blur-3xl" />

        {/* AI Header Status */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span>Near IA · Modo {styleLabel}</span>
          </div>

          <span className="text-[11px] font-semibold text-white/60">
            Nv. {level} · {levelProgress}%
          </span>
        </div>

        {/* Living AI Core Orb + Contextual Dialogue */}
        <div className="relative z-10 mt-4 flex items-center gap-4">
          <motion.button
            type="button"
            onClick={handlePulseOrb}
            animate={
              pulsing
                ? { scale: [1, 1.12, 0.96, 1.04, 1] }
                : { scale: [1, 1.04, 1] }
            }
            transition={
              pulsing
                ? { duration: 0.5 }
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
            className="group relative grid size-20 shrink-0 place-items-center rounded-3xl border border-white/25 bg-white/10 shadow-inner backdrop-blur-md"
            aria-label="Sincronizar con Near IA"
            title="Toca el núcleo de Near para otro consejo preventivo"
          >
            <div className="absolute inset-1.5 rounded-2xl bg-sphere opacity-85 blur-xs transition-opacity group-hover:opacity-100" />
            <div className="relative grid size-14 place-items-center rounded-2xl bg-background/95 shadow-md">
              <NearMark className="size-9" />
            </div>
            <span className="absolute -bottom-1.5 rounded-full border border-white/20 bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 uppercase">
              IA Viva
            </span>
          </motion.button>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-medium leading-relaxed text-white/95"
              >
                “{activeMessage}”
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Primary AI Action Buttons (Chat IA & Voice IA first!) */}
        <div className="relative z-10 mt-5 grid grid-cols-2 gap-2.5">
          <Link
            to="/chat"
            className="group flex items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-amber-400/90 border-b-amber-700 bg-gradient-to-r from-[#C86D51] to-[#914A36] px-4 py-3 text-xs font-extrabold tracking-wide text-white shadow-md transition-all hover:brightness-110 active:translate-y-0.5 active:border-b-2"
          >
            <MessageCircleHeart className="size-4.5 shrink-0 transition-transform group-hover:scale-110" />
            <span>Chat con Near IA</span>
          </Link>

          <Link
            to="/voz"
            className="group flex items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-white/25 border-b-slate-950 bg-white/12 px-4 py-3 text-xs font-extrabold tracking-wide text-white backdrop-blur-md transition-all hover:bg-white/20 active:translate-y-0.5 active:border-b-2"
          >
            <AudioLines className="size-4.5 shrink-0 text-sky-300 transition-transform group-hover:scale-110" />
            <span>Hablar por Voz</span>
          </Link>
        </div>

        {/* Quick-Start AI Topic Prompts */}
        <div className="relative z-10 mt-3.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="shrink-0 text-[10px] font-bold text-white/55 uppercase">
            Iniciar con:
          </span>
          {[
            "Presión por exámenes",
            "Necesito despejarme",
            "Organizar mi día",
          ].map((topic) => (
            <Link
              key={topic}
              to="/chat"
              className="shrink-0 rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[11px] font-medium text-white/85 transition-colors hover:bg-white/20"
            >
              <Sparkles className="mr-1 inline size-2.5 text-amber-300" />
              {topic}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
