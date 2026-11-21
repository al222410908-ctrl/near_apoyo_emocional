import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus,
  ArrowRight,
  LogOut,
  RotateCcw,
} from "lucide-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/near/GoogleIcon";
import { NearLogo, NearMark } from "@/components/near/Logo";
import { PrivacyNoticeDialog } from "@/components/near/PrivacyNoticeDialog";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Near Apoyo Emocional · IA Preventiva Universitaria" },
      {
        name: "description",
        content: "Espacio confidencial de apoyo emocional e inteligencia preventiva para estudiantes universitarios.",
      },
      { property: "og:title", content: "Near Apoyo Emocional · IA Preventiva Universitaria" },
      {
        property: "og:description",
        content: "Acceso seguro, confidencial y ético a Near Apoyo Emocional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootLandingScreen,
});

/**
 * PANTALLA PRINCIPAL CON SECUENCIA EXACTA:
 * 1. La Animación abarca TODA LA PANTALLA completa (sin botones de saltar ni textos que estorben).
 * 2. Al terminar la animación del video (o al tocar la pantalla), transición suave al Formulario de Login/Registro.
 */
function RootLandingScreen() {
  const { hydrated, signedIn, user, onboarded, login, register, loginDemo, logout } = useNear();
  const navigate = useNavigate();

  // Controla si se muestra la animación en pantalla completa o el formulario
  const [showSplash, setShowSplash] = useState(true);

  // Tab activo dentro del formulario: 'login' | 'register'
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Formulario de Iniciar Sesión
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Formulario de Registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regConsent, setRegConsent] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const returning = hydrated && signedIn && user;

  // Finalizar splash y pasar al formulario o dashboard si ya inició sesión
  const handleSplashFinish = () => {
    if (returning) {
      navigate({ to: onboarded ? "/inicio" : "/onboarding" });
    } else {
      setShowSplash(false);
    }
  };

  // Manejar el video de pantalla completa
  useEffect(() => {
    if (!showSplash) return;

    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si el navegador bloquea autoplay, se permite tocar la pantalla
        });
      }
    }

    // Temporizador de seguridad: si el video no termina en 6.2s, pasa automáticamente
    const timer = window.setTimeout(() => {
      handleSplashFinish();
    }, 6200);

    return () => window.clearTimeout(timer);
  }, [showSplash]);

  const handleVideoEnded = () => {
    // Breve pausa de 400ms sobre el logo final antes del fundido al formulario
    window.setTimeout(() => {
      handleSplashFinish();
    }, 400);
  };

  // Manejar Login
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(loginEmail)) {
      toast.error("Escribe un correo válido");
      return;
    }
    if (loginPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    login(loginEmail);
    toast.success("¡Bienvenido de vuelta a Near!");
    navigate({ to: "/inicio" });
  };

  // Manejar Registro
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    const error =
      regName.trim().length < 2
        ? "¿Cómo te gustaría que te llamemos?"
        : !/^\S+@\S+\.\S+$/.test(regEmail)
          ? "Escribe tu correo de estudiante o personal"
          : regPassword.length < 6
            ? "Usa al menos 6 caracteres en tu contraseña"
            : !regConsent
              ? "Acepta el aviso de privacidad para cuidar tus datos"
              : null;

    if (error) {
      toast.error(error);
      return;
    }

    register({ name: regName.trim().split(" ")[0] ?? regName.trim(), email: regEmail });
    toast.success(`¡Cuenta creada con éxito, ${regName.trim().split(" ")[0]}!`);
    navigate({ to: "/onboarding" });
  };

  // Manejar Modo Demo (accesible en 1 clic para no desecharlo)
  const handleQuickDemo = () => {
    loginDemo();
    toast.success("Ingresaste en Modo Demo");
    navigate({ to: "/inicio" });
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        /* =========================================================================
           PASO 1: LA ANIMACIÓN ABARCA TODA LA PANTALLA (SIN BOTONES NI ELEMENTOS)
           ========================================================================= */
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-[#FDFBF7] select-none dark:bg-[#151413]"
          onClick={handleSplashFinish}
          title="Toca para continuar"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover select-none"
            playsInline
            autoPlay
            muted
            poster="/near-splash-poster.jpg"
            onEnded={handleVideoEnded}
          >
            <source src="/near-splash.webm" type="video/webm" />
            <source src="/near-splash.mp4" type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        </motion.div>
      ) : (
        /* =========================================================================
           PASO 2: EL FORMULARIO (INICIAR SESIÓN / CREAR CUENTA)
           ========================================================================= */
        <motion.div
          key="auth-screen"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-sanctuary px-4 pt-6 pb-6 sm:px-6"
        >
          {/* Halos de luz de fondo */}
          <div className="pointer-events-none absolute -top-20 -left-16 size-72 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-20 size-72 rounded-full bg-rose-400/15 blur-3xl" />

          {/* Encabezado con Logo Oficial de Near y botón discreto para repetir la intro */}
          <header className="relative z-10 mx-auto flex w-full max-w-sm items-center justify-between pb-3">
            <NearLogo showSubtitle={true} />

            <button
              type="button"
              onClick={() => setShowSplash(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-3 py-1 text-[11px] font-bold text-heading shadow-2xs backdrop-blur transition-all active:scale-95 hover:bg-surface-2"
              title="Volver a reproducir la animación de inicio"
            >
              <RotateCcw className="size-3 text-primary" />
              <span>Ver intro</span>
            </button>
          </header>

          {/* Tarjeta Central del Formulario */}
          <main className="relative z-10 my-auto flex w-full flex-col items-center py-2">
            <div className="w-full max-w-sm rounded-3xl border-2 border-border/80 bg-[#FFFDF9] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:bg-[#1E1C1A]">
              {returning ? (
                /* Estado si el usuario ya tiene sesión activa */
                <div className="space-y-4 py-2 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                    <NearMark className="size-9" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-heading">¡Qué bueno verte, {user.name}!</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tu sesión está activa con tu cuenta ({user.email}).
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      type="button"
                      onClick={() => navigate({ to: onboarded ? "/inicio" : "/onboarding" })}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-b-[4px] border-sky-600 border-b-sky-800 bg-sky-500 py-3.5 text-sm font-bold text-white shadow-md transition-all active:translate-y-0.5 hover:bg-sky-600"
                    >
                      Continuar a mi espacio <ArrowRight className="size-4" />
                    </Button>

                    <button
                      type="button"
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-rose-600"
                    >
                      <LogOut className="size-3.5" />
                      Cerrar sesión / Cambiar de cuenta
                    </button>
                  </div>
                </div>
              ) : (
                /* Formulario con Pestañas: Iniciar Sesión / Crear Cuenta */
                <div>
                  {/* Selector de Pestañas */}
                  <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-border/80 bg-surface/70 p-1">
                    <button
                      type="button"
                      onClick={() => setAuthTab("login")}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                        authTab === "login"
                          ? "border border-b-2 border-border/80 bg-background text-heading shadow-xs"
                          : "text-muted-foreground hover:text-heading"
                      }`}
                    >
                      <LogIn className="size-3.5" />
                      <span>Iniciar sesión</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthTab("register")}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                        authTab === "register"
                          ? "border border-b-2 border-border/80 bg-background text-heading shadow-xs"
                          : "text-muted-foreground hover:text-heading"
                      }`}
                    >
                      <UserPlus className="size-3.5" />
                      <span>Crear cuenta</span>
                    </button>
                  </div>

                  {/* Formulario: Iniciar Sesión */}
                  {authTab === "login" && (
                    <form onSubmit={handleLogin} className="space-y-3.5">
                      <div className="space-y-1 text-left">
                        <Label htmlFor="login-email" className="text-xs font-semibold text-heading">
                          Correo institucional o personal
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          placeholder="alumno@utvt.edu.mx"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="h-11 rounded-xl border-input bg-background px-3 text-sm text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-sky-500"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <Label htmlFor="login-password" className="text-xs font-semibold text-heading">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showLoginPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="h-11 rounded-xl border-input bg-background pr-10 pl-3 text-sm text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-heading"
                            aria-label={showLoginPassword ? "Ocultar" : "Mostrar"}
                          >
                            {showLoginPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full rounded-xl border border-b-[3px] border-sky-600 border-b-sky-800 bg-sky-500 py-3 text-xs font-bold text-white shadow-xs transition-all active:translate-y-0.5 hover:bg-sky-600"
                      >
                        Entrar a Near
                      </Button>

                      <div className="flex items-center gap-2 py-0.5 text-[11px] text-muted-foreground">
                        <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
                      </div>

                      {/* Continuar con Google */}
                      <Button
                        type="button"
                        variant="surface"
                        className="w-full rounded-xl border border-border bg-background py-2.5 text-xs font-semibold text-heading hover:bg-surface-2"
                        onClick={() => {
                          loginDemo();
                          toast.success("Sesión iniciada con Google (cuenta estudiantil)");
                          navigate({ to: "/inicio" });
                        }}
                      >
                        <GoogleIcon className="mr-1.5 size-4" /> Continuar con Google
                      </Button>
                    </form>
                  )}

                  {/* Formulario: Crear Cuenta */}
                  {authTab === "register" && (
                    <form onSubmit={handleRegister} className="space-y-3.5">
                      <div className="space-y-1 text-left">
                        <Label htmlFor="reg-name" className="text-xs font-semibold text-heading">
                          ¿Cómo te llamas o te gustaría que te llamemos?
                        </Label>
                        <Input
                          id="reg-name"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Ej. Alan o Alex"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="h-11 rounded-xl border-input bg-background px-3 text-sm text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <Label htmlFor="reg-email" className="text-xs font-semibold text-heading">
                          Correo institucional o personal
                        </Label>
                        <Input
                          id="reg-email"
                          type="email"
                          autoComplete="email"
                          placeholder="tu.correo@utvt.edu.mx"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="h-11 rounded-xl border-input bg-background px-3 text-sm text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <Label htmlFor="reg-password" className="text-xs font-semibold text-heading">
                          Contraseña (mínimo 6 caracteres)
                        </Label>
                        <div className="relative">
                          <Input
                            id="reg-password"
                            type={showRegPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="h-11 rounded-xl border-input bg-background pr-10 pl-3 text-sm text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-heading"
                            aria-label={showRegPassword ? "Ocultar" : "Mostrar"}
                          >
                            {showRegPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Consentimiento confidencial */}
                      <label className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/80 p-2.5 text-left cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regConsent}
                          onChange={(e) => setRegConsent(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-border text-rose-500 focus:ring-rose-400"
                        />
                        <span className="text-[11px] leading-snug text-muted-foreground">
                          Acepto el tratamiento ético y confidencial de mis datos conforme a la LFPDPPP y el{" "}
                          <PrivacyNoticeDialog
                            trigger={
                              <button type="button" className="font-semibold text-rose-600 underline dark:text-rose-400">
                                Aviso de Privacidad
                              </button>
                            }
                          />
                          .
                        </span>
                      </label>

                      <Button
                        type="submit"
                        className="w-full rounded-xl border border-b-[3px] border-rose-500 border-b-rose-700 bg-rose-500 py-3 text-xs font-bold text-white shadow-xs transition-all active:translate-y-0.5 hover:bg-rose-600"
                      >
                        Crear mi cuenta y comenzar
                      </Button>
                    </form>
                  )}

                  {/* Acceso a Modo Demo (enlace accesible para probar sin registro) */}
                  <div className="mt-4 border-t border-border/80 pt-3 text-center">
                    <button
                      type="button"
                      onClick={handleQuickDemo}
                      className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:bg-surface-2 hover:text-heading"
                      title="Explorar todas las funciones sin crear cuenta"
                    >
                      <Sparkles className="size-3 text-amber-500 transition-transform group-hover:scale-125" />
                      <span>¿Solo quieres explorar? <strong className="text-primary font-bold">Probar modo demo (1 clic)</strong></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Pie de página institucional */}
          <footer className="relative z-10 mx-auto flex w-full max-w-sm items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Confidencial y seguro
            </span>
            <span>© 2026 Near · TIC UTVT</span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
