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
import { NearFriendlyAvatar } from "@/components/near/NearFriendlyAvatar";
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
  "Hola, soy Near IA. Estoy listo para escucharte por voz o texto cuando sientas presión en la universidad.",
  "Podemos transformar pensamientos de estrés, organizar tus entregas o hacer una pausa guiada 4-7-8.",
  "Todo lo que hablemos aquí es 100% privado y preventivo. ¿Entramos a tu espacio?",
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
    }, 55);

    const nextTimer = window.setTimeout(() => {
      setLineIdx((prev) => (prev + 1) % LIVE_DEMO_GREETINGS.length);
    }, 5800);

    return () => {
      window.clearInterval(streamTimer);
      window.clearTimeout(nextTimer);
    };
  }, [lineIdx]);

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-sanctuary px-5 pt-6 pb-7">
      {/* Ambient Light Orbs */}
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
        Near IA · VoiceChat & Chat en Vivo
      </motion.div>

      {/* Center Live Friendly Near Character Preview with Speaking Simulation */}
      <div className="relative z-10 my-auto flex flex-col items-center py-5 text-center">
        <div className="relative mb-3 flex items-center justify-center">
          <NearFriendlyAvatar phase={speaking ? "speaking" : "idle"} size="lg" />
        </div>

        {/* Live Simulated Speech Bubble */}
        <div className="mt-3 w-full rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 text-left shadow-sm dark:border-b-neutral-800">
          <div className="mb-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
              <Bot className="size-3.5" /> Simulación en vivo · Voz y Texto
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">24/7</span>
          </div>
          <p className="min-h-[42px] font-display text-sm font-semibold leading-relaxed text-heading">
            “{streamed}”
            {speaking && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 rounded-full bg-primary"
              />
            )}
          </p>
        </div>

        {/* 4 Thematic Modules Preview Grid */}
        <div className="mt-4 grid w-full grid-cols-2 gap-2 text-left">
          {[
            {
              icon: AudioLines,
              title: "Voz + Chat IA",
              sub: "Burbuja reactiva unificada",
              tone: "bg-primary-tint text-primary",
            },
            {
              icon: GraduationCap,
              title: "Cápsulas & Radar",
              sub: "5 unidades y test preventivo",
              tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
            },
            {
              icon: WandSparkles,
              title: "Laboratorio Mental",
              sub: "Reencuadre y Pomodoro 25/5",
              tone: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
            },
            {
              icon: Activity,
              title: "Bitácora & Nivel",
              sub: "Racha, misiones y métricas",
              tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-2.5 rounded-2xl border border-b-[3px] border-border bg-surface/90 p-2.5 shadow-2xs"
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                  <Icon className="size-4" />
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
      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center gap-3 rounded-2xl border border-b-[3px] border-border bg-surface/90 px-3.5 py-2 backdrop-blur">
          <GraduationCap className="size-5 shrink-0 text-primary" />
          <p className="text-left text-xs font-medium leading-snug text-foreground">
            Comunidad <strong className="text-heading">UTVT</strong> • Preventivo, ético y privado
          </p>
          <ShieldCheck className="ml-auto size-5 shrink-0 text-emerald-600" />
        </div>

        {returning ? (
          <Link
            to={onboarded ? "/inicio" : "/onboarding"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-primary border-b-[#693222] bg-clay py-3.5 text-sm font-extrabold tracking-wide text-primary-foreground shadow-md transition-all active:translate-y-0.5"
          >
            Abrir Burbuja de Near IA, {user.name} →
          </Link>
        ) : (
          <>
            <Link
              to="/inicio"
              onClick={() => loginDemo()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-primary border-b-[#693222] bg-clay py-3.5 text-sm font-extrabold tracking-wide text-primary-foreground shadow-md transition-all active:translate-y-0.5"
            >
              <Sparkles className="size-4" /> Entrar a Near IA (Demo en Vivo)
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/login"
                className="flex items-center justify-center rounded-2xl border border-b-[3px] border-border border-b-neutral-300 bg-surface py-2.5 text-xs font-bold text-heading transition-all active:translate-y-0.5 dark:border-b-neutral-800"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="flex items-center justify-center rounded-2xl border border-b-[3px] border-secondary/40 border-b-secondary bg-secondary-tint/60 py-2.5 text-xs font-bold text-heading transition-all active:translate-y-0.5"
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
