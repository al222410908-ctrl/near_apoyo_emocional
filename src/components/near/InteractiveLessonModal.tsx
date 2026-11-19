import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Flame, Lightbulb, Sparkles, Trophy, Volume2, X, XCircle } from "lucide-react";
import { useState } from "react";
import { useNear } from "@/context/NearContext";
import type { InteractiveLesson } from "@/services/lessonsData";
import { cn } from "@/lib/utils";

function playEffectTone(type: "success" | "tryAgain" | "victory") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "success") {
      [523.25, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.06, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } else if (type === "tryAgain") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(250, now + 0.25);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "victory") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.07, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    }
  } catch {
    // Ignore audio context restrictions
  }
}

function vibrate(pattern: number | number[]) {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore
    }
  }
}

interface InteractiveLessonModalProps {
  lesson: InteractiveLesson | null;
  onClose: () => void;
}

export function InteractiveLessonModal({ lesson, onClose }: InteractiveLessonModalProps) {
  const { completeLesson, showPill } = useNear();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [mythFlipped, setMythFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [wrongChipId, setWrongChipId] = useState<string | null>(null);

  if (!lesson) return null;

  const progressPct = step === 0 ? 28 : step === 1 ? 62 : step === 2 ? 92 : 100;
  const chosenQuizObj = lesson.quizStep.options.find((o) => o.id === selectedOption);
  const isQuizHealthy = Boolean(chosenQuizObj?.isHealthy);

  const positiveChipsCount = lesson.practiceStep.actionChips.filter((c) => c.positive).length;
  const practiceComplete = selectedChips.length >= positiveChipsCount;

  const handleCheckQuiz = () => {
    if (!selectedOption) return;
    setQuizChecked(true);
    if (isQuizHealthy) {
      playEffectTone("success");
      vibrate([40, 60, 80]);
    } else {
      playEffectTone("tryAgain");
      vibrate(120);
    }
  };

  const handleToggleChip = (chip: { id: string; positive: boolean }) => {
    if (!chip.positive) {
      setWrongChipId(chip.id);
      playEffectTone("tryAgain");
      vibrate(100);
      window.setTimeout(() => setWrongChipId(null), 900);
      return;
    }
    if (selectedChips.includes(chip.id)) return;
    const next = [...selectedChips, chip.id];
    setSelectedChips(next);
    playEffectTone("success");
    vibrate(45);
  };

  const handleFinishLesson = () => {
    playEffectTone("victory");
    vibrate([60, 40, 60, 40, 140]);
    setStep(3);
  };

  const handleClaimReward = () => {
    completeLesson(lesson.id, lesson.xpReward);
    showPill({
      emoji: "🏆",
      title: `¡Unidad ${lesson.unitNumber} completada!`,
      subtitle: `Ganaste +${lesson.xpReward} Semillas de Calma`,
      tone: "gold",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ y: "100%", opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] border-t-2 border-white/30 bg-background shadow-2xl sm:rounded-[32px] sm:border-2"
      >
        {/* Top Progress Header (Duolingo Style) */}
        <div className="flex items-center gap-3 border-b border-border/70 bg-surface/90 px-5 py-4 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-b-4 border-border bg-background text-muted-foreground transition-transform active:translate-y-0.5 active:border-b-2"
            aria-label="Cerrar cápsula"
          >
            <X className="size-4.5" />
          </button>

          <div className="relative h-4 flex-1 overflow-hidden rounded-full border-2 border-border bg-surface-2 p-0.5">
            <motion.div
              className={cn("h-full rounded-full bg-gradient-to-r", lesson.palette.gradient)}
              initial={{ width: "15%" }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="h-1.5 w-full rounded-full bg-white/30" />
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border-2 border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>+{lesson.xpReward} XP</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                {/* Unit Badge */}
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-extrabold text-white shadow-xs", lesson.palette.bg)}>
                    {lesson.emoji} UNIDAD {lesson.unitNumber} · {lesson.category.toUpperCase()}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold leading-tight text-heading">
                  {lesson.title}
                </h2>

                {/* Near Character Dialogue Bubble */}
                <div className="flex items-start gap-3.5 rounded-3xl border-2 border-b-4 border-primary/25 bg-primary-tint/50 p-4">
                  <motion.div
                    animate={{ y: [0, -5, 0], rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-b-4 border-amber-600 bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-md"
                  >
                    🦊
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                      Near · Tu Guía
                    </p>
                    <p className="mt-0.5 text-sm font-medium leading-relaxed text-heading">
                      “{lesson.storyStep.mascotQuote}”
                    </p>
                  </div>
                </div>

                {/* Main Concept Card */}
                <div className={cn("rounded-3xl border-2 border-b-[5px] p-4", lesson.palette.lightBg, lesson.palette.lightBorder)}>
                  <div className="flex items-center gap-2">
                    <Lightbulb className={cn("size-5", lesson.palette.text)} />
                    <h3 className={cn("text-base font-extrabold", lesson.palette.text)}>
                      {lesson.storyStep.conceptTitle}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {lesson.storyStep.conceptBody}
                  </p>
                </div>

                {/* Interactive Myth vs. Reality Flip Card */}
                <div className="space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    👇 Toca la tarjeta para transformar el pensamiento:
                  </p>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setMythFlipped((f) => !f);
                      vibrate(35);
                      playEffectTone("success");
                    }}
                    className={cn(
                      "w-full rounded-3xl border-2 border-b-[5px] p-4 text-left transition-all",
                      mythFlipped
                        ? "border-emerald-400 border-b-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
                        : "border-rose-300 border-b-rose-500 bg-rose-50/80 dark:bg-rose-950/40",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase",
                          mythFlipped ? "bg-emerald-600 text-white" : "bg-rose-600 text-white",
                        )}
                      >
                        {mythFlipped ? "✨ Realidad Compasiva (Toca para girar)" : "⚡ Mito de Presión (Toca para revelar)"}
                      </span>
                      <Volume2 className="size-4 opacity-60" />
                    </div>
                    <p className="mt-3 font-display text-base font-bold leading-snug text-heading">
                      {mythFlipped ? lesson.storyStep.reality : lesson.storyStep.myth}
                    </p>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                  🧩 RETO DE SITUACIÓN UNIVERSITARIA
                </span>

                <div className="rounded-3xl border-2 border-b-4 border-border bg-surface p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Escenario real</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-heading">
                    {lesson.quizStep.scenario}
                  </p>
                </div>

                <h3 className="font-display text-lg font-bold text-heading">
                  {lesson.quizStep.question}
                </h3>

                <div className="space-y-2.5">
                  {lesson.quizStep.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt.id;
                    const showSuccess = quizChecked && isSelected && opt.isHealthy;
                    const showWarning = quizChecked && isSelected && !opt.isHealthy;

                    return (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedOption(opt.id);
                          setQuizChecked(false);
                          vibrate(25);
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border-2 border-b-[5px] p-3.5 text-left transition-all active:translate-y-0.5 active:border-b-2",
                          showSuccess
                            ? "border-emerald-500 border-b-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100"
                            : showWarning
                              ? "border-amber-500 border-b-amber-700 bg-amber-50 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100"
                              : isSelected
                                ? "border-sky-500 border-b-sky-700 bg-sky-50/90 text-sky-950 dark:bg-sky-950/50 dark:text-sky-100"
                                : "border-border border-b-neutral-300 bg-surface hover:bg-surface-2 dark:border-b-neutral-700",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-xl border-2 text-xs font-extrabold",
                            isSelected
                              ? "border-current bg-white/80 text-heading"
                              : "border-border bg-background text-muted-foreground",
                          )}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 text-sm font-semibold leading-snug">
                          {opt.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Duolingo-style Feedback Drawer */}
                <AnimatePresence>
                  {quizChecked && chosenQuizObj && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className={cn(
                        "rounded-3xl border-2 border-b-4 p-4",
                        isQuizHealthy
                          ? "border-emerald-500 bg-emerald-100/90 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-100"
                          : "border-amber-500 bg-amber-100/90 text-amber-950 dark:bg-amber-950/80 dark:text-amber-100",
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        {isQuizHealthy ? (
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                        )}
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-wide">
                            {isQuizHealthy ? "¡Excelente elección preventiva!" : "Reflexiona un momento:"}
                          </p>
                          <p className="mt-1 text-xs font-medium leading-relaxed">
                            {chosenQuizObj.feedback}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  🛡️ MINI-JUEGO · {selectedChips.length}/{positiveChipsCount} ACTIVADOS
                </span>

                <h3 className="font-display text-2xl font-bold text-heading">
                  {lesson.practiceStep.prompt}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lesson.practiceStep.instruction}
                </p>

                <div className="grid grid-cols-1 gap-3 pt-1">
                  {lesson.practiceStep.actionChips.map((chip) => {
                    const picked = selectedChips.includes(chip.id);
                    const isWrong = wrongChipId === chip.id;

                    return (
                      <motion.button
                        key={chip.id}
                        type="button"
                        animate={isWrong ? { x: [0, -10, 10, -8, 8, 0] } : picked ? { scale: [1, 1.04, 1] } : undefined}
                        transition={{ duration: 0.35 }}
                        onClick={() => handleToggleChip(chip)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border-2 border-b-[5px] p-4 text-left font-semibold transition-all active:translate-y-0.5 active:border-b-2",
                          picked
                            ? "border-emerald-500 border-b-emerald-700 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : isWrong
                              ? "border-rose-500 border-b-rose-700 bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200"
                              : "border-border border-b-neutral-300 bg-surface text-heading hover:bg-surface-2 dark:border-b-neutral-700",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-white/20 text-xl">
                            {chip.emoji}
                          </span>
                          <span className="text-sm font-bold">{chip.label}</span>
                        </span>
                        <span
                          className={cn(
                            "grid size-7 place-items-center rounded-full border-2",
                            picked ? "border-white bg-white text-emerald-600" : "border-border bg-background",
                          )}
                        >
                          {picked && <Check className="size-4 stroke-[3]" />}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {wrongChipId && (
                  <p className="text-center text-xs font-bold text-rose-600 dark:text-rose-400">
                    ⚡ Ese pensamiento aumenta tu presión escolar. ¡Elige los que te cuidan!
                  </p>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="relative mb-5 grid size-28 place-items-center rounded-[32px] border-4 border-b-8 border-amber-600 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 text-white shadow-2xl shadow-amber-500/30"
                >
                  <Trophy className="size-14 drop-shadow" />
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="absolute -top-3 -right-3 grid size-10 place-items-center rounded-full border-2 border-white bg-emerald-500 text-lg font-black text-white shadow"
                  >
                    ✨
                  </motion.span>
                </motion.div>

                <h2 className="font-display text-3xl font-extrabold text-heading">
                  ¡Cápsula Superada!
                </h2>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                  Fortaleciste tu refugio mental para la universidad. Cada pequeño hábito previene el desgaste emocional.
                </p>

                <div className="mt-6 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-3xl border-2 border-b-[5px] border-amber-400 border-b-amber-600 bg-amber-50 p-4 dark:bg-amber-950/40">
                    <p className="text-[11px] font-extrabold uppercase text-amber-700 dark:text-amber-300">
                      Semillas Ganadas
                    </p>
                    <p className="mt-1 flex items-center justify-center gap-1 font-display text-2xl font-black text-amber-600 dark:text-amber-400">
                      <Sparkles className="size-5" /> +{lesson.xpReward} XP
                    </p>
                  </div>
                  <div className="rounded-3xl border-2 border-b-[5px] border-orange-400 border-b-orange-600 bg-orange-50 p-4 dark:bg-orange-950/40">
                    <p className="text-[11px] font-extrabold uppercase text-orange-700 dark:text-orange-300">
                      Racha Diaria
                    </p>
                    <p className="mt-1 flex items-center justify-center gap-1 font-display text-2xl font-black text-orange-600 dark:text-orange-400">
                      <Flame className="size-5 fill-current" /> Activa
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky 3D Bottom Action Button */}
        <div className="border-t border-border/80 bg-surface/95 p-4 backdrop-blur-md">
          {step === 0 && (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                vibrate(30);
              }}
              className={cn(
                "w-full rounded-2xl border-2 border-b-[6px] py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition-all active:translate-y-1 active:border-b-2",
                lesson.palette.bg,
                lesson.palette.border,
                lesson.palette.lip,
              )}
            >
              Continuar al Reto →
            </button>
          )}

          {step === 1 && !isQuizHealthy && (
            <button
              type="button"
              disabled={!selectedOption}
              onClick={handleCheckQuiz}
              className={cn(
                "w-full rounded-2xl border-2 border-b-[6px] py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition-all active:translate-y-1 active:border-b-2 disabled:opacity-40",
                lesson.palette.bg,
                lesson.palette.border,
                lesson.palette.lip,
              )}
            >
              Comprobar Respuesta
            </button>
          )}

          {step === 1 && quizChecked && isQuizHealthy && (
            <button
              type="button"
              onClick={() => {
                setStep(2);
                vibrate(30);
              }}
              className="w-full rounded-2xl border-2 border-b-[6px] border-emerald-600 border-b-emerald-800 bg-emerald-500 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all active:translate-y-1 active:border-b-2"
            >
              ¡Genial! Ir a la Práctica →
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              disabled={!practiceComplete}
              onClick={handleFinishLesson}
              className="w-full rounded-2xl border-2 border-b-[6px] border-emerald-600 border-b-emerald-800 bg-emerald-500 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all active:translate-y-1 active:border-b-2 disabled:opacity-40"
            >
              {practiceComplete ? "¡Completar Unidad!" : `Elige ${positiveChipsCount - selectedChips.length} más para continuar`}
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleClaimReward}
              className="w-full rounded-2xl border-2 border-b-[6px] border-amber-600 border-b-amber-800 bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-amber-500/30 transition-all active:translate-y-1 active:border-b-2"
            >
              🌱 Reclamar +{lesson.xpReward} XP y Volver
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
