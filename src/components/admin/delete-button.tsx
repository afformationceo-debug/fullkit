"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  redirectTo: string;
  label?: string;
  confirmMessage?: string;
}

export function DeleteButton({
  onDelete,
  redirectTo,
  label = "삭제",
  confirmMessage = "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleDelete() {
    startTransition(async () => {
      const result = await onDelete();
      if (result.success) {
        router.push(redirectTo);
      } else {
        setError(result.error || "삭제에 실패했습니다.");
        setShowConfirm(false);
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">{confirmMessage}</p>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Trash2 size={14} className="mr-1" />}
            확인
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isPending}
            onClick={() => setShowConfirm(false)}
          >
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 size={14} className="mr-2" />
      {label}
    </Button>
  );
}
