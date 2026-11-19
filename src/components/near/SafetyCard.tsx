import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { CrisisLines } from "./SosDialog";
import { SAFETY_MESSAGE } from "@/services/companion";

export function SafetyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-3xl border border-sos/25 bg-sos-tint p-4 shadow-soft"
      role="alert"
    >
      <div className="mb-2 flex items-center gap-2 text-sos">
        <ShieldAlert className="size-5" />
        <p className="text-sm font-semibold">Tu seguridad es lo primero</p>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-heading">{SAFETY_MESSAGE}</p>
      <CrisisLines />
    </motion.div>
  );
}
