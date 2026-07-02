import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { timeAgo, formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Check, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WebhookEventType } from "@/lib/api/types";

export const Route = createFileRoute("/webhooks")({
  head: () => ({
    meta: [
      { title: "Webhook Activity — ZapVeridian" },
      { name: "description", content: "Real-time feed of incoming webhook events from Nomba." },
    ],
  }),
  component: WebhooksPage,
});

const typeStyles: Record<WebhookEventType, { dot: string; chip: string; label: string }> = {
  transaction: { dot: "bg-primary", chip: "bg-primary/15 text-primary border-primary/30", label: "transaction" },
  refund: { dot: "bg-warning", chip: "bg-warning/15 text-warning border-warning/30", label: "refund" },
  failed_payment: { dot: "bg-destructive", chip: "bg-destructive/15 text-destructive border-destructive/30", label: "failed payment" },
};

function WebhooksPage() {
  const { data: events = [] } = useQuery({
    queryKey: ["webhooks"],
    queryFn: api.listWebhookEvents,
    refetchInterval: 5000,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webhook Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">Live feed of incoming events from Nomba.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground">Listening on</span>
          <code className="font-mono text-foreground">hooks.zapveridian.app</code>
        </div>
      </header>

      <Card className="bg-card border-border shadow-soft">
        <div className="divide-y divide-border">
          {events.length === 0 && (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Activity className="h-6 w-6" />
              No events yet
            </div>
          )}
          {events.map((e) => {
            const s = typeStyles[e.event_type];
            return (
              <div key={e.event_id} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                <span className={cn("mt-2 h-2.5 w-2.5 rounded-full shrink-0", s.dot)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] uppercase tracking-wider font-medium", s.chip)}>
                      {s.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(e.received_at)}</span>
                    <span className="text-xs text-muted-foreground">· {timeAgo(e.received_at)}</span>
                  </div>
                  <div className="mt-1.5 text-sm font-mono text-foreground/90 truncate">{e.payload_summary}</div>
                </div>
                <div className={cn("shrink-0 inline-flex items-center gap-1 text-xs",
                  e.signature_valid ? "text-success" : "text-destructive")}>
                  {e.signature_valid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {e.signature_valid ? "verified" : "unverified"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
