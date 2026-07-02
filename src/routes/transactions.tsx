import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { ChevronDown, Search } from "lucide-react";
import type { TransactionStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — ZapVeridian" },
      { name: "description", content: "Browse, filter, and inspect Nomba payment transactions." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data: txns = [], isLoading } = useQuery({ queryKey: ["transactions"], queryFn: api.listTransactions });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = txns.filter((t) => {
    if (status !== "all" && t.status !== status) return false;
    if (q && !`${t.customer} ${t.reference} ${t.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    const d = new Date(t.date).getTime();
    if (from && d < new Date(from).getTime()) return false;
    if (to && d > new Date(to).getTime() + 86_400_000) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} of {txns.length} transactions</p>
      </header>

      <Card className="p-4 bg-card border-border shadow-soft">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customer or reference" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </Card>

      <Card className="bg-card border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Customer</th>
                <th className="text-left font-medium px-4 py-3">Reference</th>
                <th className="text-right font-medium px-4 py-3">Amount</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No transactions match your filters.</td></tr>
              )}
              {filtered.map((t) => (
                <RowGroup
                  key={t.id}
                  t={t}
                  expanded={expanded === t.id}
                  onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1", mono && "font-mono text-xs")}>{value}</div>
    </div>
  );
}

function RowGroup({ t, expanded, onToggle }: { t: import("@/lib/api/types").Transaction; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <tr onClick={onToggle} className="border-t border-border cursor-pointer hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDateTime(t.date)}</td>
        <td className="px-4 py-3">
          <div className="font-medium">{t.customer}</div>
          <div className="text-xs text-muted-foreground">{t.email}</div>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.reference}</td>
        <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(t.amount)}</td>
        <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
        <td className="px-4 py-3">
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </td>
      </tr>
      {expanded && (
        <tr className="bg-muted/20 border-t border-border">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <Field label="Method" value={t.method} />
              <Field label="Currency" value={t.currency} />
              <Field label="Description" value={t.description} />
              <Field label="Reference" value={t.reference} mono />
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">View receipt</Button>
              {t.status === "success" && <Button size="sm" variant="secondary">Refund</Button>}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
