"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createLead } from "@/lib/actions/lead-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createLead({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      service_type: formData.get("service_type") as string,
      budget_range: (formData.get("budget_range") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      source: (formData.get("source") as string) || undefined,
    });

    if (result.success) {
      router.push("/leads");
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leads"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">리드 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">새로운 리드 정보를 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">이름 *</Label>
            <Input id="name" name="name" required className="mt-1.5" placeholder="홍길동" />
          </div>
          <div>
            <Label htmlFor="phone">연락처 *</Label>
            <Input id="phone" name="phone" required className="mt-1.5" placeholder="010-0000-0000" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" className="mt-1.5" placeholder="email@example.com" />
          </div>
          <div>
            <Label htmlFor="company">회사명</Label>
            <Input id="company" name="company" className="mt-1.5" placeholder="회사명" />
          </div>
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
            <Label htmlFor="source">유입 경로</Label>
            <select id="source" name="source" className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="website">웹사이트</option>
              <option value="referral">추천</option>
              <option value="kmong">크몽</option>
              <option value="naver">네이버</option>
              <option value="google">구글</option>
              <option value="youtube">유튜브</option>
              <option value="email">이메일</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="budget_range">예산 범위</Label>
          <select id="budget_range" name="budget_range" className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">선택</option>
            <option value="under_500">500만원 미만</option>
            <option value="500_1000">500만원 ~ 1,000만원</option>
            <option value="1000_3000">1,000만원 ~ 3,000만원</option>
            <option value="3000_5000">3,000만원 ~ 5,000만원</option>
            <option value="over_5000">5,000만원 이상</option>
          </select>
        </div>

        <div>
          <Label htmlFor="description">프로젝트 설명</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="프로젝트에 대해 간단히 설명해 주세요."
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "리드 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/leads")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
