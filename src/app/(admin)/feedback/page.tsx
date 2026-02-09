import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Star } from "lucide-react";

export const metadata = { title: "피드백 관리 | Full Kit Admin" };

const statusLabels: Record<string, string> = {
  pending: "대기",
  in_review: "검토중",
  resolved: "해결",
  dismissed: "반려",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_review: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  dismissed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-xs text-muted-foreground">-</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

interface FeedbackPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function FeedbackPage({ searchParams }: FeedbackPageProps) {
  const params = await searchParams;
  const filterStatus = params.status || "";

  const supabase = await createClient();
  let feedbacks: Array<Record<string, unknown>> = [];

  try {
    let query = supabase
      .from("feedback")
      .select("*, projects(title), clients(company_name)")
      .order("created_at", { ascending: false });

    if (filterStatus) {
      query = query.eq("status", filterStatus);
    }

    const { data } = await query;
    feedbacks = data || [];
  } catch {}

  const allStatuses = Object.keys(statusLabels);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">피드백 관리</h1>
          <p className="text-muted-foreground mt-1">고객 피드백을 수집하고 처리합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/feedback/new"><Plus size={16} className="mr-1.5" /> 피드백 등록</Link>
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/feedback">
          <Badge
            variant={!filterStatus ? "default" : "outline"}
            className="cursor-pointer text-xs px-3 py-1"
          >
            전체
          </Badge>
        </Link>
        {allStatuses.map((s) => (
          <Link key={s} href={`/feedback?status=${s}`}>
            <Badge
              variant={filterStatus === s ? "default" : "outline"}
              className={`cursor-pointer text-xs px-3 py-1 ${filterStatus === s ? statusColors[s] || "" : ""}`}
            >
              {statusLabels[s]}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {feedbacks.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              {filterStatus ? "해당 상태의 피드백이 없습니다." : "아직 접수된 피드백이 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {filterStatus ? "다른 필터를 선택해 보세요." : "고객이 피드백을 남기면 여기에 표시됩니다."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">제목</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">프로젝트</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">거래처</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">평점</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">접수일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {feedbacks.map((fb) => {
                  const project = fb.projects as { title: string } | null;
                  const client = fb.clients as { company_name: string } | null;
                  return (
                    <tr key={fb.id as string} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4 font-medium">
                        <Link href={`/feedback/${fb.id}`} className="hover:underline">
                          {fb.title as string}
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {project?.title || "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {client?.company_name || "-"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusColors[(fb.status as string)] || ""}`}
                        >
                          {statusLabels[(fb.status as string)] || (fb.status as string)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <StarRating rating={fb.rating as number | null} />
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(fb.created_at as string)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
