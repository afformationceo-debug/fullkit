"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateMeeting } from "@/lib/actions/meeting-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMeetingPage({ params }: EditMeetingPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    meeting_date: "",
    location: "",
    agenda: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchMeeting() {
      const supabase = createClient();
      const { data } = await supabase.from("meetings").select("*").eq("id", id).single();
      if (data) {
        setFormData({
          title: (data.title as string) || "",
          meeting_date: (data.meeting_date as string)?.slice(0, 16) || "",
          location: (data.location as string) || "",
          agenda: (data.agenda as string) || "",
          notes: (data.notes as string) || "",
        });
      }
      setFetching(false);
    }
    fetchMeeting();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateMeeting(id, {
      title: formData.title,
      meeting_date: formData.meeting_date,
      location: formData.location || null,
      agenda: formData.agenda || null,
      notes: formData.notes || null,
    });

    if (result.success) {
      router.push(`/meetings/${id}`);
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
          <Link href={`/meetings/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">미팅 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">미팅 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">미팅 제목 *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meeting_date">일시 *</Label>
            <Input id="meeting_date" type="datetime-local" value={formData.meeting_date} onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="location">장소</Label>
            <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label htmlFor="agenda">안건</Label>
          <textarea
            id="agenda"
            value={formData.agenda}
            onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        <div>
          <Label htmlFor="notes">메모</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "수정 완료"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/meetings/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
