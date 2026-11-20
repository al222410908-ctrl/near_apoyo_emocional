import { AnimatePresence, motion } from "framer-motion";
import { Flame, Mic, MicOff, Sparkles, Trash2, WandSparkles, Wind, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNear } from "@/context/NearContext";
import { useSpeechRecognition } from "@/hooks/useSpeech";
import { cn } from "@/lib/utils";

interface VentAndDissolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeekPerspective?: (text: string) => void;
}

export function VentAndDissolveModal({
  isOpen,
  onClose,
  onSeekPerspective,
}: VentAndDissolveModalProps) {
  const { addXp, showPill } = useNear();
  const [ventText, setVentText] = useState("");
  const [dissolving, setDissolving] = useState(false);
  const [dissolved, setDissolved] = useState(false);

  const stt = useSpeechRecognition({
    onFinal: (transcript) => setVentText((prev) => `${prev} ${transcript}`.trim()),
    onError: () => toast("Dictado de voz", { description: "Puedes escribir libremente en el recuadro." }),
  });

  const handleDissolve = () => {
    if (!ventText.trim()) return;

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([30, 50, 80, 120]);
      } catch {
        // Ignore
      }
    }

    setDissolving(true);
    setTimeout(() => {
      setDissolving(false);
      setDissolved(true);
      setVentText("");
      addXp(25);
      showPill({
        emoji: "💨",
        title: "Carga liberada",
        subtitle: "+25 XP por soltar lo que pesaba",
        tone: "primary",
      });
    }, 1400);
  };

  const handlePerspective = () => {
    if (!ventText.trim()) return;
    onSeekPerspective?.(ventText);
    onClose();
  };

  const handleReset = () => {
    setDissolved(false);
    setVentText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleReset}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[36px] border border-white/10 bg-[#16181D] p-6 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-rose-500/15 text-rose-400">
              <Flame className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-white">Desahogo Sin Filtro</h2>
              <p className="text-[11px] text-white/60">Privado · Cero censura · Cero rastro</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {dissolved ? (
          /* Estado Post-Disolución (Sensación de Alivio y Calma) */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto flex flex-col items-center py-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="grid size-20 place-items-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400"
            >
              🌿
            </motion.div>

            <h3 className="mt-4 font-display text-lg font-bold text-white">Se desvaneció.</h3>
            <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-white/70">
              Esa carga ya salió de tu pecho y de tu mente. No se guardó en ningún servidor. Ahora tómate un suspiro hondo: hoy hiciste lo mejor que pudiste.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition-transform active:scale-95"
            >
              <Wind className="size-4" />
              <span>Volver a Near en calma</span>
            </button>
          </motion.div>
        ) : (
          /* Estado de Escritura y Desahogo */
          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div className="relative mt-2">
              <textarea
                value={ventText}
                onChange={(e) => setVentText(e.target.value)}
                disabled={dissolving}
                placeholder="Escribe todo lo que te enoja, te duele o te frustra... suéltalo sin cuidar las palabras, nadie lo leerá..."
                rows={6}
                className={cn(
                  "w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-white placeholder:text-white/30 focus:border-rose-400/50 focus:outline-none",
                  dissolving && "animate-pulse blur-sm opacity-20 transition-all duration-1000",
                )}
              />

              {/* Botón de Dictado Rápido */}
              <button
                type="button"
                onClick={() => (stt.isListening ? stt.stop() : stt.start())}
                className={cn(
                  "absolute right-3 bottom-3 grid size-8 place-items-center rounded-xl border transition-all",
                  stt.isListening
                    ? "border-rose-500 bg-rose-500 text-white animate-pulse"
                    : "border-white/15 bg-white/10 text-white/70 hover:bg-white/20",
                )}
                title={stt.isListening ? "Detener dictado" : "Dictar desahogo por voz"}
              >
                {stt.isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
            </div>

            {/* Efecto de partículas animadas al disolver */}
            <AnimatePresence>
              {dissolving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-400"
                >
                  <motion.span
                    animate={{ y: [-5, -15], opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  <span>Desintegrando la carga emocional…</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botones de Acción */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                {/* 1. DISOLVER Y SOLTAR */}
                <button
                  type="button"
                  disabled={!ventText.trim() || dissolving}
                  onClick={handleDissolve}
                  className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/60 to-rose-900/40 p-3 text-center transition-all hover:border-rose-500 active:scale-95 disabled:opacity-40"
                >
                  <span className="grid size-8 place-items-center rounded-xl bg-rose-500 text-white shadow-md">
                    <Trash2 className="size-4" />
                  </span>
                  <span className="text-xs font-bold text-white">Disolver y Soltar</span>
                  <span className="text-[10px] text-rose-300/80">Destruir sin rastro</span>
                </button>

                {/* 2. PEDIR PERSPECTIVA A NEAR */}
                <button
                  type="button"
                  disabled={!ventText.trim() || dissolving}
                  onClick={handlePerspective}
                  className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/60 to-emerald-900/40 p-3 text-center transition-all hover:border-emerald-500 active:scale-95 disabled:opacity-40"
                >
                  <span className="grid size-8 place-items-center rounded-xl bg-emerald-500 text-white shadow-md">
                    <WandSparkles className="size-4" />
                  </span>
                  <span className="text-xs font-bold text-white">Buscar Perspectiva</span>
                  <span className="text-[10px] text-emerald-300/80">Platicar con Near</span>
                </button>
              </div>

              <p className="pt-1 text-center text-[10px] text-white/40">
                Todo se procesa en tu dispositivo. Nada se sube a redes ni bases públicas.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
