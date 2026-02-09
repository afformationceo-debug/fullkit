"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Play, RotateCcw } from "lucide-react";

interface KeywordActionsProps {
  keywordId: string;
  status: string;
}

export function KeywordActions({ keywordId, status }: KeywordActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm("이 키워드를 삭제하시겠습니까?")) return;
    setAction("delete");
    startTransition(async () => {
      await fetch("/api/admin/keywords", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: keywordId }),
      });
      router.refresh();
    });
  }

  function handleGenerate() {
    if (!confirm("이 키워드로 블로그 글을 즉시 생성하시겠습니까? (약 30초~1분 소요)")) return;
    setAction("generate");
    startTransition(async () => {
      const res = await fetch("/api/admin/keywords/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywordId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`생성 실패: ${data.error}`);
      }
      router.refresh();
    });
  }

  function handleRetry() {
    setAction("retry");
    startTransition(async () => {
      await fetch("/api/admin/keywords", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: keywordId, status: "pending" }),
      });
      router.refresh();
    });
  }

  const isLoading = isPending;

  return (
    <div className="flex gap-1">
      {status === "pending" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerate}
          disabled={isLoading}
          className="h-7 px-2 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
        >
          {isLoading && action === "generate" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Play size={12} />
          )}
          <span className="ml-1">즉시생성</span>
        </Button>
      )}

      {status === "failed" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          disabled={isLoading}
          className="h-7 px-2 text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
        >
          {isLoading && action === "retry" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RotateCcw size={12} />
          )}
          <span className="ml-1">재시도</span>
        </Button>
      )}

      {(status === "pending" || status === "failed") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
          className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
        >
          {isLoading && action === "delete" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
        </Button>
      )}
    </div>
  );
}
