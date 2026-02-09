"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addFollowUp } from "@/lib/actions/meeting-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send } from "lucide-react";

interface FollowUp {
  id: string;
  content: string;
  status: string;
  due_date: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: "대기",
  completed: "완료",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export function FollowUpList({ meetingId, followUps }: { meetingId: string; followUps: FollowUp[] }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await addFollowUp(meetingId, content.trim());
      if (result.success) {
        setContent("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="후속 조치를 입력하세요..."
          className="min-h-[60px] text-sm"
        />
        <Button type="submit" size="sm" disabled={isPending || !content.trim()} className="flex-shrink-0">
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </Button>
      </form>

      {followUps.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">아직 후속 조치가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {followUps
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((fu) => (
              <div key={fu.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm whitespace-pre-wrap">{fu.content}</p>
                  <Badge variant={fu.status === "completed" ? "default" : "outline"} className="text-xs ml-2 flex-shrink-0">
                    {statusLabels[fu.status] || fu.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-muted-foreground">{formatDate(fu.created_at)}</p>
                  {fu.due_date && (
                    <p className="text-xs text-muted-foreground">기한: {formatDate(fu.due_date)}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
