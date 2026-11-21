import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  GraduationCap,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/near/GoogleIcon";
import { NearMark } from "@/components/near/Logo";
import { SplashVideoHero } from "@/components/near/SplashVideoHero";
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
  component: WelcomeAuthScreen,
});

function WelcomeAuthScreen() {
  const { hydrated, signedIn, user, onboarded, login, register, loginDemo, logout } = useNear();
  const navigate = useNavigate();

  // Tab activo: 'login' | 'register'
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Estado del formulario de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Estado del formulario de Registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regConsent, setRegConsent] = useState(true);

  const returning = hydrated && signedIn && user;

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

  // Manejar Modo Demo
  const handleQuickDemo = () => {
    loginDemo();
    toast.success("Ingresaste como estudiante en Modo Demo");
    navigate({ to: "/inicio" });
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-sanctuary px-4 pt-4 pb-6 sm:px-6">
      {/* Luces ambientales en degradado turquesa y coral */}
      <div className="pointer-events-none absolute -top-20 -left-16 size-72 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 size-72 rounded-full bg-rose-400/15 blur-3xl" />

      {/* Barra superior con distintivo institucional */}
      <header className="relative z-10 mx-auto flex w-full max-w-sm items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-b-[2px] border-border bg-surface/90 px-3 py-1 text-xs font-bold text-heading shadow-2xs backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Near · Apoyo Emocional
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          <GraduationCap className="size-3.5 text-primary" />
          <span>UTVT TIC</span>
        </div>
      </header>

      {/* Contenido Central: Video Animación + Formulario Directo */}
      <main className="relative z-10 my-auto flex w-full flex-col items-center py-2">
        {/* Video Animado del Logo de Near (Cerebro ➔ Corazón) */}
        <SplashVideoHero className="mb-3.5" videoClassName="h-40 sm:h-48" />

        {/* Tarjeta de Acceso Directo */}
        <div className="w-full max-w-sm rounded-3xl border-2 border-border/80 bg-[#FFFDF9] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:bg-[#1E1C1A]">
          {returning ? (
            /* Estado: Usuario con sesión activa */
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                <NearMark className="size-9" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-heading">¡Qué bueno verte, {user.name}!</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tu sesión sigue activa con tu cuenta ({user.email}).
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
            /* Estado: Formulario Directo con Pestañas (Iniciar Sesión / Crear Cuenta) */
            <div>
              {/* Pestañas de Navegación Rápida */}
              <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-border/80 bg-surface/70 p-1">
                <button
                  type="button"
                  onClick={() => setAuthTab("login")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
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
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
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
                <form onSubmit={handleLogin} className="space-y-3">
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
                      className="h-10 rounded-xl border-input bg-background px-3 text-xs text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-xs font-semibold text-heading">
                        Contraseña
                      </Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-10 rounded-xl border-input bg-background pr-10 pl-3 text-xs text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-muted-foreground hover:text-heading"
                        aria-label={showLoginPassword ? "Ocultar" : "Mostrar"}
                      >
                        {showLoginPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl border border-b-[3px] border-sky-600 border-b-sky-800 bg-sky-500 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:translate-y-0.5 hover:bg-sky-600"
                  >
                    Entrar a Near
                  </Button>

                  <div className="flex items-center gap-2 py-0.5 text-[11px] text-muted-foreground">
                    <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
                  </div>

                  {/* Acceso rápido con Google */}
                  <Button
                    type="button"
                    variant="surface"
                    className="w-full rounded-xl border border-border bg-background py-2 text-xs font-semibold text-heading hover:bg-surface-2"
                    onClick={() => {
                      loginDemo();
                      toast.success("Sesión iniciada con Google (cuenta institucional)");
                      navigate({ to: "/inicio" });
                    }}
                  >
                    <GoogleIcon className="mr-1.5 size-4" /> Continuar con Google
                  </Button>
                </form>
              )}

              {/* Formulario: Crear Cuenta */}
              {authTab === "register" && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1 text-left">
                    <Label htmlFor="reg-name" className="text-xs font-semibold text-heading">
                      ¿Cómo te llamas o te gusta que te digan?
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Ej. Alan o Alex"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="h-10 rounded-xl border-input bg-background px-3 text-xs text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500"
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
                      className="h-10 rounded-xl border-input bg-background px-3 text-xs text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500"
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
                        className="h-10 rounded-xl border-input bg-background pr-10 pl-3 text-xs text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-muted-foreground hover:text-heading"
                        aria-label={showRegPassword ? "Ocultar" : "Mostrar"}
                      >
                        {showRegPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Consentimiento LFPDPPP */}
                  <label className="flex items-start gap-2 rounded-xl border border-border/80 bg-background/80 p-2 text-left cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regConsent}
                      onChange={(e) => setRegConsent(e.target.checked)}
                      className="mt-0.5 size-3.5 rounded border-border text-rose-500 focus:ring-rose-400"
                    />
                    <span className="text-[10px] leading-tight text-muted-foreground">
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
                    className="w-full rounded-xl border border-b-[3px] border-rose-500 border-b-rose-700 bg-rose-500 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:translate-y-0.5 hover:bg-rose-600"
                  >
                    Crear mi cuenta y comenzar
                  </Button>
                </form>
              )}

              {/* Botón de Modo Demo: para no desecharlo y permitir prueba inmediata sin registrarse */}
              <div className="mt-3.5 border-t border-border/80 pt-2.5 text-center">
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

      {/* Pie institucional */}
      <footer className="relative z-10 mx-auto flex w-full max-w-sm items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          Confidencial y seguro
        </span>
        <span>© 2026 Near · TIC UTVT</span>
      </footer>
    </div>
  );
}
