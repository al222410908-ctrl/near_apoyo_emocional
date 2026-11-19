import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout, fieldClass } from "@/components/near/AuthLayout";
import { GoogleIcon } from "@/components/near/GoogleIcon";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Near Apoyo Emocional" },
      { name: "description", content: "Vuelve a tu refugio emocional en Near." },
      { property: "og:title", content: "Iniciar sesión · Near Apoyo Emocional" },
      { property: "og:description", content: "Vuelve a tu refugio emocional en Near." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, loginDemo } = useNear();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Escribe un correo válido"); return; }
    if (password.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return; }
    login(email);
    navigate({ to: "/inicio" });
  };

  return (
    <AuthLayout
      title="Qué bueno verte"
      subtitle="Tu refugio te estaba esperando. Entra con calma."
      footer={
        <>
          ¿Primera vez en Near?{" "}
          <Link to="/registro" className="font-semibold text-primary">
            Crea tu cuenta
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="tu.nombre@alumno.edu.mx" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass + " pr-12"} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground" aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>
        <Button type="submit" variant="clay" size="xl" className="w-full">
          Entrar
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="surface"
        size="xl"
        className="w-full bg-background font-medium"
        onClick={() => {
          loginDemo();
          toast.success("Sesión iniciada con Google (demo)");
          navigate({ to: "/inicio" });
        }}
      >
        <GoogleIcon /> Continuar con Google
      </Button>
    </AuthLayout>
  );
}
