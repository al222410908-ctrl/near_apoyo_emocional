import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  AudioLines,
  Bot,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SplashVideoHero } from "@/components/near/SplashVideoHero";
import { NearMark } from "@/components/near/Logo";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Near Apoyo Emocional · IA Preventiva Universitaria" },
      {
        name: "description",
        content: "Centro unificado de Voice Chat y Chat con IA empática, cápsulas preventivas y laboratorio mental para estudiantes universitarios.",
      },
      { property: "og:title", content: "Near Apoyo Emocional · IA Preventiva Universitaria" },
      {
        property: "og:description",
        content: "Voice Chat y Chat con IA empática, cápsulas preventivas y laboratorio mental.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const LIVE_DEMO_GREETINGS = [
  "Hola, bienvenido a Near. Un espacio seguro para transformar el estrés y cuidar de ti.",
  "Mente y corazón en equilibrio: escucha empática, ejercicios de respiración 4-7-8 y desahogo libre.",
  "Todo lo que hablemos aquí es 100% privado, preventivo y diseñado para la comunidad universitaria.",
];

function Splash() {
  const { hydrated, signedIn, user, onboarded, loginDemo } = useNear();
  const returning = hydrated && signedIn && user;
  const [lineIdx, setLineIdx] = useState(0);
  const [streamed, setStreamed] = useState("");
  const [speaking, setSpeaking] = useState(true);

  useEffect(() => {
    const full = LIVE_DEMO_GREETINGS[lineIdx] ?? LIVE_DEMO_GREETINGS[0]!;
    const words = full.split(" ");
    let i = 0;
    setStreamed("");
    setSpeaking(true);

    const streamTimer = window.setInterval(() => {
      i += 1;
      setStreamed(words.slice(0, i).join(" "));
      if (i >= words.length) {
        window.clearInterval(streamTimer);
        window.setTimeout(() => setSpeaking(false), 600);
      }
    }, 50);

    const nextTimer = window.setTimeout(() => {
      setLineIdx((prev) => (prev + 1) % LIVE_DEMO_GREETINGS.length);
    }, 5500);

    return () => {
      window.clearInterval(streamTimer);
      window.clearTimeout(nextTimer);
    };
  }, [lineIdx]);

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-sanctuary px-5 pt-5 pb-7">
      {/* Ambient Light Orbs con los colores oficiales de la marca (Turquesa y Coral) */}
      <div className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-72 rounded-full bg-rose-400/15 blur-3xl" />

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
        Near · Apoyo Emocional Universitario
      </motion.div>

      {/* Center Hero: Video Animado de la Marca (Cerebro -> Corazón) */}
      <div className="relative z-10 my-auto flex flex-col items-center py-3 text-center">
        {/* Componente de Video Splash Animado */}
        <SplashVideoHero className="mb-2" />

        {/* Live Simulated Speech Bubble */}
        <div className="mt-2 w-full max-w-sm rounded-3xl border-2 border-border/80 bg-[#FFFDF9] p-3.5 text-left shadow-[0_4px_0_rgba(28,25,23,0.06)] dark:bg-[#262421]">
          <div className="mb-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              <Bot className="size-3.5" /> Acompañamiento Inteligente
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">UTVT 24/7</span>
          </div>
          <p className="min-h-[40px] font-display text-xs font-semibold leading-relaxed text-heading sm:text-sm">
            “{streamed}”
            {speaking && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 rounded-full bg-sky-500"
              />
            )}
          </p>
        </div>

        {/* 4 Thematic Modules Preview Grid */}
        <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-2 text-left">
          {[
            {
              icon: AudioLines,
              title: "Voz y Texto",
              sub: "Escucha interactiva",
              tone: "bg-[#0EA5E9] text-white",
            },
            {
              icon: GraduationCap,
              title: "Cápsulas & Radar",
              sub: "Micro-lecciones",
              tone: "bg-[#0D9488] text-white",
            },
            {
              icon: WandSparkles,
              title: "Estudio & Calma",
              sub: "Reencuadre de estrés",
              tone: "bg-[#F97316] text-white",
            },
            {
              icon: Activity,
              title: "Bitácora & Nivel",
              sub: "Racha y registro",
              tone: "bg-[#6366F1] text-white",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-2 rounded-2xl border-2 border-border/80 bg-[#FFFDF9] p-2 shadow-2xs dark:bg-[#262421]"
              >
                <span className={`grid size-7 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <span className="block truncate text-xs font-bold text-heading">{item.title}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Tactile CTAs */}
      <div className="relative z-10 mx-auto w-full max-w-sm space-y-2.5">
        <div className="flex items-center gap-3 rounded-2xl border border-b-[3px] border-border bg-surface/90 px-3.5 py-2 backdrop-blur">
          <NearMark className="size-5 shrink-0" />
          <p className="text-left text-xs font-medium leading-snug text-foreground">
            Comunidad <strong className="text-heading">UTVT</strong> • Privado, ético y anónimo
          </p>
          <ShieldCheck className="ml-auto size-5 shrink-0 text-emerald-600" />
        </div>

        {returning ? (
          <Link
            to={onboarded ? "/inicio" : "/onboarding"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-sky-600 border-b-sky-800 bg-sky-500 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-md transition-all active:translate-y-0.5 hover:bg-sky-600"
          >
            Abrir Espacio de Near, {user.name} →
          </Link>
        ) : (
          <>
            <Link
              to="/inicio"
              onClick={() => loginDemo()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-sky-600 border-b-sky-800 bg-sky-500 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-md transition-all active:translate-y-0.5 hover:bg-sky-600"
            >
              <Sparkles className="size-4" /> Entrar a Near (Demo en Vivo)
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/login"
                className="flex items-center justify-center rounded-2xl border border-b-[3px] border-border border-b-neutral-300 bg-surface py-2.5 text-xs font-bold text-heading transition-all active:translate-y-0.5 dark:border-b-neutral-800 hover:bg-surface-2"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="flex items-center justify-center rounded-2xl border border-b-[3px] border-rose-300 border-b-rose-400 bg-rose-50/70 py-2.5 text-xs font-bold text-rose-900 transition-all active:translate-y-0.5 dark:bg-rose-950/40 dark:text-rose-200 hover:bg-rose-100"
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
