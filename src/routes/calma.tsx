import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookHeart, Check, ChevronRight, GraduationCap, Hand, Sparkles, Waves, Wind } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, ScreenHeader } from "@/components/near/AppScreen";
import { NearActivityGuide } from "@/components/near/NearActivityGuide";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calma")({
  head: () => ({
    meta: [
      { title: "Pausas de Calma · Near Apoyo Emocional" },
      { name: "description", content: "Respiración 4-7-8, sonidos de calma y tu bitácora emocional en un solo lugar." },
      { property: "og:title", content: "Pausas de Calma · Near Apoyo Emocional" },
      { property: "og:description", content: "Respiración 4-7-8, sonidos de calma y tu bitácora emocional en un solo lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen emergency>
      <CalmaHub />
    </AppScreen>
  ),
});

const tools = [
  {
    to: "/respiracion",
    title: "Pausa Consciente 4-7-8",
    subtitle: "Respiración guiada con vibración háptica · 3 min",
    badge: "+20 XP",
    icon: Wind,
    cardStyle:
      "border-sky-500 border-b-sky-700 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20",
  },
  {
    to: "/sonidos",
    title: "Paisajes Sonoros Zen",
    subtitle: "Lluvia, olas, fogata y bosque sintetizados en vivo",
    badge: "Audio Zen",
    icon: Waves,
    cardStyle:
      "border-teal-500 border-b-teal-700 bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20",
  },
  {
    to: "/bitacora",
    title: "Bitácora & Estadísticas",
    subtitle: "Tu mapa emocional de la semana y diario",
    badge: "Progreso",
    icon: BookHeart,
    cardStyle:
      "border-violet-500 border-b-violet-700 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20",
  },
] as const;

const grounding = [
  { n: 5, emoji: "👀", text: "cosas que puedes ver a tu alrededor" },
  { n: 4, emoji: "✋", text: "texturas que puedes tocar ahora mismo" },
  { n: 3, emoji: "👂", text: "sonidos distintos que logras escuchar" },
  { n: 2, emoji: "🌿", text: "aromas que percibes en el ambiente" },
  { n: 1, emoji: "💧", text: "sabor o sensación en tu boca" },
];

function CalmaHub() {
  const { addXp, showPill } = useNear();
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [rewarded, setRewarded] = useState(false);

  const toggleStep = (n: number) => {
    const isChecked = checkedSteps.includes(n);
    const updated = isChecked ? checkedSteps.filter((s) => s !== n) : [...checkedSteps, n];
    setCheckedSteps(updated);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignorar si haptics no está disponible
      }
    }

    if (!isChecked && updated.length === 5) {
      if (!rewarded) {
        setRewarded(true);
        addXp(20);
        showPill({
          emoji: "🌿",
          title: "¡Anclaje 5-4-3-2-1 Completado!",
          subtitle: "Ganaste +20 Semillas de Calma",
          tone: "gold",
        });
      }
      toast.success("¡Anclaje 5-4-3-2-1 completado! 🌿", {
        description: "Regresaste al momento presente. Tómate un segundo para sentir tus pies en la tierra.",
      });
    }
  };

  const progressPct = Math.round((checkedSteps.length / 5) * 100);

  return (
    <div className="bg-sanctuary pb-6">
      <ScreenHeader title="Kit de Calma Interactiva" subtitle="Rituales táctiles para bajar revoluciones en minutos." />
      <div className="space-y-3.5 px-4 pt-3">
        <NearActivityGuide
          title="Near te acompaña en tu pausa"
          explanation="Elige el ritual que tu mente pida hoy: respiración guiada 4-7-8, sonidos relajantes o el reto sensorial 5-4-3-2-1 para aterrizar en el presente."
        />
        {tools.map((t, i) => (
          <motion.div
            key={t.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={t.to}
              className={cn(
                "flex items-center gap-4 rounded-3xl border-2 border-b-[6px] p-4 transition-all active:translate-y-1 active:border-b-2",
                t.cardStyle,
              )}
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-white/40 bg-white/20 text-white shadow-xs">
                <t.icon className="size-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="inline-block rounded-lg bg-black/20 px-2 py-0.5 text-[10px] font-black uppercase">
                  {t.badge}
                </span>
                <span className="mt-0.5 block font-display text-lg font-black text-white">{t.title}</span>
                <span className="block text-xs text-white/90">{t.subtitle}</span>
              </span>
              <ChevronRight className="size-5 text-white/80" />
            </Link>
          </motion.div>
        ))}

        {/* Ejercicio de Anclaje Sensorial Interactivo Gamificado */}
        <section className="mt-5 rounded-[30px] border-2 border-b-[6px] border-emerald-400 border-b-emerald-600 bg-surface p-5 shadow-lg dark:border-emerald-800 dark:border-b-emerald-950">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-2xl border-2 border-b-4 border-emerald-600 bg-emerald-500 text-white">
                <Hand className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-extrabold text-heading">Reto Sensorial 5-4-3-2-1</h2>
                <p className="text-xs text-muted-foreground">Aterriza tu mente en el aquí y el ahora</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Sparkles className="size-3" /> +20 XP
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-3 flex-1 overflow-hidden rounded-full border border-border bg-surface-2 p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {checkedSteps.length}/5
            </span>
            {checkedSteps.length > 0 && (
              <button
                type="button"
                onClick={() => setCheckedSteps([])}
                className="text-xs font-bold text-muted-foreground underline hover:text-heading"
              >
                Reiniciar
              </button>
            )}
          </div>

          <ul className="space-y-2.5">
            {grounding.map((g) => {
              const done = checkedSteps.includes(g.n);
              return (
                <motion.li
                  key={g.n}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleStep(g.n)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-b-4 px-3.5 py-3 text-sm font-bold transition-all active:translate-y-0.5 active:border-b-2",
                    done
                      ? "border-emerald-500 border-b-emerald-700 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "border-border border-b-neutral-300 bg-background text-heading hover:bg-surface-2 dark:border-b-neutral-800",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-xl border-2 text-xs font-black transition-all",
                      done
                        ? "border-white bg-white text-emerald-600"
                        : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    )}
                  >
                    {done ? <Check className="size-4 stroke-[3.5]" /> : g.n}
                  </span>
                  <span className="text-base">{g.emoji}</span>
                  <span className={cn("flex-1 text-xs font-extrabold", done && "line-through opacity-90")}>
                    {g.n} {g.text}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </section>

        {/* Vinculación Institucional UTVT */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 rounded-3xl border-2 border-b-[5px] border-amber-400 border-b-amber-600 bg-amber-50/90 p-4 dark:border-amber-800 dark:border-b-amber-950 dark:bg-amber-950/40"
        >
          <div className="flex items-start gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-b-4 border-amber-700 bg-amber-500 text-white shadow-xs">
              <GraduationCap className="size-6" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-black tracking-wider text-amber-800 uppercase dark:text-amber-300">
                Apoyo Institucional UTVT
              </p>
              <h3 className="text-sm font-extrabold text-heading">Servicio Psicopedagógico Escolar</h3>
              <p className="mt-1 text-xs font-medium text-foreground/85 leading-relaxed">
                Edificio D (Tutorías y Apoyo al Estudiante), Campus Santa María Atarasquillo, Lerma. Orientación confidencial y gratuita para alumnos.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
