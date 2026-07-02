import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { formatCurrency, timeAgo } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { ArrowUpRight, Receipt, RotateCcw, Webhook, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — ZapVeridian" },
      { name: "description", content: "Live snapshot of your Nomba payment activity routed through Zapier." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { data: txns = [] } = useQuery({ queryKey: ["transactions"], queryFn: api.listTransactions });
  const { data: events = [] } = useQuery({ queryKey: ["webhooks"], queryFn: api.listWebhookEvents });

  const totalVolume = txns.filter(t => t.status === "success").reduce((s, t) => s + t.amount, 0);
  const successCount = txns.filter(t => t.status === "success").length;
  const failedCount = txns.filter(t => t.status === "failed").length;
  const pendingCount = txns.filter(t => t.status === "pending").length;

  const stats = [
    { label: "Volume (24h)", value: formatCurrency(totalVolume), icon: TrendingUp, hint: `${successCount} successful` },
    { label: "Transactions", value: txns.length, icon: Receipt, hint: `${pendingCount} pending` },
    { label: "Webhook Events", value: events.length, icon: Webhook, hint: `${events.filter(e=>e.signature_valid).length} verified` },
    { label: "Failed Charges", value: failedCount, icon: RotateCcw, hint: "Last 24h" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time activity from your Nomba integration.</p>
        </div>
        <Link to="/transactions" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          View all transactions <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 bg-card border-border shadow-soft">
            <div className="flex items-start justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5 bg-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Transactions</h2>
            <Link to="/transactions" className="text-xs text-muted-foreground hover:text-foreground">See all</Link>
          </div>
          <div className="space-y-2">
            {txns.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.customer}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.reference} · {timeAgo(t.date)}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={t.status} />
                  <span className="font-semibold tabular-nums">{formatCurrency(t.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-card border-border shadow-soft">
          <h2 className="font-semibold mb-4">Webhook Feed</h2>
          <div className="space-y-3">
            {events.slice(0, 6).map((e) => (
              <div key={e.event_id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                  e.event_type === "transaction" ? "bg-primary" :
                  e.event_type === "refund" ? "bg-warning" : "bg-destructive"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{e.payload_summary}</div>
                  <div className="text-xs text-muted-foreground">{timeAgo(e.received_at)} · {e.signature_valid ? "✓ verified" : "✗ unverified"}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
