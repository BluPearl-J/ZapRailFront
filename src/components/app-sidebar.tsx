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

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/refunds", label: "Refunds", icon: RotateCcw },
  { to: "/webhooks", label: "Webhook Activity", icon: Webhook },
  { to: "/connections", label: "Zap Connections", icon: Zap },
  { to: "/setup", label: "Setup", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
          <Zap className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">ZapVeridian</div>
          <div className="text-xs text-muted-foreground">Nomba × Zapier</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border border-sidebar-border"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent/50 border border-sidebar-border p-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Webhook</span>
            <span className="text-foreground font-medium">Live</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">All systems operational</div>
        </div>
      </div>
    </aside>
  );
}
