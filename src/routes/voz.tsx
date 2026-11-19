import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lock, MessageCircleHeart, Mic, MicOff, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/near/AppScreen";
import { SafetyCard } from "@/components/near/SafetyCard";
import { useNear } from "@/context/NearContext";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { detectCrisis } from "@/services/safety";
import { generateReply } from "@/services/companion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/voz")({
  head: () => ({
    meta: [
      { title: "Modo de Voz IA · Near Apoyo Emocional" },
      { name: "description", content: "Habla con Near IA en voz alta, como en un diálogo real, en un espacio sereno." },
      { property: "og:title", content: "Modo de Voz IA · Near Apoyo Emocional" },
      { property: "og:description", content: "Habla con Near IA en voz alta, como en un diálogo real, en un espacio sereno." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen nav={false}>
      <VoiceScreen />
    </AppScreen>
  ),
});

type Phase = "idle" | "listening" | "thinking" | "speaking";

const DEMO_PHRASES = [
  "Siento mucha presión por mis exámenes finales",
  "Hoy me siento muy cansado y sin foco",
  "Necesito calmarme un poco antes de clase",
];

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Toca el micrófono o elige una frase para hablar",
  listening: "Escuchando tu voz…",
  thinking: "Near IA está procesando…",
  speaking: "Near IA te responde",
};

function VoiceScreen() {
  const { settings, addMessage, addXp, showPill } = useNear();
  const [phase, setPhase] = useState<Phase>("idle");
  const [userLine, setUserLine] = useState("");
  const [nearLine, setNearLine] = useState(
    "Hola. Estoy aquí para escucharte en voz alta. Cuando quieras, cuéntame cómo te sientes hoy.",
  );
  const [crisis, setCrisis] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const timers = useRef<number[]>([]);
  const demoIdx = useRef(0);
  const tts = useSpeechSynthesis(settings.voiceRate);

  const respond = useCallback(
    (heard: string) => {
      setUserLine(heard);
      addMessage({ role: "user", text: heard });

      if (!rewarded) {
        setRewarded(true);
        addXp(20);
        showPill({
          emoji: "🎙️",
          title: "Sesión de Voz con Near IA",
          subtitle: "+20 XP de Bienestar Preventivo",
          tone: "primary",
        });
      }

      if (detectCrisis(heard)) {
        setCrisis(true);
        setPhase("idle");
        return;
      }
      setPhase("thinking");
      const t = window.setTimeout(() => {
        const reply = generateReply(heard, settings.companionStyle);
        addMessage({ role: "near", text: reply.text, action: reply.action });
        setNearLine(reply.text);
        setPhase("speaking");
        const spoke = tts.speak(reply.text, "voice", () => setPhase("idle"));
        if (!spoke) timers.current.push(window.setTimeout(() => setPhase("idle"), 4000));
      }, 1100);
      timers.current.push(t);
    },
    [addMessage, addXp, rewarded, settings.companionStyle, showPill, tts],
  );

  const fallbackRef = useRef<() => void>(() => {});
  const stt = useSpeechRecognition({
    onFinal: respond,
    onError: () => {
      toast("Simulando entrada de voz", { description: "Te mostramos la respuesta de voz de Near IA." });
      fallbackRef.current();
    },
  });

  useEffect(() => {
    if (!stt.listening && phase === "listening" && !stt.interim) {
      const t = window.setTimeout(() => setPhase((p) => (p === "listening" ? "idle" : p)), 300);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [stt.listening, stt.interim, phase]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const triggerSimulatedPhrase = (customPhrase?: string) => {
    const phrase =
      customPhrase ?? DEMO_PHRASES[demoIdx.current++ % DEMO_PHRASES.length] ?? "Necesito calmarme un poco";
    setPhase("listening");
    setUserLine("");
    phrase.split(" ").forEach((_, i, arr) => {
      timers.current.push(window.setTimeout(() => setUserLine(arr.slice(0, i + 1).join(" ")), 180 * (i + 1)));
    });
    timers.current.push(window.setTimeout(() => respond(phrase), 180 * phrase.split(" ").length + 450));
  };

  fallbackRef.current = () => triggerSimulatedPhrase();

  const toggleMic = () => {
    if (phase === "speaking") {
      tts.cancel();
      setPhase("idle");
      return;
    }
    if (phase === "listening") {
      stt.stop();
      return;
    }
    if (phase === "thinking") return;
    setCrisis(false);
    if (stt.supported && stt.start()) {
      setUserLine("");
      setPhase("listening");
    } else triggerSimulatedPhrase();
  };

  const liveUser = phase === "listening" && stt.interim ? stt.interim : userLine;
  const active = phase === "listening" || phase === "speaking";

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-voice px-5 pt-5 pb-8">
      {/* Top Tactile Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-b-[3px] border-border bg-surface/85 px-3 py-1.5 text-xs font-bold text-heading backdrop-blur">
          <Lock className="size-3.5 text-emerald-600" />
          <span>Near Voz IA · Privado</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/chat"
            className="flex items-center gap-1.5 rounded-xl border border-b-[3px] border-border bg-surface/85 px-3 py-1.5 text-xs font-bold text-heading backdrop-blur transition-transform active:translate-y-0.5"
          >
            <MessageCircleHeart className="size-3.5 text-primary" />
            <span>Ir a Chat</span>
          </Link>
          <Link
            to="/inicio"
            className="grid size-9 place-items-center rounded-xl border border-b-[3px] border-border bg-surface/85 text-heading backdrop-blur transition-transform active:translate-y-0.5"
            aria-label="Cerrar modo de voz"
          >
            <X className="size-4.5" />
          </Link>
        </div>
      </div>

      {/* Center Breathing AI Sphere */}
      <div className="relative my-auto flex items-center justify-center py-8">
        <motion.div
          className="absolute size-72 rounded-full bg-sphere opacity-45 blur-3xl"
          animate={{
            scale:
              phase === "speaking"
                ? [1, 1.24, 1.05, 1.18, 1]
                : phase === "listening"
                  ? [1, 1.12, 1]
                  : [0.95, 1.03, 0.95],
          }}
          transition={{
            duration: phase === "speaking" ? 1.5 : phase === "listening" ? 1.2 : 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.button
          type="button"
          onClick={toggleMic}
          className="relative size-48 rounded-full border-2 border-white/30 bg-sphere shadow-glow"
          animate={{
            scale:
              phase === "speaking"
                ? [1, 1.08, 0.98, 1.06, 1]
                : phase === "listening"
                  ? [1, 1.05, 1]
                  : phase === "thinking"
                    ? [1, 0.95, 1]
                    : [0.97, 1.02, 0.97],
          }}
          transition={{
            scale: {
              duration: phase === "speaking" ? 0.9 : phase === "listening" ? 1.1 : 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          aria-label="Núcleo de voz Near IA"
        >
          <span className="absolute inset-6 rounded-full bg-background/20 blur-md" />
          <span className="absolute top-8 left-10 size-12 rounded-full bg-background/40 blur-xl" />
        </motion.button>
        {active &&
          [0, 1].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute size-48 rounded-full border-2 border-primary-soft/50"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.65, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
            />
          ))}
      </div>

      {/* Transcript Card & Controls */}
      <div className="space-y-4">
        <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface/90 p-4 text-center shadow-sm backdrop-blur-md dark:border-b-neutral-800">
          <p className="text-[11px] font-extrabold tracking-widest text-primary uppercase">
            {PHASE_LABEL[phase]}
          </p>
          <AnimatePresence mode="wait">
            {crisis ? (
              <motion.div key="crisis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-left">
                <SafetyCard />
              </motion.div>
            ) : (
              <motion.div
                key={phase === "listening" ? "u" : "n"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                {phase === "listening" || phase === "thinking" ? (
                  <p className="font-display text-lg font-bold leading-snug text-heading">{liveUser || "…"}</p>
                ) : (
                  <p className="font-display text-base font-semibold leading-snug text-heading">“{nearLine}”</p>
                )}
                {phase !== "listening" && phase !== "thinking" && userLine && (
                  <p className="mt-1.5 text-xs text-muted-foreground">Dijiste: “{userLine}”</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Voice Prompt Chips for Instant Testing */}
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
          {DEMO_PHRASES.map((phrase) => (
            <button
              key={phrase}
              type="button"
              disabled={phase === "listening" || phase === "thinking"}
              onClick={() => triggerSimulatedPhrase(phrase)}
              className="shrink-0 rounded-xl border border-b-[3px] border-border bg-surface/90 px-3 py-1.5 text-xs font-semibold text-heading transition-all hover:border-primary/40 active:translate-y-0.5 disabled:opacity-40"
            >
              <Sparkles className="mr-1 inline size-3 text-primary" />
              {phrase}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={toggleMic}
            className={cn(
              "grid size-18 place-items-center rounded-3xl border-2 border-b-[5px] shadow-lg transition-all active:translate-y-0.5",
              phase === "listening"
                ? "border-secondary border-b-slate-900 bg-secondary text-secondary-foreground"
                : "border-primary border-b-[#693222] bg-clay text-primary-foreground",
            )}
            aria-label={phase === "listening" ? "Detener micrófono" : "Hablar con Near"}
          >
            {phase === "listening" ? <MicOff className="size-7" /> : <Mic className="size-7" />}
          </motion.button>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {phase === "speaking" ? "Toca para interrumpir" : "Toca para hablar o usa un tema rápido arriba"}
          </span>
        </div>
      </div>
    </div>
  );
}
