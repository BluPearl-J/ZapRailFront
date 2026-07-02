export type TransactionStatus = "success" | "failed" | "pending";
export type RefundStatus = "processed" | "rejected" | "pending";
export type WebhookEventType = "transaction" | "refund" | "failed_payment";

export interface Transaction {
  id: string;
  reference: string;
  date: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  method: string;
  description: string;
}

export interface Refund {
  id: string;
  transactionRef: string;
  customer: string;
  amount: number;
  status: RefundStatus;
  date: string;
  reason?: string;
}

/**
 * Webhook event schema — matches backend JSON contract exactly.
 * Fields: event_id, event_type, received_at, signature_valid (boolean).
 */
export interface WebhookEvent {
  event_id: string;
  event_type: WebhookEventType;
  received_at: string;
  signature_valid: boolean;
  payload_summary?: string;
}

export interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  events: number;
}

export interface ConnectionConfig {
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
}
