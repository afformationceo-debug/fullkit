"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient_ } from "@/lib/actions/client-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createClient_({
      company_name: formData.get("company_name") as string,
      contact_name: formData.get("contact_name") as string,
      contact_email: (formData.get("contact_email") as string) || undefined,
      contact_phone: (formData.get("contact_phone") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    });

    if (result.success) {
      router.push("/clients");
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">거래처 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">새로운 거래처를 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="company_name">회사명 *</Label>
          <Input id="company_name" name="company_name" required className="mt-1.5" placeholder="회사명" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_name">담당자 이름 *</Label>
            <Input id="contact_name" name="contact_name" required className="mt-1.5" placeholder="담당자 이름" />
          </div>
          <div>
            <Label htmlFor="contact_phone">담당자 연락처</Label>
            <Input id="contact_phone" name="contact_phone" className="mt-1.5" placeholder="010-0000-0000" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_email">담당자 이메일</Label>
            <Input id="contact_email" name="contact_email" type="email" className="mt-1.5" placeholder="email@company.com" />
          </div>
          <div>
            <Label htmlFor="address">주소</Label>
            <Input id="address" name="address" className="mt-1.5" placeholder="회사 주소" />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">메모</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="거래처 관련 메모"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "거래처 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/clients")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
