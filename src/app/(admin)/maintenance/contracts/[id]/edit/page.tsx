"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateContract } from "@/lib/actions/maintenance-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

interface EditContractPageProps {
  params: Promise<{ id: string }>;
}

export default function EditContractPage({ params }: EditContractPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<Array<{ id: string; company_name: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
  const [formData, setFormData] = useState({
    client_id: "",
    project_id: "",
    start_date: "",
    end_date: "",
    monthly_fee: "",
    scope: "",
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [contractRes, clientsRes, projectsRes] = await Promise.all([
        supabase.from("maintenance_contracts").select("*").eq("id", id).single(),
        supabase.from("clients").select("id, company_name").order("company_name"),
        supabase.from("projects").select("id, title").order("title"),
      ]);

      if (contractRes.data) {
        const d = contractRes.data;
        setFormData({
          client_id: (d.client_id as string) || "",
          project_id: (d.project_id as string) || "",
          start_date: (d.start_date as string)?.slice(0, 10) || "",
          end_date: (d.end_date as string)?.slice(0, 10) || "",
          monthly_fee: String((d.monthly_fee as number) || ""),
          scope: (d.scope as string) || "",
        });
      }
      setClients((clientsRes.data || []).map((c) => ({ id: c.id as string, company_name: c.company_name as string })));
      setProjects((projectsRes.data || []).map((p) => ({ id: p.id as string, title: p.title as string })));
      setFetching(false);
    }
    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateContract(id, {
      client_id: formData.client_id,
      project_id: formData.project_id || null,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      monthly_fee: formData.monthly_fee ? parseInt(formData.monthly_fee, 10) : null,
      scope: formData.scope || null,
    });

    if (result.success) {
      router.push(`/maintenance/contracts/${id}`);
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
          <Link href={`/maintenance/contracts/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">계약 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">유지보수 계약 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id">거래처 *</Label>
            <select
              id="client_id"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              required
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">선택...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="project_id">프로젝트</Label>
            <select
              id="project_id"
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">선택...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="start_date">시작일 *</Label>
            <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="end_date">종료일</Label>
            <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="monthly_fee">월 비용 (원)</Label>
            <Input id="monthly_fee" type="number" value={formData.monthly_fee} onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })} className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label htmlFor="scope">계약 범위</Label>
          <textarea
            id="scope"
            value={formData.scope}
            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            rows={5}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "수정 완료"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/maintenance/contracts/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
