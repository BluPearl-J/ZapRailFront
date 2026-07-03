/**
 * Central API client layer for ZapVeridian.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  TO CONNECT YOUR REAL BACKEND:                                        │
 * │  1. Set USE_MOCK = false                                              │
 * │  2. Update BASE_URL to your Express API root (e.g. https://api.…)    │
 * │  3. Components stay untouched — they only call `api.*` methods.       │
 * └──────────────────────────────────────────────────────────────────────┘
 */
import {
  mockTransactions,
  mockRefunds,
  mockWebhookEvents,
  mockConnectedApps,
} from "./mock-data";
import type {
  Transaction,
  Refund,
  WebhookEvent,
  ConnectedApp,
  ConnectionConfig,
} from "./types";

// ── Backend configuration ────────────────────────────────────────────────

// export const BASE_URL: string = "https://api.zapveridian.local/v1";
export const BASE_URL: string ="https://plain-papers-lead.loca.lt/";
export const USE_MOCK = false;

/** Thin fetch wrapper used once USE_MOCK is false. */
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

const delay = <T,>(value: T, ms = 250): Promise<T> =>
  new Promise((r) => setTimeout(() => r(value), ms));

// ---------- Connection / setup ----------
export const api = {
  async getConnectionConfig(): Promise<ConnectionConfig> {
    return delay({
      apiKey: "",
      apiSecret: "",
      webhookUrl: "https://hooks.zapveridian.app/v1/nomba/wh_3a9f12b8c7d4e2f1",
    });
  },

  async testConnection(apiKey: string, apiSecret: string): Promise<{ ok: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 900));
    if (!apiKey || !apiSecret) {
      return { ok: false, message: "API key and secret are required." };
    }
    if (apiKey.length < 8) {
      return { ok: false, message: "API key looks invalid. Double-check it in your Nomba dashboard." };
    }
    return { ok: true, message: "Connection successful. Webhook endpoint is live." };
  },

  // ---------- Transactions ----------
  async listTransactions(): Promise<Transaction[]> {
    if (!USE_MOCK) return http<Transaction[]>("/transactions");
    return delay(mockTransactions);
  },

  // ---------- Refunds ----------
  async listRefunds(): Promise<Refund[]> {
    if (!USE_MOCK) return http<Refund[]>("/refunds");
    return delay(mockRefunds);
  },
  async listRefundableTransactions(): Promise<Transaction[]> {
    if (!USE_MOCK) return http<Transaction[]>("/transactions?refundable=1");
    return delay(mockTransactions.filter((t) => t.status === "success"));
  },
  async issueRefund(transactionRef: string, amount: number): Promise<Refund> {
    if (!USE_MOCK) {
      return http<Refund>("/refunds", {
        method: "POST",
        body: JSON.stringify({ transactionRef, amount }),
      });
    }
    const tx = mockTransactions.find((t) => t.reference === transactionRef);
    return delay({
      id: `r_${Date.now()}`,
      transactionRef,
      customer: tx?.customer ?? "Unknown",
      amount,
      status: "pending",
      date: new Date().toISOString(),
      reason: "Manual refund",
    });
  },

  // ---------- Webhooks ----------
  // Expected JSON shape: { event_id, event_type, received_at, signature_valid }
  async listWebhookEvents(): Promise<WebhookEvent[]> {
    if (!USE_MOCK) return http<WebhookEvent[]>("/webhooks/events");
    return delay(mockWebhookEvents);
  },

  // ---------- Connected apps ----------
  async listConnectedApps(): Promise<ConnectedApp[]> {
    return delay(mockConnectedApps);
  },
  async toggleConnectedApp(id: string, enabled: boolean): Promise<ConnectedApp> {
    const app = mockConnectedApps.find((a) => a.id === id)!;
    app.enabled = enabled;
    return delay(app);
  },
};
