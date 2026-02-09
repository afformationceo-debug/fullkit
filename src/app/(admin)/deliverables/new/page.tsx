"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewDeliverablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("deliverables").insert({
      project_id: formData.get("project_id") as string,
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      description: (formData.get("description") as string) || null,
      version: (formData.get("version") as string) || "1.0",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/deliverables");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/deliverables"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">산출물 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">프로젝트 산출물을 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">산출물 제목 *</Label>
          <Input id="title" name="title" required className="mt-1.5" placeholder="산출물 제목" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="project_id">프로젝트 ID *</Label>
            <Input id="project_id" name="project_id" required className="mt-1.5" placeholder="프로젝트 UUID" />
          </div>
          <div>
            <Label htmlFor="type">유형 *</Label>
            <select id="type" name="type" required className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">선택</option>
              <option value="design">디자인</option>
              <option value="document">문서</option>
              <option value="source_code">소스코드</option>
              <option value="deployment">배포</option>
              <option value="report">리포트</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="version">버전</Label>
          <Input id="version" name="version" className="mt-1.5" placeholder="1.0" defaultValue="1.0" />
        </div>

        <div>
          <Label htmlFor="description">설명</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="산출물 설명"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "산출물 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/deliverables")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
