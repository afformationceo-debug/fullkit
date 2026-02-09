"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMeeting } from "@/lib/actions/meeting-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewMeetingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createMeeting({
      title: formData.get("title") as string,
      meeting_date: formData.get("meeting_date") as string,
      location: (formData.get("location") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      agenda: (formData.get("agenda") as string) || undefined,
    });

    if (result.success) {
      router.push("/meetings");
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/meetings"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">미팅 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">새로운 미팅 일정을 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">미팅 제목 *</Label>
          <Input id="title" name="title" required className="mt-1.5" placeholder="미팅 제목" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meeting_date">일시 *</Label>
            <Input id="meeting_date" name="meeting_date" type="datetime-local" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="location">장소</Label>
            <Input id="location" name="location" className="mt-1.5" placeholder="미팅 장소 또는 온라인 링크" />
          </div>
        </div>

        <div>
          <Label htmlFor="agenda">안건</Label>
          <textarea
            id="agenda"
            name="agenda"
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="미팅 안건을 입력하세요."
          />
        </div>

        <div>
          <Label htmlFor="notes">메모</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="기타 메모사항"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "미팅 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/meetings")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
