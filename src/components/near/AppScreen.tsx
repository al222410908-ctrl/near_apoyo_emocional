import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNear } from "@/context/NearContext";
import { NearMark } from "./Logo";
import { BottomNav } from "./BottomNav";
import { EmergencyBanner } from "./EmergencyBanner";
import { cn } from "@/lib/utils";

/** Signed-in screen: guards the session, then renders content + sticky footer. */
export function AppScreen({
  children,
  nav = true,
  emergency = false,
  className,
}: {
  children: ReactNode;
  nav?: boolean;
  emergency?: boolean;
  className?: string;
}) {
  const { hydrated, signedIn, user, onboarded } = useNear();
  const navigate = useNavigate();
  const ready = hydrated && signedIn && !!user && onboarded;

  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn || !user) navigate({ to: "/login", replace: true });
    else if (!onboarded) navigate({ to: "/onboarding", replace: true });
  }, [hydrated, signedIn, user, onboarded, navigate]);

  if (!ready) return <ScreenLoader />;

  return (
    <div className="flex min-h-screen flex-col">
      <main className={cn("flex-1", className)}>{children}</main>
      {(nav || emergency) && (
        <div className="sticky bottom-0 z-30 pt-2">
          {emergency && <EmergencyBanner />}
          {nav && <BottomNav />}
        </div>
      )}
    </div>
  );
}

export function ScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3">
        <NearMark className="size-14 animate-breathe" />
        <p className="text-sm text-muted-foreground">Preparando tu refugio…</p>
      </div>
    </div>
  );
}

export function ScreenHeader({ title, subtitle, right, back }: { title: string; subtitle?: string; right?: ReactNode; back?: ReactNode }) {
  return (
    <header className="flex items-start gap-3 px-5 pt-6 pb-4">
      {back}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
