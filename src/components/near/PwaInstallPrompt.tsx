import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Registro del Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-surface/95 p-3.5 shadow-lift backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Download className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-heading">Instalar Near en tu celular</p>
            <p className="text-[11px] text-muted-foreground">Acceso directo y soporte sin conexión</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="clay" className="h-8 px-2.5 text-xs font-medium" onClick={handleInstall}>
            Instalar
          </Button>
          <button
            type="button"
            className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-2"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar aviso de instalación"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
