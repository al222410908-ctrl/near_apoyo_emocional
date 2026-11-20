import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Heart, Sparkles, WandSparkles, Wind, X } from "lucide-react";
import { useState } from "react";
import { NearFriendlyAvatar } from "@/components/near/NearFriendlyAvatar";
import { useNear } from "@/context/NearContext";
import { cn } from "@/lib/utils";

interface TactileEmotionUntanglerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

interface SensationItem {
  id: string;
  name: string;
  tag: string;
  emoji: string;
  color: string;
  bgGrad: string;
  hypothesis: string;
  subOptions: string[];
  reframe: string;
}

const SENSATIONS: SensationItem[] = [
  {
    id: "pecho",
    name: "Pecho apretado",
    tag: "Falta de aire o peso encima",
    emoji: "🫁",
    color: "border-rose-400 text-rose-800",
    bgGrad: "from-rose-50 to-rose-100/60 dark:from-rose-950/40 dark:to-rose-900/20",
    hypothesis:
      "Esa opresión en el pecho suele llegar cuando sientes que todo depende de ti y que si tú te descuidas un segundo, todo se derrumba. ¿Te resuena?",
    subOptions: [
      "Siento que me exijo ser perfecto/a",
      "Tengo miedo al futuro y a no poder",
      "Estoy cargando problemas de otros",
    ],
    reframe:
      "No tienes que sostener el mundo entero hoy. Tu valor no depende de rendir sin parar; date permiso de respirar y soltar lo que no puedes controlar ahorita.",
  },
  {
    id: "garganta",
    name: "Nudo en la garganta",
    tag: "Ganas de llorar o palabras atoradas",
    emoji: "🧣",
    color: "border-amber-400 text-amber-800",
    bgGrad: "from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20",
    hypothesis:
      "El nudo en la garganta aparece cuando tienes algo que decir o llorar, pero te obligas a sonreír y parecer fuerte frente a los demás. ¿Tiene sentido?",
    subOptions: [
      "Quiero llorar pero me aguanto",
      "Me guardé algo que me lastimó",
      "Me siento incomprendido/a",
    ],
    reframe:
      "Llorar no es debilidad; es la forma en que tu cuerpo limpia la sobrecarga. Si necesitas soltar unas lágrimas, estás en un lugar seguro. Yo me quedo contigo.",
  },
  {
    id: "mente",
    name: "Mente a mil por hora",
    tag: "Ruido mental, sobrepensamiento, insomnio",
    emoji: "🌀",
    color: "border-indigo-400 text-indigo-800",
    bgGrad: "from-indigo-50 to-indigo-100/60 dark:from-indigo-950/40 dark:to-indigo-900/20",
    hypothesis:
      "Cuando la mente va tan rápido, no está buscando soluciones reales; está en modo alarma porque siente peligro o incertidumbre. ¿Qué te tiene intranquilo/a?",
    subOptions: [
      "Repaso conversaciones pasadas con culpa",
      "Imagino los peores escenarios posibles",
      "Demasiados pendientes en desorden",
    ],
    reframe:
      "Tu mente está tratando de protegerte del futuro, pero el futuro no está pasando ahorita. Baja la mirada a tus manos: aquí y ahora estás a salvo.",
  },
  {
    id: "vacio",
    name: "Sensación de vacío",
    tag: "Desconexión, nada emociona, apatía",
    emoji: "🕳️",
    color: "border-slate-400 text-slate-800",
    bgGrad: "from-slate-50 to-slate-100/60 dark:from-slate-900/40 dark:to-slate-800/20",
    hypothesis:
      "A veces el vacío no es tristeza, es anestesia emocional: cuando la vida ha sido demasiado intensa, el cerebro apaga el volumen para descansar. ¿Te sientes desconectado/a?",
    subOptions: [
      "Siento que estoy en piloto automático",
      "Me siento solo/a rodeado/a de gente",
      "Perdí las ganas de lo que antes me gustaba",
    ],
    reframe:
      "El vacío es una señal de que necesitas recargar en silencio sin presionarte por 'estar feliz'. Es un invierno emocional temporal; la primavera vuelve a su tiempo.",
  },
  {
    id: "bateria",
    name: "Batería en 0%",
    tag: "Pesadez física, agotamiento, sin energía",
    emoji: "🔋",
    color: "border-emerald-400 text-emerald-800",
    bgGrad: "from-emerald-50 to-emerald-100/60 dark:from-emerald-950/40 dark:to-emerald-900/20",
    hypothesis:
      "Cuando no tienes batería ni para contestar un mensaje, tu cuerpo te está pidiendo a gritos una tregua. No eres flojo/a; estás drenado/a.",
    subOptions: [
      "He dado mucho y nadie me cuida a mí",
      "Semana tras semana sin un descanso de verdad",
      "Cansancio que no se quita durmiendo",
    ],
    reframe:
      "Hoy no intentes ser productivo/a. Comer algo caliente, tomar agua y cerrar los ojos 10 minutos es suficiente victoria por hoy.",
  },
];

export function TactileEmotionUntangler({
  isOpen,
  onClose,
  onOpenChatWithTopic,
}: TactileEmotionUntanglerProps) {
  const { addXp, showPill } = useNear();
  const [selectedSensation, setSelectedSensation] = useState<SensationItem | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const handleSelectSensation = (item: SensationItem) => {
    setSelectedSensation(item);
    setSelectedSub(null);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([20, 30]);
      } catch {
        // Ignore
      }
    }
  };

  const handleSelectSub = (sub: string) => {
    setSelectedSub(sub);
    addXp(20);
    showPill({
      emoji: "🧭",
      title: "Emoción desempaquetada",
      subtitle: "+20 XP por escuchar a tu cuerpo",
      tone: "primary",
    });
  };

  const handleReset = () => {
    setSelectedSensation(null);
    setSelectedSub(null);
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
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[36px] border border-black/10 bg-[#FAF7F2] p-5 text-[#1C1917] shadow-2xl dark:border-white/10 dark:bg-[#1E1C1A] dark:text-[#F4EFE6]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-400">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-heading">El Desempaquetador</h2>
              <p className="text-[11px] text-muted-foreground">
                Cero texto · Descifra lo que sientes con toques
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="grid size-8 place-items-center rounded-full bg-black/5 text-[#5C5248] hover:bg-black/10 dark:bg-white/10 dark:text-white/80"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* CONTENIDO INTERACTIVO POR PASOS */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!selectedSensation ? (
            /* PASO 1: MAPA CORPORAL / SENSACIONES */
            <div className="space-y-3 py-2">
              <div className="rounded-2xl bg-white/70 p-3 text-center dark:bg-white/5">
                <p className="text-xs font-semibold text-heading">
                  ¿Dónde o cómo sientes el malestar en este momento?
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Toca la sensación que más se acerque a lo que traes
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {SENSATIONS.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectSensation(item)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                      "bg-gradient-to-r shadow-2xs",
                      item.bgGrad,
                      item.color,
                    )}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-2xs dark:bg-black/20">
                      {item.emoji}
                    </span>
                    <div className="flex-1">
                      <span className="block font-display text-sm font-bold text-heading">
                        {item.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {item.tag}
                      </span>
                    </div>
                    <ChevronRight className="size-4 opacity-50" />
                  </motion.button>
                ))}
              </div>
            </div>
          ) : !selectedSub ? (
            /* PASO 2: LA HIPÓTESIS INTUITIVA DE NEAR */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 py-2"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-3.5 dark:border-white/10 dark:bg-[#2A2724]">
                <NearFriendlyAvatar size="sm" showWavePill={false} />
                <div className="flex-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#284B3C] dark:text-emerald-400">
                    Near leyendo tu sensación
                  </span>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-heading">
                    “{selectedSensation.hypothesis}”
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-muted-foreground uppercase">
                  Toca la opción que más resuena contigo:
                </span>
                {selectedSensation.subOptions.map((opt) => (
                  <motion.button
                    key={opt}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectSub(opt)}
                    className="flex w-full items-center justify-between rounded-2xl border border-black/5 bg-white p-3.5 text-left text-xs font-semibold text-heading shadow-2xs hover:border-[#B85A3A]/40 dark:border-white/10 dark:bg-[#262421]"
                  >
                    <span>{opt}</span>
                    <CheckCircle2 className="size-4 text-emerald-600 opacity-0 group-hover:opacity-100" />
                  </motion.button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedSensation(null)}
                className="text-center text-xs font-bold text-muted-foreground hover:underline w-full pt-1"
              >
                ← Probar con otra sensación
              </button>
            </motion.div>
          ) : (
            /* PASO 3: EL ALIVIO EMOCIONAL Y REENCUADRE */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-3"
            >
              <div className="rounded-[28px] border border-emerald-600/15 bg-gradient-to-b from-emerald-50 via-white to-emerald-50/50 p-5 shadow-sm dark:border-emerald-500/20 dark:from-[#112419] dark:via-[#19221D] dark:to-[#112419]">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="size-4" />
                  <span>Lo que tu cuerpo necesitaba escuchar</span>
                </div>

                <p className="mt-3 font-display text-sm font-semibold leading-relaxed text-heading sm:text-base">
                  {selectedSensation.reframe}
                </p>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-100/70 px-3 py-1.5 text-xs font-bold text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200">
                  <span>Sensación: {selectedSensation.name}</span>
                  <span>+20 XP ganados 🌿</span>
                </div>
              </div>

              {/* Acciones para cerrar el loop con calma */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpenChatWithTopic?.(
                      `Siento ${selectedSensation.name.toLowerCase()} porque ${selectedSub.toLowerCase()}. Ayúdame a desenredarlo con calma.`,
                    );
                    onClose();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B85A3A] py-3 text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
                >
                  <WandSparkles className="size-4" />
                  <span>Platicar esto más a fondo con Near</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-2xl border border-black/10 bg-white py-2.5 text-xs font-bold text-[#5C5248] hover:bg-[#F4EFE6] dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                >
                  Ya me siento más en paz · Cerrar
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
