import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Bot,
  BrainCircuit,
  Crown,
  Flame,
  ListTodo,
  MessageSquareHeart,
  Mic,
  ShieldAlert,
  Sprout,
} from "lucide-react";
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
    return `Noté que hoy registraste ansiedad${n}. Hablemos por chat o voz para bajar el ritmo mental paso a paso.`;
  }
  if (mood === "abrumado") {
    return `Cuando se acumulan proyectos todo parece urgente${n}. Escríbeme o háblame y ordenamos juntos una sola prioridad.`;
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
  if (h >= 5 && h < 12) return `Buen día${n}. Soy Near, tu IA de acompañamiento preventivo. ¿Prefieres escribir o hablar por voz hoy?`;
  if (h >= 12 && h < 19) return `Buenas tardes${n}. Estoy activo por si necesitas despejar la mente entre clases o entregas.`;
  return `Buenas noches${n}. Es momento de soltar la carga académica; conversemos si traes algo en mente.`;
}

export function NearMascotHero() {
  const { displayName, streak, xp, todayMood, settings, addXp, showPill } = useNear();
  const [tipIndex, setTipIndex] = useState<number | null>(null);
  const [interactedToday, setInteractedToday] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const level = Math.floor(xp / 100) + 1;

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
    <div className="space-y-4">
      {/* Barra Superior Estática (Sticky HUD con Iconos Vectoriales) */}
      <header className="sticky top-2 z-30 flex items-center justify-between gap-2 rounded-2xl border border-b-[3px] border-border/90 border-b-neutral-300 bg-surface/90 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-b-neutral-800">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl bg-primary-tint">
            <NearMark className="size-5" />
          </div>
          <span className="font-display text-sm font-extrabold tracking-tight text-heading">Near</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Streak Pill */}
          <div
            className="inline-flex items-center gap-1 rounded-xl border border-amber-300/90 bg-amber-50/90 px-2 py-1 text-[11px] font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            title="Racha de Calma"
          >
            <Flame className="size-3.5 fill-amber-500 text-amber-600" />
            <span>{streak}d</span>
          </div>

          {/* XP Seeds Pill */}
          <motion.div
            key={xp}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1 rounded-xl border border-emerald-300/90 bg-emerald-50/90 px-2 py-1 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            title="Puntos de Bienestar (XP)"
          >
            <Sprout className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{xp} XP</span>
          </motion.div>

          {/* Level Pill */}
          <div
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-2 py-1 text-[11px] font-bold text-heading"
            title={`Nivel ${level}`}
          >
            <Crown className="size-3.5 text-primary" />
            <span>Nv.{level}</span>
          </div>

          {/* SOS Button */}
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

      {/* MÓDULO 1 (PRINCIPAL): Centro Conversacional Near IA (Chat & Voice Chat) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-primary uppercase">
            <Bot className="size-3.5" /> Módulo Principal · Acompañamiento IA
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">24/7 Confidencial</span>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-b-[5px] border-slate-700/80 border-b-slate-950 bg-gradient-to-br from-slate-900 via-[#1E293B] to-[#2C3E50] p-5 text-white shadow-xl">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-primary-soft/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 size-48 rounded-full bg-sky-400/20 blur-3xl" />

          {/* AI Presence Bar */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <span>Near IA · Modo {styleLabel}</span>
            </div>
            <span className="text-[11px] font-medium text-white/60">Toca el orbe para un consejo</span>
          </div>

          {/* Living AI Core Orb + Contextual Dialogue */}
          <div className="relative z-10 mt-3.5 flex items-center gap-3.5">
            <motion.button
              type="button"
              onClick={handlePulseOrb}
              animate={pulsing ? { scale: [1, 1.12, 0.96, 1.04, 1] } : { scale: [1, 1.04, 1] }}
              transition={pulsing ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="group relative grid size-18 shrink-0 place-items-center rounded-3xl border border-white/25 bg-white/10 shadow-inner backdrop-blur-md"
              aria-label="Sincronizar con Near IA"
            >
              <div className="absolute inset-1.5 rounded-2xl bg-sphere opacity-85 blur-xs transition-opacity group-hover:opacity-100" />
              <div className="relative grid size-13 place-items-center rounded-2xl bg-background/95 shadow-md">
                <NearMark className="size-8" />
              </div>
            </motion.button>

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-medium leading-relaxed text-white/95 sm:text-sm"
                >
                  “{activeMessage}”
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* 2 Tarjetas Principales de IA: Chat IA & Voice Chat */}
          <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
            {/* Tarjeta 1: Chat con Near IA */}
            <Link
              to="/chat"
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-b-[4px] border-amber-400/80 border-b-[#693222] bg-gradient-to-br from-[#C86D51] to-[#914A36] p-3.5 text-white shadow-md transition-all hover:brightness-105 active:translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl border border-white/25 bg-white/15 text-white shadow-2xs transition-transform group-hover:scale-105">
                  <MessageSquareHeart className="size-5" />
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold text-amber-100">
                  Texto <ArrowUpRight className="size-3" />
                </span>
              </div>
              <div>
                <span className="block font-display text-base font-extrabold leading-tight">Chat con IA</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-white/85">
                  Escribe y recibe apoyo estructurado
                </span>
              </div>
            </Link>

            {/* Tarjeta 2: Voice Chat con Near IA */}
            <Link
              to="/voz"
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-b-[4px] border-sky-400/40 border-b-slate-950 bg-gradient-to-br from-sky-500/25 via-indigo-500/25 to-slate-800/90 p-3.5 text-white backdrop-blur-md transition-all hover:bg-white/20 active:translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl border border-sky-300/30 bg-sky-400/20 text-sky-300 shadow-2xs transition-transform group-hover:scale-105">
                  <AudioLines className="size-5" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold text-sky-200">
                  <Mic className="size-2.5" /> Voz
                </span>
              </div>
              <div>
                <span className="block font-display text-base font-extrabold leading-tight">Voice Chat</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-white/80">
                  Diálogo hablado en tiempo real
                </span>
              </div>
            </Link>
          </div>

          {/* Accesos Rápidos de Tema con Iconos Vectoriales */}
          <div className="relative z-10 mt-3.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {[
              { label: "Presión por exámenes", icon: BookOpen },
              { label: "Despejar la mente", icon: BrainCircuit },
              { label: "Organizar mi día", icon: ListTodo },
            ].map((topic) => {
              const TopicIcon = topic.icon;
              return (
                <Link
                  key={topic.label}
                  to="/chat"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 transition-colors hover:bg-white/20"
                >
                  <TopicIcon className="size-3.5 text-amber-300" />
                  <span>{topic.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
