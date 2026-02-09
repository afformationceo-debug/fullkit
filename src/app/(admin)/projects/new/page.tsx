"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProject } from "@/lib/actions/project-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const budget = formData.get("budget") as string;
    const result = await createProject({
      title: formData.get("title") as string,
      client_id: formData.get("client_id") as string,
      service_type: formData.get("service_type") as string,
      description: (formData.get("description") as string) || undefined,
      start_date: (formData.get("start_date") as string) || undefined,
      end_date: (formData.get("end_date") as string) || undefined,
      budget: budget ? parseInt(budget, 10) : undefined,
    });

    if (result.success) {
      router.push("/projects");
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">프로젝트 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">새 프로젝트를 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">프로젝트명 *</Label>
          <Input id="title" name="title" required className="mt-1.5" placeholder="프로젝트 제목" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="service_type">서비스 유형 *</Label>
            <select id="service_type" name="service_type" required className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">선택</option>
              <option value="homepage">홈페이지</option>
              <option value="app">앱</option>
              <option value="solution">솔루션</option>
              <option value="automation">자동화</option>
            </select>
          </div>
          <div>
            <Label htmlFor="client_id">거래처 ID *</Label>
            <Input id="client_id" name="client_id" required className="mt-1.5" placeholder="거래처 UUID" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="start_date">시작일</Label>
            <Input id="start_date" name="start_date" type="date" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="end_date">종료일</Label>
            <Input id="end_date" name="end_date" type="date" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="budget">예산 (원)</Label>
            <Input id="budget" name="budget" type="number" className="mt-1.5" placeholder="0" />
          </div>
        </div>

        <div>
          <Label htmlFor="description">프로젝트 설명</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="프로젝트에 대한 상세 설명"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "프로젝트 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
