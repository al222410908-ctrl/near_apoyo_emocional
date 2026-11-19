import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, GraduationCap, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Near Apoyo Emocional · Tu refugio universitario" },
      { name: "description", content: "Un espacio seguro, confidencial y empático para estudiantes universitarios en México. Desahógate, respira y cuida de ti." },
      { property: "og:title", content: "Near Apoyo Emocional · Tu refugio universitario" },
      { property: "og:description", content: "Un espacio seguro, confidencial y empático para estudiantes universitarios en México." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { hydrated, signedIn, user, onboarded, loginDemo } = useNear();
  const returning = hydrated && signedIn && user;

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-sanctuary px-5 pt-7 pb-7">
      {/* Vibrant Ambient Color Orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-amber-400/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 size-72 rounded-full bg-rose-400/20 blur-3xl" />

      {/* Top Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-emerald-300 border-b-emerald-500 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200"
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        Refugio Universitario • 100% Confidencial
      </motion.div>

      {/* Center Mascot Stage & Value Prop */}
      <div className="relative z-10 my-auto flex flex-col items-center py-6 text-center">
        {/* Animated Mascot Hero Showcase */}
        <div className="relative mb-6">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative grid size-36 place-items-center rounded-[38px] border-4 border-b-8 border-amber-500 border-b-amber-700 bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 shadow-2xl shadow-orange-500/30"
          >
            <svg viewBox="0 0 120 120" className="size-28 overflow-visible drop-shadow-md">
              <defs>
                <radialGradient id="splashBodyGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFF7ED" />
                  <stop offset="45%" stopColor="#FDBA74" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>
              </defs>
              <path d="M60 20 Q60 6 74 6 Q76 18 60 20 Z" fill="#10B981" />
              <path d="M60 20 Q58 10 46 10 Q46 20 60 20 Z" fill="#34D399" />
              <circle cx="32" cy="36" r="11" fill="#EA580C" />
              <circle cx="32" cy="36" r="6" fill="#FED7AA" />
              <circle cx="88" cy="36" r="11" fill="#EA580C" />
              <circle cx="88" cy="36" r="6" fill="#FED7AA" />
              <rect x="20" y="24" width="80" height="76" rx="38" fill="url(#splashBodyGrad)" stroke="#FFFFFF" strokeWidth="3.5" />
              <ellipse cx="36" cy="68" rx="7" ry="4.5" fill="#F43F5E" opacity="0.55" />
              <ellipse cx="84" cy="68" rx="7" ry="4.5" fill="#F43F5E" opacity="0.55" />
              <circle cx="44" cy="56" r="6.5" fill="#1C1917" />
              <circle cx="42" cy="53.5" r="2.2" fill="#FFFFFF" />
              <circle cx="76" cy="56" r="6.5" fill="#1C1917" />
              <circle cx="74" cy="53.5" r="2.2" fill="#FFFFFF" />
              <path d="M51 67 Q60 76 69 67" fill="none" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Floating Gamified Pills Around Mascot */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-3 -left-12 flex items-center gap-1 rounded-2xl border-2 border-b-4 border-orange-400 border-b-orange-600 bg-white px-2.5 py-1 text-xs font-black text-orange-600 shadow-md"
          >
            <Flame className="size-3.5 fill-orange-500" /> Racha Diaria
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-14 -bottom-2 flex items-center gap-1 rounded-2xl border-2 border-b-4 border-emerald-400 border-b-emerald-600 bg-white px-2.5 py-1 text-xs font-black text-emerald-700 shadow-md"
          >
            <Sprout className="size-3.5 text-emerald-600" /> +25 XP Calma
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-black tracking-tight text-heading"
        >
          Near
        </motion.h1>
        <p className="mt-1 text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Entrena tu Calma • Día a Día
        </p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-foreground/90"
        >
          Cápsulas interactivas de 2 minutos, racha de bienestar y un compañero con IA para sobrevivir al semestre sin quemarte.
        </motion.p>

        {/* Feature Mini-Grid */}
        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {[
            { emoji: "🗺️", title: "Camino", sub: "5 Unidades" },
            { emoji: "🦊", title: "Guía IA", sub: "Chat y Voz" },
            { emoji: "🌬️", title: "4-7-8", sub: "Háptico" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border-2 border-b-4 border-border border-b-neutral-300 bg-surface/90 p-2.5 text-center shadow-xs dark:border-b-neutral-800"
            >
              <span className="text-xl">{f.emoji}</span>
              <span className="mt-0.5 block text-xs font-extrabold text-heading">{f.title}</span>
              <span className="block text-[10px] font-semibold text-muted-foreground">{f.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tactile 3D CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative z-10 space-y-3"
      >
        <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface/90 px-3.5 py-2.5 backdrop-blur">
          <GraduationCap className="size-5 shrink-0 text-primary" />
          <p className="text-left text-xs font-semibold leading-snug text-foreground">
            Diseñado para alumnos <strong className="text-heading">UTVT</strong> • Preventivo y privado
          </p>
          <ShieldCheck className="ml-auto size-5 shrink-0 text-emerald-600" />
        </div>

        {returning ? (
          <Link
            to={onboarded ? "/inicio" : "/onboarding"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-b-[6px] border-emerald-600 border-b-emerald-800 bg-emerald-500 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all active:translate-y-1 active:border-b-2"
          >
            🚀 Continuar mi Camino, {user.name}
          </Link>
        ) : (
          <>
            <Link
              to="/inicio"
              onClick={() => loginDemo()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-b-[6px] border-emerald-600 border-b-emerald-800 bg-emerald-500 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all active:translate-y-1 active:border-b-2"
            >
              <Sparkles className="size-4" /> Entrar al Camino Interactivo (Demo)
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/login"
                className="flex items-center justify-center rounded-2xl border-2 border-b-[5px] border-border border-b-neutral-300 bg-surface py-3 text-xs font-extrabold uppercase tracking-wider text-heading transition-all active:translate-y-0.5 active:border-b-2 dark:border-b-neutral-800"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="flex items-center justify-center rounded-2xl border-2 border-b-[5px] border-amber-500 border-b-amber-700 bg-amber-400 py-3 text-xs font-extrabold uppercase tracking-wider text-amber-950 transition-all active:translate-y-0.5 active:border-b-2"
              >
                Crear cuenta
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
