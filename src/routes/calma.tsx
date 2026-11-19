import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookHeart, Check, ChevronRight, GraduationCap, Hand, Waves, Wind } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, ScreenHeader } from "@/components/near/AppScreen";

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
  { to: "/respiracion", title: "Pausa Consciente", subtitle: "Respiración 4-7-8 guiada · 3 min", icon: Wind, tone: "bg-primary-tint text-primary" },
  { to: "/sonidos", title: "Sonidos de Calma", subtitle: "Lluvia, olas, fogata y bosque", icon: Waves, tone: "bg-secondary-tint text-secondary" },
  { to: "/bitacora", title: "Bitácora emocional", subtitle: "Tu semana, patrones y reflexiones", icon: BookHeart, tone: "bg-success-tint text-success" },
] as const;

const grounding = [
  { n: 5, text: "cosas que puedes ver" },
  { n: 4, text: "cosas que puedes tocar" },
  { n: 3, text: "sonidos que escuchas" },
  { n: 2, text: "olores que percibes" },
  { n: 1, text: "sabor en tu boca" },
];

function CalmaHub() {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

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
      toast.success("¡Anclaje 5-4-3-2-1 completado! 🌿", {
        description: "Regresaste al momento presente. Tómate un segundo para sentir tus pies en la tierra.",
      });
    }
  };

  return (
    <div className="bg-sanctuary pb-6">
      <ScreenHeader title="Pausas de calma" subtitle="Pequeños rituales para volver a tu centro." />
      <div className="space-y-3 px-5">
        {tools.map((t, i) => (
          <motion.div
            key={t.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={t.to} className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-soft transition-shadow hover:shadow-lift">
              <span className={`grid size-14 place-items-center rounded-2xl ${t.tone}`}>
                <t.icon className="size-7" />
              </span>
              <span className="flex-1">
                <span className="block font-display text-lg font-semibold text-heading">{t.title}</span>
                <span className="block text-sm text-muted-foreground">{t.subtitle}</span>
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}

        {/* Ejercicio de Anclaje Sensorial Interactivo */}
        <section className="mt-6 rounded-3xl bg-secondary p-5 text-secondary-foreground shadow-lift">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hand className="size-5" />
              <h2 className="font-display text-lg font-semibold text-secondary-foreground">Anclaje 5-4-3-2-1</h2>
            </div>
            {checkedSteps.length > 0 && (
              <button
                type="button"
                onClick={() => setCheckedSteps([])}
                className="text-xs text-secondary-tint/80 underline underline-offset-2 hover:text-secondary-tint"
              >
                Reiniciar
              </button>
            )}
          </div>
          <p className="mb-4 text-sm opacity-90">Toca cada paso conforme lo identifiques a tu alrededor:</p>
          <ul className="space-y-2">
            {grounding.map((g) => {
              const done = checkedSteps.includes(g.n);
              return (
                <motion.li
                  key={g.n}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleStep(g.n)}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-all ${
                    done
                      ? "bg-secondary-foreground/20 text-secondary-foreground font-medium"
                      : "bg-secondary-foreground/10 text-secondary-foreground/90 hover:bg-secondary-foreground/15"
                  }`}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                      done ? "bg-success text-success-foreground" : "bg-secondary-foreground text-secondary"
                    }`}
                  >
                    {done ? <Check className="size-4 stroke-[3]" /> : g.n}
                  </span>
                  <span className={`flex-1 ${done ? "line-through opacity-85" : ""}`}>{g.text}</span>
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
          className="mt-6 rounded-3xl border border-primary/20 bg-primary-tint/40 p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <GraduationCap className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold tracking-wide text-primary uppercase">Apoyo Institucional UTVT</p>
              <h3 className="text-sm font-semibold text-heading">Servicio Psicopedagógico Escolar</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Edificio D (Tutorías y Apoyo al Estudiante), Campus Santa María Atarasquillo, Lerma. Orientación confidencial y gratuita para alumnos.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
