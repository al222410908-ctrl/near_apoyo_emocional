import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Compass, Leaf, MessageCircleHeart, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    to: "/inicio",
    label: "Inicio",
    icon: Compass,
    activeClass: "border-primary/40 border-b-primary bg-primary-tint text-primary",
    labelClass: "text-primary",
  },
  {
    to: "/chat",
    label: "Near IA",
    icon: MessageCircleHeart,
    activeClass: "border-primary border-b-[#693222] bg-clay text-primary-foreground",
    labelClass: "text-primary",
  },
  {
    to: "/calma",
    label: "Calma",
    icon: Leaf,
    activeClass: "border-emerald-400/70 border-b-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    labelClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: UserRound,
    activeClass: "border-secondary/40 border-b-secondary bg-secondary-tint text-secondary",
    labelClass: "text-secondary",
  },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="border-t border-border bg-surface/95 px-3 pt-2 pb-safe shadow-lg backdrop-blur-xl"
      aria-label="Navegación principal"
    >
      <ul className="grid grid-cols-4 gap-1.5 pb-2">
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
                  animate={isActive ? { y: -1 } : { y: 0 }}
                  className={cn(
                    "grid h-9 w-13 place-items-center rounded-xl transition-all",
                    isActive
                      ? cn("border border-b-[3px] shadow-xs", activeClass)
                      : "border border-transparent text-muted-foreground group-hover:bg-surface-2 group-hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4.5 transition-transform", isActive && "scale-105 stroke-[2.3]")} />
                </motion.span>
                <span
                  className={cn(
                    "text-[11px] tracking-tight transition-colors",
                    isActive ? cn("font-extrabold", labelClass) : "font-medium text-muted-foreground",
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
  );
}
