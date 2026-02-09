"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateClient_ } from "@/lib/actions/client-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default function EditClientPage({ params }: EditClientPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchClient() {
      const supabase = createClient();
      const { data } = await supabase.from("clients").select("*").eq("id", id).single();
      if (data) {
        setFormData({
          company_name: (data.company_name as string) || "",
          contact_name: (data.contact_name as string) || "",
          contact_email: (data.contact_email as string) || "",
          contact_phone: (data.contact_phone as string) || "",
          address: (data.address as string) || "",
          notes: (data.notes as string) || "",
        });
      }
      setFetching(false);
    }
    fetchClient();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateClient_(id, {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      address: formData.address || null,
      notes: formData.notes || null,
    });

    if (result.success) {
      router.push(`/clients/${id}`);
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
          <Link href={`/clients/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">거래처 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">거래처 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="company_name">회사명 *</Label>
          <Input id="company_name" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required className="mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_name">담당자 이름 *</Label>
            <Input id="contact_name" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="contact_phone">담당자 연락처</Label>
            <Input id="contact_phone" value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="mt-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_email">담당자 이메일</Label>
            <Input id="contact_email" type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="address">주소</Label>
            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">메모</Label>
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
          <Button type="button" variant="outline" onClick={() => router.push(`/clients/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
