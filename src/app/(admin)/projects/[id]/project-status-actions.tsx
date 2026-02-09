"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProjectStatus } from "@/lib/actions/project-actions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

const statusFlow: Record<string, Array<{ value: string; label: string }>> = {
  planning: [
    { value: "designing", label: "디자인 단계로" },
    { value: "on_hold", label: "보류" },
  ],
  designing: [
    { value: "developing", label: "개발 단계로" },
    { value: "on_hold", label: "보류" },
  ],
  developing: [
    { value: "testing", label: "테스트 단계로" },
    { value: "on_hold", label: "보류" },
  ],
  testing: [
    { value: "launched", label: "런칭" },
    { value: "developing", label: "개발로 복귀" },
  ],
  launched: [
    { value: "completed", label: "완료 처리" },
  ],
  completed: [],
  on_hold: [
    { value: "planning", label: "기획부터 재개" },
    { value: "designing", label: "디자인부터 재개" },
    { value: "developing", label: "개발부터 재개" },
  ],
  cancelled: [],
};

export function ProjectStatusActions({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const actions = statusFlow[currentStatus] || [];

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      const result = await updateProjectStatus(projectId, newStatus);
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <Button
          key={action.value}
          variant={action.value === "on_hold" || action.value === "cancelled" ? "secondary" : "default"}
          className={`w-full justify-start ${action.value !== "on_hold" && action.value !== "cancelled" ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""}`}
          disabled={isPending}
          onClick={() => handleStatusChange(action.value)}
        >
          {isPending ? (
            <Loader2 size={14} className="mr-2 animate-spin" />
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
