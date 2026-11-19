import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AvatarMoodState = "idle" | "listening" | "thinking" | "speaking";

export function NearFriendlyAvatar({
  phase = "idle",
  size = "lg",
  showWavePill = true,
}: {
  phase?: AvatarMoodState;
  size?: "sm" | "md" | "lg";
  showWavePill?: boolean;
}) {
  const dimClass = size === "lg" ? "size-28" : size === "md" ? "size-20" : "size-14";
  const auraClass = size === "lg" ? "size-36" : size === "md" ? "size-24" : "size-16";

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Soft Pastel Aura */}
      <motion.div
        className={cn(
          "pointer-events-none absolute rounded-full blur-2xl",
          auraClass,
          phase === "listening"
            ? "bg-sky-400/35"
            : phase === "speaking"
              ? "bg-amber-300/40"
              : phase === "thinking"
                ? "bg-violet-400/35"
                : "bg-emerald-300/30",
        )}
        animate={{
          scale: phase === "speaking" ? [1, 1.22, 1] : [0.95, 1.08, 0.95],
        }}
        transition={{ duration: phase === "speaking" ? 1.2 : 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Character SVG */}
      <motion.div
        animate={
          phase === "speaking"
            ? { y: [0, -5, 0], scale: [1, 1.05, 0.98, 1.03, 1] }
            : phase === "listening"
              ? { y: [0, -4, 0], rotate: [0, -3, 3, 0] }
              : phase === "thinking"
                ? { y: [0, -3, 0], rotate: [-2, 2, -2] }
                : { y: [0, -4, 0] }
        }
        transition={{
          duration: phase === "speaking" ? 1.1 : phase === "listening" ? 1.6 : 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn("relative", dimClass)}
      >
        <svg viewBox="0 0 140 140" className="size-full overflow-visible drop-shadow-xl">
          <defs>
            {/* Warm, soft cream-peach friendly body gradient */}
            <radialGradient id="friendlyBody" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#FFF3E6" />
              <stop offset="100%" stopColor="#FCD5B5" />
            </radialGradient>

            {/* Soft outer border glow */}
            <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>

            {/* Fresh green sprout leaf gradient */}
            <linearGradient id="sproutLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Little Sprout on Top of Head */}
          <g className="origin-bottom">
            <path
              d="M70 25 C70 11, 86 7, 90 16 C88 24, 76 26, 70 25 Z"
              fill="url(#sproutLeaf)"
            />
            <path
              d="M70 25 C68 14, 54 12, 51 19 C54 25, 64 26, 70 25 Z"
              fill="#34D399"
            />
            <path d="M70 28 L70 22" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Cozy Little Side Paws / Arms */}
          <ellipse
            cx="23"
            cy="84"
            rx="10"
            ry="7"
            transform={phase === "speaking" ? "rotate(-22 23 84)" : "rotate(-10 23 84)"}
            fill="#FCD5B5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <ellipse
            cx="117"
            cy="84"
            rx="10"
            ry="7"
            transform={phase === "speaking" ? "rotate(22 117 84)" : "rotate(10 117 84)"}
            fill="#FCD5B5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />

          {/* Main Soft Mochi / Cloud-Drop Body */}
          <path
            d="M70 26 C104 26, 118 50, 118 78 C118 104, 100 118, 70 118 C40 118, 22 104, 22 78 C22 50, 36 26, 70 26 Z"
            fill="url(#friendlyBody)"
            stroke="url(#rimGrad)"
            strokeWidth="3.5"
          />

          {/* Top Glossy Highlight */}
          <ellipse cx="52" cy="42" rx="16" ry="7" transform="rotate(-15 52 42)" fill="#FFFFFF" opacity="0.75" />

          {/* Warm Rosy Blush Cheeks */}
          <ellipse cx="42" cy="79" rx="8.5" ry="5" fill="#FB7185" opacity="0.45" />
          <ellipse cx="98" cy="79" rx="8.5" ry="5" fill="#FB7185" opacity="0.45" />

          {/* Friendly Eyes */}
          {phase === "speaking" ? (
            /* Cheerful Happy Arc Eyes (^ ^) when speaking */
            <>
              <path
                d="M45 67 Q52 58 59 67"
                fill="none"
                stroke="#432818"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <path
                d="M81 67 Q88 58 95 67"
                fill="none"
                stroke="#432818"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
            </>
          ) : (
            /* Warm Expressive Eyes with Double White Starry Catchlights */
            <>
              <g>
                <circle cx="52" cy="66" r="7.5" fill="#3B2314" />
                <circle cx="49.5" cy="63.5" r="2.8" fill="#FFFFFF" />
                <circle cx="54.5" cy="68.5" r="1.3" fill="#FFFFFF" />
              </g>
              <g>
                <circle cx="88" cy="66" r="7.5" fill="#3B2314" />
                <circle cx="85.5" cy="63.5" r="2.8" fill="#FFFFFF" />
                <circle cx="90.5" cy="68.5" r="1.3" fill="#FFFFFF" />
              </g>
            </>
          )}

          {/* Friendly Smile (No vertical bars inside mouth!) */}
          {phase === "speaking" ? (
            /* Happy open talking smile */
            <path
              d="M60 77 Q70 89 80 77 Z"
              fill="#F43F5E"
              stroke="#432818"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          ) : phase === "listening" ? (
            /* Attentive gentle 'o' smile */
            <ellipse cx="70" cy="79" rx="4.5" ry="3.5" fill="#432818" />
          ) : (
            /* Warm cozy smile curve */
            <path
              d="M61 77 Q70 85 79 77"
              fill="none"
              stroke="#432818"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </motion.div>

      {/* External Soundwave Equalizer Pill BELOW the character (Clean & Friendly) */}
      {showWavePill && size !== "sm" && (
        <div className="mt-1 flex h-6 items-center justify-center gap-1 rounded-full border border-white/20 bg-slate-950/80 px-3.5 py-1 shadow-md backdrop-blur-md">
          {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
            <motion.span
              key={bar}
              className={cn(
                "w-1 rounded-full",
                phase === "listening"
                  ? "bg-sky-400"
                  : phase === "speaking"
                    ? "bg-amber-300"
                    : phase === "thinking"
                      ? "bg-violet-400"
                      : "bg-emerald-400",
              )}
              animate={{
                height:
                  phase === "speaking"
                    ? [4, 14, 6, 16, 7, 13, 4]
                    : phase === "listening"
                      ? [4, 12, 16, 8, 14, 6, 4]
                      : phase === "thinking"
                        ? [4, 10, 4, 10, 4]
                        : [4, 6, 8, 6, 4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: bar * 0.08,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
