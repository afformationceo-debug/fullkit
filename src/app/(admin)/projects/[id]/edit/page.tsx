"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProject } from "@/lib/actions/project-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

interface ClientOption {
  id: string;
  company_name: string;
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    client_id: "",
    service_type: "homepage",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [projectRes, clientRes] = await Promise.all([
        supabase.from("projects").select("*").eq("id", id).single(),
        supabase.from("clients").select("id, company_name").order("company_name"),
      ]);
      if (projectRes.data) {
        const p = projectRes.data;
        setFormData({
          title: (p.title as string) || "",
          client_id: (p.client_id as string) || "",
          service_type: (p.service_type as string) || "homepage",
          description: (p.description as string) || "",
          start_date: (p.start_date as string) || "",
          end_date: (p.end_date as string) || "",
          budget: p.budget ? String(p.budget) : "",
        });
      }
      if (clientRes.data) setClients(clientRes.data as ClientOption[]);
      setFetching(false);
    }
    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateProject(id, {
      title: formData.title,
      client_id: formData.client_id,
      service_type: formData.service_type,
      description: formData.description || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      budget: formData.budget ? Number(formData.budget) : null,
    });

    if (result.success) {
      router.push(`/projects/${id}`);
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
          <Link href={`/projects/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">프로젝트 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">프로젝트 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">프로젝트명 *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id">거래처 *</Label>
            <select id="client_id" value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} required className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">거래처 선택</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="service_type">서비스 유형 *</Label>
            <select id="service_type" value={formData.service_type} onChange={(e) => setFormData({ ...formData, service_type: e.target.value })} required className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="homepage">홈페이지</option>
              <option value="app">앱</option>
              <option value="solution">솔루션</option>
              <option value="automation">자동화</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="start_date">시작일</Label>
            <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="end_date">종료일</Label>
            <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="budget">예산 (원)</Label>
            <Input id="budget" type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="mt-1.5" />
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
          <Button type="button" variant="outline" onClick={() => router.push(`/projects/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
