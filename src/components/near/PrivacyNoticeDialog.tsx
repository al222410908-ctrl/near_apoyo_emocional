import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PRIVACY_NOTICE } from "@/services/mockData";

export function PrivacyNoticeDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background sm:max-w-sm">
        <DialogHeader className="text-left">
          <DialogTitle>Aviso de Privacidad</DialogTitle>
          <DialogDescription>Versión simplificada · LFPDPPP</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {PRIVACY_NOTICE.map((s) => (
            <section key={s.title}>
              <h3 className="mb-1 font-sans text-sm font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
