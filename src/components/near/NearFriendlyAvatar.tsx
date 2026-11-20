import { motion } from "framer-motion";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";
import type { AvatarStyleId } from "@/types";

export type AvatarMoodState = "idle" | "listening" | "thinking" | "speaking";

export function NearFriendlyAvatar({
  phase = "idle",
  size = "lg",
  showWavePill = true,
  variant,
}: {
  phase?: AvatarMoodState;
  size?: "xs" | "sm" | "md" | "lg";
  showWavePill?: boolean;
  variant?: AvatarStyleId;
}) {
  const { settings } = useNear();
  const activeVariant: AvatarStyleId = variant ?? settings.avatarId ?? "ondas";

  if (activeVariant === "oculto") {
    return null;
  }

  const dimClass =
    size === "lg" ? "size-28" : size === "md" ? "size-20" : size === "sm" ? "size-12" : "size-9";
  const isSmall = size === "sm" || size === "xs";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div
        animate={
          phase === "speaking"
            ? { scale: [1, 1.05, 0.98, 1.04, 1] }
            : phase === "listening"
              ? { scale: [1, 1.06, 1] }
              : { scale: [0.98, 1.02, 0.98] }
        }
        transition={{
          duration: phase === "speaking" ? 1.2 : phase === "listening" ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "relative grid place-items-center rounded-full border-2 border-[#1C1917]/15 bg-[#FFFDF9] shadow-[0_5px_0_rgba(28,25,23,0.1)] dark:border-white/15 dark:bg-[#262421]",
          dimClass,
        )}
      >
        {/* =================================================================
            VARIANTE 1: "ondas" (Núcleo de Voz Editorial)
           ================================================================= */}
        {activeVariant === "ondas" && (
          <>
            <svg viewBox="0 0 120 120" className="absolute inset-0 size-full p-1.5">
              <defs>
                <linearGradient id="editorialTerra" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D97B59" />
                  <stop offset="100%" stopColor="#914A36" />
                </linearGradient>
                <linearGradient id="editorialSage" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#284B3C" />
                  <stop offset="100%" stopColor="#4A7C66" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="50" fill="#F4EFE6" />
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke={phase === "listening" ? "#284B3C" : "#B85A3A"}
                strokeWidth="2.5"
                strokeDasharray={phase === "thinking" ? "10 8" : "180 40"}
                strokeLinecap="round"
                opacity="0.45"
              />
              <circle
                cx="60"
                cy="60"
                r="32"
                fill={phase === "listening" ? "url(#editorialSage)" : "url(#editorialTerra)"}
              />
            </svg>
            <div className="relative z-10 flex items-center justify-center gap-1">
              {(isSmall ? [0, 1, 2] : [0, 1, 2, 3, 4, 5, 6]).map((bar) => (
                <motion.span
                  key={bar}
                  className="w-1 rounded-full bg-[#FFFDF9]"
                  animate={{
                    height:
                      phase === "speaking"
                        ? isSmall
                          ? [4, 12, 6]
                          : [8, 24, 11, 28, 14, 22, 8]
                        : phase === "listening"
                          ? isSmall
                            ? [5, 13, 8]
                            : [8, 20, 26, 12, 22, 10, 8]
                          : isSmall
                            ? [4, 7, 4]
                            : [6, 11, 16, 11, 6],
                  }}
                  transition={{
                    duration: phase === "speaking" ? 0.55 : phase === "listening" ? 0.5 : 1.8,
                    repeat: Infinity,
                    delay: bar * 0.08,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* =================================================================
            VARIANTE 2: "brote" (Compañero Brote Cálido)
           ================================================================= */}
        {activeVariant === "brote" && (
          <svg viewBox="0 0 120 120" className="size-[86%] overflow-visible">
            <circle cx="60" cy="62" r="42" fill="#F4EFE6" stroke="#B85A3A" strokeWidth="3" />
            {/* Sprout leaf on top */}
            <path d="M60 20 C60 8, 76 6, 78 14 C76 21, 65 22, 60 20 Z" fill="#284B3C" />
            <path d="M60 20 C58 11, 45 10, 43 16 C46 21, 55 22, 60 20 Z" fill="#4A7C66" />
            {/* Minimalist warm eyes */}
            {phase === "speaking" ? (
              <>
                <path d="M40 58 Q46 51 52 58" fill="none" stroke="#1E1A17" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M68 58 Q74 51 80 58" fill="none" stroke="#1E1A17" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="46" cy="57" r="4.5" fill="#1E1A17" />
                <circle cx="74" cy="57" r="4.5" fill="#1E1A17" />
              </>
            )}
            {/* Warm subtle smile */}
            <path
              d={phase === "speaking" ? "M51 69 Q60 79 69 69" : "M52 70 Q60 76 68 70"}
              fill="none"
              stroke="#B85A3A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* =================================================================
            VARIANTE 3: "geometrico" (Prisma Zen / Bauhaus)
           ================================================================= */}
        {activeVariant === "geometrico" && (
          <motion.svg
            viewBox="0 0 120 120"
            className="size-[84%]"
            animate={{ rotate: phase === "speaking" || phase === "thinking" ? 360 : 0 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="60" cy="60" r="46" fill="#F4EFE6" />
            <rect
              x="28"
              y="28"
              width="64"
              height="64"
              rx="14"
              transform="rotate(45 60 60)"
              fill="#284B3C"
            />
            <rect
              x="34"
              y="34"
              width="52"
              height="52"
              rx="12"
              fill="#B85A3A"
            />
            <circle cx="60" cy="60" r="16" fill="#FFFDF9" />
            <circle
              cx="60"
              cy="60"
              r={phase === "speaking" ? "9" : "6"}
              fill="#C88A2B"
            />
          </motion.svg>
        )}

        {/* =================================================================
            VARIANTE 4: "constelacion" (Eco Astral / Nodos de Luz)
           ================================================================= */}
        {activeVariant === "constelacion" && (
          <svg viewBox="0 0 120 120" className="size-[86%]">
            <circle cx="60" cy="60" r="48" fill="#1E2923" />
            <circle cx="60" cy="60" r="36" fill="none" stroke="#C88A2B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
            <circle cx="60" cy="60" r="22" fill="none" stroke="#FFFDF9" strokeWidth="1.5" opacity="0.4" />
            {/* Constellation lines */}
            <path d="M36 48 L60 32 L84 50 L74 82 L46 82 Z" fill="none" stroke="#D97B59" strokeWidth="2" opacity="0.85" />
            {/* Nodes */}
            <circle cx="60" cy="32" r="4.5" fill="#FFFDF9" />
            <circle cx="84" cy="50" r="4" fill="#C88A2B" />
            <circle cx="74" cy="82" r="4" fill="#FFFDF9" />
            <circle cx="46" cy="82" r="4" fill="#C88A2B" />
            <circle cx="36" cy="48" r="4" fill="#FFFDF9" />
            <circle cx="60" cy="60" r={phase === "speaking" ? "11" : "8"} fill="#D97B59" />
          </svg>
        )}
      </motion.div>

      {/* Status Tag Below Core */}
      {showWavePill && !isSmall && (
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#1C1917]/15 bg-[#FFFDF9] px-3 py-0.5 text-[10px] font-bold tracking-wider text-[#1C1917] uppercase shadow-2xs dark:border-white/15 dark:bg-[#262421] dark:text-[#F4EFE6]">
          <span
            className={cn(
              "size-1.5 rounded-full",
              phase === "listening"
                ? "bg-[#284B3C]"
                : phase === "speaking"
                  ? "bg-[#B85A3A]"
                  : "bg-[#284B3C]",
            )}
          />
          {phase === "speaking"
            ? "Hablando contigo"
            : phase === "listening"
              ? "Escuchando"
              : phase === "thinking"
                ? "Redactando…"
                : "Voz y texto"}
        </span>
      )}
    </div>
  );
}
