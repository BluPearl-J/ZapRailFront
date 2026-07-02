import { Badge } from "@/components/ui/badge";
import type { TransactionStatus, RefundStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  success: "bg-success/15 text-success border-success/30",
  processed: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: TransactionStatus | RefundStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-medium", variants[status])}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full inline-block",
        status === "success" || status === "processed" ? "bg-success" :
        status === "pending" ? "bg-warning" : "bg-destructive")}
      />
      {status}
    </Badge>
  );
}
