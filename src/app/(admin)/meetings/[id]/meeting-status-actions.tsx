"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMeeting } from "@/lib/actions/meeting-actions";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, ArrowRight } from "lucide-react";

const statusFlow: Record<string, Array<{ value: string; label: string; variant: "default" | "secondary" | "destructive" }>> = {
  scheduled: [
    { value: "completed", label: "완료 처리", variant: "default" },
    { value: "cancelled", label: "취소", variant: "destructive" },
    { value: "no_show", label: "불참 처리", variant: "destructive" },
  ],
  completed: [],
  cancelled: [
    { value: "scheduled", label: "재예약", variant: "secondary" },
  ],
  no_show: [
    { value: "scheduled", label: "재예약", variant: "secondary" },
  ],
};

export function MeetingStatusActions({
  meetingId,
  currentStatus,
}: {
  meetingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const actions = statusFlow[currentStatus] || [];

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateMeeting(meetingId, { status: newStatus });
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
