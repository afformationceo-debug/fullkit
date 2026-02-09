"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateDeliverable } from "@/lib/actions/deliverable-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

const typeOptions = [
  { value: "design", label: "디자인" },
  { value: "document", label: "문서" },
  { value: "source_code", label: "소스코드" },
  { value: "deployment", label: "배포" },
  { value: "report", label: "보고서" },
  { value: "other", label: "기타" },
];

interface EditDeliverablePageProps {
  params: Promise<{ id: string }>;
}

export default function EditDeliverablePage({ params }: EditDeliverablePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    type: "document",
    version: "",
    description: "",
    file_url: "",
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [deliverableRes, projectsRes] = await Promise.all([
        supabase.from("deliverables").select("*").eq("id", id).single(),
        supabase.from("projects").select("id, title").order("title"),
      ]);

      if (deliverableRes.data) {
        const d = deliverableRes.data;
        setFormData({
          title: (d.title as string) || "",
          project_id: (d.project_id as string) || "",
          type: (d.type as string) || "document",
          version: (d.version as string) || "",
          description: (d.description as string) || "",
          file_url: (d.file_url as string) || "",
        });
      }
      setProjects((projectsRes.data || []).map((p) => ({ id: p.id as string, title: p.title as string })));
      setFetching(false);
    }
    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateDeliverable(id, {
      title: formData.title,
      project_id: formData.project_id || null,
      type: formData.type,
      version: formData.version || null,
      description: formData.description || null,
      file_url: formData.file_url || null,
    });

    if (result.success) {
      router.push(`/deliverables/${id}`);
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
          <Link href={`/deliverables/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">산출물 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">산출물 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">산출물 제목 *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div>
            <Label htmlFor="type">유형</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="version">버전</Label>
            <Input id="version" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} placeholder="v1.0" className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label htmlFor="file_url">파일 URL</Label>
          <Input id="file_url" value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} placeholder="https://..." className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="description">설명</Label>
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
          <Button type="button" variant="outline" onClick={() => router.push(`/deliverables/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
