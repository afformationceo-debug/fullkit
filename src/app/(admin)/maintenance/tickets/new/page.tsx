"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTicket } from "@/lib/actions/maintenance-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createTicket({
      contract_id: formData.get("contract_id") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      priority: (formData.get("priority") as string) || undefined,
    });

    if (result.success) {
      router.push("/maintenance");
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/maintenance"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">지원 티켓 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">새 지원 티켓을 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">제목 *</Label>
          <Input id="title" name="title" required className="mt-1.5" placeholder="티켓 제목" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contract_id">유지보수 계약 ID *</Label>
            <Input id="contract_id" name="contract_id" required className="mt-1.5" placeholder="계약 UUID" />
          </div>
          <div>
            <Label htmlFor="priority">우선순위</Label>
            <select id="priority" name="priority" className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">설명</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="문제 상세 설명"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "티켓 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/maintenance")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
