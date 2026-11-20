import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  BookOpen,
  BrainCircuit,
  Eye,
  EyeOff,
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
  { label: "Ayúdame a organizar mi día paso a paso", short: "Ordenar mi día", icon: ListTodo },
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
      }, 45);

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
      calmado: "Qué bueno que hoy sientes calma. Aprovechemos esa claridad para avanzar a buen ritmo.",
      esperanzado: "Se siente buen ánimo hoy. Estoy aquí para acompañarte en tus metas del día.",
      cansado: "Se nota que ha sido una semana pesada. Bajemos la velocidad, no tienes que forzarte.",
      ansioso: "Cuando se junta la presión escolar es normal sentir tensión. Ordenemos un solo pendiente a la vez.",
      abrumado: "Si todo parece urgente hoy, hagamos una pausa de dos minutos para despejar el ruido.",
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
          title: "Sesión registrada",
          subtitle: "+20 XP en tu progreso diario",
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
      setStreamedText("Ordenando ideas contigo…");

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
      toast("Modo demostración de voz", {
        description: "Simulando conversación hablada.",
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
    <section className="relative overflow-hidden rounded-[28px] border-2 border-[#1C1917]/15 bg-[#EFEAE0] p-4 text-[#1C1917] shadow-[0_6px_0_rgba(28,25,23,0.1)] dark:border-white/15 dark:bg-[#1E1C1A] dark:text-[#F4EFE6]">
      {/* Top Editorial Status Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1917]/15 bg-[#FFFDF9] px-3 py-1 text-[11px] font-bold text-[#1C1917] dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6]">
          <span
            className={cn(
              "size-2 rounded-full",
              phase === "listening"
                ? "animate-pulse bg-[#284B3C]"
                : phase === "speaking"
                  ? "animate-pulse bg-[#B85A3A]"
                  : "bg-[#284B3C]",
            )}
          />
          <span>Espacio de escucha</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setVoiceEnabled((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-colors",
              voiceEnabled
                ? "border-[#284B3C]/30 bg-[#284B3C] text-[#FFFDF9]"
                : "border-[#1C1917]/15 bg-[#FFFDF9] text-[#5C5248] dark:border-white/15 dark:bg-[#2A2724] dark:text-white/60",
            )}
            title={voiceEnabled ? "Audio activado" : "Audio silenciado"}
          >
            {voiceEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            <span>{voiceEnabled ? "Audio" : "Silencio"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAvatarPicker((a) => !a);
              setShowTonePicker(false);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-[#1C1917]/15 bg-[#FFFDF9] px-2.5 py-1 text-[11px] font-bold text-[#1C1917] hover:bg-[#F4EFE6] dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6]"
            title="Cambiar o quitar avatar"
          >
            {settings.avatarId === "oculto" ? (
              <EyeOff className="size-3 text-[#5C5248]" />
            ) : (
              <Sparkles className="size-3 text-[#284B3C]" />
            )}
            <span>Avatar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowTonePicker((s) => !s);
              setShowAvatarPicker(false);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-[#1C1917]/15 bg-[#FFFDF9] px-2.5 py-1 text-[11px] font-bold text-[#1C1917] hover:bg-[#F4EFE6] dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6]"
            title="Estilo de conversación"
          >
            <SlidersHorizontal className="size-3 text-[#B85A3A]" />
            <span className="capitalize">{settings.companionStyle}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Avatar Selector (Choose from 4 Avatars or Hide It!) */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2.5"
          >
            <div className="rounded-2xl border border-[#1C1917]/15 bg-[#FFFDF9] p-2.5 dark:border-white/15 dark:bg-[#2A2724]">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[10px] font-extrabold tracking-wider text-[#5C5248] uppercase dark:text-white/70">
                  Elige tu avatar o desactívalo:
                </span>
                <span className="text-[10px] font-bold text-[#284B3C] dark:text-emerald-400">Opcional</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {AVATAR_STYLES.map((av) => {
                  const active = (settings.avatarId ?? "ondas") === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        updateSettings({ avatarId: av.id });
                        setShowAvatarPicker(false);
                        toast.success(
                          av.id === "oculto" ? "Avatar ocultado (Modo minimalista)" : `Avatar: ${av.label}`,
                        );
                      }}
                      className={cn(
                        "flex flex-col items-center justify-between gap-1 rounded-xl border p-1.5 text-center transition-all",
                        active
                          ? "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]"
                          : "border-[#1C1917]/12 bg-[#F4EFE6]/60 text-[#1C1917] hover:bg-[#F4EFE6] dark:border-white/10 dark:bg-white/5 dark:text-[#F4EFE6]",
                      )}
                    >
                      <div className="grid h-9 place-items-center">
                        {av.id === "oculto" ? (
                          <span className="grid size-8 place-items-center rounded-full border border-dashed border-current/40">
                            <EyeOff className="size-4" />
                          </span>
                        ) : (
                          <NearFriendlyAvatar variant={av.id} size="xs" showWavePill={false} />
                        )}
                      </div>
                      <span className="block text-[10px] font-extrabold leading-tight">{av.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Tone Picker */}
      <AnimatePresence>
        {showTonePicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2.5"
          >
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-[#1C1917]/15 bg-[#FFFDF9] p-2 dark:border-white/15 dark:bg-[#2A2724]">
              {COMPANION_STYLES.map((st) => {
                const active = settings.companionStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      updateSettings({ companionStyle: st.id });
                      setShowTonePicker(false);
                      toast.success(`Tono: ${st.label}`);
                    }}
                    className={cn(
                      "rounded-xl px-2.5 py-1.5 text-left transition-all",
                      active
                        ? "bg-[#284B3C] text-[#FFFDF9]"
                        : "text-[#1C1917] hover:bg-[#F4EFE6] dark:text-[#F4EFE6] dark:hover:bg-white/10",
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

      {/* Center Audio Core (or Compact Bar when Avatar is Hidden) + Editorial Dialogue Card */}
      <div className="my-3.5 flex flex-col items-center">
        {settings.avatarId === "oculto" ? (
          <div className="flex w-full items-center justify-between rounded-2xl border border-[#1C1917]/15 bg-[#FFFDF9] px-3.5 py-2 dark:border-white/15 dark:bg-[#2A2724]">
            <button
              type="button"
              onClick={handleToggleVoiceBubble}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1C1917] dark:text-[#F4EFE6]"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-[#284B3C] text-[#FFFDF9]">
                <Mic className="size-3.5" />
              </span>
              <span>
                {phase === "listening"
                  ? "Escuchando tu voz… (Toca para detener)"
                  : phase === "speaking"
                    ? "Near hablando… (Toca para pausar)"
                    : "Modo sin avatar · Toca para hablar por voz"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ avatarId: "ondas" })}
              className="inline-flex items-center gap-1 rounded-lg border border-[#1C1917]/15 px-2 py-1 text-[10px] font-bold text-[#5C5248] hover:text-[#1C1917] dark:border-white/15 dark:text-white/70"
            >
              <Eye className="size-3" /> Mostrar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggleVoiceBubble}
            className="group flex flex-col items-center justify-center rounded-3xl p-1 transition-transform active:scale-95"
            aria-label="Hablar por voz con Near"
          >
            <NearFriendlyAvatar phase={phase} size="lg" />
          </button>
        )}

        {/* User's Last Spoken / Typed Line */}
        <AnimatePresence>
          {(lastUserPrompt || stt.interim) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2.5 max-w-[92%] rounded-2xl border border-[#1C1917]/12 bg-[#FFFDF9]/80 px-3.5 py-1.5 text-center text-xs font-semibold text-[#5C5248] dark:border-white/15 dark:bg-[#2A2724] dark:text-white/80"
            >
              “{phase === "listening" && stt.interim ? stt.interim : lastUserPrompt}”
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editorial Dialogue Card */}
        <div className="mt-3 w-full">
          {isCrisis ? (
            <div className="text-left">
              <SafetyCard />
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-[#1C1917]/15 bg-[#FFFDF9] p-4 text-[#1C1917] shadow-[0_4px_0_rgba(28,25,23,0.08)] dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6]">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider text-[#B85A3A] uppercase">
                  Near · Acompañante
                </span>

                {fullBubbleText && phase !== "thinking" && (
                  <button
                    type="button"
                    onClick={() => simulateSpeakingResponse(fullBubbleText, lastAction, true)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1C1917]/12 bg-[#F4EFE6] px-2 py-0.5 text-[10px] font-bold text-[#1C1917] hover:bg-[#E5DEC9] dark:border-white/15 dark:bg-[#1E1C1A] dark:text-[#F4EFE6]"
                  >
                    <Volume2 className="size-3 text-[#B85A3A]" /> Escuchar
                  </button>
                )}
              </div>

              <p className="font-display text-[15px] font-semibold leading-relaxed text-[#1C1917] dark:text-[#F4EFE6]">
                {streamedText || "Cuéntame cómo va tu semana o qué pendiente te tiene con presión."}
                {(phase === "speaking" || phase === "thinking") && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-1 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-[#B85A3A]"
                  />
                )}
              </p>

              {lastAction && phase !== "thinking" && (
                <Link
                  to={lastAction === "respiracion" ? "/respiracion" : "/sonidos"}
                  className="mt-3 flex items-center justify-between rounded-2xl border border-[#284B3C]/30 bg-[#284B3C] px-3.5 py-2 text-xs font-bold text-[#FFFDF9] transition-transform active:translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    {lastAction === "respiracion" ? <Wind className="size-4" /> : <Waves className="size-4" />}
                    {lastAction === "respiracion"
                      ? "Abrir pausa de Respiración 4-7-8"
                      : "Abrir Paisajes Sonoros"}
                  </span>
                  <span>→</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unified Input & Editorial Topic Chips */}
      <div className="space-y-2.5">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {QUICK_TOPICS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.short}
                type="button"
                disabled={phase === "thinking"}
                onClick={() => handleUnifiedSubmit(t.label, false)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#1C1917]/15 bg-[#FFFDF9] px-3 py-1.5 text-[11px] font-bold text-[#1C1917] transition-all hover:border-[#B85A3A] active:scale-95 disabled:opacity-40 dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6]"
              >
                <Icon className="size-3.5 text-[#B85A3A]" />
                <span>{t.short}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={onFormSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoiceBubble}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl border-2 transition-all active:translate-y-0.5",
              phase === "listening"
                ? "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]"
                : "border-[#1C1917]/15 bg-[#FFFDF9] text-[#B85A3A] hover:border-[#B85A3A] dark:border-white/15 dark:bg-[#2A2724]",
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
            placeholder="Escribe o toca el micrófono para hablar…"
            className="h-11 flex-1 rounded-2xl border-2 border-[#1C1917]/15 bg-[#FFFDF9] px-3.5 text-xs font-semibold text-[#1C1917] placeholder:text-[#5C5248]/70 focus:border-[#B85A3A] focus:outline-none sm:text-sm dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6] dark:placeholder:text-white/50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || phase === "thinking"}
            className="grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-[#1C1917]/20 bg-[#B85A3A] text-[#FFFDF9] shadow-xs transition-all active:translate-y-0.5 disabled:opacity-40"
            aria-label="Enviar"
          >
            <SendHorizontal className="size-4.5" />
          </button>
        </form>

        <div className="flex items-center justify-between px-1 pt-0.5 text-[11px] font-semibold text-[#5C5248] dark:text-white/60">
          <span>100% confidencial</span>
          <div className="flex items-center gap-3">
            <Link to="/chat" className="inline-flex items-center gap-1 font-bold text-[#B85A3A] hover:underline">
              <MessageSquareHeart className="size-3" /> Conversación completa
            </Link>
            <Link to="/voz" className="inline-flex items-center gap-1 font-bold text-[#284B3C] hover:underline dark:text-emerald-400">
              <AudioLines className="size-3" /> Modo Voz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
