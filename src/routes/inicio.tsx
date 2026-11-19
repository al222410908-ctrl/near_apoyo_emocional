import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookHeart, ChevronRight, Heart, Lightbulb, MessageCircleHeart, Mic, Sparkles, Waves, Wind } from "lucide-react";
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

function getSmartGreeting(displayName?: string, mood?: string) {
  const h = new Date().getHours();
  const name = displayName ? `, ${displayName}` : "";

  let title = "";
  let subtitle = "";
  let badge = "";

  if (h >= 5 && h < 12) {
    title = `Buen día${name}`;
    subtitle = "Un paso a la vez con tus entregas y materias de hoy. Tu propio ritmo es el adecuado.";
    badge = "Amanecer enfocado";
  } else if (h >= 12 && h < 19) {
    title = `Buenas tardes${name}`;
    subtitle = "Pausa a mitad de jornada. Suelta la tensión de la espalda y hombros.";
    badge = "Recarga vespertina";
  } else if (h >= 19 && h < 23) {
    title = `Noche serena${name}`;
    subtitle = "Lo que lograste hoy en la escuela fue suficiente. Es momento de desconectar.";
    badge = "Cierre de día";
  } else {
    title = `Noche silenciosa${name}`;
    subtitle = "Los pensamientos suelen sentirse más pesados a deshoras. Aquí tienes un refugio seguro.";
    badge = "Refugio nocturno";
  }

  if (mood === "ansioso" || mood === "abrumado") {
    subtitle = `Notamos que te sientes ${mood}. No tienes que resolver todo de golpe; date un respiro suave.`;
  } else if (mood === "cansado") {
    subtitle = "Día de esfuerzo. Date permiso de descansar y soltar la autoexigencia universitaria.";
  } else if (mood === "calmado" || mood === "esperanzado") {
    subtitle = "Qué paz verte por aquí. Abraza esta serenidad y llévala contigo en tu jornada.";
  }

  return { title, subtitle, badge };
}

const fade = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 * i, duration: 0.35 },
});

function Dashboard() {
  const { displayName, favorites, toggleFavorite, todayMood } = useNear();
  const quote = quoteOfTheDay();
  const fav = favorites.includes(quote.id);
  const greetingData = getSmartGreeting(displayName, todayMood?.mood);

  return (
    <div className="space-y-6 bg-sanctuary px-5 pt-6 pb-4">
      <motion.header {...fade(0)} className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-tint/60 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary">
            <Sparkles className="size-3" />
            <span>{greetingData.badge}</span>
          </div>
          <h1 className="text-[25px] leading-tight font-bold tracking-tight text-heading">
            {greetingData.title} 👋
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            {greetingData.subtitle}
          </p>
        </div>
        <SosDialog
          trigger={
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              className="rounded-full bg-sos px-3.5 py-2 text-xs font-bold tracking-wide text-sos-foreground shadow-sm transition-transform active:scale-95"
            >
              SOS
            </motion.button>
          }
        />
      </motion.header>

      <motion.div {...fade(1)}>
        <StreakWidget />
      </motion.div>

      {/* Bento Emotional Insight Card */}
      <motion.div
        {...fade(2)}
        className="group relative overflow-hidden rounded-3xl border border-white/30 bg-surface/80 p-4 shadow-soft backdrop-blur-xl transition-all hover:border-primary/30"
      >
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Lightbulb className="size-4.5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Observación Empática
              </span>
              <span className="text-[10px] font-semibold text-primary">IA Preventiva</span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-foreground/85">
              {todayMood
                ? `Registraste ánimo ${todayMood.mood} hoy. Recuerda que no necesitas exigirte la perfección en la escuela; cuidarte también es parte del camino.`
                : "Hacer una pausa consciente antes de tus entregas universitarias reduce la sobrecarga mental y renueva tu energía."}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.section {...fade(3)}>
        <h2 className="mb-3 text-lg font-semibold">¿Cómo te sientes hoy?</h2>
        <MoodChips />
      </motion.section>

      <motion.section {...fade(4)} className="rounded-3xl border border-white/30 bg-surface/90 p-5 shadow-soft backdrop-blur-md">
        <h2 className="text-lg font-semibold">¿Quieres desahogarte o reflexionar?</h2>
        <p className="mt-1 mb-4 text-sm">Near te escucha sin juicios, a tu ritmo.</p>
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Link to="/chat" className="group flex flex-col gap-3 rounded-2xl bg-primary-tint p-4 shadow-xs transition-shadow hover:shadow-soft">
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-110">
                <MessageCircleHeart className="size-5" />
              </span>
              <span>
                <span className="block font-semibold text-heading">Chatear</span>
                <span className="block text-xs text-muted-foreground">Escribe con calma</span>
              </span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Link to="/voz" className="group flex flex-col gap-3 rounded-2xl bg-secondary-tint p-4 shadow-xs transition-shadow hover:shadow-soft">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground shadow-xs transition-transform group-hover:scale-110">
                <Mic className="size-5" />
              </span>
              <span>
                <span className="block font-semibold text-heading">Hablar con voz</span>
                <span className="block text-xs text-muted-foreground">Siente un diálogo real</span>
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section {...fade(5)} className="relative overflow-hidden rounded-3xl bg-secondary p-5 text-secondary-foreground shadow-lift">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide uppercase opacity-80">Reflexión del día</p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            animate={fav ? { scale: [1, 1.3, 1] } : undefined}
            onClick={() => toggleFavorite(quote.id)}
            className="grid size-10 place-items-center rounded-full bg-secondary-foreground/15 shadow-xs"
            aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-pressed={fav}
          >
            <Heart className={cn("size-5 transition-colors", fav ? "fill-current text-primary-tint" : "text-secondary-foreground")} />
          </motion.button>
        </div>
        <p className="mt-1 font-display text-lg leading-snug">“{quote.text}”</p>
      </motion.section>

      <motion.section {...fade(6)}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pausas de calma rápida</h2>
          <span className="text-xs text-muted-foreground">2-5 min</span>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="w-[72%] shrink-0 snap-start">
            <Link to="/respiracion" className="group flex h-full flex-col justify-between gap-6 rounded-3xl bg-primary-tint p-5 shadow-xs transition-shadow hover:shadow-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-background/80 text-primary shadow-xs transition-transform group-hover:scale-110">
                <Wind className="size-6" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-heading">Respiración 4-7-8</span>
                <span className="block text-sm text-foreground/80">3 min para soltar tensión</span>
              </span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="w-[72%] shrink-0 snap-start">
            <Link to="/sonidos" className="group flex h-full flex-col justify-between gap-6 rounded-3xl bg-secondary-tint p-5 shadow-xs transition-shadow hover:shadow-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-background/80 text-secondary shadow-xs transition-transform group-hover:scale-110">
                <Waves className="size-6" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-heading">Sonidos de calma</span>
                <span className="block text-sm text-foreground/80">5 min de lluvia y olas</span>
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.div {...fade(7)} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
        <Link to="/bitacora" className="flex items-center gap-4 rounded-3xl border border-white/30 bg-surface/90 p-4 shadow-xs backdrop-blur-md transition-shadow hover:shadow-soft">
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
