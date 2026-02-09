"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, UserCheck, X, Check } from "lucide-react";

const statusFlow: Record<string, Array<{ value: string; label: string; variant: "default" | "secondary" | "destructive" }>> = {
  new: [
    { value: "contacted", label: "연락완료", variant: "default" },
    { value: "lost", label: "실패 처리", variant: "destructive" },
  ],
  contacted: [
    { value: "meeting_scheduled", label: "미팅예정", variant: "default" },
    { value: "proposal_sent", label: "견적발송", variant: "default" },
    { value: "lost", label: "실패 처리", variant: "destructive" },
  ],
  meeting_scheduled: [
    { value: "proposal_sent", label: "견적발송", variant: "default" },
    { value: "lost", label: "실패 처리", variant: "destructive" },
  ],
  proposal_sent: [
    { value: "negotiating", label: "협상중", variant: "default" },
    { value: "won", label: "수주 확정", variant: "default" },
    { value: "lost", label: "실패 처리", variant: "destructive" },
  ],
  negotiating: [
    { value: "won", label: "수주 확정", variant: "default" },
    { value: "lost", label: "실패 처리", variant: "destructive" },
  ],
  won: [],
  lost: [
    { value: "new", label: "재오픈", variant: "secondary" },
  ],
};

export function LeadStatusActions({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [converting, setConverting] = useState(false);

  const actions = statusFlow[currentStatus] || [];

  async function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
    });
  }

  async function handleConvert() {
    setConverting(true);
    const res = await fetch(`/api/admin/leads/${leadId}/convert`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/clients/${data.clientId}`);
    }
    setConverting(false);
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
          ) : (
            <ArrowRight size={14} className="mr-2" />
          )}
          {action.label}
        </Button>
      ))}

      {currentStatus === "won" && (
        <Button
          className="w-full justify-start bg-green-600 text-white hover:bg-green-700"
          disabled={converting}
          onClick={handleConvert}
        >
          {converting ? (
            <Loader2 size={14} className="mr-2 animate-spin" />
          ) : (
            <UserCheck size={14} className="mr-2" />
          )}
          거래처로 전환
        </Button>
      )}

      {actions.length === 0 && currentStatus !== "won" && (
        <p className="text-xs text-muted-foreground text-center">
          더 이상 변경할 수 없는 상태입니다.
        </p>
      )}
    </div>
  );
}
