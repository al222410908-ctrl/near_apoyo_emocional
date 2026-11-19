import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useNear } from "@/context/NearContext";
import { NearMark } from "./Logo";
import { BottomNav } from "./BottomNav";
import { EmergencyBanner } from "./EmergencyBanner";
import { cn } from "@/lib/utils";

/** Signed-in screen: guards the session, then renders content + sticky footer with ambient aura. */
export function AppScreen({
  children,
  nav = true,
  emergency = false,
  className,
}: {
  children: ReactNode;
  nav?: boolean;
  emergency?: boolean;
  className?: string;
}) {
  const { hydrated, signedIn, user, onboarded, todayMood } = useNear();
  const navigate = useNavigate();
  const ready = hydrated && signedIn && !!user && onboarded;

  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn || !user) navigate({ to: "/login", replace: true });
    else if (!onboarded) navigate({ to: "/onboarding", replace: true });
  }, [hydrated, signedIn, user, onboarded, navigate]);

  if (!ready) return <ScreenLoader />;

  const mood = todayMood?.mood;
  const isAnxious = mood === "ansioso" || mood === "abrumado";
  const isTired = mood === "cansado";
  const isCalm = mood === "calmado" || mood === "esperanzado";

  const auraLeft = isAnxious
    ? "bg-secondary-tint/35"
    : isTired
      ? "bg-amber-200/25"
      : isCalm
        ? "bg-primary-soft/22"
        : "bg-primary-soft/14";

  const auraRight = isAnxious
    ? "bg-emerald-200/25"
    : isTired
      ? "bg-purple-200/25"
      : isCalm
        ? "bg-amber-100/35"
        : "bg-secondary-tint/22";

  const pulseDuration = isAnxious ? 18 : 12;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Aurora ambiental reactiva de calma en segundo plano */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className={`absolute -top-20 -left-16 size-80 rounded-full blur-3xl transition-colors duration-1000 ${auraLeft}`}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-1/3 -right-24 size-88 rounded-full blur-3xl transition-colors duration-1000 ${auraRight}`}
          animate={{
            x: [0, -25, 0],
            y: [0, -35, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: pulseDuration + 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute -bottom-24 left-1/4 size-72 rounded-full bg-primary-tint/25 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn("relative z-10 flex-1", className)}
      >
        {children}
      </motion.main>
      {(nav || emergency) && (
        <div className="sticky bottom-0 z-30 pt-2">
          {emergency && <EmergencyBanner />}
          {nav && <BottomNav />}
        </div>
      )}
    </div>
  );
}

export function ScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3">
        <NearMark className="size-14 animate-breathe" />
        <p className="text-sm text-muted-foreground">Preparando tu refugio…</p>
      </div>
    </div>
  );
}

export function ScreenHeader({ title, subtitle, right, back }: { title: string; subtitle?: string; right?: ReactNode; back?: ReactNode }) {
  return (
    <header className="flex items-start gap-3 px-5 pt-6 pb-4">
      {back}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
