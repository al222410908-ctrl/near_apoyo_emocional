import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScreenLoader } from "@/components/near/AppScreen";
import { COMPANION_STYLES, GOALS, MOODS } from "@/services/mockData";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";
import type { CompanionStyle, GoalId, MoodId } from "@/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Personaliza tu refugio · Near" },
      { name: "description", content: "Cuéntanos qué buscas y cómo quieres que Near te acompañe." },
      { property: "og:title", content: "Personaliza tu refugio · Near" },
      { property: "og:description", content: "Cuéntanos qué buscas y cómo quieres que Near te acompañe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const STYLE_EMOJI: Record<CompanionStyle, string> = { calido: "🤗", directo: "🧭", silencioso: "🕊️" };

function Onboarding() {
  const { hydrated, signedIn, user, completeOnboarding } = useNear();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<GoalId[]>([]);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [style, setStyle] = useState<CompanionStyle>("calido");

  useEffect(() => {
    if (hydrated && (!signedIn || !user)) navigate({ to: "/login", replace: true });
  }, [hydrated, signedIn, user, navigate]);

  if (!hydrated || !user) return <ScreenLoader />;

  const canNext = step === 0 ? goals.length > 0 : step === 1 ? mood !== null : true;
  const next = () => {
    if (step < 2) return setStep(step + 1);
    completeOnboarding({ goals, mood, style });
    navigate({ to: "/inicio" });
  };

  const steps = [
    {
      title: `Hola, ${user.name}. ¿Qué te trae a Near?`,
      subtitle: "Elige todo lo que resuene contigo.",
      body: (
        <div className="space-y-3">
          {GOALS.map((g) => {
            const on = goals.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoals((s) => (on ? s.filter((x) => x !== g.id) : [...s, g.id]))}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.99]",
                  on ? "border-primary bg-primary-tint" : "border-border bg-surface",
                )}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="flex-1">
                  <span className="block font-semibold text-heading">{g.label}</span>
                  <span className="block text-sm text-muted-foreground">{g.description}</span>
                </span>
                <span className={cn("grid size-6 place-items-center rounded-full border", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                  {on && <Check className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "¿Cómo llegas hoy?",
      subtitle: "No hay respuestas correctas. Solo un punto de partida.",
      body: (
        <div className="grid grid-cols-2 gap-3">
          {MOODS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-3xl border p-5 transition-all active:scale-[0.98]",
                i === MOODS.length - 1 && "col-span-2",
                mood === m.id ? "border-primary bg-primary-tint shadow-soft" : "border-border bg-surface",
              )}
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="text-sm font-semibold text-heading">{m.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "¿Cómo quieres que te acompañe?",
      subtitle: "Puedes cambiarlo cuando quieras desde tu perfil.",
      body: (
        <div className="space-y-3">
          {COMPANION_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.99]",
                style === s.id ? "border-secondary bg-secondary-tint" : "border-border bg-surface",
              )}
            >
              <span className="text-2xl">{STYLE_EMOJI[s.id]}</span>
              <span className="flex-1">
                <span className="block font-semibold text-heading">{s.label}</span>
                <span className="block text-sm text-muted-foreground">{s.description}</span>
              </span>
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step] ?? steps[0]!;

  return (
    <div className="flex min-h-screen flex-col bg-sanctuary px-6 pt-6 pb-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn("grid size-10 place-items-center rounded-full bg-background/70 text-heading", step === 0 && "invisible")}
          aria-label="Paso anterior"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex flex-1 gap-2">
          {steps.map((_, i) => (
            <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <motion.span className="block h-full bg-clay" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} />
            </span>
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">{step + 1}/3</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex-1 pt-8"
        >
          <h1 className="text-[28px] leading-tight font-semibold">{current.title}</h1>
          <p className="mt-2 mb-6 text-sm">{current.subtitle}</p>
          {current.body}
        </motion.div>
      </AnimatePresence>

      <Button variant="clay" size="xl" className="mt-8 w-full" disabled={!canNext} onClick={next}>
        {step < 2 ? "Continuar" : "Entrar a mi refugio"}
      </Button>
    </div>
  );
}
