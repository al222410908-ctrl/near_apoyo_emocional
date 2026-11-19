import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AudioLines, Flame, GraduationCap, MessageCircleHeart, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { NearMark } from "@/components/near/Logo";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Near Apoyo Emocional · IA Preventiva Universitaria" },
      { name: "description", content: "Plataforma de acompañamiento emocional preventivo con IA, misiones diarias y cápsulas interactivas para estudiantes universitarios." },
      { property: "og:title", content: "Near Apoyo Emocional · IA Preventiva Universitaria" },
      { property: "og:description", content: "Acompañamiento emocional preventivo con IA, misiones diarias y cápsulas interactivas." },
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
      {/* Subtle Ambient Light Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-primary-soft/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-72 rounded-full bg-secondary/15 blur-3xl" />

      {/* Top Institutional Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto inline-flex items-center gap-2 rounded-full border border-b-[3px] border-border bg-surface/90 px-4 py-1.5 text-xs font-bold text-heading shadow-2xs backdrop-blur"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        IA Preventiva Activa • 100% Confidencial
      </motion.div>

      {/* Center Living AI Core Showcase */}
      <div className="relative z-10 my-auto flex flex-col items-center py-6 text-center">
        <div className="relative mb-6">
          <motion.div
            className="absolute -inset-6 rounded-full bg-sphere opacity-40 blur-2xl"
            animate={{ scale: [0.92, 1.1, 0.92] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative grid size-32 place-items-center rounded-[36px] border border-b-[5px] border-slate-700 border-b-slate-950 bg-gradient-to-br from-slate-900 via-[#1E293B] to-[#2C3E50] shadow-xl"
          >
            <div className="grid size-20 place-items-center rounded-3xl bg-background/95 shadow-inner">
              <NearMark className="size-12" />
            </div>
          </motion.div>

          {/* Floating Context Badges */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="absolute -top-2 -left-14 flex items-center gap-1 rounded-xl border border-b-[3px] border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-heading shadow-sm"
          >
            <Flame className="size-3.5 fill-amber-500 text-amber-600" /> Racha Diaria
          </motion.div>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
            className="absolute -right-14 -bottom-1 flex items-center gap-1 rounded-xl border border-b-[3px] border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm dark:text-emerald-400"
          >
            <Sprout className="size-3.5 text-emerald-600" /> Cápsulas +XP
          </motion.div>
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight text-heading">
          Near
        </h1>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">
          Acompañamiento Emocional con IA
        </p>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/90">
          Conversa por chat o voz con una IA empática, entrena tu calma con cápsulas interactivas y mantén tu equilibrio durante el semestre.
        </p>

        {/* Pillars Grid */}
        <div className="mt-6 grid w-full grid-cols-3 gap-2">
          {[
            { icon: MessageCircleHeart, title: "Chat IA", sub: "Empático 24/7" },
            { icon: AudioLines, title: "Modo Voz", sub: "Diálogo fluido" },
            { icon: Sparkles, title: "Misiones", sub: "Hábitos +XP" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-2xl border border-b-[3px] border-border bg-surface/90 p-3 text-center shadow-2xs"
              >
                <span className="grid size-8 place-items-center rounded-xl bg-primary-tint text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="mt-1.5 block text-xs font-bold text-heading">{item.title}</span>
                <span className="block text-[10px] text-muted-foreground">{item.sub}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Tactile CTAs */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-b-[3px] border-border bg-surface/90 px-3.5 py-2.5 backdrop-blur">
          <GraduationCap className="size-5 shrink-0 text-primary" />
          <p className="text-left text-xs font-medium leading-snug text-foreground">
            Comunidad <strong className="text-heading">UTVT</strong> • Enfoque preventivo y privado
          </p>
          <ShieldCheck className="ml-auto size-5 shrink-0 text-emerald-600" />
        </div>

        {returning ? (
          <Link
            to={onboarded ? "/inicio" : "/onboarding"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-primary border-b-[#693222] bg-clay py-3.5 text-sm font-extrabold tracking-wide text-primary-foreground shadow-md transition-all active:translate-y-0.5"
          >
            Continuar a mi espacio, {user.name} →
          </Link>
        ) : (
          <>
            <Link
              to="/inicio"
              onClick={() => loginDemo()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-primary border-b-[#693222] bg-clay py-3.5 text-sm font-extrabold tracking-wide text-primary-foreground shadow-md transition-all active:translate-y-0.5"
            >
              <Sparkles className="size-4" /> Explorar Demo Interactiva
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/login"
                className="flex items-center justify-center rounded-2xl border border-b-[3px] border-border border-b-neutral-300 bg-surface py-3 text-xs font-bold text-heading transition-all active:translate-y-0.5 dark:border-b-neutral-800"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="flex items-center justify-center rounded-2xl border border-b-[3px] border-secondary/40 border-b-secondary bg-secondary-tint/60 py-3 text-xs font-bold text-heading transition-all active:translate-y-0.5"
              >
                Crear cuenta
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
