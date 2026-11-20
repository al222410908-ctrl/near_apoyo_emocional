import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles, Square, Volume2, X } from "lucide-react";
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
  const [isMinimized, setIsMinimized] = useState(false);
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
      setIsMinimized(false);
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
      }, 38);

      const duration = Math.min(5000, Math.max(2000, words.length * 50));

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

  if (isMinimized) {
    return (
      <div className={cn("flex items-center justify-between rounded-2xl border border-[#1C1917]/8 bg-[#FFFDF9]/90 px-3.5 py-1.5 backdrop-blur-sm dark:border-white/10 dark:bg-[#2A2724]/90", className)}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C5248] hover:text-[#1C1917] dark:text-white/70 dark:hover:text-white"
        >
          <Sparkles className="size-3.5 text-[#B85A3A]" />
          <span>Guía de Near: {title}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="rounded-lg p-1 text-[#5C5248] hover:bg-[#F4EFE6] dark:text-white/70 dark:hover:bg-white/10"
          title="Expandir guía"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-2xl border border-[#1C1917]/8 bg-[#FFFDF9]/95 p-3.5 shadow-2xs backdrop-blur-md dark:border-white/10 dark:bg-[#2A2724]/95",
        className,
      )}
    >
      {settings.avatarId !== "oculto" && (
        <button
          type="button"
          onClick={() => (isTalking ? stopAll() : triggerExplain(true))}
          className="shrink-0 rounded-full transition-transform active:scale-95"
          title="Escuchar guía hablada"
          aria-label="Escuchar guía"
        >
          <NearFriendlyAvatar phase={isTalking ? "speaking" : "idle"} size="sm" showWavePill={false} />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold tracking-wider text-[#284B3C] uppercase dark:text-emerald-400">
            {title}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => (isTalking ? stopAll() : triggerExplain(true))}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold transition-all active:scale-95",
                isTalking
                  ? "border-[#1C1917] bg-[#284B3C] text-[#FFFDF9]"
                  : "border-[#1C1917]/10 bg-[#F4EFE6]/70 text-[#1C1917] hover:bg-[#EAE4D7] dark:border-white/10 dark:bg-white/10 dark:text-[#F4EFE6]",
              )}
            >
              {isTalking ? (
                <>
                  <Square className="size-2.5 fill-current" /> Pausar
                </>
              ) : (
                <>
                  <Volume2 className="size-3 text-[#B85A3A]" /> Escuchar
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                stopAll();
                setIsMinimized(true);
              }}
              className="grid size-6 place-items-center rounded-lg text-[#5C5248]/70 hover:bg-[#F4EFE6] hover:text-[#1C1917] dark:text-white/60 dark:hover:bg-white/10"
              title="Minimizar guía"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-1 text-xs font-medium leading-relaxed text-[#2A2724] dark:text-[#F4EFE6]">
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
