"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateLead } from "@/lib/actions/lead-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

const serviceOptions = [
  { value: "homepage", label: "홈페이지" },
  { value: "app", label: "앱" },
  { value: "solution", label: "솔루션" },
  { value: "automation", label: "자동화" },
];

const budgetOptions = [
  { value: "under-300", label: "300만원 미만" },
  { value: "300-500", label: "300~500만원" },
  { value: "500-1000", label: "500~1,000만원" },
  { value: "1000-3000", label: "1,000~3,000만원" },
  { value: "3000-5000", label: "3,000~5,000만원" },
  { value: "over-5000", label: "5,000만원 이상" },
  { value: "undecided", label: "미정" },
];

const sourceOptions = [
  { value: "website", label: "웹사이트" },
  { value: "referral", label: "추천" },
  { value: "kmong", label: "크몽" },
  { value: "naver", label: "네이버" },
  { value: "google", label: "구글" },
  { value: "youtube", label: "유튜브" },
  { value: "email", label: "이메일" },
  { value: "other", label: "기타" },
];

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    service_type: "homepage",
    budget_range: "undecided",
    source: "website",
    description: "",
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase.from("leads").select("*").eq("id", id).single();

      if (data) {
        setFormData({
          name: (data.name as string) || "",
          phone: (data.phone as string) || "",
          email: (data.email as string) || "",
          company: (data.company as string) || "",
          service_type: (data.service_type as string) || "homepage",
          budget_range: (data.budget_range as string) || "undecided",
          source: (data.source as string) || "website",
          description: (data.description as string) || "",
        });
      }
      setFetching(false);
    }
    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateLead(id, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      company: formData.company || null,
      service_type: formData.service_type,
      budget_range: formData.budget_range || null,
      source: formData.source || null,
      description: formData.description || null,
    });

    if (result.success) {
      router.push(`/leads/${id}`);
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
          <Link href={`/leads/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">리드 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">리드 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">이름 *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">연락처 *</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="mt-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="company">회사</Label>
            <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="mt-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="service_type">서비스</Label>
            <select
              id="service_type"
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {serviceOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="budget_range">예산</Label>
            <select
              id="budget_range"
              value={formData.budget_range}
              onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {budgetOptions.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="source">유입경로</Label>
            <select
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {sourceOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">프로젝트 설명</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "수정 완료"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/leads/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
