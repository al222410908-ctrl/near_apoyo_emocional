import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashVideoHeroProps {
  className?: string;
  onAnimationComplete?: () => void;
}

export function SplashVideoHero({
  className,
  onAnimationComplete,
}: SplashVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intentar reproducción automática
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay silenciado fue bloqueado o pausado por el navegador
          setIsPlaying(false);
        });
    }
  }, []);

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
    setHasEnded(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <div className={cn("relative mx-auto flex w-full max-w-sm flex-col items-center", className)}>
      {/* Halo de luz ambiental multicolor (Turquesa y Coral) */}
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-r from-sky-400/25 via-teal-300/20 to-rose-400/25 blur-2xl animate-pulse" />

      {/* Contenedor del video con esquinas redondeadas y sombra suave */}
      <div className="relative z-10 w-full overflow-hidden rounded-3xl border-2 border-border/70 bg-[#FFFDF9] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:bg-[#1C1917]/90">
        <video
          ref={videoRef}
          className="h-64 w-full object-contain md:h-72 select-none"
          playsInline
          autoPlay
          muted
          poster="/near-splash-poster.jpg"
          onEnded={handleEnded}
        >
          <source src="/near-splash.webm" type="video/webm" />
          <source src="/near-splash.mp4" type="video/mp4" />
          Tu navegador no soporta reproducción de video HTML5.
        </video>

        {/* Botón flotante para repetir la animación */}
        <div className="absolute right-3 bottom-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-3 py-1 text-[11px] font-bold text-heading shadow-xs backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            title="Repetir animación del logo"
          >
            <RotateCcw className="size-3 text-primary" />
            <span>Repetir animación</span>
          </button>
        </div>

        {/* Indicador de estado */}
        <AnimatePresence>
          {hasEnded && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400"
            >
              <Sparkles className="size-3" />
              <span>Logo Oficial Near</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
