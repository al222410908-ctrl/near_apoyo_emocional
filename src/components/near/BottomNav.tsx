import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Leaf, UserRound } from "lucide-react";

const tabs = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/calma", label: "Calma", icon: Leaf },
  { to: "/perfil", label: "Perfil", icon: UserRound },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="border-t border-border/80 bg-background/95 px-6 pt-2 pb-safe shadow-lg backdrop-blur-xl" aria-label="Navegación principal">
      <ul className="flex items-center justify-around pb-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to || (to !== "/inicio" && pathname.startsWith(to));
          return (
            <li key={to} className="relative">
              <Link
                to={to}
                className={`group relative flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-colors ${
                  isActive ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <motion.span
                  whileTap={{ scale: 0.88 }}
                  className="relative grid h-8 w-14 place-items-center rounded-full"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-primary-tint"
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 size-5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-primary" : "text-muted-foreground group-hover:scale-105"
                    }`}
                  />
                </motion.span>
                <span className="relative z-10 text-[11px] tracking-tight">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
