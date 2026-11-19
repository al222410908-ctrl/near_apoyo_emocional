import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AuthLayout, fieldClass } from "@/components/near/AuthLayout";
import { PrivacyNoticeDialog } from "@/components/near/PrivacyNoticeDialog";
import { useNear } from "@/context/NearContext";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear cuenta · Near Apoyo Emocional" },
      { name: "description", content: "Crea tu refugio emocional confidencial con tu correo de estudiante." },
      { property: "og:title", content: "Crear cuenta · Near Apoyo Emocional" },
      { property: "og:description", content: "Crea tu refugio emocional confidencial con tu correo de estudiante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useNear();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);

  const submit = (e: FormEvent): void => {
    e.preventDefault();
    const error =
      name.trim().length < 2
        ? "¿Cómo te gustaría que te llamemos?"
        : !/^\S+@\S+\.\S+$/.test(email)
          ? "Escribe tu correo de estudiante"
          : password.length < 6
            ? "Usa al menos 6 caracteres en tu contraseña"
            : !consent
              ? "Necesitamos tu consentimiento para cuidar tus datos"
              : null;
    if (error) {
      toast.error(error);
      return;
    }
    register({ name: name.trim().split(" ")[0] ?? name.trim(), email });
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthLayout
      title="Tu refugio empieza aquí"
      subtitle="Solo necesitamos lo básico. Todo lo que compartas es confidencial."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">¿Cómo te llamas?</Label>
          <Input id="name" autoComplete="given-name" placeholder="Tu nombre o apodo" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo de estudiante</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="tu.nombre@alumno.edu.mx" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} />
        </div>
        <label htmlFor="consent" className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-secondary" />
          <span className="flex-1 text-sm leading-snug">
            Acepto el tratamiento de mis datos conforme a la LFPDPPP y he leído el{" "}
            <PrivacyNoticeDialog
              trigger={
                <button type="button" className="font-semibold text-primary underline underline-offset-2">
                  Aviso de Privacidad
                </button>
              }
            />
            .
          </span>
          <Switch id="consent" checked={consent} onCheckedChange={setConsent} aria-label="Acepto el aviso de privacidad" />
        </label>
        <Button type="submit" variant="clay" size="xl" className="w-full" disabled={!consent}>
          Crear mi refugio
        </Button>
      </form>
    </AuthLayout>
  );
}
