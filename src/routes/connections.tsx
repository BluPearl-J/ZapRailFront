import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Zap Connections — ZapVeridian" },
      { name: "description", content: "Manage connected downstream apps for your Nomba payment events." },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const qc = useQueryClient();
  const { data: apps = [] } = useQuery({ queryKey: ["apps"], queryFn: api.listConnectedApps });
  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => api.toggleConnectedApp(id, enabled),
    onSuccess: (app) => {
      toast.success(`${app.name} ${app.enabled ? "enabled" : "disabled"}`);
      qc.invalidateQueries({ queryKey: ["apps"] });
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zap Connections</h1>
          <p className="text-sm text-muted-foreground mt-1">Downstream apps subscribed to your Nomba events.</p>
        </div>
        <Button onClick={() => toast.info("Coming soon — open in Zapier")}>
          <Plus className="h-4 w-4 mr-1.5" /> Connect new app
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <Card key={app.id} className="p-5 bg-card border-border shadow-soft flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-primary shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{app.name}</div>
                  <div className="text-xs text-muted-foreground">{app.category}</div>
                </div>
              </div>
              <Switch
                checked={app.enabled}
                onCheckedChange={(v) => toggle.mutate({ id: app.id, enabled: v })}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{app.description}</p>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{app.events} events delivered</span>
              <span className={app.enabled ? "text-success" : "text-muted-foreground"}>
                {app.enabled ? "● Active" : "○ Paused"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
