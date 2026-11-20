import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  Eye,
  EyeOff,
  ListTodo,
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
import { NearFriendlyAvatar } from "@/components/near/NearFriendlyAvatar";
import { SafetyCard } from "@/components/near/SafetyCard";
import { useNear } from "@/context/NearContext";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { apiService } from "@/services/api";
import { generateReply } from "@/services/companion";
import { AVATAR_STYLES, COMPANION_STYLES } from "@/services/mockData";
import { detectCrisis } from "@/services/safety";
import { cn } from "@/lib/utils";
import type { CompanionStyle } from "@/types";

type AiPhase = "idle" | "listening" | "thinking" | "speaking";

const QUICK_TOPICS = [
  { label: "Siento mucha presión por un examen", short: "Presión de examen", icon: BookOpen },
  { label: "Tengo bloqueo mental con mis entregas", short: "Bloqueo con tareas", icon: BrainCircuit },
  { label: "No puedo dormir por pensar en pendientes", short: "Insomnio escolar", icon: MoonStar },
  { label: "Ayúdame a ordenar mi día paso a paso", short: "Ordenar mi día", icon: ListTodo },
];

const STYLE_LABELS: Record<CompanionStyle, string> = {
  calido: "Cálido y cercano",
  directo: "Directo y práctico",
  silencioso: "Escucha breve",
};

export function UnifiedAiStage() {
  const {
    displayName,
    messages,
    addMessage,
    settings,
    updateSettings,
    todayMood,
    logMood,
    addXp,
    showPill,
  } = useNear();

  const [phase, setPhase] = useState<AiPhase>("idle");
  const [inputText, setInputText] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showTonePicker, setShowTonePicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
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
      }, 42);

      if (autoSpeak && voiceEnabled) {
        const spoke = tts.speak(replyText, "unified-stage", () => setPhase("idle"));
        if (!spoke) {
          const duration = Math.min(5500, Math.max(2400, words.length * 60));
          timersRef.current.push(window.setTimeout(() => setPhase("idle"), duration));
        }
      } else {
        const duration = Math.min(5000, Math.max(2200, words.length * 55));
        timersRef.current.push(window.setTimeout(() => setPhase("idle"), duration));
      }
    },
    [clearTimers, tts, voiceEnabled],
  );

  useEffect(() => {
    const lastNear = [...messages].reverse().find((m) => m.role === "near");
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) setLastUserPrompt(lastUser.text);

    const greeting =
      lastNear?.text ??
      `Hola${displayName ? `, ${displayName}` : ""}. Este es tu espacio privado. Puedes hablarme en voz alta o escribir lo que traes en mente.`;

    simulateSpeakingResponse(greeting, lastNear?.action, false);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!todayMood) return;
    const moodReplies: Record<string, string> = {
      calmado: "Qué bueno que hoy sientes calma. Aprovechemos esa claridad para avanzar a tu propio ritmo.",
      esperanzado: "Se siente buen ánimo hoy. Estoy aquí para acompañarte en tus metas y pendientes.",
      cansado: "Se nota que la carga ha estado pesada. Vamos despacio, hoy no tienes que forzarte.",
      ansioso: "Cuando se junta la presión escolar es normal sentir tensión en el pecho. Ordenemos un solo pendiente a la vez.",
      abrumado: "Si todo parece urgente ahora mismo, hagamos una pausa de un minuto para despejar el ruido mental.",
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
          emoji: "🌿",
          title: "Espacio de escucha",
          subtitle: "+20 XP por expresar lo que sientes",
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
      setStreamedText("Te escucho y ordeno ideas contigo…");

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
        "Necesito despejar mi mente de tantos pendientes";

      setPhase("listening");
      setLastUserPrompt("");
      const words = phrase.split(" ");

      words.forEach((_, i) => {
        timersRef.current.push(
          window.setTimeout(() => {
            setLastUserPrompt(words.slice(0, i + 1).join(" "));
          }, 150 * (i + 1)),
        );
      });

      timersRef.current.push(
        window.setTimeout(() => {
          handleUnifiedSubmit(phrase, true);
        }, 150 * words.length + 400),
      );
    },
    [clearTimers, handleUnifiedSubmit, tts],
  );

  const stt = useSpeechRecognition({
    onFinal: (transcript) => handleUnifiedSubmit(transcript, true),
    onError: () => {
      toast("Modo voz asistido", {
        description: "Capturando mensaje para Near.",
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
        navigator.vibrate([25, 40, 25]);
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
    <section className="relative flex min-h-[72vh] flex-col justify-between overflow-hidden rounded-[32px] border border-[#1C1917]/10 bg-gradient-to-b from-[#F9F6F0] via-[#F4EFE6] to-[#EFEAE0] p-5 text-[#1C1917] shadow-sm dark:border-white/10 dark:from-[#24211E] dark:via-[#1E1C1A] dark:to-[#171514] dark:text-[#F4EFE6]">
      {/* 1. Barra de Herramientas Superior: Muy sutil y despejada */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1917]/8 bg-[#FFFDF9]/90 px-3 py-1 text-[11px] font-semibold text-[#5C5248] backdrop-blur-md dark:border-white/10 dark:bg-[#2A2724]/90 dark:text-white/80">
          <span
            className={cn(
              "size-2 rounded-full transition-colors",
              phase === "listening"
                ? "animate-pulse bg-[#284B3C]"
                : phase === "speaking"
                  ? "animate-pulse bg-[#B85A3A]"
                  : "bg-emerald-600",
            )}
          />
          <span className="tracking-wide">
            {phase === "listening"
              ? "Escuchándote…"
              : phase === "speaking"
                ? "Near respondiendo"
                : phase === "thinking"
                  ? "Reflexionando…"
                  : "Espacio de Escucha"}
          </span>
        </div>

        {/* Controles discretos */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setVoiceEnabled((v) => !v)}
            className={cn(
              "grid size-8 place-items-center rounded-xl border transition-colors",
              voiceEnabled
                ? "border-[#284B3C]/20 bg-[#284B3C]/10 text-[#284B3C] dark:bg-emerald-950/50 dark:text-emerald-300"
                : "border-[#1C1917]/8 bg-[#FFFDF9] text-[#5C5248]/60 dark:border-white/10 dark:bg-[#2A2724]",
            )}
            title={voiceEnabled ? "Voz activada" : "Modo lectura (silencio)"}
          >
            {voiceEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAvatarPicker((a) => !a);
              setShowTonePicker(false);
            }}
            className={cn(
              "grid size-8 place-items-center rounded-xl border border-[#1C1917]/8 bg-[#FFFDF9] text-[#5C5248] transition-colors hover:text-[#1C1917] dark:border-white/10 dark:bg-[#2A2724] dark:text-white/80",
              showAvatarPicker && "border-[#1C1917]/25 bg-[#EFEAE0]",
            )}
            title="Ajustar o cambiar avatar"
          >
            {settings.avatarId === "oculto" ? (
              <EyeOff className="size-3.5 opacity-60" />
            ) : (
              <Sparkles className="size-3.5 text-[#B85A3A]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowTonePicker((s) => !s);
              setShowAvatarPicker(false);
            }}
            className={cn(
              "grid size-8 place-items-center rounded-xl border border-[#1C1917]/8 bg-[#FFFDF9] text-[#5C5248] transition-colors hover:text-[#1C1917] dark:border-white/10 dark:bg-[#2A2724] dark:text-white/80",
              showTonePicker && "border-[#1C1917]/25 bg-[#EFEAE0]",
            )}
            title={`Tono actual: ${settings.companionStyle}`}
          >
            <SlidersHorizontal className="size-3.5 text-[#284B3C] dark:text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Check-in de Ánimo Sutil (Solo si aún no se registró hoy) */}
      {!todayMood && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-emerald-600/15 bg-emerald-50/70 px-3.5 py-2 text-xs backdrop-blur-sm dark:border-emerald-500/20 dark:bg-emerald-950/40"
        >
          <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
            <span className="text-xs">🌱</span>
            <span className="font-semibold text-[11px]">¿Cómo llegas a la uni?</span>
          </div>
          <div className="flex items-center gap-1">
            {(
              [
                { id: "calmado", label: "Paz", emoji: "☀️" },
                { id: "ansioso", label: "Tensión", emoji: "⚡" },
                { id: "cansado", label: "Fatiga", emoji: "🌙" },
                { id: "esperanzado", label: "Ánimo", emoji: "✨" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  logMood(m.id);
                  addXp(15);
                  showPill({
                    emoji: m.emoji,
                    title: "Ánimo registrado",
                    subtitle: "+15 XP en tu progreso",
                    tone: "primary",
                  });
                }}
                className="rounded-lg border border-emerald-700/15 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-emerald-900 shadow-2xs transition-all hover:bg-white active:scale-95 dark:bg-emerald-900/60 dark:text-emerald-100"
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selector de Avatar Desplegable */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2"
          >
            <div className="rounded-2xl border border-[#1C1917]/10 bg-[#FFFDF9] p-3 shadow-sm dark:border-white/10 dark:bg-[#2A2724]">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[10px] font-bold tracking-wider text-[#5C5248] uppercase dark:text-white/70">
                  Elige tu acompañante o modera su visibilidad:
                </span>
                <span className="text-[10px] font-bold text-[#284B3C] dark:text-emerald-400">Personalizable</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {AVATAR_STYLES.map((av) => {
                  const active = (settings.avatarId ?? "brote") === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        updateSettings({ avatarId: av.id });
                        setShowAvatarPicker(false);
                        toast.success(
                          av.id === "oculto" ? "Modo minimalista activado" : `Acompañante: ${av.label}`,
                        );
                      }}
                      className={cn(
                        "flex flex-col items-center justify-between gap-1 rounded-xl border p-2 text-center transition-all",
                        active
                          ? "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]"
                          : "border-[#1C1917]/8 bg-[#F4EFE6]/50 text-[#1C1917] hover:bg-[#F4EFE6] dark:border-white/10 dark:bg-white/5 dark:text-[#F4EFE6]",
                      )}
                    >
                      <div className="grid h-8 place-items-center">
                        {av.id === "oculto" ? (
                          <span className="grid size-7 place-items-center rounded-full border border-dashed border-current/40">
                            <EyeOff className="size-3.5" />
                          </span>
                        ) : (
                          <NearFriendlyAvatar variant={av.id} size="xs" showWavePill={false} />
                        )}
                      </div>
                      <span className="block text-[10px] font-bold leading-tight">{av.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selector de Tono Desplegable */}
      <AnimatePresence>
        {showTonePicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2"
          >
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-[#1C1917]/10 bg-[#FFFDF9] p-2.5 shadow-sm dark:border-white/10 dark:bg-[#2A2724]">
              {COMPANION_STYLES.map((st) => {
                const active = settings.companionStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      updateSettings({ companionStyle: st.id });
                      setShowTonePicker(false);
                      toast.success(`Estilo: ${st.label}`);
                    }}
                    className={cn(
                      "rounded-xl px-2.5 py-2 text-left transition-all",
                      active
                        ? "bg-[#284B3C] text-[#FFFDF9]"
                        : "text-[#1C1917] hover:bg-[#F4EFE6] dark:text-[#F4EFE6] dark:hover:bg-white/10",
                    )}
                  >
                    <span className="block text-[11px] font-bold capitalize">{st.id}</span>
                    <span className="block truncate text-[9px] opacity-80">{STYLE_LABELS[st.id]}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ÁREA CENTRAL: AVATAR COMO HÉROE CON ESPACIO GENEROSO Y DIÁLOGO CALMADO */}
      <div className="my-auto flex flex-col items-center justify-center py-4">
        {settings.avatarId === "oculto" ? (
          <div className="flex w-full items-center justify-between rounded-2xl border border-[#1C1917]/10 bg-[#FFFDF9]/90 px-4 py-2.5 dark:border-white/10 dark:bg-[#2A2724]">
            <button
              type="button"
              onClick={handleToggleVoiceBubble}
              className="inline-flex items-center gap-2.5 text-xs font-semibold text-[#1C1917] dark:text-[#F4EFE6]"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-[#284B3C] text-[#FFFDF9]">
                <Mic className="size-3.5" />
              </span>
              <span>
                {phase === "listening"
                  ? "Escuchándote… Toca para enviar"
                  : phase === "speaking"
                    ? "Hablando… Toca para pausar"
                    : "Toca el micro para hablar por voz"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ avatarId: "brote" })}
              className="inline-flex items-center gap-1 rounded-lg border border-[#1C1917]/10 px-2 py-1 text-[10px] font-bold text-[#5C5248] hover:text-[#1C1917] dark:border-white/10 dark:text-white/70"
            >
              <Eye className="size-3" /> Ver avatar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggleVoiceBubble}
            className="group relative flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
            aria-label="Hablar o pausar voz con Near"
          >
            <NearFriendlyAvatar phase={phase} size="lg" />
          </button>
        )}

        {/* Lo que dijo el estudiante (si aplica) */}
        <AnimatePresence>
          {(lastUserPrompt || stt.interim) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 max-w-[90%] rounded-full border border-[#1C1917]/8 bg-[#FFFDF9]/90 px-4 py-1.5 text-center text-xs font-medium text-[#5C5248] shadow-2xs backdrop-blur-sm dark:border-white/10 dark:bg-[#2A2724]/90 dark:text-white/80"
            >
              “{phase === "listening" && stt.interim ? stt.interim : lastUserPrompt}”
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarjeta de Diálogo Sereno */}
        <div className="mt-4 w-full">
          {isCrisis ? (
            <div className="text-left">
              <SafetyCard />
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#1C1917]/10 bg-[#FFFDF9]/95 p-5 text-[#1C1917] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#2A2724]/95 dark:text-[#F4EFE6]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider text-[#B85A3A] uppercase">
                  Near · Espacio Seguro
                </span>

                {fullBubbleText && phase !== "thinking" && (
                  <button
                    type="button"
                    onClick={() => simulateSpeakingResponse(fullBubbleText, lastAction, true)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#1C1917]/8 bg-[#F4EFE6]/70 px-2.5 py-0.5 text-[10px] font-bold text-[#5C5248] hover:bg-[#EAE4D7] dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                  >
                    <Volume2 className="size-3 text-[#B85A3A]" /> Escuchar voz
                  </button>
                )}
              </div>

              <p className="font-display text-[15px] font-medium leading-relaxed text-[#2A2724] sm:text-base dark:text-[#F4EFE6]">
                {streamedText || "Cuéntame cómo va tu día o qué pendiente te tiene con la cabeza pesada."}
                {(phase === "speaking" || phase === "thinking") && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-1 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-[#B85A3A]"
                  />
                )}
              </p>

              {lastAction && phase !== "thinking" && (
                <div className="mt-3.5 pt-2">
                  <a
                    href={lastAction === "respiracion" ? "/respiracion" : "/sonidos"}
                    className="flex items-center justify-between rounded-xl border border-[#284B3C]/20 bg-[#284B3C] px-3.5 py-2 text-xs font-semibold text-[#FFFDF9] transition-transform active:translate-y-0.5"
                  >
                    <span className="flex items-center gap-2">
                      {lastAction === "respiracion" ? <Wind className="size-4" /> : <Waves className="size-4" />}
                      {lastAction === "respiracion"
                        ? "Hacer 1 minuto de respiración consciente"
                        : "Escuchar sonido de lluvia o bosque"}
                    </span>
                    <span>→</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. DOCK INFERIOR DE ENTRADA: MICRÓFONO PROTAGONISTA Y CHIPS SUAVES */}
      <div className="mt-3 space-y-2.5">
        {/* Chips de temas sugeridos con diseño limpio y sutil */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {QUICK_TOPICS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.short}
                type="button"
                disabled={phase === "thinking"}
                onClick={() => handleUnifiedSubmit(t.label, false)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#1C1917]/8 bg-[#FFFDF9]/80 px-3 py-1.5 text-[11px] font-medium text-[#5C5248] backdrop-blur-sm transition-all hover:border-[#B85A3A]/40 hover:text-[#1C1917] active:scale-95 disabled:opacity-40 dark:border-white/10 dark:bg-[#2A2724]/80 dark:text-white/80"
              >
                <Icon className="size-3 text-[#B85A3A]" />
                <span>{t.short}</span>
              </button>
            );
          })}
        </div>

        {/* Barra de entrada unificada */}
        <form onSubmit={onFormSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoiceBubble}
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-2xl border transition-all active:scale-95",
              phase === "listening"
                ? "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9] shadow-md"
                : "border-[#1C1917]/10 bg-[#FFFDF9] text-[#B85A3A] hover:border-[#B85A3A]/30 dark:border-white/10 dark:bg-[#2A2724]",
            )}
            title="Hablar por voz"
            aria-label="Hablar por voz"
          >
            {phase === "listening" ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe lo que sientes o toca el micro…"
            className="h-12 flex-1 rounded-2xl border border-[#1C1917]/10 bg-[#FFFDF9] px-4 text-xs font-medium text-[#1C1917] placeholder:text-[#5C5248]/60 focus:border-[#B85A3A] focus:outline-none sm:text-sm dark:border-white/10 dark:bg-[#2A2724] dark:text-[#F4EFE6] dark:placeholder:text-white/40"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || phase === "thinking"}
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#B85A3A] text-[#FFFDF9] shadow-xs transition-all active:scale-95 disabled:opacity-40"
            aria-label="Enviar mensaje"
          >
            <SendHorizontal className="size-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
