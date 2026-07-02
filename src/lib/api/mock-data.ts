import type { Transaction, Refund, WebhookEvent, ConnectedApp } from "./types";

const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60_000).toISOString();

export const mockTransactions: Transaction[] = [
  { id: "t_1", reference: "NMB-8842910", date: ago(12), customer: "Adaeze Okafor", email: "adaeze@example.com", amount: 45000, currency: "NGN", status: "success", method: "Card", description: "Order #1042 – Premium plan" },
  { id: "t_2", reference: "NMB-8842893", date: ago(45), customer: "Tunde Bakare", email: "tunde@example.com", amount: 12500, currency: "NGN", status: "pending", method: "Bank Transfer", description: "Invoice INV-220" },
  { id: "t_3", reference: "NMB-8842881", date: ago(120), customer: "Chinwe Nwosu", email: "chinwe@example.com", amount: 88000, currency: "NGN", status: "success", method: "Card", description: "Subscription renewal" },
  { id: "t_4", reference: "NMB-8842867", date: ago(180), customer: "Yemi Adebayo", email: "yemi@example.com", amount: 22500, currency: "NGN", status: "failed", method: "USSD", description: "Order #1041 – insufficient funds" },
  { id: "t_5", reference: "NMB-8842842", date: ago(310), customer: "Kemi Salami", email: "kemi@example.com", amount: 150000, currency: "NGN", status: "success", method: "Bank Transfer", description: "Enterprise upgrade" },
  { id: "t_6", reference: "NMB-8842821", date: ago(540), customer: "Ifeanyi Eze", email: "ife@example.com", amount: 6500, currency: "NGN", status: "success", method: "Card", description: "Add-on credits" },
  { id: "t_7", reference: "NMB-8842799", date: ago(720), customer: "Ngozi Ibe", email: "ngozi@example.com", amount: 33200, currency: "NGN", status: "failed", method: "Card", description: "Order #1039 – declined" },
  { id: "t_8", reference: "NMB-8842770", date: ago(1440), customer: "Bola Akinyemi", email: "bola@example.com", amount: 9900, currency: "NGN", status: "success", method: "Card", description: "Monthly subscription" },
];

export const mockRefunds: Refund[] = [
  { id: "r_1", transactionRef: "NMB-8842770", customer: "Bola Akinyemi", amount: 9900, status: "processed", date: ago(60), reason: "Customer request" },
  { id: "r_2", transactionRef: "NMB-8842821", customer: "Ifeanyi Eze", amount: 6500, status: "pending", date: ago(200), reason: "Duplicate charge" },
  { id: "r_3", transactionRef: "NMB-8842842", customer: "Kemi Salami", amount: 25000, status: "rejected", date: ago(420), reason: "Outside refund window" },
];

export const mockWebhookEvents: WebhookEvent[] = [
  { event_id: "w_1", event_type: "transaction", received_at: ago(2), signature_valid: true, payload_summary: "charge.success • NMB-8842910 • ₦45,000" },
  { event_id: "w_2", event_type: "failed_payment", received_at: ago(8), signature_valid: true, payload_summary: "charge.failed • NMB-8842867 • insufficient_funds" },
  { event_id: "w_3", event_type: "refund", received_at: ago(25), signature_valid: true, payload_summary: "refund.processed • NMB-8842770 • ₦9,900" },
];

mockWebhookEvents.push(
  { event_id: "w_4", event_type: "transaction", received_at: ago(40), signature_valid: false, payload_summary: "charge.success • signature mismatch" },
  { event_id: "w_5", event_type: "transaction", received_at: ago(95), signature_valid: true, payload_summary: "charge.success • NMB-8842881 • ₦88,000" },
  { event_id: "w_6", event_type: "failed_payment", received_at: ago(180), signature_valid: true, payload_summary: "charge.failed • NMB-8842799 • card_declined" },
  { event_id: "w_7", event_type: "refund", received_at: ago(420), signature_valid: true, payload_summary: "refund.rejected • NMB-8842842" },
);

export const mockConnectedApps: ConnectedApp[] = [
  { id: "slack", name: "Slack", description: "Post transaction alerts to a channel", category: "Notifications", enabled: true, events: 142 },
  { id: "quickbooks", name: "QuickBooks", description: "Sync payments to your accounting ledger", category: "Accounting", enabled: true, events: 86 },
  { id: "gsheets", name: "Google Sheets", description: "Append each transaction to a sheet", category: "Productivity", enabled: false, events: 0 },
  { id: "gmail", name: "Gmail", description: "Send custom receipts on success", category: "Email", enabled: true, events: 312 },
  { id: "hubspot", name: "HubSpot", description: "Update contact records with payment data", category: "CRM", enabled: false, events: 0 },
];
