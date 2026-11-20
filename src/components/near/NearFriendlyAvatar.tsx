import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AvatarMoodState = "idle" | "listening" | "thinking" | "speaking";

/**
 * Near Organic Audio Core — Designed for teens & university students (16–25).
 * Replaces childish cartoon faces with an editorial, organic sound-reactive
 * botanical/zen sculpture (inspired by Headspace, Endel & Apple Journal).
 */
export function NearFriendlyAvatar({
  phase = "idle",
  size = "lg",
  showWavePill = true,
}: {
  phase?: AvatarMoodState;
  size?: "sm" | "md" | "lg";
  showWavePill?: boolean;
}) {
  const dimClass = size === "lg" ? "size-28" : size === "md" ? "size-20" : "size-12";
  const isSm = size === "sm";

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Organic Tactile Disc Container */}
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
          "relative grid place-items-center rounded-full border-2 border-[#1C1917]/15 bg-[#FFFDF9] shadow-[0_6px_0_rgba(28,25,23,0.12)] dark:border-white/15 dark:bg-[#262421]",
          dimClass,
        )}
      >
        {/* Outer Rotating Organic Ring */}
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

          {/* Soft Warm Background Circle */}
          <circle cx="60" cy="60" r="50" fill="#F4EFE6" />

          {/* Organic Asymmetric Inner Ring */}
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

          {/* Inner Core Circle */}
          <circle
            cx="60"
            cy="60"
            r="32"
            fill={phase === "listening" ? "url(#editorialSage)" : "url(#editorialTerra)"}
          />
        </svg>

        {/* Live Soundwave Bars Inside the Core */}
        <div className="relative z-10 flex items-center justify-center gap-1">
          {(isSm ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6]).map((bar) => (
            <motion.span
              key={bar}
              className="w-1 rounded-full bg-[#FFFDF9]"
              animate={{
                height:
                  phase === "speaking"
                    ? isSm
                      ? [5, 14, 7, 16]
                      : [8, 24, 11, 28, 14, 22, 8]
                    : phase === "listening"
                      ? isSm
                        ? [6, 15, 9, 13]
                        : [8, 20, 26, 12, 22, 10, 8]
                      : phase === "thinking"
                        ? [6, 14, 6]
                        : isSm
                          ? [5, 8, 5]
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
      </motion.div>

      {/* Status Tag Below Core (Only on large/medium when enabled) */}
      {showWavePill && !isSm && (
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
