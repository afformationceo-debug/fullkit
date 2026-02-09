"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { use } from "react";

interface ProjectOption {
  id: string;
  title: string;
}

interface ClientOption {
  id: string;
  company_name: string;
}

interface EditFeedbackPageProps {
  params: Promise<{ id: string }>;
}

export default function EditFeedbackPage({ params }: EditFeedbackPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    client_id: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [feedbackRes, projectRes, clientRes] = await Promise.all([
        supabase.from("feedback").select("*").eq("id", id).single(),
        supabase.from("projects").select("id, title").order("title"),
        supabase.from("clients").select("id, company_name").order("company_name"),
      ]);
      if (feedbackRes.data) {
        const fb = feedbackRes.data;
        setFormData({
          title: (fb.title as string) || "",
          project_id: (fb.project_id as string) || "",
          client_id: (fb.client_id as string) || "",
          content: (fb.content as string) || "",
          category: (fb.category as string) || "",
        });
        setRating((fb.rating as number) || 0);
      }
      if (projectRes.data) setProjects(projectRes.data as ProjectOption[]);
      if (clientRes.data) setClients(clientRes.data as ClientOption[]);
      setFetching(false);
    }
    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("feedback")
      .update({
        title: formData.title,
        project_id: formData.project_id,
        client_id: formData.client_id || null,
        content: formData.content || null,
        category: formData.category || null,
        rating: rating || null,
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push(`/feedback/${id}`);
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
          <Link href={`/feedback/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">피드백 수정</h1>
          <p className="text-muted-foreground text-sm mt-0.5">피드백 정보를 수정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="title">제목 *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="project_id">프로젝트 *</Label>
            <select id="project_id" value={formData.project_id} onChange={(e) => setFormData({ ...formData, project_id: e.target.value })} required className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">프로젝트 선택</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="client_id">거래처</Label>
            <select id="client_id" value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">거래처 선택 (선택사항)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">카테고리</Label>
            <select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">선택</option>
              <option value="design">디자인</option>
              <option value="functionality">기능</option>
              <option value="performance">성능</option>
              <option value="communication">커뮤니케이션</option>
              <option value="overall">전반적</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <Label>평점</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star === rating ? 0 : star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={
                      star <= (hoverRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/30"
                    }
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">{rating}점</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="content">피드백 내용</Label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "수정 완료"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/feedback/${id}`)}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
