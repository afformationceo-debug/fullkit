import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FolderKanban,
  MessageSquare,
  Pencil,
  Star,
  Tag,
} from "lucide-react";
import { FeedbackStatusActions } from "./feedback-status-actions";
import { FeedbackComments } from "./feedback-comments";

const statusLabels: Record<string, string> = {
  pending: "대기",
  in_review: "검토중",
  resolved: "해결",
  dismissed: "반려",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  in_review: "bg-blue-500/10 text-blue-500",
  resolved: "bg-green-500/10 text-green-500",
  dismissed: "bg-gray-500/10 text-gray-500",
};

const categoryLabels: Record<string, string> = {
  design: "디자인",
  functionality: "기능",
  performance: "성능",
  communication: "커뮤니케이션",
  overall: "전반적",
  other: "기타",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-sm text-muted-foreground">-</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}
        />
      ))}
      <span className="text-sm ml-2">{rating}점</span>
    </div>
  );
}

interface FeedbackDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: FeedbackDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: feedback, error } = await supabase
    .from("feedback")
    .select("*, projects(title, project_number), clients(company_name), feedback_comments(id, content, created_at, created_by)")
    .eq("id", id)
    .single();

  if (error || !feedback) notFound();

  const project = feedback.projects as { title: string; project_number: string } | null;
  const client = feedback.clients as { company_name: string } | null;
  const comments = (feedback.feedback_comments as Array<Record<string, unknown>>) || [];

  const infoItems = [
    { icon: FolderKanban, label: "프로젝트", value: project ? `${project.title} (${project.project_number})` : "-" },
    { icon: Building2, label: "거래처", value: client?.company_name || "-" },
    { icon: Tag, label: "카테고리", value: categoryLabels[(feedback.category as string)] || (feedback.category as string) || "-" },
    { icon: Calendar, label: "접수일", value: formatDate(feedback.created_at as string) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/feedback"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 피드백 목록
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{feedback.title as string}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[(feedback.status as string)] || ""}`}
            >
              {statusLabels[(feedback.status as string)] || (feedback.status as string)}
            </Badge>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/feedback/${id}/edit`}><Pencil size={14} className="mr-1.5" /> 수정</Link>
        </Button>
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
              <div className="flex items-start gap-3">
                <Star size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">평점</p>
                  <StarRating rating={feedback.rating as number | null} />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {(feedback.content as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">피드백 내용</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {feedback.content as string}
              </p>
            </div>
          )}

          {/* Comments */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} />
              <h2 className="font-semibold">댓글</h2>
              <span className="text-xs text-muted-foreground">({comments.length})</span>
            </div>
            <FeedbackComments
              feedbackId={id}
              comments={comments.map((c) => ({
                id: c.id as string,
                content: c.content as string,
                created_at: c.created_at as string,
              }))}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">상태 관리</h2>
            <FeedbackStatusActions feedbackId={id} currentStatus={feedback.status as string} />
          </div>
        </div>
      </div>
    </div>
  );
}
