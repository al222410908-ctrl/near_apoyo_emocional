import { AnimatePresence, motion } from "framer-motion";
import { Crown, Flame, Sparkles, Sprout } from "lucide-react";
import { useState } from "react";
import { SosDialog } from "@/components/near/SosDialog";
import { useNear } from "@/context/NearContext";
import type { MoodId } from "@/types";

const MASCOT_TIPS = [
  "¡Tócame cuando necesites un recordatorio amable! Hoy no tienes que poder con todo a la vez. 🌿",
  "¿Sabías que exhalar más lento de lo que inhalas engaña a tu cerebro para apagar el estrés? 🌬️",
  "Un semestre se gana paso a paso, no en una sola madrugada sin dormir. ¡Cuida tu descanso! 🌙",
  "Si hoy solo avanzaste un 10% en tu proyecto, ese 10% ya es victoria. ¡Estoy orgulloso de ti! ✨",
  "Tu calificación mide un examen, nunca tu inteligencia ni lo lejos que vas a llegar. 🏆",
];

function getMoodMessage(name: string, mood?: MoodId) {
  const n = name ? `, ${name}` : "";
  if (mood === "ansioso") {
    return `Siento que hoy hay nervios${n}. Respira conmigo, vamos a bajar el ruido mental juntos.`;
  }
  if (mood === "abrumado") {
    return `Cuando todo se junta en la uni se siente pesado${n}. Hoy solo elijamos una cosa pequeña.`;
  }
  if (mood === "cansado") {
    return `Tu cuerpo pide pausa${n}. Se vale bajar la velocidad sin sentir culpa.`;
  }
  if (mood === "esperanzado") {
    return `¡Me encanta ver esa chispa hoy${n}! Aprovecha esta energía bonita a tu propio ritmo.`;
  }
  if (mood === "calmado") {
    return `¡Qué paz se siente hoy${n}! Guardemos este momento en tu racha de bienestar.`;
  }

  const h = new Date().getHours();
  if (h >= 5 && h < 12) return `¡Buen día${n}! ☀️ ¿Listo para conquistar tus clases sin descuidar tu paz?`;
  if (h >= 12 && h < 19) return `¡Hola${n}! 🌤️ Hagamos una pausa de 2 minutos para recargar tu batería mental.`;
  return `¡Buenas noches${n}! 🌙 Suelta la mochila escolar, aquí estás en tu refugio seguro.`;
}

export function NearMascotHero() {
  const { displayName, streak, xp, todayMood, addXp, showPill } = useNear();
  const [tapIndex, setTapIndex] = useState<number | null>(null);
  const [pettedToday, setPettedToday] = useState(false);
  const [jumping, setJumping] = useState(false);

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  const handleTapMascot = () => {
    setJumping(true);
    window.setTimeout(() => setJumping(false), 600);

    setTapIndex((prev) => (prev === null ? 0 : (prev + 1) % MASCOT_TIPS.length));

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([30, 50, 40]);
      } catch {
        // Ignore
      }
    }

    if (!pettedToday) {
      setPettedToday(true);
      addXp(5);
      showPill({
        emoji: "🦊",
        title: "¡Near se alegra de verte!",
        subtitle: "+5 Semillas de Calma por saludar a tu guía",
        tone: "gold",
      });
    }
  };

  const bubbleText = tapIndex !== null ? MASCOT_TIPS[tapIndex] : getMoodMessage(displayName, todayMood?.mood);

  return (
    <div className="space-y-4">
      {/* Top Gamified Duolingo-Style HUD Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Streak 3D Pill */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-orange-300 border-b-orange-500 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 shadow-xs dark:border-orange-700 dark:border-b-orange-900 dark:bg-orange-950/70 dark:text-orange-300"
            title="Tu Racha de Calma"
          >
            <Flame className="size-4 fill-orange-500 text-orange-500" />
            <span>{streak}</span>
          </motion.div>

          {/* Seeds XP 3D Pill */}
          <motion.div
            key={xp}
            initial={{ scale: 1.18 }}
            animate={{ scale: 1 }}
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-emerald-300 border-b-emerald-500 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 shadow-xs dark:border-emerald-700 dark:border-b-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300"
            title="Semillas de Calma (XP)"
          >
            <Sprout className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>{xp} XP</span>
          </motion.div>

          {/* Level 3D Pill */}
          <motion.div
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-violet-300 border-b-violet-500 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 shadow-xs dark:border-violet-700 dark:border-b-violet-900 dark:bg-violet-950/70 dark:text-violet-300"
            title="Nivel de Bienestar"
          >
            <Crown className="size-3.5 fill-violet-500 text-violet-600 dark:text-violet-300" />
            <span>Nv. {level}</span>
          </motion.div>
        </div>

        {/* 3D SOS Button */}
        <SosDialog
          trigger={
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              className="rounded-2xl border-2 border-b-4 border-rose-700 border-b-rose-900 bg-rose-600 px-3.5 py-1.5 text-xs font-black tracking-wider text-white shadow-md shadow-rose-500/25 transition-all active:translate-y-0.5 active:border-b-2"
            >
              SOS
            </motion.button>
          }
        />
      </div>

      {/* Main Colorful Mascot Sanctuary Card */}
      <div className="relative overflow-hidden rounded-[30px] border-2 border-b-[6px] border-amber-400/90 border-b-amber-600 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 p-5 text-white shadow-xl shadow-orange-500/20">
        {/* Decorative Background Circles & Sparkles */}
        <div className="pointer-events-none absolute -top-12 -right-12 size-44 rounded-full bg-white/15 blur-xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 size-40 rounded-full bg-yellow-300/25 blur-xl" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Interactive SVG Mascot Character */}
          <div className="relative shrink-0">
            <motion.button
              type="button"
              onClick={handleTapMascot}
              animate={
                jumping
                  ? { y: [0, -18, 0, -8, 0], scale: [1, 1.12, 0.95, 1.05, 1], rotate: [0, -8, 8, 0] }
                  : { y: [0, -5, 0] }
              }
              transition={
                jumping
                  ? { duration: 0.55 }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="group relative grid size-24 place-items-center rounded-[28px] border-2 border-b-4 border-white/60 border-b-amber-800/40 bg-white/25 p-2 shadow-lg backdrop-blur-md transition-transform active:scale-95"
              aria-label="Interactuar con Near"
            >
              {/* Custom Adorable Animated SVG Spirit Companion */}
              <svg viewBox="0 0 120 120" className="size-20 overflow-visible drop-shadow-md">
                <defs>
                  <radialGradient id="nearBodyGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFF7ED" />
                    <stop offset="45%" stopColor="#FDBA74" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </radialGradient>
                  <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Little Sprout Leaf on Top */}
                <g className="origin-bottom animate-bounce" style={{ animationDuration: "3s" }}>
                  <path d="M60 22 Q60 10 72 8 Q74 20 60 22 Z" fill="url(#leafGrad)" />
                  <path d="M60 22 Q58 12 48 12 Q48 22 60 22 Z" fill="#10B981" />
                </g>

                {/* Cute Ears / Horns */}
                <circle cx="32" cy="36" r="11" fill="#EA580C" />
                <circle cx="32" cy="36" r="6" fill="#FED7AA" />
                <circle cx="88" cy="36" r="11" fill="#EA580C" />
                <circle cx="88" cy="36" r="6" fill="#FED7AA" />

                {/* Main Cozy Spirit Body */}
                <rect x="20" y="24" width="80" height="76" rx="38" fill="url(#nearBodyGrad)" stroke="#FFFFFF" strokeWidth="3" />

                {/* Rosy Cheeks */}
                <ellipse cx="36" cy="68" rx="7" ry="4.5" fill="#F43F5E" opacity="0.55" />
                <ellipse cx="84" cy="68" rx="7" ry="4.5" fill="#F43F5E" opacity="0.55" />

                {/* Expressive Eyes */}
                {jumping ? (
                  <>
                    {/* Happy ^ ^ eyes when tapped */}
                    <path d="M38 56 Q44 48 50 56" fill="none" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
                    <path d="M70 56 Q76 48 82 56" fill="none" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="44" cy="56" r="6.5" fill="#1C1917" />
                    <circle cx="42" cy="53.5" r="2.2" fill="#FFFFFF" />
                    <circle cx="76" cy="56" r="6.5" fill="#1C1917" />
                    <circle cx="74" cy="53.5" r="2.2" fill="#FFFFFF" />
                  </>
                )}

                {/* Warm Smile */}
                <path
                  d={jumping ? "M50 66 Q60 77 70 66" : "M52 67 Q60 74 68 67"}
                  fill="none"
                  stroke="#1C1917"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />

                {/* Little Paws */}
                <circle cx="24" cy="76" r="7" fill="#FB923C" stroke="#FFF" strokeWidth="2" />
                <circle cx="96" cy="76" r="7" fill="#FB923C" stroke="#FFF" strokeWidth="2" />
              </svg>

              <span className="absolute -bottom-2 rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[10px] font-black text-orange-600 shadow">
                ¡Tócame! ✨
              </span>
            </motion.button>
          </div>

          {/* Speech Bubble & Greeting */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-xs">
                <Sparkles className="size-3 text-yellow-200" /> Compañero Near
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={bubbleText}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="relative rounded-2xl border-2 border-white/80 bg-white/95 p-3 text-neutral-900 shadow-md"
              >
                <p className="text-xs font-bold leading-snug text-neutral-800">
                  {bubbleText}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Level XP Progress Bar inside Hero */}
        <div className="relative z-10 mt-4 flex items-center gap-3 rounded-2xl bg-black/20 px-3.5 py-2 backdrop-blur-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/95">
            Nivel {level}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/25 p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-emerald-300"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(12, levelProgress)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span className="text-[11px] font-black tabular-nums text-yellow-200">
            {levelProgress}/100 XP
          </span>
        </div>
      </div>
    </div>
  );
}
