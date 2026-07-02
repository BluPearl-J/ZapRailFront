import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Receipt,
  RotateCcw,
  Webhook,
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/transactions", label: "Txns", icon: Receipt },
  { to: "/refunds", label: "Refunds", icon: RotateCcw },
  { to: "/webhooks", label: "Hooks", icon: Webhook },
  { to: "/connections", label: "Zaps", icon: Zap },
  { to: "/setup", label: "Setup", icon: Settings },
] as const;

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-sidebar/95 backdrop-blur">
      <ul className="grid grid-cols-6">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
