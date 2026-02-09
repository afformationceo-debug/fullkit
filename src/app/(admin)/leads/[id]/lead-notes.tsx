"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface Note {
  id: string;
  content: string;
  created_at: string;
}

export function LeadNotes({ leadId, notes }: { leadId: string; notes: Note[] }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        setContent("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Note input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메모를 남겨주세요..."
          className="min-h-[60px] text-sm"
        />
        <Button type="submit" size="sm" disabled={isPending || !content.trim()} className="flex-shrink-0">
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </Button>
      </form>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">아직 메모가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {notes
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((note) => (
              <div key={note.id} className="rounded-lg border border-border p-3">
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(note.created_at)}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
