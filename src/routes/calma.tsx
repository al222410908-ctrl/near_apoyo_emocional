import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookHeart, ChevronRight, Hand, Waves, Wind } from "lucide-react";
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
  return (
    <div className="bg-sanctuary pb-4">
      <ScreenHeader title="Pausas de calma" subtitle="Pequeños rituales para volver a tu centro." />
      <div className="space-y-3 px-5">
        {tools.map((t, i) => (
          <motion.div key={t.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={t.to} className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-soft active:scale-[0.99]">
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

        <section className="mt-6 rounded-3xl bg-secondary p-5 text-secondary-foreground">
          <div className="mb-3 flex items-center gap-2">
            <Hand className="size-5" />
            <h2 className="font-display text-lg font-semibold text-secondary-foreground">Anclaje 5-4-3-2-1</h2>
          </div>
          <p className="mb-4 text-sm opacity-90">Cuando la mente corre muy rápido, vuelve al presente con tus sentidos. Nombra en silencio:</p>
          <ul className="space-y-2">
            {grounding.map((g) => (
              <li key={g.n} className="flex items-center gap-3 rounded-2xl bg-secondary-foreground/10 px-3 py-2 text-sm">
                <span className="grid size-7 place-items-center rounded-full bg-secondary-foreground font-semibold text-secondary">{g.n}</span>
                {g.text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
