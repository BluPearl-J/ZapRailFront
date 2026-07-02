import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import type { Transaction } from "@/lib/api/types";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refunds — ZapVeridian" },
      { name: "description", content: "Issue refunds and track refund status across your Nomba transactions." },
    ],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  const qc = useQueryClient();
  const { data: refundable = [] } = useQuery({ queryKey: ["refundable"], queryFn: api.listRefundableTransactions });
  const { data: refunds = [] } = useQuery({ queryKey: ["refunds"], queryFn: api.listRefunds });
  const [target, setTarget] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState("");

  const mutation = useMutation({
    mutationFn: ({ ref, amt }: { ref: string; amt: number }) => api.issueRefund(ref, amt),
    onSuccess: () => {
      toast.success("Refund submitted", { description: "It will appear in the refund status table shortly." });
      qc.invalidateQueries({ queryKey: ["refunds"] });
      setTarget(null);
      setAmount("");
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Refunds</h1>
        <p className="text-sm text-muted-foreground mt-1">Issue and monitor refunds on successful transactions.</p>
      </header>

      <section>
        <h2 className="font-semibold mb-3">Refundable transactions</h2>
        <Card className="bg-card border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Date</th>
                  <th className="text-left font-medium px-4 py-3">Customer</th>
                  <th className="text-left font-medium px-4 py-3">Reference</th>
                  <th className="text-right font-medium px-4 py-3">Amount</th>
                  <th className="w-32" />
                </tr>
              </thead>
              <tbody>
                {refundable.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(t.date)}</td>
                    <td className="px-4 py-3 font-medium">{t.customer}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.reference}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(t.amount)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="secondary" onClick={() => { setTarget(t); setAmount(String(t.amount)); }}>
                        Issue Refund
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Refund status</h2>
        <Card className="bg-card border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Date</th>
                  <th className="text-left font-medium px-4 py-3">Customer</th>
                  <th className="text-left font-medium px-4 py-3">Txn Ref</th>
                  <th className="text-left font-medium px-4 py-3">Reason</th>
                  <th className="text-right font-medium px-4 py-3">Amount</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(r.date)}</td>
                    <td className="px-4 py-3 font-medium">{r.customer}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.transactionRef}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.reason}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(r.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue refund</DialogTitle>
            <DialogDescription>
              Refund {target?.customer} for transaction <span className="font-mono">{target?.reference}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="amt">Refund amount (NGN)</Label>
            <Input id="amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} max={target?.amount} />
            <p className="text-xs text-muted-foreground">Original charge: {target && formatCurrency(target.amount)}</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
            <Button
              onClick={() => target && mutation.mutate({ ref: target.reference, amt: Number(amount) })}
              disabled={mutation.isPending || !amount}
            >
              {mutation.isPending ? "Processing…" : "Confirm refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
