import { useState } from "react";
import { Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink, Zap, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNear } from "@/context/NearContext";
import { testGeminiApiKey } from "@/services/aiCompanion";

interface GeminiConnectDialogProps {
  trigger?: React.ReactNode;
}

export function GeminiConnectDialog({ trigger }: GeminiConnectDialogProps) {
  const { settings, updateSettings } = useNear();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || "");
  const [testing, setTesting] = useState(false);

  const hasKey = Boolean(settings.geminiApiKey && settings.geminiApiKey.trim().length > 10);

  const handleSaveAndTest = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      toast.error("Por favor escribe o pega tu clave de API.");
      return;
    }

    setTesting(true);
    const result = await testGeminiApiKey(trimmed);
    setTesting(false);

    if (result.ok) {
      updateSettings({ geminiApiKey: trimmed });
      toast.success("¡Google Gemini conectado con éxito! Ahora tienes IA verídica y personalizada.");
      setOpen(false);
    } else {
      toast.error(result.message || "Error al verificar la clave. Revisa que sea correcta.");
    }
  };

  const handleDisconnect = () => {
    updateSettings({ geminiApiKey: "" });
    setApiKey("");
    toast("Clave de Gemini removida", {
      description: "Near seguirá funcionando con su motor empático preventivo autónomo.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-2.5 py-1 text-[11px] font-bold text-heading shadow-2xs backdrop-blur transition-all active:scale-95 hover:bg-surface-2"
          >
            <Sparkles className={`size-3 ${hasKey ? "text-emerald-500" : "text-amber-500"}`} />
            <span>{hasKey ? "Gemini IA Activo" : "Vincular Gemini"}</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-[#FFFDF9] p-5 sm:max-w-md dark:bg-[#1E1C1A]">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Sparkles className="size-5" />
            </span>
            <DialogTitle className="text-lg font-bold text-heading">
              Vincular Google Gemini API (Gratis)
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Conecta una clave gratuita de Gemini para que Near responda con conocimiento en tiempo real, adaptado a la comunidad universitaria de la UTVT.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Tarjeta informativa de cómo obtener la clave gratis */}
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/70 p-3.5 text-xs text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200">
            <div className="flex items-start gap-2.5">
              <Zap className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <div className="space-y-1.5">
                <p className="font-bold">¿Cómo obtenerla gratis en 1 minuto?</p>
                <p className="text-[11px] leading-relaxed text-sky-800 dark:text-sky-300">
                  Google ofrece <strong>Gemini 1.5 Flash 100% gratis</strong> para estudiantes y desarrolladores. No requiere tarjeta de crédito.
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-sky-600 underline underline-offset-2 hover:text-sky-700 dark:text-sky-400"
                >
                  <span>Crear clave gratuita en Google AI Studio</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Campo para pegar la clave */}
          <div className="space-y-2 text-left">
            <Label htmlFor="gemini-key" className="text-xs font-semibold text-heading flex items-center gap-1.5">
              <Key className="size-3.5 text-primary" />
              <span>Clave de API de Gemini</span>
            </Label>
            <Input
              id="gemini-key"
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-11 rounded-xl border-input bg-background font-mono text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <p className="text-[10px] text-muted-foreground">
              Tu clave se almacena de forma privada en tu propio navegador conforme a la LFPDPPP y nunca se comparte con terceros.
            </p>
          </div>

          {/* Estado actual */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-surface/70 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Estado del modelo:</span>
            {hasKey ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Gemini 1.5 Flash Conectado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="size-3.5" /> Motor Autónomo de Near (Offline)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          {hasKey && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="rounded-xl border-sos/30 text-sos hover:bg-sos/10"
            >
              <Trash2 className="size-3.5 mr-1" /> Desconectar
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Cerrar
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={testing}
              onClick={handleSaveAndTest}
              className="rounded-xl border border-b-[3px] border-sky-600 border-b-sky-800 bg-sky-500 font-bold text-white shadow-xs hover:bg-sky-600 active:translate-y-0.5"
            >
              {testing ? "Verificando..." : "Guardar y Conectar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
