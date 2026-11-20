import { motion } from "framer-motion";
import { Square, Volume2 } from "lucide-react";
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
      }, 40);

      const duration = Math.min(5000, Math.max(2000, words.length * 52));

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
        "relative flex items-center gap-3 rounded-3xl border-2 border-[#1C1917]/15 bg-[#EFEAE0] p-3.5 shadow-[0_4px_0_rgba(28,25,23,0.08)] dark:border-white/15 dark:bg-[#1E1C1A]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => (isTalking ? stopAll() : triggerExplain(true))}
        className="shrink-0 rounded-full transition-transform active:scale-95"
        title="Escuchar explicación"
        aria-label="Escuchar guía"
      >
        <NearFriendlyAvatar phase={isTalking ? "speaking" : "idle"} size="sm" showWavePill={false} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold tracking-wider text-[#284B3C] uppercase dark:text-emerald-400">
            {title}
          </span>

          <button
            type="button"
            onClick={() => (isTalking ? stopAll() : triggerExplain(true))}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[10px] font-extrabold transition-all active:scale-95",
              isTalking
                ? "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]"
                : "border-[#1C1917]/15 bg-[#FFFDF9] text-[#1C1917] hover:bg-[#F4EFE6] dark:border-white/15 dark:bg-[#2A2724] dark:text-[#F4EFE6]",
            )}
          >
            {isTalking ? (
              <>
                <Square className="size-2.5 fill-current" /> Detener
              </>
            ) : (
              <>
                <Volume2 className="size-3 text-[#B85A3A]" /> Escuchar
              </>
            )}
          </button>
        </div>

        <p className="mt-1 text-xs font-semibold leading-relaxed text-[#1C1917] dark:text-[#F4EFE6]">
          “{streamedText}”
          {isTalking && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.65, repeat: Infinity }}
              className="ml-1 inline-block h-3 w-1 translate-y-0.5 rounded-full bg-[#B85A3A]"
            />
          )}
        </p>
      </div>
    </div>
  );
}
