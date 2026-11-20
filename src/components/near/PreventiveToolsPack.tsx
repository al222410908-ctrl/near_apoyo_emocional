import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BatteryCharging,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";

/* ============================================================================
   1. RADAR DE BALANCE ESCOLAR (Auto-Exploración Preventiva No Clínica)
   ============================================================================ */

const RADAR_DIMENSIONS = [
  {
    id: "energia",
    label: "Descanso y Energía Física",
    question: "¿Cómo sientes tu nivel de batería corporal hoy?",
    levels: ["Agotado (20%)", "Bajo (45%)", "Estable (75%)", "Recargado (95%)"],
  },
  {
    id: "entregas",
    label: "Manejo de Carga Académica",
    question: "¿Qué tan manejables sientes tus tareas y proyectos actuales?",
    levels: ["Desbordado", "Con presión alta", "En ritmo", "Bajo control"],
  },
  {
    id: "enfoque",
    label: "Claridad y Concentración",
    question: "¿Qué tan fácil te resulta concentrarte en una sola cosa?",
    levels: ["Mente dispersa", "Cuesta arrancar", "Buen foco", "Mente clara"],
  },
  {
    id: "calma",
    label: "Serenidad Emocional",
    question: "¿Qué tanta tranquilidad sientes en el cuerpo (hombros/estómago)?",
    levels: ["Mucha tensión", "Inquietud leve", "Tranquilo", "En paz"],
  },
] as const;

export function AcademicBalanceRadar() {
  const { addXp, showPill } = useNear();
  const [scores, setScores] = useState<Record<string, number>>({
    energia: 2,
    entregas: 1,
    enfoque: 2,
    calma: 2,
  });
  const [analyzed, setAnalyzed] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const totalScore = Object.values(scores).reduce((acc, v) => acc + v, 0);
  const balancePct = Math.round(((totalScore + 4) / 16) * 100);

  const getRecommendation = () => {
    if (balancePct < 50) {
      return {
        badge: "Prioridad: Descompresión Preventiva",
        tone: "border-amber-400 bg-amber-50/90 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
        advice:
          "Tu radar muestra sobrecarga acumulada. Hoy no intentes avanzar todo a la vez: aplica una pausa de Respiración 4-7-8 de 3 minutos y elige una sola micro-tarea de 15 minutos.",
      };
    }
    if (balancePct < 78) {
      return {
        badge: "Balance Moderado · Ajustar Ritmo",
        tone: "border-sky-400 bg-sky-50/90 text-sky-950 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100",
        advice:
          "Llevas un ritmo funcional pero con puntos de tensión en entregas. Usa bloques Pomodoro de 25 minutos con descansos reales lejos de la pantalla para evitar agotarte.",
      };
    }
    return {
      badge: "Equilibrio Sólido · Zona Preventiva Óptima",
      tone: "border-emerald-400 bg-emerald-50/90 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
      advice:
        "Tu energía y enfoque están bien alineados hoy. Es un excelente momento para avanzar tu proyecto más importante y proteger tu horario de sueño esta noche.",
    };
  };

  const handleAnalyze = () => {
    setAnalyzed(true);
    if (!rewarded) {
      setRewarded(true);
      addXp(35);
      showPill({
        emoji: "🧭",
        title: "Radar Preventivo Completado",
        subtitle: "+35 XP · Plan de equilibrio generado",
        tone: "gold",
      });
    }
  };

  const rec = getRecommendation();

  return (
    <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl border border-b-[3px] border-[#1C1917] bg-[#284B3C] text-white">
            <Activity className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-heading">Radar de Balance Escolar</h3>
            <p className="text-xs text-muted-foreground">Auto-exploración preventiva (no clínica) · +35 XP</p>
          </div>
        </div>
        <span className="rounded-xl bg-[#284B3C]/15 px-2.5 py-1 text-xs font-extrabold text-[#284B3C] dark:text-emerald-300">
          {balancePct}% Equilibrio
        </span>
      </div>

      <div className="space-y-3">
        {RADAR_DIMENSIONS.map((dim) => {
          const current = scores[dim.id] ?? 2;
          return (
            <div key={dim.id} className="rounded-2xl border border-border bg-background p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-bold text-heading">{dim.label}</span>
                <span className="text-[11px] font-bold text-primary">{dim.levels[current]}</span>
              </div>
              <p className="mb-2 text-[11px] text-muted-foreground">{dim.question}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {dim.levels.map((lvl, idx) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setScores((s) => ({ ...s, [dim.id]: idx }));
                      setAnalyzed(false);
                    }}
                    className={cn(
                      "rounded-xl border py-1.5 text-[10px] font-bold transition-all",
                      current === idx
                        ? "border-b-[3px] border-primary bg-primary-tint text-primary"
                        : "border-border bg-surface text-muted-foreground hover:text-heading",
                    )}
                  >
                    {idx + 1}/4
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAnalyze}
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-[#1C1917] bg-[#284B3C] py-3 text-xs font-extrabold tracking-wide text-white shadow-sm transition-all active:translate-y-0.5"
      >
        <Sparkles className="size-4" />
        <span>Generar Interpretación Preventiva</span>
      </button>

      <AnimatePresence>
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn("mt-3.5 rounded-2xl border border-b-[3px] p-3.5", rec.tone)}
          >
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase">
              <ShieldCheck className="size-4" />
              <span>{rec.badge}</span>
            </div>
            <p className="mt-1.5 text-xs font-medium leading-relaxed">{rec.advice}</p>
            <p className="mt-2 text-[10px] opacity-75">
              *Nota ética: Este radar es una guía de bienestar estudiantil y no constituye un diagnóstico médico o psicológico.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   2. TRANSFORMADOR DE PENSAMIENTOS INTRUSIVOS (Reencuadre Cognitivo)
   ============================================================================ */

const SAMPLE_THOUGHTS = [
  {
    worry: "“No voy a alcanzar a terminar todo el proyecto integrador a tiempo.”",
    reframe:
      "No necesitas terminar todo el proyecto en los próximos 10 minutos. Solo necesitas dividirlo en 3 bloques y avanzar el primero hoy.",
    microAction: "Abre el archivo y escribe únicamente el esquema de subtítulos durante 5 minutos.",
  },
  {
    worry: "“Si me bloqueo en la exposición o examen, todos pensarán que no sé nada.”",
    reframe:
      "Sentir nervios al exponer es una respuesta normal de adrenalina. Tus compañeros están igual de concentrados en sus propias partes.",
    microAction: "Respira 4-7-8 dos veces antes de hablar y ten una tarjeta con 3 palabras clave en la mano.",
  },
  {
    worry: "“Siento que todos avanzan más rápido que yo en la carrera.”",
    reframe:
      "Cada estudiante tiene contextos, cargas y ritmos distintos. Comparar tu proceso interno con la fachada externa de otros no es justo contigo.",
    microAction: "Reconoce 1 tema o habilidad que hoy entiendes mejor que hace un mes.",
  },
];

export function ThoughtReframerTool() {
  const { addXp, showPill } = useNear();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customWorry, setCustomWorry] = useState("");
  const [transformed, setTransformed] = useState(false);

  const activeSample = SAMPLE_THOUGHTS[selectedIdx] ?? SAMPLE_THOUGHTS[0]!;

  const handleTransform = () => {
    setTransformed(true);
    addXp(20);
    showPill({
      emoji: "✨",
      title: "Pensamiento Reencuadrado",
      subtitle: "+20 XP · Descarga cognitiva completada",
      tone: "success",
    });
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl border border-b-[3px] border-amber-500/40 border-b-amber-700 bg-amber-500 text-white">
            <WandSparkles className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-heading">Laboratorio de Reencuadre Mental</h3>
            <p className="text-xs text-muted-foreground">Transforma pensamientos de presión en pasos claros · +20 XP</p>
          </div>
        </div>
      </div>

      {/* Selector de pensamiento frecuente o propio */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          1. Selecciona o escribe la idea que te está generando ruido:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["Proyecto integrador", "Miedo a bloquearme", "Comparación escolar"].map((tag, idx) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setCustomWorry("");
                setTransformed(false);
              }}
              className={cn(
                "rounded-xl border px-2.5 py-1 text-xs font-bold transition-all",
                selectedIdx === idx && !customWorry
                  ? "border-b-[3px] border-primary bg-primary-tint text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-heading",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={customWorry}
          onChange={(e) => {
            setCustomWorry(e.target.value);
            setTransformed(false);
          }}
          placeholder="O escribe aquí tu propio pensamiento intrusivo…"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-heading placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Tarjeta de transformación */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {!transformed ? (
            <motion.div
              key="worry-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              className="rounded-2xl border border-b-[3px] border-rose-300 border-b-rose-500 bg-rose-50/70 p-3.5 dark:border-rose-800 dark:bg-rose-950/30"
            >
              <span className="text-[10px] font-extrabold uppercase text-rose-700 dark:text-rose-300">
                Pensamiento de Presión Detectado:
              </span>
              <p className="mt-1 font-display text-sm font-bold text-heading">
                {customWorry.trim() ? `“${customWorry}”` : activeSample.worry}
              </p>
              <button
                type="button"
                onClick={handleTransform}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-b-[3px] border-primary border-b-[#693222] bg-clay py-2.5 text-xs font-extrabold text-primary-foreground shadow-2xs transition-all active:translate-y-0.5"
              >
                <RefreshCw className="size-3.5" />
                <span>Transformar en Perspectiva Preventiva</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="reframed-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2.5 rounded-2xl border border-b-[3px] border-emerald-400 border-b-emerald-600 bg-emerald-50/80 p-3.5 dark:border-emerald-800 dark:bg-emerald-950/40"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" /> Reencuadre Compasivo de Near IA
                </span>
                <button
                  type="button"
                  onClick={() => setTransformed(false)}
                  className="text-[10px] font-bold text-emerald-700 underline dark:text-emerald-300"
                >
                  Probar otro
                </button>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-heading">
                {customWorry.trim()
                  ? `Es válido que "${customWorry}" te preocupe, pero un pensamiento bajo estrés no es una sentencia. Dividamos lo que sí depende de ti hoy en un solo paso manejable.`
                  : activeSample.reframe}
              </p>
              <div className="rounded-xl bg-white/80 p-2.5 text-xs dark:bg-black/30">
                <strong className="text-emerald-700 dark:text-emerald-400">Micro-Acción de 5 min: </strong>
                <span className="text-heading">
                  {customWorry.trim()
                    ? "Hacer 3 respiraciones lentas y elegir una sola tarea de 5 minutos sin buscar perfección."
                    : activeSample.microAction}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================================
   3. TEMPORIZADOR POMODORO COMPASIVO ANTI-BURNOUT (25m Enfoque + 5m Calma)
   ============================================================================ */

export function CompassionatePomodoroTool() {
  const { addXp, showPill } = useNear();
  const [mode, setMode] = useState<"enfoque" | "pausa">("enfoque");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [taskGoal, setTaskGoal] = useState("Avanzar el primer apartado de mi entrega");

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setRunning(false);
        addXp(25);
        showPill({
          emoji: "⏱️",
          title: mode === "enfoque" ? "¡Bloque de Enfoque Completado!" : "¡Pausa de Recarga Lista!",
          subtitle: "+25 XP por estudiar cuidando tu mente",
          tone: "gold",
        });
        toast.success("¡Bloque completado! Ganaste +25 XP");
        return mode === "enfoque" ? 5 * 60 : 25 * 60;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [running, mode, addXp, showPill]);

  const switchMode = (nextMode: "enfoque" | "pausa") => {
    setRunning(false);
    setMode(nextMode);
    setSecondsLeft(nextMode === "enfoque" ? 25 * 60 : 5 * 60);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="rounded-3xl border border-b-[4px] border-border border-b-neutral-300 bg-surface p-4 shadow-xs dark:border-b-neutral-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl border border-b-[3px] border-emerald-500/40 border-b-emerald-700 bg-emerald-600 text-white">
            <Clock className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-heading">Pomodoro Compasivo 25/5</h3>
            <p className="text-xs text-muted-foreground">Estudia por bloques sin llegar al agotamiento</p>
          </div>
        </div>

        <div className="flex rounded-xl border border-border bg-background p-0.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => switchMode("enfoque")}
            className={cn(
              "rounded-lg px-2.5 py-1 transition-colors",
              mode === "enfoque" ? "bg-primary-tint text-primary" : "text-muted-foreground",
            )}
          >
            25m Foco
          </button>
          <button
            type="button"
            onClick={() => switchMode("pausa")}
            className={cn(
              "rounded-lg px-2.5 py-1 transition-colors",
              mode === "pausa" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
            )}
          >
            5m Pausa
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Micro-meta sin presión para este bloque:
        </label>
        <input
          type="text"
          value={taskGoal}
          onChange={(e) => setTaskGoal(e.target.value)}
          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-medium text-heading focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-primary">
            {mode === "enfoque" ? (
              <>
                <BrainCircuit className="size-3" /> Enfoque suave
              </>
            ) : (
              <>
                <BatteryCharging className="size-3 text-emerald-600" /> Recarga mental
              </>
            )}
          </span>
          <p className="font-display text-3xl font-extrabold tabular-nums text-heading">
            {mins}:{secs}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-1.5 rounded-xl border border-b-[3px] border-primary border-b-[#693222] bg-clay px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow-2xs transition-all active:translate-y-0.5"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
            <span>{running ? "Pausar" : "Iniciar"}</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode(mode)}
            className="grid size-9 place-items-center rounded-xl border border-b-[3px] border-border bg-surface text-muted-foreground hover:text-heading"
            aria-label="Reiniciar reloj"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
