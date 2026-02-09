import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  FolderKanban,
  Package,
  Tag,
  FileText,
} from "lucide-react";

const typeLabels: Record<string, string> = {
  design: "디자인",
  document: "문서",
  source_code: "소스코드",
  deployment: "배포",
  report: "보고서",
  other: "기타",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface DeliverableDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DeliverableDetailPage({ params }: DeliverableDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: deliverable, error } = await supabase
    .from("deliverables")
    .select("*, projects(title, project_number)")
    .eq("id", id)
    .single();

  if (error || !deliverable) notFound();

  const project = deliverable.projects as { title: string; project_number: string } | null;

  const infoItems = [
    { icon: FolderKanban, label: "프로젝트", value: project ? `${project.title} (${project.project_number})` : "-" },
    { icon: Tag, label: "유형", value: typeLabels[(deliverable.type as string)] || (deliverable.type as string) || "-" },
    { icon: Package, label: "버전", value: (deliverable.version as string) || "v1.0" },
    { icon: Calendar, label: "등록일", value: formatDate(deliverable.created_at as string) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/deliverables"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 산출물 목록
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{deliverable.title as string}</h1>
            <Badge variant="outline" className="text-xs">
              {typeLabels[(deliverable.type as string)] || (deliverable.type as string)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {(deliverable.description as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} />
                <h2 className="font-semibold">설명</h2>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {deliverable.description as string}
              </p>
            </div>
          )}

          {/* File URL */}
          {(deliverable.file_url as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">파일</h2>
              <a
                href={deliverable.file_url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand hover:underline"
              >
                {deliverable.file_url as string}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">산출물 정보</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">유형</p>
                <p className="text-sm font-medium">{typeLabels[(deliverable.type as string)] || (deliverable.type as string)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">버전</p>
                <p className="text-sm font-mono">{(deliverable.version as string) || "v1.0"}</p>
              </div>
              {project && (
                <div>
                  <p className="text-xs text-muted-foreground">프로젝트</p>
                  <Link href={`/projects/${deliverable.project_id}`} className="text-sm text-brand hover:underline">
                    {project.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
