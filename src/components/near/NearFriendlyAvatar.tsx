import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";
import type { AvatarStyleId, MoodId } from "@/types";

export type AvatarMoodState = "idle" | "listening" | "thinking" | "speaking";

export function NearFriendlyAvatar({
  phase = "idle",
  size = "lg",
  showWavePill = true,
  variant,
  interactive = true,
}: {
  phase?: AvatarMoodState;
  size?: "xs" | "sm" | "md" | "lg";
  showWavePill?: boolean;
  variant?: AvatarStyleId;
  interactive?: boolean;
}) {
  const { settings, todayMood } = useNear();
  const [tapHeart, setTapHeart] = useState(false);
  const activeVariant: AvatarStyleId = variant ?? settings.avatarId ?? "brote";

  if (activeVariant === "oculto") {
    return null;
  }

  const handleTap = () => {
    if (!interactive) return;
    setTapHeart(true);
    setTimeout(() => setTapHeart(false), 1400);
  };

  const isAnxious = todayMood?.mood === "ansioso" || todayMood?.mood === "abrumado";
  const isTired = todayMood?.mood === "cansado";
  const isCalmOrHopeful = todayMood?.mood === "calmado" || todayMood?.mood === "esperanzado";

  const dimClass =
    size === "lg" ? "size-28" : size === "md" ? "size-20" : size === "sm" ? "size-14" : "size-10";
  const auraClass =
    size === "lg" ? "size-36" : size === "md" ? "size-24" : size === "sm" ? "size-16" : "size-10";
  const isSmall = size === "sm" || size === "xs";

  return (
    <div
      onClick={handleTap}
      className={cn(
        "relative flex flex-col items-center justify-center select-none",
        interactive && "cursor-pointer active:scale-95 transition-transform",
      )}
    >
      {/* Floating Hearts / Sparkles on Tap */}
      <AnimatePresence>
        {tapHeart && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -35, scale: 1.2 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-none absolute -top-4 z-30 flex items-center gap-1 font-bold text-rose-500 drop-shadow-md text-sm"
          >
            <span>💖</span>
            <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
              ¡Aquí estoy contigo!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer Soft Pastel Aura */}
      <motion.div
        className={cn(
          "pointer-events-none absolute rounded-full blur-2xl",
          auraClass,
          activeVariant === "constelacion"
            ? "bg-indigo-400/35"
            : activeVariant === "geometrico"
              ? "bg-emerald-400/35"
              : activeVariant === "ondas"
                ? "bg-orange-400/35"
                : isAnxious
                  ? "bg-teal-300/45"
                  : isTired
                    ? "bg-amber-200/40"
                    : "bg-amber-300/40",
        )}
        animate={{
          scale: isAnxious
            ? [1, 1.3, 1] // Guía de respiración lenta
            : phase === "speaking"
              ? [1, 1.22, 1]
              : [0.95, 1.08, 0.95],
        }}
        transition={{
          duration: isAnxious ? 4.2 : phase === "speaking" ? 1.2 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Animated 3D Character Container */}
      <motion.div
        animate={
          isAnxious
            ? { scale: [1, 1.08, 1], y: [0, -3, 0] } // Co-regulación respiratoria (4.2 segundos)
            : phase === "speaking"
              ? { y: [0, -5, 0], scale: [1, 1.05, 0.98, 1.03, 1] }
              : phase === "listening"
                ? { y: [0, -4, 0], rotate: [0, -3, 3, 0] }
                : phase === "thinking"
                  ? { y: [0, -3, 0], rotate: [-2, 2, -2] }
                  : { y: [0, -4, 0] }
        }
        transition={{
          duration: isAnxious ? 4.2 : phase === "speaking" ? 1.1 : phase === "listening" ? 1.6 : 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn("relative", dimClass)}
      >
        {/* =================================================================
            1. BROTE (Espíritu Mochi del Bosque — 3D Studio Grade)
           ================================================================= */}
        {activeVariant === "brote" && (
          <svg viewBox="0 0 140 140" className="size-full overflow-visible drop-shadow-xl">
            <defs>
              <radialGradient id="broteBody" cx="38%" cy="32%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="55%" stopColor="#FFF3E6" />
                <stop offset="100%" stopColor="#FCD5B5" />
              </radialGradient>
              <linearGradient id="broteRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>
              <linearGradient id="broteLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Sprout Leaves on Top */}
            <g className="origin-bottom">
              <path d="M70 25 C70 11, 86 7, 90 16 C88 24, 76 26, 70 25 Z" fill="url(#broteLeaf)" />
              <path d="M70 25 C68 14, 54 12, 51 19 C54 25, 64 26, 70 25 Z" fill="#34D399" />
              <path d="M70 28 L70 22" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Side Paws */}
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

            {/* Main 3D Mochi Body */}
            <path
              d="M70 26 C104 26, 118 50, 118 78 C118 104, 100 118, 70 118 C40 118, 22 104, 22 78 C22 50, 36 26, 70 26 Z"
              fill="url(#broteBody)"
              stroke="url(#broteRim)"
              strokeWidth="3.5"
            />

            {/* 3D Specular Gloss */}
            <ellipse cx="52" cy="42" rx="16" ry="7" transform="rotate(-15 52 42)" fill="#FFFFFF" opacity="0.75" />

            {/* Rosy Cheeks */}
            <ellipse cx="42" cy="79" rx="8.5" ry="5" fill="#FB7185" opacity="0.45" />
            <ellipse cx="98" cy="79" rx="8.5" ry="5" fill="#FB7185" opacity="0.45" />

            {/* Eyes */}
            {phase === "speaking" ? (
              <>
                <path d="M45 67 Q52 58 59 67" fill="none" stroke="#432818" strokeWidth="4.2" strokeLinecap="round" />
                <path d="M81 67 Q88 58 95 67" fill="none" stroke="#432818" strokeWidth="4.2" strokeLinecap="round" />
              </>
            ) : isTired ? (
              <>
                {/* Sleepy soothing eyes */}
                <path d="M46 68 Q52 74 58 68" fill="none" stroke="#432818" strokeWidth="3.8" strokeLinecap="round" />
                <path d="M82 68 Q88 74 94 68" fill="none" stroke="#432818" strokeWidth="3.8" strokeLinecap="round" />
              </>
            ) : isCalmOrHopeful ? (
              <>
                {/* Happy smiling eyes */}
                <path d="M46 68 Q52 61 58 68" fill="none" stroke="#432818" strokeWidth="4" strokeLinecap="round" />
                <path d="M82 68 Q88 61 94 68" fill="none" stroke="#432818" strokeWidth="4" strokeLinecap="round" />
                <circle cx="52" cy="57" r="1.5" fill="#F59E0B" />
                <circle cx="88" cy="57" r="1.5" fill="#F59E0B" />
              </>
            ) : (
              <>
                <circle cx="52" cy="66" r="7.5" fill="#3B2314" />
                <circle cx="49.5" cy="63.5" r="2.8" fill="#FFFFFF" />
                <circle cx="54.5" cy="68.5" r="1.3" fill="#FFFFFF" />
                <circle cx="88" cy="66" r="7.5" fill="#3B2314" />
                <circle cx="85.5" cy="63.5" r="2.8" fill="#FFFFFF" />
                <circle cx="90.5" cy="68.5" r="1.3" fill="#FFFFFF" />
              </>
            )}

            {/* Mouth */}
            <path
              d={phase === "speaking" ? "M63 80 Q70 91 77 80 Z" : "M64 81 Q70 87 76 81"}
              fill={phase === "speaking" ? "#E11D48" : "none"}
              stroke="#432818"
              strokeWidth={phase === "speaking" ? "2" : "3.5"}
              strokeLinecap="round"
            />

            {/* Cozy Warm Tea Accessory if Tired */}
            {isTired && !isSmall && (
              <g transform="translate(56, 92)">
                <rect x="0" y="4" width="28" height="20" rx="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                <path d="M28 8 Q34 14 28 20" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                {/* Steam */}
                <motion.path
                  d="M8 0 Q10 -6 8 -12 M18 0 Q20 -6 18 -12"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ y: [0, -4, 0], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </g>
            )}
          </svg>
        )}

        {/* =================================================================
            2. KITSUNE (Guardián Zorro de Enfoque — 3D Studio Grade)
           ================================================================= */}
        {activeVariant === "ondas" && (
          <svg viewBox="0 0 140 140" className="size-full overflow-visible drop-shadow-xl">
            <defs>
              <radialGradient id="foxBody" cx="38%" cy="30%" r="72%">
                <stop offset="0%" stopColor="#FFF7ED" />
                <stop offset="45%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#C2410C" />
              </radialGradient>
              <linearGradient id="foxEar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7C2D12" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>

            {/* Fluffy Fox Tail Tip on Right */}
            <path
              d="M108 96 C128 88, 134 66, 120 58 C114 66, 112 80, 104 88 Z"
              fill="#EA580C"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            <circle cx="122" cy="63" r="6" fill="#FFF7ED" />

            {/* Pointed Kitsune Ears */}
            <path d="M28 48 L20 12 L52 30 Z" fill="url(#foxEar)" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M30 42 L25 20 L45 32 Z" fill="#FDE68A" />
            <path d="M112 48 L120 12 L88 30 Z" fill="url(#foxEar)" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M110 42 L115 20 L95 32 Z" fill="#FDE68A" />

            {/* Main 3D Fox Head/Body */}
            <path
              d="M70 26 C104 26, 118 52, 118 78 C118 104, 98 118, 70 118 C42 118, 22 104, 22 78 C22 52, 36 26, 70 26 Z"
              fill="url(#foxBody)"
              stroke="#FFFFFF"
              strokeWidth="3.5"
            />

            {/* Cream White Fur Cheek Mask */}
            <path
              d="M24 78 C36 68, 56 76, 70 90 C84 76, 104 68, 116 78 C114 104, 96 117, 70 117 C44 117, 26 104, 24 78 Z"
              fill="#FFF7ED"
            />

            {/* Forehead Golden Diamond Star */}
            <path d="M70 36 L74 44 L70 52 L66 44 Z" fill="#FDE047" />

            {/* Gloss Highlight */}
            <ellipse cx="50" cy="40" rx="13" ry="5" transform="rotate(-15 50 40)" fill="#FFFFFF" opacity="0.55" />

            {/* Blush */}
            <ellipse cx="40" cy="82" rx="7.5" ry="4.5" fill="#F43F5E" opacity="0.45" />
            <ellipse cx="100" cy="82" rx="7.5" ry="4.5" fill="#F43F5E" opacity="0.45" />

            {/* Expressive Eyes */}
            {phase === "speaking" ? (
              <>
                <path d="M44 66 Q51 57 58 66" fill="none" stroke="#271206" strokeWidth="4.2" strokeLinecap="round" />
                <path d="M82 66 Q89 57 96 66" fill="none" stroke="#271206" strokeWidth="4.2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="51" cy="65" r="7.5" fill="#271206" />
                <circle cx="48.5" cy="62.5" r="2.8" fill="#FFFFFF" />
                <circle cx="53.5" cy="67.5" r="1.3" fill="#FDE047" />
                <circle cx="89" cy="65" r="7.5" fill="#271206" />
                <circle cx="86.5" cy="62.5" r="2.8" fill="#FFFFFF" />
                <circle cx="91.5" cy="67.5" r="1.3" fill="#FDE047" />
              </>
            )}

            {/* Cute Little Fox Nose & Smile */}
            <polygon points="66,73 74,73 70,78" fill="#271206" />
            <path
              d={phase === "speaking" ? "M61 81 Q70 91 79 81" : "M62 81 Q70 87 78 81"}
              fill="none"
              stroke="#271206"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* =================================================================
            3. BÚHO MENTOR (Sabiduría Académica — 3D Studio Grade)
           ================================================================= */}
        {activeVariant === "geometrico" && (
          <svg viewBox="0 0 140 140" className="size-full overflow-visible drop-shadow-xl">
            <defs>
              <radialGradient id="owlBody" cx="38%" cy="30%" r="72%">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#065F46" />
              </radialGradient>
            </defs>

            {/* Side Feathered Wings */}
            <ellipse
              cx="21"
              cy="82"
              rx="10"
              ry="16"
              transform={phase === "speaking" ? "rotate(-20 21 82)" : "rotate(-8 21 82)"}
              fill="#047857"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            <ellipse
              cx="119"
              cy="82"
              rx="10"
              ry="16"
              transform={phase === "speaking" ? "rotate(20 119 82)" : "rotate(8 119 82)"}
              fill="#047857"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />

            {/* Main 3D Owl Body */}
            <path
              d="M70 24 C105 24, 118 48, 118 78 C118 105, 100 118, 70 118 C40 118, 22 105, 22 78 C22 48, 35 24, 70 24 Z"
              fill="url(#owlBody)"
              stroke="#FFFFFF"
              strokeWidth="3.5"
            />

            {/* Owl Feather Ear Tufts */}
            <path d="M28 36 L20 20 L42 28 Z" fill="#065F46" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M112 36 L120 20 L98 28 Z" fill="#065F46" stroke="#FFFFFF" strokeWidth="2" />

            {/* Soft Cream Belly Patch */}
            <ellipse cx="70" cy="98" rx="30" ry="18" fill="#ECFDF5" />
            <path d="M58 95 Q62 100 66 95" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M74 95 Q78 100 82 95" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

            {/* Big Round Owl Eye Masks + Golden Glasses */}
            <circle cx="51" cy="62" r="17" fill="#FFFDF9" stroke="#F59E0B" strokeWidth="3.5" />
            <circle cx="89" cy="62" r="17" fill="#FFFDF9" stroke="#F59E0B" strokeWidth="3.5" />
            <line x1="68" y1="62" x2="72" y2="62" stroke="#F59E0B" strokeWidth="3.5" />

            {/* Eyes Inside Glasses */}
            {phase === "speaking" ? (
              <>
                <path d="M44 63 Q51 55 58 63" fill="none" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" />
                <path d="M82 63 Q89 55 96 63" fill="none" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="51" cy="62" r="7.5" fill="#064E3B" />
                <circle cx="48.5" cy="59.5" r="2.8" fill="#FFFFFF" />
                <circle cx="89" cy="62" r="7.5" fill="#064E3B" />
                <circle cx="86.5" cy="59.5" r="2.8" fill="#FFFFFF" />
              </>
            )}

            {/* Golden Owl Beak */}
            <polygon points="65,71 75,71 70,80" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          </svg>
        )}

        {/* =================================================================
            4. NOVA ASTRAL (Espíritu Estelar Nocturno — 3D Studio Grade)
           ================================================================= */}
        {activeVariant === "constelacion" && (
          <svg viewBox="0 0 140 140" className="size-full overflow-visible drop-shadow-xl">
            <defs>
              <radialGradient id="novaBody" cx="35%" cy="30%" r="72%">
                <stop offset="0%" stopColor="#E0E7FF" />
                <stop offset="48%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#312E81" />
              </radialGradient>
            </defs>

            {/* Orbiting Golden Star Halo */}
            <ellipse
              cx="70"
              cy="76"
              rx="58"
              ry="16"
              transform="rotate(-14 70 76)"
              fill="none"
              stroke="#FDE047"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.8"
            />

            {/* Glowing Crescent Moon Crown on Top */}
            <path
              d="M64 12 C56 16, 58 28, 68 30 C61 32, 52 26, 54 16 C56 10, 61 10, 64 12 Z"
              fill="#FDE047"
            />
            <circle cx="76" cy="16" r="3" fill="#FDE047" />

            {/* Main 3D Cosmic Body */}
            <path
              d="M70 26 C104 26, 118 50, 118 78 C118 104, 100 118, 70 118 C40 118, 22 104, 22 78 C22 50, 36 26, 70 26 Z"
              fill="url(#novaBody)"
              stroke="#C7D2FE"
              strokeWidth="3.5"
            />

            {/* 3D Specular Gloss */}
            <ellipse cx="52" cy="42" rx="15" ry="6.5" transform="rotate(-15 52 42)" fill="#FFFFFF" opacity="0.65" />

            {/* Soft Starlight Blush */}
            <ellipse cx="42" cy="79" rx="8" ry="4.5" fill="#F472B6" opacity="0.5" />
            <ellipse cx="98" cy="79" rx="8" ry="4.5" fill="#F472B6" opacity="0.5" />

            {/* Luminous Star Eyes */}
            {phase === "speaking" ? (
              <>
                <path d="M45 67 Q52 58 59 67" fill="none" stroke="#FEF08A" strokeWidth="4.2" strokeLinecap="round" />
                <path d="M81 67 Q88 58 95 67" fill="none" stroke="#FEF08A" strokeWidth="4.2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="52" cy="66" r="7.5" fill="#1E1B4B" />
                <circle cx="49.5" cy="63.5" r="2.8" fill="#FEF08A" />
                <circle cx="54.5" cy="68.5" r="1.4" fill="#FFFFFF" />
                <circle cx="88" cy="66" r="7.5" fill="#1E1B4B" />
                <circle cx="85.5" cy="63.5" r="2.8" fill="#FEF08A" />
                <circle cx="90.5" cy="68.5" r="1.4" fill="#FFFFFF" />
              </>
            )}

            {/* Cosmic Smile */}
            <path
              d={phase === "speaking" ? "M60 77 Q70 88 80 77" : "M61 77 Q70 84 79 77"}
              fill="none"
              stroke="#FEF08A"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </motion.div>

      {/* External Soundwave Equalizer Pill BELOW the character */}
      {showWavePill && !isSmall && (
        <div className="mt-1 flex h-6 items-center justify-center gap-1 rounded-full border border-white/20 bg-slate-950/85 px-3.5 py-1 shadow-md backdrop-blur-md">
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
