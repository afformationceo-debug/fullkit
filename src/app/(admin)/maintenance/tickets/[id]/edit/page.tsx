"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateTicket } from "@/lib/actions/maintenance-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

const priorityOptions = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
  { value: "urgent", label: "긴급" },
];

interface EditTicketPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTicketPage({ params }: EditTicketPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    async function fetchTicket() {
      const supabase = createClient();
      const { data } = await supabase.from("tickets").select("*").eq("id", id).single();
      if (data) {
        setFormData({
          title: (data.title as string) || "",
          description: (data.description as string) || "",
          priority: (data.priority as string) || "medium",
        });
      }
      setFetching(false);
    }
    fetchTicket();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateTicket(id, {
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
    });

    if (result.success) {
      router.push(`/maintenance/tickets/${id}`);
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/maintenance/tickets/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">티켓 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">지원 티켓 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">티켓 제목 *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="priority">우선순위</Label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {priorityOptions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description">설명</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "수정 완료"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/maintenance/tickets/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
