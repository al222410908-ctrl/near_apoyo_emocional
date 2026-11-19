import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookHeart, ChevronRight, Heart, MessageCircleHeart, Mic, Waves, Wind } from "lucide-react";
import { AppScreen } from "@/components/near/AppScreen";
import { StreakWidget } from "@/components/near/StreakWidget";
import { MoodChips } from "@/components/near/MoodChips";
import { SosDialog } from "@/components/near/SosDialog";
import { useNear } from "@/context/NearContext";
import { quoteOfTheDay } from "@/services/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Inicio · Near Apoyo Emocional" },
      { name: "description", content: "Tu racha de calma, registro de ánimo y pausas rápidas para hoy." },
      { property: "og:title", content: "Inicio · Near Apoyo Emocional" },
      { property: "og:description", content: "Tu racha de calma, registro de ánimo y pausas rápidas para hoy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen emergency>
      <Dashboard />
    </AppScreen>
  ),
});

function greeting(d = new Date()) {
  const h = d.getHours();
  return h >= 5 && h < 12 ? "Buen día" : h >= 12 && h < 19 ? "Buenas tardes" : "Buenas noches";
}

const fade = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 * i, duration: 0.35 },
});

function Dashboard() {
  const { displayName, favorites, toggleFavorite } = useNear();
  const quote = quoteOfTheDay();
  const fav = favorites.includes(quote.id);

  return (
    <div className="space-y-6 bg-sanctuary px-5 pt-6 pb-4">
      <motion.header {...fade(0)} className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] leading-tight font-semibold">
            {greeting()}
            {displayName ? `, ${displayName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm">Tu refugio está listo para ti hoy.</p>
        </div>
        <SosDialog
          trigger={
            <button type="button" className="rounded-full bg-sos px-3.5 py-2 text-xs font-bold tracking-wide text-sos-foreground shadow-sm active:scale-95">
              SOS
            </button>
          }
        />
      </motion.header>

      <motion.div {...fade(1)}>
        <StreakWidget />
      </motion.div>

      <motion.section {...fade(2)}>
        <h2 className="mb-3 text-lg font-semibold">¿Cómo te sientes hoy?</h2>
        <MoodChips />
      </motion.section>

      <motion.section {...fade(3)} className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
        <h2 className="text-lg font-semibold">¿Quieres desahogarte o reflexionar?</h2>
        <p className="mt-1 mb-4 text-sm">Near te escucha sin juicios, a tu ritmo.</p>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/chat" className="group flex flex-col gap-3 rounded-2xl bg-primary-tint p-4 transition-transform active:scale-[0.98]">
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <MessageCircleHeart className="size-5" />
            </span>
            <span>
              <span className="block font-semibold text-heading">Chatear</span>
              <span className="block text-xs text-muted-foreground">Escribe con calma</span>
            </span>
          </Link>
          <Link to="/voz" className="group flex flex-col gap-3 rounded-2xl bg-secondary-tint p-4 transition-transform active:scale-[0.98]">
            <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <Mic className="size-5" />
            </span>
            <span>
              <span className="block font-semibold text-heading">Hablar con voz</span>
              <span className="block text-xs text-muted-foreground">Siente un diálogo real</span>
            </span>
          </Link>
        </div>
      </motion.section>

      <motion.section {...fade(4)} className="relative overflow-hidden rounded-3xl bg-secondary p-5 text-secondary-foreground">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide uppercase opacity-80">Reflexión del día</p>
          <button
          type="button"
          onClick={() => toggleFavorite(quote.id)}
          className="grid size-10 place-items-center rounded-full bg-secondary-foreground/15 active:scale-90"
          aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
          aria-pressed={fav}
        >
          <Heart className={cn("size-5", fav && "fill-current")} />
          </button>
        </div>
        <p className="mt-1 font-display text-lg leading-snug">“{quote.text}”</p>
      </motion.section>

      <motion.section {...fade(5)}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pausas de calma rápida</h2>
          <span className="text-xs text-muted-foreground">2-5 min</span>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
          <Link to="/respiracion" className="flex w-[72%] shrink-0 snap-start flex-col justify-between gap-6 rounded-3xl bg-primary-tint p-5 active:scale-[0.98]">
            <span className="grid size-12 place-items-center rounded-2xl bg-background/70 text-primary">
              <Wind className="size-6" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold text-heading">Respiración 4-7-8</span>
              <span className="block text-sm">3 min para soltar tensión</span>
            </span>
          </Link>
          <Link to="/sonidos" className="flex w-[72%] shrink-0 snap-start flex-col justify-between gap-6 rounded-3xl bg-secondary-tint p-5 active:scale-[0.98]">
            <span className="grid size-12 place-items-center rounded-2xl bg-background/70 text-secondary">
              <Waves className="size-6" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold text-heading">Sonidos de calma</span>
              <span className="block text-sm">5 min de lluvia y olas</span>
            </span>
          </Link>
        </div>
      </motion.section>

      <motion.div {...fade(6)}>
        <Link to="/bitacora" className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 active:scale-[0.99]">
          <span className="grid size-12 place-items-center rounded-2xl bg-success-tint text-success">
            <BookHeart className="size-6" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-heading">Mi bitácora</span>
            <span className="block text-sm text-muted-foreground">Tus patrones y reflexiones de la semana</span>
          </span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>
      </motion.div>
    </div>
  );
}
