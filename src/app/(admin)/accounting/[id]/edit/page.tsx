"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateInvoice } from "@/lib/actions/invoice-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
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
    due_date: "",
    notes: "",
    tax_rate: "10",
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [invoiceRes, clientsRes, projectsRes] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", id).single(),
        supabase.from("clients").select("id, company_name").order("company_name"),
        supabase.from("projects").select("id, title").order("title"),
      ]);

      if (invoiceRes.data) {
        const d = invoiceRes.data;
        setFormData({
          client_id: (d.client_id as string) || "",
          project_id: (d.project_id as string) || "",
          due_date: (d.due_date as string)?.slice(0, 10) || "",
          notes: (d.notes as string) || "",
          tax_rate: String((d.tax_rate as number) || 10),
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

    const result = await updateInvoice(id, {
      client_id: formData.client_id,
      project_id: formData.project_id || null,
      due_date: formData.due_date,
      notes: formData.notes || null,
      tax_rate: parseInt(formData.tax_rate, 10),
    });

    if (result.success) {
      router.push(`/accounting/${id}`);
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
          <Link href={`/accounting/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">청구서 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">청구서 기본 정보를 수정합니다.</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="due_date">만기일 *</Label>
            <Input id="due_date" type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="tax_rate">세율 (%)</Label>
            <Input id="tax_rate" type="number" value={formData.tax_rate} onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })} className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">비고</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "수정 완료"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/accounting/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
