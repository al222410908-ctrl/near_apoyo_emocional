import { motion } from "framer-motion";
import { Sparkles, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NearFriendlyAvatar } from "@/components/near/NearFriendlyAvatar";
import { useNear } from "@/context/NearContext";
import { useSpeechSynthesis } from "@/hooks/useSpeech";
import { cn } from "@/lib/utils";

interface NearActivityGuideProps {
  title: string;
  explanation: string;
  autoSpeakOnMount?: boolean;
  className?: string;
}

export function NearActivityGuide({
  title,
  explanation,
  autoSpeakOnMount = false,
  className,
}: NearActivityGuideProps) {
  const { settings } = useNear();
  const tts = useSpeechSynthesis(settings.voiceRate);
  const [simulatingVoice, setSimulatingVoice] = useState(false);
  const [streamedText, setStreamedText] = useState(explanation);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<number | null>(null);

  const isTalking = tts.speakingId === title || simulatingVoice;

  const stopAll = useCallback(() => {
    tts.cancel();
    setSimulatingVoice(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (streamRef.current) window.clearInterval(streamRef.current);
    setStreamedText(explanation);
  }, [explanation, tts]);

  const triggerExplain = useCallback(
    (withAudio: boolean) => {
      stopAll();
      setSimulatingVoice(true);
      setStreamedText("");

      const words = explanation.split(" ");
      let idx = 0;
      streamRef.current = window.setInterval(() => {
        idx += 1;
        setStreamedText(words.slice(0, idx).join(" "));
        if (idx >= words.length && streamRef.current) {
          window.clearInterval(streamRef.current);
          streamRef.current = null;
        }
      }, 42);

      const duration = Math.min(5500, Math.max(2200, words.length * 55));

      if (withAudio) {
        const started = tts.speak(explanation, title, () => {
          setSimulatingVoice(false);
        });
        if (!started) {
          timerRef.current = window.setTimeout(() => setSimulatingVoice(false), duration);
        }
      } else {
        timerRef.current = window.setTimeout(() => setSimulatingVoice(false), duration);
      }
    },
    [explanation, stopAll, title, tts],
  );

  // Animate typewriter explanation whenever the explanation text changes
  useEffect(() => {
    triggerExplain(autoSpeakOnMount);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (streamRef.current) window.clearInterval(streamRef.current);
      tts.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explanation]);

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-3xl border border-b-[4px] border-amber-300/90 border-b-amber-500 bg-gradient-to-r from-amber-50/90 via-surface to-orange-50/50 p-3.5 shadow-xs dark:border-amber-800/80 dark:border-b-amber-950 dark:from-amber-950/35 dark:via-surface dark:to-orange-950/20",
        className,
      )}
    >
      {/* Interactive Mini Avatar */}
      <button
        type="button"
        onClick={() => (isTalking ? stopAll() : triggerExplain(true))}
        className="shrink-0 rounded-2xl p-0.5 transition-transform active:scale-95"
        title="Toca a Near para que te lea la actividad"
        aria-label="Escuchar guía de Near"
      >
        <NearFriendlyAvatar phase={isTalking ? "speaking" : "idle"} size="sm" showWavePill={false} />
      </button>

      {/* Explanation Speech Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
            <Sparkles className="size-3" /> {title}
          </span>

          <button
            type="button"
            onClick={() => (isTalking ? stopAll() : triggerExplain(true))}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[10px] font-extrabold transition-all active:scale-95",
              isTalking
                ? "border-primary bg-primary text-primary-foreground"
                : "border-amber-400/80 bg-white text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
            )}
          >
            {isTalking ? (
              <>
                <Square className="size-2.5 fill-current" /> Detener voz
              </>
            ) : (
              <>
                <Volume2 className="size-3" /> Escuchar a Near
              </>
            )}
          </button>
        </div>

        <p className="mt-1 text-xs font-semibold leading-relaxed text-heading">
          “{streamedText}”
          {isTalking && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.65, repeat: Infinity }}
              className="ml-1 inline-block h-3 w-1 translate-y-0.5 rounded-full bg-primary"
            />
          )}
        </p>
      </div>
    </div>
  );
}
