import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { NearLogo } from "./Logo";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sanctuary px-6 pt-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="grid size-10 place-items-center rounded-full bg-background/70 text-heading" aria-label="Volver">
          <ChevronLeft className="size-5" />
        </Link>
        <NearLogo />
        <span className="size-10" />
      </div>
      <div className="mt-10 mb-8">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed">{subtitle}</p>
      </div>
      <div className="flex-1">{children}</div>
      <div className="mt-8 text-center text-sm">{footer}</div>
    </div>
  );
}

export const fieldClass =
  "h-13 rounded-2xl border-input bg-background px-4 text-base text-heading placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
