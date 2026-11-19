import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Compass, Leaf, MessageCircleHeart, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    to: "/inicio",
    label: "Camino",
    icon: Compass,
    activeClass: "border-amber-500 border-b-amber-700 bg-amber-400 text-amber-950 shadow-amber-500/25",
    labelClass: "text-amber-700 dark:text-amber-400",
  },
  {
    to: "/chat",
    label: "Chat IA",
    icon: MessageCircleHeart,
    activeClass: "border-rose-500 border-b-rose-700 bg-rose-500 text-white shadow-rose-500/25",
    labelClass: "text-rose-600 dark:text-rose-400",
  },
  {
    to: "/calma",
    label: "Calma",
    icon: Leaf,
    activeClass: "border-emerald-500 border-b-emerald-700 bg-emerald-500 text-white shadow-emerald-500/25",
    labelClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: UserRound,
    activeClass: "border-violet-500 border-b-violet-700 bg-violet-500 text-white shadow-violet-500/25",
    labelClass: "text-violet-700 dark:text-violet-400",
  },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="border-t-2 border-border bg-surface/95 px-3 pt-2 pb-safe shadow-2xl backdrop-blur-xl"
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
                  whileTap={{ scale: 0.88 }}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                  className={cn(
                    "grid h-10 w-14 place-items-center rounded-2xl transition-all",
                    isActive
                      ? cn("border-2 border-b-4 shadow-md", activeClass)
                      : "border-2 border-transparent text-muted-foreground group-hover:bg-surface-2 group-hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-5 transition-transform", isActive && "scale-110 stroke-[2.5]")} />
                </motion.span>
                <span
                  className={cn(
                    "text-[11px] tracking-tight transition-colors",
                    isActive ? cn("font-black", labelClass) : "font-semibold text-muted-foreground",
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
