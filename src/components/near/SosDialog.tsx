import type { ReactNode } from "react";
import { Phone, HeartHandshake, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CRISIS_LINES } from "@/services/mockData";
import { useNear } from "@/context/NearContext";

export function CrisisLines() {
  const { emergencyContact } = useNear();
  return (
    <div className="space-y-2.5">
      {CRISIS_LINES.map((line) => (
        <a
          key={line.id}
          href={`tel:${line.tel}`}
          className="flex items-center gap-3 rounded-2xl bg-sos p-4 text-sos-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sos-foreground/15">
            <Phone className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold">{line.name}</span>
            <span className="block text-xs opacity-85">{line.description}</span>
          </span>
          <span className="font-display text-lg font-semibold">{line.display}</span>
        </a>
      ))}
      {emergencyContact && (
        <a
          href={`tel:${emergencyContact.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-transform active:scale-[0.98]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary-tint text-secondary">
            <UserRound className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-heading">{emergencyContact.name}</span>
            <span className="block text-xs text-muted-foreground">Tu contacto de confianza</span>
          </span>
          <span className="text-sm font-semibold text-secondary">{emergencyContact.phone}</span>
        </a>
      )}
    </div>
  );
}

export function SosDialog({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  return (
    <Dialog {...(open !== undefined ? { open } : {})} {...(onOpenChange ? { onOpenChange } : {})}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl border-border bg-background sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <span className="mb-1 grid size-14 place-items-center rounded-full bg-sos-tint text-sos">
            <HeartHandshake className="size-7" />
          </span>
          <DialogTitle className="text-xl">No estás solo/a</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-foreground">
            Si sientes que no puedes más, habla ahora con una persona capacitada. Es gratuito, confidencial y
            disponible las 24 horas.
          </DialogDescription>
        </DialogHeader>
        <CrisisLines />
        <p className="text-center text-[11px] leading-snug text-muted-foreground">
          Near es un espacio de acompañamiento. No diagnostica ni sustituye la atención profesional.
        </p>
      </DialogContent>
    </Dialog>
  );
}
