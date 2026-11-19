import { Link } from "@tanstack/react-router";
import { Home, Leaf, UserRound } from "lucide-react";

const tabs = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/calma", label: "Calma", icon: Leaf },
  { to: "/perfil", label: "Perfil", icon: UserRound },
] as const;

export function BottomNav() {
  return (
    <nav className="border-t border-border bg-background/90 px-6 pt-2 pb-safe backdrop-blur-xl" aria-label="Principal">
      <ul className="flex items-center justify-around pb-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="group flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <span className="grid h-8 w-14 place-items-center rounded-full transition-colors group-data-[status=active]:bg-primary-tint">
                <Icon className="size-5" />
              </span>
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
