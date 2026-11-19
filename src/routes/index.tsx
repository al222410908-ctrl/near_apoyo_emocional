import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NearMark } from "@/components/near/Logo";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Near Apoyo Emocional · Tu refugio universitario" },
      { name: "description", content: "Un espacio seguro, confidencial y empático para estudiantes universitarios en México. Desahógate, respira y cuida de ti." },
      { property: "og:title", content: "Near Apoyo Emocional · Tu refugio universitario" },
      { property: "og:description", content: "Un espacio seguro, confidencial y empático para estudiantes universitarios en México." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { hydrated, signedIn, user, onboarded, loginDemo } = useNear();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 1)), 120);
    return () => window.clearInterval(t);
  }, []);

  const returning = hydrated && signedIn && user;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-sanctuary px-6 pt-10 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-heading backdrop-blur"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        Refugio Activo • 100% Confidencial
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="relative mb-8 grid place-items-center">
          <motion.div
            className="absolute size-56 rounded-full bg-sphere opacity-40 blur-2xl"
            animate={{ scale: [0.9, 1.12, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative grid size-36 place-items-center rounded-full bg-background/80 shadow-lift backdrop-blur"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <NearMark className="size-20" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-semibold"
        >
          Near
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 max-w-xs text-base leading-relaxed"
        >
          Un refugio para respirar, desahogarte y volver a ti, entre clases y exámenes.
        </motion.p>

        <div className="mt-8 w-full max-w-xs">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Aflojando tensiones…</span>
            <span className="font-semibold tabular-nums text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-clay transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-3.5 backdrop-blur">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary-tint text-secondary">
            <Lock className="size-5" />
          </span>
          <p className="text-left text-sm leading-snug">
            <span className="block font-semibold text-heading">Espacio seguro</span>
            Cifrado de extremo a extremo
          </p>
          <ShieldCheck className="ml-auto size-5 text-success" />
        </div>

        {returning ? (
          <Button asChild variant="clay" size="xl" className="w-full">
            <Link to={onboarded ? "/inicio" : "/onboarding"}>Volver a mi refugio, {user.name}</Link>
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="surface" size="xl">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild variant="clay" size="xl">
              <Link to="/registro">Crear cuenta</Link>
            </Button>
          </div>
        )}
        {!returning && (
          <Button asChild variant="ghost" className="w-full text-muted-foreground">
            <Link to="/inicio" onClick={() => loginDemo()}>
              <Sparkles /> Explorar con cuenta demo
            </Link>
          </Button>
        )}
      </motion.div>
    </div>
  );
}
