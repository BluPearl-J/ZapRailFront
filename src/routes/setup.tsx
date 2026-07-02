import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup — ZapVeridian" },
      { name: "description", content: "Connect your Nomba account to ZapVeridian and Zapier in minutes." },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const { data: config } = useQuery({ queryKey: ["config"], queryFn: api.getConnectionConfig });
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const webhookUrl = config?.webhookUrl ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("Webhook URL copied");
  };

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    const r = await api.testConnection(apiKey, apiSecret);
    setResult(r);
    setTesting(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Setup</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect Nomba to ZapVeridian and your Zaps.</p>
      </header>

      <Card className="p-6 bg-card border-border shadow-soft space-y-5">
        <div>
          <h2 className="font-semibold">1. Nomba API credentials</h2>
          <p className="text-sm text-muted-foreground mt-1">Find these in your Nomba dashboard under Developer → API Keys.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="key">API Key</Label>
            <Input id="key" placeholder="pk_live_..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret">API Secret</Label>
            <Input id="secret" type="password" placeholder="sk_live_..." value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleTest} disabled={testing}>
            {testing ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Testing…</> : "Test Connection"}
          </Button>
          {result && (
            <div className={cn("flex items-center gap-2 text-sm",
              result.ok ? "text-success" : "text-destructive")}>
              {result.ok ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {result.message}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-card border-border shadow-soft space-y-4">
        <div>
          <h2 className="font-semibold">2. Your webhook URL</h2>
          <p className="text-sm text-muted-foreground mt-1">Paste this into Nomba's webhook settings to receive payment events.</p>
        </div>
        <div className="flex items-stretch gap-2">
          <code className="flex-1 px-3 py-2 rounded-md border border-border bg-muted/40 font-mono text-sm truncate flex items-center">
            {webhookUrl || "Loading..."}
          </code>
          <Button variant="outline" onClick={handleCopy} disabled={!webhookUrl}>
            <Copy className="h-4 w-4 mr-1.5" /> Copy
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border shadow-soft">
        <h2 className="font-semibold">3. Connect in Zapier</h2>
        <ol className="mt-4 space-y-4">
          {[
            "Sign in to Zapier and click \"Create Zap\".",
            "Search for the \"ZapVeridian (Nomba)\" app and select it as your trigger.",
            "Choose a trigger event — for example, \"New successful payment\".",
            "When prompted, paste your API Key and Secret from step 1 above.",
            "Pick an action app (Slack, Google Sheets, QuickBooks, etc.) and map the payment fields.",
            "Turn the Zap on. New Nomba payments will start flowing through within seconds.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary text-sm font-semibold shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-foreground/90 pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
