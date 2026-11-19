import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useNear } from "@/context/NearContext";

export function DynamicIslandPill() {
  const { activePill, dismissPill } = useNear();

  return (
    <div className="pointer-events-none fixed top-3 left-0 right-0 z-50 flex justify-center px-4">
      <AnimatePresence>
        {activePill && (
          <motion.div
            key={activePill.id}
            initial={{ y: -65, scale: 0.85, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -45, scale: 0.9, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 28,
              mass: 0.8,
            }}
            className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-full border border-white/20 bg-heading/95 px-4 py-2.5 text-background shadow-2xl backdrop-blur-2xl"
          >
            <motion.span
              animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.6 }}
              className="text-lg leading-none"
            >
              {activePill.emoji}
            </motion.span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-semibold tracking-tight text-background">
                {activePill.title}
              </p>
              {activePill.subtitle && (
                <p className="truncate text-[11px] text-background/75">
                  {activePill.subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={dismissPill}
              className="grid size-6 shrink-0 place-items-center rounded-full text-background/60 hover:bg-white/10 hover:text-background"
              aria-label="Cerrar notificación"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
