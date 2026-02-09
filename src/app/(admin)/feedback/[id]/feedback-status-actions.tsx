"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateFeedbackStatus } from "@/lib/actions/feedback-actions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Check, X } from "lucide-react";

const statusFlow: Record<string, Array<{ value: string; label: string; variant: "default" | "secondary" | "destructive" }>> = {
  pending: [
    { value: "in_review", label: "검토 시작", variant: "default" },
    { value: "dismissed", label: "반려", variant: "destructive" },
  ],
  in_review: [
    { value: "resolved", label: "해결 처리", variant: "default" },
    { value: "dismissed", label: "반려", variant: "destructive" },
  ],
  resolved: [],
  dismissed: [
    { value: "pending", label: "재오픈", variant: "secondary" },
  ],
};

export function FeedbackStatusActions({
  feedbackId,
  currentStatus,
}: {
  feedbackId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const actions = statusFlow[currentStatus] || [];

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateFeedbackStatus(feedbackId, newStatus);
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
