import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileEdit, Plus, Clock, Eye } from "lucide-react";

export const metadata = { title: "블로그 관리 | WhyKit Admin" };

const statusLabels: Record<string, string> = {
  draft: "초안",
  scheduled: "예약",
  published: "발행",
  archived: "보관",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  published: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const categoryLabels: Record<string, string> = {
  development: "개발",
  design: "디자인",
  marketing: "마케팅",
  business: "비즈니스",
  tutorial: "튜토리얼",
  case_study: "사례연구",
  news: "뉴스",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogAdminPage() {
  const supabase = await createClient();
  let posts: Array<Record<string, unknown>> = [];

  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    posts = data || [];
  } catch {}

  // Stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">블로그 관리</h1>
          <p className="text-muted-foreground mt-1">블로그 콘텐츠, 키워드, 자동 발행을 관리합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/blog-admin/new"><Plus size={16} className="mr-1" /> 새 글 작성</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "전체", value: totalPosts, color: "text-foreground" },
          { label: "발행", value: publishedPosts, color: "text-green-500" },
          { label: "초안", value: draftPosts, color: "text-gray-500" },
          { label: "예약", value: scheduledPosts, color: "text-blue-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileEdit size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">아직 작성된 글이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-1">새 글을 작성하여 블로그를 시작하세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">제목</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">슬러그</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">카테고리</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">발행일</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">읽기 시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => {
                  const displayDate =
                    post.status === "published"
                      ? (post.published_at as string | null)
                      : post.status === "scheduled"
                        ? (post.scheduled_for as string | null)
                        : (post.created_at as string | null);
                  const dateLabel =
                    post.status === "published"
                      ? "발행"
                      : post.status === "scheduled"
                        ? "예약"
                        : "작성";
                  return (
                    <tr key={post.id as string} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4 font-medium">
                        <Link href={`/blog-admin/${post.id}`} className="hover:underline">
                          {post.title as string}
                        </Link>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono text-muted-foreground">
                          /{post.slug as string}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusColors[(post.status as string)] || ""}`}
                        >
                          {statusLabels[(post.status as string)] || (post.status as string)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {post.category ? (
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[(post.category as string)] || (post.category as string)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          {post.status === "published" ? (
                            <Eye size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          <span>{dateLabel}</span>
                          <span>{formatDate(displayDate as string | null)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {post.reading_time_minutes
                          ? `${post.reading_time_minutes as number}분`
                          : "-"}
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
