"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTicketStatus } from "@/lib/actions/maintenance-actions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Check, X } from "lucide-react";

const statusFlow: Record<string, Array<{ value: string; label: string; variant: "default" | "secondary" | "destructive" }>> = {
  open: [
    { value: "in_progress", label: "처리 시작", variant: "default" },
    { value: "closed", label: "종료", variant: "destructive" },
  ],
  in_progress: [
    { value: "resolved", label: "해결 완료", variant: "default" },
    { value: "closed", label: "종료", variant: "destructive" },
  ],
  resolved: [
    { value: "closed", label: "종료 처리", variant: "secondary" },
    { value: "open", label: "재오픈", variant: "secondary" },
  ],
  closed: [
    { value: "open", label: "재오픈", variant: "secondary" },
  ],
};

export function TicketStatusActions({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const actions = statusFlow[currentStatus] || [];

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
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
    </div>
  );
}
