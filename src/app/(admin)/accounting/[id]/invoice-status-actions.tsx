"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInvoiceStatus } from "@/lib/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, X, Check } from "lucide-react";

const statusFlow: Record<string, Array<{ value: string; label: string; variant: "default" | "secondary" | "destructive" }>> = {
  draft: [
    { value: "sent", label: "발송 처리", variant: "default" },
    { value: "cancelled", label: "취소", variant: "destructive" },
  ],
  sent: [
    { value: "paid", label: "결제 완료", variant: "default" },
    { value: "overdue", label: "연체 처리", variant: "destructive" },
    { value: "cancelled", label: "취소", variant: "destructive" },
  ],
  overdue: [
    { value: "paid", label: "결제 완료", variant: "default" },
    { value: "cancelled", label: "취소", variant: "destructive" },
  ],
  paid: [],
  cancelled: [
    { value: "draft", label: "초안으로 복원", variant: "secondary" },
  ],
};

export function InvoiceStatusActions({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const actions = statusFlow[currentStatus] || [];

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, newStatus);
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <Button
          key={action.value}
          variant={action.variant === "destructive" ? "destructive" : action.variant === "secondary" ? "secondary" : "default"}
          className={`w-full justify-start ${action.variant === "default" ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""}`}
          disabled={isPending}
          onClick={() => handleStatusChange(action.value)}
        >
          {isPending ? (
            <Loader2 size={14} className="mr-2 animate-spin" />
          ) : action.variant === "destructive" ? (
            <X size={14} className="mr-2" />
          ) : action.variant === "default" ? (
            <Check size={14} className="mr-2" />
          ) : (
            <ArrowRight size={14} className="mr-2" />
          )}
          {action.label}
        </Button>
      ))}
      {actions.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          최종 상태입니다.
        </p>
      )}
    </div>
  );
}
