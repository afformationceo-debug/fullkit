"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ClientOption {
  id: string;
  company_name: string;
}

interface ProjectOption {
  id: string;
  title: string;
}

export default function NewContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [clientRes, projectRes] = await Promise.all([
        supabase.from("clients").select("id, company_name").order("company_name"),
        supabase.from("projects").select("id, title").order("title"),
      ]);
      if (clientRes.data) setClients(clientRes.data as ClientOption[]);
      if (projectRes.data) setProjects(projectRes.data as ProjectOption[]);
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const monthlyFee = formData.get("monthly_fee") as string;
    const { error: insertError } = await supabase.from("maintenance_contracts").insert({
      client_id: formData.get("client_id") as string,
      project_id: (formData.get("project_id") as string) || null,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      monthly_fee: monthlyFee ? parseInt(monthlyFee, 10) : 0,
      scope: (formData.get("scope") as string) || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/maintenance");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/maintenance"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">유지보수 계약 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">유지보수 계약을 등록합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id">거래처 *</Label>
            <select id="client_id" name="client_id" required className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">거래처 선택</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="project_id">프로젝트</Label>
            <select id="project_id" name="project_id" className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">프로젝트 선택 (선택사항)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="start_date">시작일 *</Label>
            <Input id="start_date" name="start_date" type="date" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="end_date">종료일 *</Label>
            <Input id="end_date" name="end_date" type="date" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="monthly_fee">월 비용 (원)</Label>
            <Input id="monthly_fee" name="monthly_fee" type="number" className="mt-1.5" placeholder="0" />
          </div>
        </div>

        <div>
          <Label htmlFor="scope">유지보수 범위</Label>
          <textarea
            id="scope"
            name="scope"
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="유지보수 범위 및 조건"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "계약 등록"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/maintenance")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
