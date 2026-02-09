"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addTicketComment } from "@/lib/actions/maintenance-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketComments({ ticketId, comments }: { ticketId: string; comments: Comment[] }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await addTicketComment(ticketId, content.trim());
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
          placeholder="댓글을 작성하세요..."
          className="min-h-[60px] text-sm"
        />
        <Button type="submit" size="sm" disabled={isPending || !content.trim()} className="flex-shrink-0">
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </Button>
      </form>

      {comments.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">아직 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {comments
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((comment) => (
              <div key={comment.id} className="rounded-lg border border-border p-3">
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(comment.created_at)}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
