import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  BookOpen,
  BrainCircuit,
  ListTodo,
  MessageSquareHeart,
  Mic,
  MicOff,
  MoonStar,
  SendHorizontal,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
  Wind,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { NearMark } from "@/components/near/Logo";
import { NearFriendlyAvatar } from "@/components/near/NearFriendlyAvatar";
import { SafetyCard } from "@/components/near/SafetyCard";
import { useNear } from "@/context/NearContext";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { apiService } from "@/services/api";
import { generateReply } from "@/services/companion";
import { COMPANION_STYLES } from "@/services/mockData";
import { detectCrisis } from "@/services/safety";
import { cn } from "@/lib/utils";
import type { CompanionStyle } from "@/types";

type AiPhase = "idle" | "listening" | "thinking" | "speaking";

const QUICK_TOPICS = [
  { label: "Siento mucha presión por un examen", short: "Presión de examen", icon: BookOpen },
  { label: "Tengo bloqueo mental con mis entregas", short: "Bloqueo con tareas", icon: BrainCircuit },
  { label: "No puedo dormir por pensar en pendientes", short: "Ruido nocturno", icon: MoonStar },
  { label: "Ayúdame a organizar mi día paso a paso", short: "Organizar mi día", icon: ListTodo },
];

const STYLE_LABELS: Record<CompanionStyle, string> = {
  calido: "Cálido y Empático",
  directo: "Directo y Práctico",
  silencioso: "Escucha Serena",
};

export function UnifiedAiStage() {
  const {
    displayName,
    messages,
    addMessage,
    settings,
    updateSettings,
    todayMood,
    addXp,
    showPill,
  } = useNear();

  const [phase, setPhase] = useState<AiPhase>("idle");
  const [inputText, setInputText] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showTonePicker, setShowTonePicker] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [fullBubbleText, setFullBubbleText] = useState("");
  const [lastUserPrompt, setLastUserPrompt] = useState("");
  const [lastAction, setLastAction] = useState<"respiracion" | "sonidos" | undefined>(undefined);
  const [isCrisis, setIsCrisis] = useState(false);
  const [rewardedToday, setRewardedToday] = useState(false);

  const tts = useSpeechSynthesis(settings.voiceRate);
  const timersRef = useRef<number[]>([]);
  const streamIntervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    if (streamIntervalRef.current) {
      window.clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
  }, []);

  // Typewriter streaming simulation + voice wave simulation
  const simulateSpeakingResponse = useCallback(
    (replyText: string, action?: "respiracion" | "sonidos", autoSpeak = false) => {
      clearTimers();
      setFullBubbleText(replyText);
      setStreamedText("");
      setLastAction(action);
      setPhase("speaking");

      const words = replyText.split(" ");
      let idx = 0;

      streamIntervalRef.current = window.setInterval(() => {
        idx += 1;
        setStreamedText(words.slice(0, idx).join(" "));
        if (idx >= words.length) {
          if (streamIntervalRef.current) {
            window.clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
        }
      }, 48);

      if (autoSpeak && voiceEnabled) {
        const spoke = tts.speak(replyText, "unified-stage", () => setPhase("idle"));
        if (!spoke) {
          const duration = Math.min(6000, Math.max(2600, words.length * 65));
          timersRef.current.push(window.setTimeout(() => setPhase("idle"), duration));
        }
      } else {
        const duration = Math.min(5500, Math.max(2400, words.length * 60));
        timersRef.current.push(window.setTimeout(() => setPhase("idle"), duration));
      }
    },
    [clearTimers, tts, voiceEnabled],
  );

  // Initial welcome simulation on mount so the bubble feels alive immediately
  useEffect(() => {
    const lastNear = [...messages].reverse().find((m) => m.role === "near");
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) setLastUserPrompt(lastUser.text);

    const greeting =
      lastNear?.text ??
      `Hola${displayName ? `, ${displayName}` : ""}. Estoy activo en modo voz y texto. Cuéntame cómo va tu jornada o toca el núcleo para hablar conmigo.`;

    simulateSpeakingResponse(greeting, lastNear?.action, false);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React when user logs a mood
  useEffect(() => {
    if (!todayMood) return;
    const moodReplies: Record<string, string> = {
      calmado: "Siento tu calma. Aprovechemos esta claridad mental para mantener tu equilibrio hoy.",
      esperanzado: "¡Qué buena energía! Estoy aquí para acompañarte en tus metas del día.",
      cansado: "Noté que hoy te sientes con poca batería. Bajemos el ritmo, no tienes que forzarte.",
      ansioso: "Detecto tensión acumulada. Respira conmigo; podemos ordenar tus pendientes uno por uno.",
      abrumado: "Cuando todo se junta en la universidad, se vale pausar. Hablemos o respiremos 2 minutos.",
    };
    const msg = moodReplies[todayMood.mood];
    if (msg) {
      simulateSpeakingResponse(
        msg,
        todayMood.mood === "ansioso" || todayMood.mood === "abrumado" ? "respiracion" : undefined,
        false,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayMood?.mood]);

  const handleUnifiedSubmit = useCallback(
    async (rawText: string, viaVoice = false) => {
      const value = rawText.trim();
      if (!value || phase === "thinking") return;

      clearTimers();
      tts.cancel();
      setInputText("");
      setLastUserPrompt(value);
      addMessage({ role: "user", text: value });

      if (!rewardedToday) {
        setRewardedToday(true);
        addXp(20);
        showPill({
          emoji: "🎙️",
          title: "Sincronización con Near IA",
          subtitle: "+20 XP · Misión conversacional completada",
          tone: "primary",
        });
      }

      if (detectCrisis(value)) {
        setIsCrisis(true);
        setPhase("idle");
        addMessage({
          role: "near",
          text: "No estás solo/a. Tu bienestar es lo más importante en este momento.",
          kind: "safety",
        });
        return;
      }

      setIsCrisis(false);
      setPhase("thinking");
      setStreamedText("Procesando y estructurando respuesta empática…");

      try {
        const res = await apiService.sendMessage({
          content: value,
          style: settings.companionStyle,
        });
        if (res.crisisAlert) {
          setIsCrisis(true);
          setPhase("idle");
          addMessage({ role: "near", text: res.reply, kind: "safety" });
        } else {
          addMessage({
            role: "near",
            text: res.reply,
            action: res.action ?? undefined,
            suggestions: res.suggestions ?? undefined,
          });
          simulateSpeakingResponse(res.reply, res.action ?? undefined, viaVoice || voiceEnabled);
        }
      } catch {
        const fallback = generateReply(value, settings.companionStyle);
        addMessage({
          role: "near",
          text: fallback.text,
          action: fallback.action,
          suggestions: fallback.suggestions,
        });
        simulateSpeakingResponse(fallback.text, fallback.action, viaVoice || voiceEnabled);
      }
    },
    [
      addMessage,
      addXp,
      clearTimers,
      phase,
      rewardedToday,
      settings.companionStyle,
      showPill,
      simulateSpeakingResponse,
      tts,
      voiceEnabled,
    ],
  );

  const simulateVoiceCapture = useCallback(
    (customPhrase?: string) => {
      clearTimers();
      tts.cancel();
      const phrase =
        customPhrase ??
        QUICK_TOPICS[Math.floor(Math.random() * QUICK_TOPICS.length)]?.label ??
        "Necesito despejar mi mente un momento";

      setPhase("listening");
      setLastUserPrompt("");
      const words = phrase.split(" ");

      words.forEach((_, i) => {
        timersRef.current.push(
          window.setTimeout(() => {
            setLastUserPrompt(words.slice(0, i + 1).join(" "));
          }, 160 * (i + 1)),
        );
      });

      timersRef.current.push(
        window.setTimeout(() => {
          handleUnifiedSubmit(phrase, true);
        }, 160 * words.length + 450),
      );
    },
    [clearTimers, handleUnifiedSubmit, tts],
  );

  const stt = useSpeechRecognition({
    onFinal: (transcript) => handleUnifiedSubmit(transcript, true),
    onError: () => {
      toast("Modo simulación de voz activo", {
        description: "Capturando ejemplo de voz en vivo con Near IA.",
      });
      simulateVoiceCapture();
    },
  });

  const handleToggleVoiceBubble = () => {
    if (phase === "speaking") {
      tts.cancel();
      setPhase("idle");
      setStreamedText(fullBubbleText);
      return;
    }
    if (phase === "listening") {
      stt.stop();
      setPhase("idle");
      return;
    }
    if (phase === "thinking") return;

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([30, 50, 30]);
      } catch {
        // Ignore
      }
    }

    if (stt.supported && stt.start()) {
      setLastUserPrompt("");
      setPhase("listening");
    } else {
      simulateVoiceCapture();
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUnifiedSubmit(inputText, false);
  };

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-b-[5px] border-slate-700/80 border-b-slate-950 bg-gradient-to-b from-slate-900 via-[#182232] to-[#1E293B] p-4 text-white shadow-xl">
      {/* Ambient Reactive Background Glows */}
      <motion.div
        className="pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary-soft/25 blur-3xl"
        animate={{
          scale: phase === "speaking" ? [1, 1.25, 1] : phase === "listening" ? [1, 1.18, 1] : [0.95, 1.05, 0.95],
          opacity: phase === "speaking" ? [0.4, 0.75, 0.4] : [0.25, 0.45, 0.25],
        }}
        transition={{ duration: phase === "speaking" ? 1.4 : 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top Stage Header: Status + Voice/Tone Controls */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
          <span className="relative flex size-2">
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                phase === "listening"
                  ? "bg-sky-400"
                  : phase === "speaking"
                    ? "bg-amber-400"
                    : phase === "thinking"
                      ? "bg-violet-400"
                      : "bg-emerald-400",
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                phase === "listening"
                  ? "bg-sky-400"
                  : phase === "speaking"
                    ? "bg-amber-400"
                    : phase === "thinking"
                      ? "bg-violet-400"
                      : "bg-emerald-400",
              )}
            />
          </span>
          <span>
            {phase === "listening"
              ? "Escuchando tu voz…"
              : phase === "thinking"
                ? "Near está escribiendo…"
                : phase === "speaking"
                  ? "Near hablando en vivo…"
                  : "Near IA · Voz y Chat Unificados"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setVoiceEnabled((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-colors",
              voiceEnabled
                ? "border-amber-400/40 bg-amber-400/15 text-amber-200"
                : "border-white/15 bg-white/5 text-white/60",
            )}
            title={voiceEnabled ? "Respuesta por voz activada" : "Respuesta por voz silenciada"}
          >
            {voiceEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            <span>{voiceEnabled ? "Voz On" : "Mute"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTonePicker((s) => !s)}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90 hover:bg-white/20"
            title="Cambiar estilo de Near IA"
          >
            <SlidersHorizontal className="size-3 text-amber-300" />
            <span className="capitalize">{settings.companionStyle}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Tone Selector */}
      <AnimatePresence>
        {showTonePicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 overflow-hidden pt-2.5"
          >
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-white/15 bg-black/30 p-2 backdrop-blur-md">
              {COMPANION_STYLES.map((st) => {
                const active = settings.companionStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      updateSettings({ companionStyle: st.id });
                      setShowTonePicker(false);
                      toast.success(`Personalidad IA: ${st.label}`);
                    }}
                    className={cn(
                      "rounded-xl px-2.5 py-1.5 text-left transition-all",
                      active ? "bg-white text-slate-900 shadow-xs" : "text-white/75 hover:bg-white/10",
                    )}
                  >
                    <span className="block text-[11px] font-extrabold capitalize">{st.id}</span>
                    <span className="block truncate text-[9px] opacity-80">{STYLE_LABELS[st.id]}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          CENTERPIECE: LA BURBUJA VIVA DE VOICECHAT & CHAT CON PERSONALIDAD
         =================================================================== */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Outer Expanding Sonar Rings when Speaking or Listening */}
          {(phase === "speaking" || phase === "listening") &&
            [0, 1].map((idx) => (
              <motion.span
                key={idx}
                className={cn(
                  "pointer-events-none absolute size-32 rounded-full border-2",
                  phase === "listening" ? "border-sky-400/50" : "border-amber-400/50",
                )}
                initial={{ scale: 0.9, opacity: 0.75 }}
                animate={{ scale: 1.65, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, delay: idx * 0.85, ease: "easeOut" }}
              />
            ))}

          {/* Thinking Orbit Ring */}
          {phase === "thinking" && (
            <motion.span
              className="pointer-events-none absolute size-34 rounded-full border-2 border-dashed border-violet-400/70"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Main Interactive Friendly Near AI Character Button */}
          <button
            type="button"
            onClick={handleToggleVoiceBubble}
            className="group relative flex flex-col items-center justify-center rounded-3xl p-2 transition-transform active:scale-95"
            aria-label="Interactuar por voz con Near IA"
          >
            <NearFriendlyAvatar phase={phase} size="lg" />

            {/* Floating Mic Action Pill */}
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-extrabold text-amber-200 shadow-sm backdrop-blur-md transition-colors group-hover:bg-white/25">
              {phase === "listening" ? (
                <>
                  <MicOff className="size-3.5 text-sky-300" /> Escuchando tu voz… (Toca para detener)
                </>
              ) : phase === "speaking" ? (
                <>
                  <AudioLines className="size-3.5 text-amber-300" /> Near hablando… (Toca para pausar)
                </>
              ) : (
                <>
                  <Mic className="size-3.5 text-amber-300" /> Toca a Near para hablar por voz
                </>
              )}
            </span>
          </button>
        </div>

        {/* User's Last Spoken / Typed Line Pill */}
        <AnimatePresence>
          {(lastUserPrompt || stt.interim) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 max-w-[90%] rounded-2xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-center text-xs font-medium text-white/90 backdrop-blur-xs"
            >
              <span className="mr-1.5 text-[10px] font-extrabold uppercase text-amber-300">Tú:</span>
              “{phase === "listening" && stt.interim ? stt.interim : lastUserPrompt}”
            </motion.div>
          )}
        </AnimatePresence>

        {/* Near's Live Streaming Response Bubble (Voice + Text Unified!) */}
        <div className="mt-3 w-full">
          {isCrisis ? (
            <div className="text-left">
              <SafetyCard />
            </div>
          ) : (
            <div className="relative rounded-3xl border border-b-[4px] border-white/20 border-b-slate-950 bg-white/95 p-4 text-slate-900 shadow-lg">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#914A36]">
                  <NearMark className="size-4" />
                  {phase === "speaking"
                    ? "Near IA · Transmitiendo voz y texto…"
                    : phase === "thinking"
                      ? "Near IA · Escribiendo…"
                      : "Near IA · Respuesta activa"}
                </span>

                {fullBubbleText && phase !== "thinking" && (
                  <button
                    type="button"
                    onClick={() => simulateSpeakingResponse(fullBubbleText, lastAction, true)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                  >
                    <Volume2 className="size-3 text-[#914A36]" /> Repetir voz
                  </button>
                )}
              </div>

              <p className="font-display text-sm font-semibold leading-relaxed text-slate-800 sm:text-[15px]">
                {streamedText || "Estoy aquí contigo. Escribe o toca la burbuja de voz para conversar."}
                {(phase === "speaking" || phase === "thinking") && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 rounded-full bg-[#914A36]"
                  />
                )}
              </p>

              {/* Contextual Tool Action inside Bubble */}
              {lastAction && phase !== "thinking" && (
                <Link
                  to={lastAction === "respiracion" ? "/respiracion" : "/sonidos"}
                  className="mt-3 flex items-center justify-between rounded-2xl border border-b-[3px] border-amber-500/40 border-b-amber-700 bg-amber-50 px-3.5 py-2 text-xs font-extrabold text-amber-950 transition-transform active:translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    {lastAction === "respiracion" ? (
                      <Wind className="size-4 text-[#914A36]" />
                    ) : (
                      <Waves className="size-4 text-sky-600" />
                    )}
                    {lastAction === "respiracion"
                      ? "Abrir ejercicio de Respiración 4-7-8 recomendado"
                      : "Abrir Paisajes Sonoros de Calma"}
                  </span>
                  <span>→</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          UNIFIED VOICE + TEXT INPUT DOCK & QUICK SIMULATION CHIPS
         =================================================================== */}
      <div className="relative z-10 space-y-2.5">
        {/* Quick Topic Simulation Chips with Vector Icons */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {QUICK_TOPICS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.short}
                type="button"
                disabled={phase === "thinking"}
                onClick={() => handleUnifiedSubmit(t.label, false)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 transition-all hover:bg-white/20 active:scale-95 disabled:opacity-40"
              >
                <Icon className="size-3.5 text-amber-300" />
                <span>{t.short}</span>
              </button>
            );
          })}
        </div>

        {/* Unified Input Form (Speak or Write in the Exact Same Bar) */}
        <form onSubmit={onFormSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoiceBubble}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl border border-b-[3px] transition-all active:translate-y-0.5",
              phase === "listening"
                ? "border-sky-300 border-b-sky-700 bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "border-white/25 border-b-slate-950 bg-white/15 text-amber-300 hover:bg-white/25",
            )}
            title="Hablar por voz con Near IA"
            aria-label="Hablar por voz"
          >
            {phase === "listening" ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe aquí o toca el micrófono para hablar…"
            className="h-11 flex-1 rounded-2xl border border-b-[3px] border-white/20 border-b-slate-950 bg-white/12 px-3.5 text-xs font-medium text-white placeholder:text-white/55 focus:border-amber-300 focus:bg-white/18 focus:outline-none sm:text-sm"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || phase === "thinking"}
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-b-[3px] border-amber-400 border-b-[#693222] bg-gradient-to-br from-[#C86D51] to-[#914A36] text-white shadow-md transition-all active:translate-y-0.5 disabled:opacity-40"
            aria-label="Enviar mensaje"
          >
            <SendHorizontal className="size-4.5" />
          </button>
        </form>

        {/* Footer Links to Fullscreen Views if desired */}
        <div className="flex items-center justify-between px-1 pt-0.5 text-[11px] text-white/65">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="size-3 text-amber-300" /> Voz y texto sincronizados en vivo
          </span>
          <div className="flex items-center gap-3">
            <Link to="/chat" className="inline-flex items-center gap-1 font-bold text-amber-300 hover:underline">
              <MessageSquareHeart className="size-3" /> Historial completo ({messages.length})
            </Link>
            <Link to="/voz" className="inline-flex items-center gap-1 font-bold text-sky-300 hover:underline">
              <AudioLines className="size-3" /> Pantalla Voz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
