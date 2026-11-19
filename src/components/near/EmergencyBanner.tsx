import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SosDialog } from "./SosDialog";

export function EmergencyBanner() {
  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-3 rounded-2xl border border-sos/20 bg-sos-tint px-3.5 py-2.5 shadow-soft">
        <LifeBuoy className="size-5 shrink-0 text-sos" />
        <p className="flex-1 text-xs leading-tight text-heading">
          <span className="font-semibold">Líneas de contención 24/7</span>
          <span className="block text-muted-foreground">Orientación gratuita</span>
        </p>
        <SosDialog
          trigger={
            <Button variant="sos" size="sm" className="rounded-full px-4">
              Contactar
            </Button>
          }
        />
      </div>
    </div>
  );
}
