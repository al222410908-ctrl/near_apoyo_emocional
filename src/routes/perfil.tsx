import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookHeart, ChevronRight, Download, EyeOff, FileText, Flame, Leaf, LogOut, MessageCircle, Moon, Pencil, Phone, Sun, Trash2, UserRound, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/near/AppScreen";
import { PrivacyNoticeDialog } from "@/components/near/PrivacyNoticeDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNear } from "@/context/NearContext";
import { useSpeechSynthesis } from "@/hooks/useSpeech";
import { COMPANION_STYLES } from "@/services/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil y privacidad · Near Apoyo Emocional" },
      { name: "description", content: "Tus derechos ARCO, modo anónimo, personalización de Near y contacto de confianza." },
      { property: "og:title", content: "Perfil y privacidad · Near Apoyo Emocional" },
      { property: "og:description", content: "Tus derechos ARCO, modo anónimo, personalización de Near y contacto de confianza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen>
      <Profile />
    </AppScreen>
  ),
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">{children}</div>
    </section>
  );
}

function Row({ icon, title, subtitle, right, onClick }: { icon: ReactNode; title: string; subtitle?: string; right?: ReactNode; onClick?: () => void }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp type={onClick ? "button" : undefined} onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-background text-secondary">{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-heading">{title}</span>
        {subtitle && <span className="block text-xs text-muted-foreground">{subtitle}</span>}
      </span>
      {right}
    </Comp>
  );
}

function Profile() {
  const near = useNear();
  const { user, settings, updateSettings, streak, checkIns, moods, messages, exportData, clearMessages, logout, emergencyContact, setEmergencyContact } = near;
  const navigate = useNavigate();
  const tts = useSpeechSynthesis(settings.voiceRate);
  if (!user) return null;

  const initials = user.name.slice(0, 2).toUpperCase();
  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `near-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Tus datos se descargaron", { description: "Archivo JSON con todo tu historial." });
  };

  return (
    <div className="space-y-6 bg-sanctuary px-5 pt-6 pb-6">
      <header className="rounded-3xl bg-clay p-5 text-primary-foreground shadow-lift">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-primary-foreground/20 font-display text-2xl font-semibold">
            {settings.anonymousMode ? <EyeOff className="size-7" /> : initials}
          </span>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-primary-foreground">{settings.anonymousMode ? "Modo anónimo" : user.name}</h1>
            <p className="text-sm opacity-85">
              {user.major} · {user.school}
            </p>
          </div>
          <EditProfileDialog />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: <Flame className="size-4" />, value: streak, label: "Racha" },
            { icon: <BookHeart className="size-4" />, value: moods.length, label: "Registros" },
            { icon: <MessageCircle className="size-4" />, value: checkIns.length, label: "Días de calma" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-primary-foreground/15 py-3">
              <p className="flex items-center justify-center gap-1 font-display text-xl font-semibold">
                {s.icon} {s.value}
              </p>
              <p className="text-[11px] opacity-85">{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      <Section title="Privacidad y derechos ARCO">
        <PrivacyNoticeDialog trigger={<button type="button" className="w-full"><Row icon={<FileText className="size-4" />} title="Aviso de Privacidad" subtitle="Cómo cuidamos tu información (LFPDPPP)" right={<ChevronRight className="size-4 text-muted-foreground" />} /></button>} />
        <Row icon={<EyeOff className="size-4" />} title="Modo anónimo" subtitle="Near no usará tu nombre" right={<Switch checked={settings.anonymousMode} onCheckedChange={(v) => updateSettings({ anonymousMode: v })} aria-label="Modo anónimo" />} />
        <Row icon={<Download className="size-4" />} title="Descargar mis datos (JSON)" subtitle="Derecho de Acceso" onClick={download} right={<ChevronRight className="size-4 text-muted-foreground" />} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="w-full">
              <Row icon={<Trash2 className="size-4 text-sos" />} title="Eliminar todo mi historial de conversaciones" subtitle={`${messages.filter((m) => m.role === "user").length} mensajes guardados · Derecho de Cancelación`} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background sm:max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tus conversaciones?</AlertDialogTitle>
              <AlertDialogDescription>Se borrarán todos tus mensajes con Near de este dispositivo. Esta acción no se puede deshacer.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-2xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-2xl bg-sos text-sos-foreground hover:bg-sos/90"
                onClick={() => {
                  clearMessages();
                  toast.success("Historial eliminado");
                }}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section title="Personaliza a Near">
        <div className="space-y-2 p-4">
          <p className="text-sm font-semibold text-heading">Tono del acompañante</p>
          <div className="grid gap-2">
            {COMPANION_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateSettings({ companionStyle: s.id })}
                className={cn("rounded-2xl border px-3.5 py-2.5 text-left transition-colors", settings.companionStyle === s.id ? "border-primary bg-primary-tint" : "border-border bg-background")}
              >
                <span className="block text-sm font-semibold text-heading">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.description}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">Velocidad de voz</p>
            <span className="text-xs font-semibold text-primary tabular-nums">{settings.voiceRate.toFixed(2)}×</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider value={[settings.voiceRate]} min={0.7} max={1.3} step={0.05} onValueChange={([v]) => updateSettings({ voiceRate: v ?? 1 })} aria-label="Velocidad de voz" className="flex-1" />
            <Button variant="soft" size="sm" className="rounded-full" onClick={() => tts.speak("Hola, estoy aquí para escucharte, a tu ritmo.", "preview")}>
              <Volume2 /> Probar
            </Button>
          </div>
        </div>
        <div className="p-4">
          <p className="mb-3 text-sm font-semibold text-heading">Tema del santuario</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "claro" as const, label: "Terracota", subtitle: "Cálido", icon: <Sun className="size-4 text-primary" /> },
              { id: "salvia" as const, label: "Bosque", subtitle: "Salvia", icon: <Leaf className="size-4 text-emerald-600 dark:text-emerald-400" /> },
              { id: "noche" as const, label: "Obsidiana", subtitle: "OLED", icon: <Moon className="size-4 text-secondary" /> },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updateSettings({ theme: t.id })}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center transition-all",
                  settings.theme === t.id
                    ? "border-primary bg-primary-tint/70 text-heading shadow-soft ring-2 ring-primary/25"
                    : "border-border bg-background hover:bg-surface-2",
                )}
              >
                <div className="grid size-8 place-items-center rounded-xl bg-surface shadow-xs">
                  {t.icon}
                </div>
                <div>
                  <span className="block text-xs font-semibold">{t.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{t.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Contacto de confianza">
        {emergencyContact ? (
          <Row
            icon={<UserRound className="size-4" />}
            title={emergencyContact.name}
            subtitle={emergencyContact.phone}
            right={
              <div className="flex items-center gap-1">
                <a href={`tel:${emergencyContact.phone.replace(/\s/g, "")}`} className="grid size-9 place-items-center rounded-full bg-success-tint text-success" aria-label={`Llamar a ${emergencyContact.name}`}>
                  <Phone className="size-4" />
                </a>
                <button type="button" onClick={() => setEmergencyContact(null)} className="grid size-9 place-items-center rounded-full text-muted-foreground" aria-label="Quitar contacto">
                  <Trash2 className="size-4" />
                </button>
              </div>
            }
          />
        ) : (
          <EmergencyContactForm />
        )}
      </Section>

      <Button
        variant="surface"
        size="xl"
        className="w-full"
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
      >
        <LogOut className="size-5" /> Cerrar sesión
      </Button>
      <p className="px-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        Near es un espacio de primer contacto y autorregulación emocional. No realiza diagnósticos clínicos, no receta medicamentos y no sustituye la atención psicológica profesional.
      </p>
    </div>
  );
}

function EmergencyContactForm() {
  const { setEmergencyContact } = useNear();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const save = () => {
    if (name.trim().length < 2) { toast.error("Escribe el nombre de tu contacto"); return; }
    if (phone.replace(/\D/g, "").length < 8) { toast.error("Escribe un teléfono válido"); return; }
    setEmergencyContact({ name: name.trim(), phone: phone.trim() });
    toast.success("Contacto de confianza guardado", { description: "Aparecerá en el botón SOS." });
  };
  return (
    <div className="space-y-3 p-4">
      <p className="text-xs text-muted-foreground">Alguien a quien puedas llamar en un momento difícil. Aparecerá junto a las líneas de emergencia.</p>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre (p. ej. Mamá, Diego)" className="h-11 rounded-2xl bg-background" aria-label="Nombre del contacto" />
      <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" placeholder="Teléfono (55 1234 5678)" className="h-11 rounded-2xl bg-background" aria-label="Teléfono del contacto" />
      <Button variant="slate" className="w-full rounded-2xl" onClick={save}>
        Guardar contacto
      </Button>
    </div>
  );
}

function EditProfileDialog() {
  const { user, updateUser } = useNear();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? "", school: user?.school ?? "", major: user?.major ?? "" });
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o && user) setForm({ name: user.name, school: user.school, major: user.major });
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className="grid size-10 place-items-center rounded-full bg-primary-foreground/15" aria-label="Editar perfil">
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {(
            [
              ["name", "Nombre"],
              ["school", "Universidad"],
              ["major", "Carrera"],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <Label htmlFor={k}>{label}</Label>
              <Input id={k} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className="h-11 rounded-2xl" />
            </div>
          ))}
          <Button
            variant="clay"
            size="xl"
            className="w-full"
            onClick={() => {
              updateUser({ name: form.name.trim() || "Estudiante", school: form.school.trim(), major: form.major.trim() });
              setOpen(false);
              toast.success("Perfil actualizado");
            }}
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
