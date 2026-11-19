import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lock, Mic, MicOff, X } from "lucide-react";
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
      { title: "Modo de Voz · Near Apoyo Emocional" },
      { name: "description", content: "Habla con Near en voz alta, como en un diálogo real, en un espacio sereno." },
      { property: "og:title", content: "Modo de Voz · Near Apoyo Emocional" },
      { property: "og:description", content: "Habla con Near en voz alta, como en un diálogo real, en un espacio sereno." },
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

const DEMO_PHRASES = ["Siento mucha presión por mis exámenes finales", "Hoy me siento muy cansada", "Necesito calmarme un poco"];

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Toca el micrófono para hablar",
  listening: "Te escucho…",
  thinking: "Near está pensando con cuidado…",
  speaking: "Near te responde",
};

function VoiceScreen() {
  const { settings, addMessage } = useNear();
  const [phase, setPhase] = useState<Phase>("idle");
  const [userLine, setUserLine] = useState("");
  const [nearLine, setNearLine] = useState("Hola. Estoy aquí para escucharte. Cuando quieras, cuéntame cómo te sientes.");
  const [crisis, setCrisis] = useState(false);
  const timers = useRef<number[]>([]);
  const demoIdx = useRef(0);
  const tts = useSpeechSynthesis(settings.voiceRate);

  const respond = useCallback(
    (heard: string) => {
      setUserLine(heard);
      addMessage({ role: "user", text: heard });
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
    [addMessage, settings.companionStyle, tts],
  );

  const fallbackRef = useRef<() => void>(() => {});
  const stt = useSpeechRecognition({
    onFinal: respond,
    onError: () => {
      toast("No pudimos usar tu micrófono", { description: "Te mostramos una conversación de ejemplo." });
      fallbackRef.current();
    },
  });

  useEffect(() => {
    if (!stt.listening && phase === "listening" && !stt.interim) {
      // Recognition ended without speech
      const t = window.setTimeout(() => setPhase((p) => (p === "listening" ? "idle" : p)), 300);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [stt.listening, stt.interim, phase]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const startDemo = () => {
    const phrase = DEMO_PHRASES[demoIdx.current++ % DEMO_PHRASES.length] ?? "Necesito calmarme un poco";
    setPhase("listening");
    setUserLine("");
    phrase.split(" ").forEach((_, i, arr) => {
      timers.current.push(window.setTimeout(() => setUserLine(arr.slice(0, i + 1).join(" ")), 250 * (i + 1)));
    });
    timers.current.push(window.setTimeout(() => respond(phrase), 250 * phrase.split(" ").length + 600));
  };

  fallbackRef.current = startDemo;

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
    } else startDemo();
  };

  const liveUser = phase === "listening" && stt.interim ? stt.interim : userLine;
  const active = phase === "listening" || phase === "speaking";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-voice px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Lock className="size-3" /> Modo de Voz · Privado
        </div>
        <Link to="/chat" className="grid size-11 place-items-center rounded-full bg-background/70 text-heading backdrop-blur" aria-label="Volver al chat">
          <X className="size-5" />
        </Link>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <motion.div
          className="absolute size-80 rounded-full bg-sphere opacity-50 blur-3xl"
          animate={{ scale: phase === "speaking" ? [1, 1.25, 1.05, 1.2, 1] : phase === "listening" ? [1, 1.12, 1] : [0.95, 1.03, 0.95] }}
          transition={{ duration: phase === "speaking" ? 1.6 : phase === "listening" ? 1.2 : 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative size-56 rounded-full bg-sphere shadow-glow"
          animate={{
            scale: phase === "speaking" ? [1, 1.08, 0.98, 1.06, 1] : phase === "listening" ? [1, 1.05, 1] : phase === "thinking" ? [1, 0.96, 1] : [0.97, 1.02, 0.97],
            rotate: phase === "thinking" ? 360 : 0,
          }}
          transition={{
            scale: { duration: phase === "speaking" ? 0.9 : phase === "listening" ? 1.1 : 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: phase === "thinking" ? Infinity : 0, ease: "linear" },
          }}
        >
          <span className="absolute inset-6 rounded-full bg-background/20 blur-md" />
          <span className="absolute top-10 left-12 size-14 rounded-full bg-background/40 blur-xl" />
        </motion.div>
        {active &&
          [0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute size-56 rounded-full border-2 border-primary-soft/50"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
            />
          ))}
      </div>

      <div className="min-h-36 space-y-3 text-center">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{PHASE_LABEL[phase]}</p>
        <AnimatePresence mode="wait">
          {crisis ? (
            <motion.div key="crisis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left">
              <SafetyCard />
            </motion.div>
          ) : (
            <motion.div key={phase === "listening" ? "u" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {phase === "listening" || phase === "thinking" ? (
                <p className="font-display text-xl leading-snug text-heading">{liveUser || "…"}</p>
              ) : (
                <p className="font-display text-lg leading-snug text-heading">{nearLine}</p>
              )}
              {phase !== "listening" && phase !== "thinking" && userLine && <p className="mt-2 text-sm text-muted-foreground">Tú: “{userLine}”</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={toggleMic}
          className={cn(
            "grid size-20 place-items-center rounded-full shadow-lift transition-colors",
            phase === "listening" ? "bg-secondary text-secondary-foreground" : "bg-clay text-primary-foreground",
          )}
          aria-label={phase === "listening" ? "Dejar de hablar" : phase === "speaking" ? "Interrumpir a Near" : "Hablar"}
        >
          {phase === "listening" ? <MicOff className="size-8" /> : <Mic className="size-8" />}
        </motion.button>
        {!stt.supported && <p className="text-center text-[11px] text-muted-foreground">Tu navegador no admite reconocimiento de voz: usaremos frases de ejemplo.</p>}
      </div>
    </div>
  );
}
