import { motion } from "framer-motion";
import { Flower2, Heart, Sparkles, Sprout, Sun } from "lucide-react";
import { useNear } from "@/context/NearContext";

export function GardenWidget() {
  const { xp, streak } = useNear();

  // Tier calculation based on XP and streak
  // Tier 1: Semilla en tierra (0 - 80 XP)
  // Tier 2: Brote tierno (81 - 200 XP)
  // Tier 3: Trébol y flor silvestre (201 - 350 XP)
  // Tier 4: Bonsái de Romero en Flor (351 - 500 XP)
  // Tier 5+: Árbol de la Serenidad del Campus UTVT (>500 XP)
  const tier =
    xp > 500 ? 5 : xp > 350 ? 4 : xp > 200 ? 3 : xp > 80 ? 2 : 1;

  const tierMeta = [
    {
      name: "Semilla de Calma",
      desc: "Tu viaje de autocuidado recién sembrado.",
      flowerColor: "#10B981",
      badge: "Nivel 1 · Germinando",
    },
    {
      name: "Brote de Lavanda",
      desc: "Dos hojitas fuertes que crecen con tus pausas diarias.",
      flowerColor: "#8B5CF6",
      badge: "Nivel 2 · Creciendo",
    },
    {
      name: "Trébol y Jazmín",
      desc: "Flores tiernas que perfuman tus días de estudio.",
      flowerColor: "#EC4899",
      badge: "Nivel 3 · Floreciendo",
    },
    {
      name: "Bonsái de Romero Zen",
      desc: "Ramas sólidas para mantener la serenidad en parciales.",
      flowerColor: "#F59E0B",
      badge: "Nivel 4 · Resiliente",
    },
    {
      name: "Árbol de la Paz UTVT",
      desc: "Un roble sabio que te da sombra y calma profunda.",
      flowerColor: "#E11D48",
      badge: "Nivel 5 · Sabiduría Zen",
    },
  ][tier - 1]!;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-emerald-600/15 bg-gradient-to-b from-[#F2FBF5] via-[#E8F7EE] to-[#DCF2E4] p-5 text-[#133A26] shadow-sm dark:border-emerald-500/20 dark:from-[#112419] dark:via-[#0F1E15] dark:to-[#0A160F] dark:text-[#E2F7EB]">
      {/* Luces mágicas flotantes */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-8 -right-8 size-36 rounded-full bg-emerald-300/30 blur-2xl dark:bg-emerald-600/20"
      />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/15 bg-white/80 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sprout className="size-3" />
            {tierMeta.badge}
          </span>
          <h3 className="mt-1 font-display text-base font-bold text-heading dark:text-[#E2F7EB]">
            {tierMeta.name}
          </h3>
          <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
            {tierMeta.desc}
          </p>
        </div>

        {/* Ilustración Viva de la Planta */}
        <div className="relative grid size-20 shrink-0 place-items-center rounded-2xl bg-white/70 shadow-2xs backdrop-blur-sm dark:bg-emerald-950/50">
          <svg viewBox="0 0 100 100" className="size-16 overflow-visible">
            {/* Maceta de barro suave */}
            <path
              d="M30 70 L70 70 L65 92 L35 92 Z"
              fill="#D97706"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect x="27" y="66" width="46" height="6" rx="3" fill="#F59E0B" />

            {/* Tallo y hojas animadas */}
            <motion.path
              d="M50 66 Q48 45 50 32"
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Hojas */}
            <motion.path
              d="M50 52 C38 50, 36 38, 48 42 C49 46, 50 50, 50 52 Z"
              fill="#10B981"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.8, repeat: Infinity }}
            />
            <motion.path
              d="M50 44 C62 42, 64 30, 52 34 C51 38, 50 42, 50 44 Z"
              fill="#34D399"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }}
            />

            {/* Flor / Coronación según tier */}
            {tier >= 3 && (
              <motion.circle
                cx="50"
                cy="28"
                r="6"
                fill={tierMeta.flowerColor}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {tier >= 4 && (
              <>
                <circle cx="43" cy="28" r="3.5" fill="#FDE047" opacity="0.8" />
                <circle cx="57" cy="28" r="3.5" fill="#FDE047" opacity="0.8" />
              </>
            )}
          </svg>

          {/* Chispa de crecimiento */}
          <motion.span
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] text-amber-950 shadow-2xs"
            title="Cuidado diario"
          >
            ✨
          </motion.span>
        </div>
      </div>

      {/* Riego diario con la racha */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-700/10 bg-white/70 px-3.5 py-2 text-xs backdrop-blur-sm dark:bg-emerald-950/40">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-900 dark:text-emerald-200">
          <Heart className="size-3.5 fill-rose-500 text-rose-500" />
          Regada hoy ({streak} días de amor propio)
        </span>
        <span className="font-extrabold text-emerald-800 dark:text-emerald-300">
          +{xp % 100}/100 para nueva flor 🌸
        </span>
      </div>
    </div>
  );
}
