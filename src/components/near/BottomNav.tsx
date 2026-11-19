import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AudioLines, LayoutGrid, MessageSquareHeart, UserRound, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    to: "/inicio",
    label: "Inicio",
    icon: LayoutGrid,
    activeClass: "border-primary/40 border-b-primary bg-primary-tint text-primary",
    labelClass: "text-primary",
  },
  {
    to: "/chat",
    label: "Chat IA",
    icon: MessageSquareHeart,
    activeClass: "border-primary border-b-[#693222] bg-clay text-primary-foreground shadow-sm",
    labelClass: "text-primary",
  },
  {
    to: "/voz",
    label: "Voz IA",
    icon: AudioLines,
    activeClass: "border-secondary border-b-slate-800 bg-secondary text-secondary-foreground shadow-sm",
    labelClass: "text-secondary",
  },
  {
    to: "/calma",
    label: "Calma",
    icon: Wind,
    activeClass:
      "border-emerald-400/80 border-b-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
    labelClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: UserRound,
    activeClass:
      "border-violet-400/80 border-b-violet-600 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/70 dark:text-violet-300",
    labelClass: "text-violet-700 dark:text-violet-400",
  },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="sticky top-2 z-40 w-full px-4 pt-2">
      <nav
        className="rounded-2xl border border-b-[3px] border-border/90 border-b-neutral-300 bg-surface/95 px-2 py-1.5 shadow-sm backdrop-blur-xl dark:border-b-neutral-800"
        aria-label="Navegación principal superior"
      >
        <ul className="grid grid-cols-5 gap-1">
          {tabs.map(({ to, label, icon: Icon, activeClass, labelClass }) => {
            const isActive =
              pathname === to ||
              (to === "/calma" && (pathname.startsWith("/calma") || pathname.startsWith("/bitacora")));

            return (
              <li key={to} className="flex justify-center">
                <Link
                  to={to}
                  className="group flex w-full flex-col items-center gap-1 rounded-2xl py-1 transition-all"
                >
                  <motion.span
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? { y: -2 } : { y: 0 }}
                    className={cn(
                      "relative grid h-9 w-12 place-items-center rounded-xl transition-all",
                      isActive
                        ? cn("border border-b-[3px]", activeClass)
                        : "border border-transparent text-muted-foreground group-hover:bg-surface-2 group-hover:text-heading",
                    )}
                  >
                    <Icon className={cn("size-4.5 transition-transform", isActive && "scale-105 stroke-[2.4]")} />
                  </motion.span>
                  <span
                    className={cn(
                      "text-[10px] tracking-tight transition-colors",
                      isActive ? cn("font-extrabold", labelClass) : "font-semibold text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
