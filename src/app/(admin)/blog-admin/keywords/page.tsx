import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { KeywordForm } from "./keyword-form";
import { KeywordActions } from "./keyword-actions";

export const metadata = { title: "키워드 관리 | WhyKit Admin" };

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "대기중",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  generating: {
    label: "생성중",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse",
  },
  scheduled: {
    label: "예약됨",
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  published: {
    label: "발행완료",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  failed: {
    label: "실패",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default async function KeywordsPage() {
  const supabase = await createClient();

  const { data: keywords } = await supabase
    .from("blog_keywords")
    .select("*, blog_posts(slug, status, published_at)")
    .order("priority", { ascending: false });

  const items = (keywords || []) as Array<Record<string, unknown>>;

  const counts = {
    total: items.length,
    pending: items.filter((k) => k.status === "pending").length,
    generating: items.filter((k) => k.status === "generating").length,
    scheduled: items.filter((k) => k.status === "scheduled").length,
    published: items.filter((k) => k.status === "published").length,
    failed: items.filter((k) => k.status === "failed").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">키워드 관리</h1>
          <p className="text-muted-foreground mt-1">
            블로그 자동 생성에 사용할 키워드를 등록합니다.
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/blog-admin">블로그 목록</Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">전체</span>
          <p className="text-2xl font-bold mt-1">{counts.total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">대기중</span>
          <p className="text-2xl font-bold mt-1 text-blue-500">{counts.pending}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">생성중</span>
          <p className="text-2xl font-bold mt-1 text-yellow-500">{counts.generating}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">예약됨</span>
          <p className="text-2xl font-bold mt-1 text-orange-500">{counts.scheduled}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">발행완료</span>
          <p className="text-2xl font-bold mt-1 text-green-500">{counts.published}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">실패</span>
          <p className="text-2xl font-bold mt-1 text-red-500">{counts.failed}</p>
        </div>
      </div>

      {/* Add keyword form */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <Plus size={16} /> 새 키워드 등록
        </h2>
        <KeywordForm />
      </div>

      {/* Keywords table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            등록된 키워드가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">키워드</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">보조 키워드</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">카테고리</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">우선순위</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">발행 링크</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((kw) => {
                  const status = String(kw.status || "pending");
                  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
                  const blogPost = kw.blog_posts as Record<string, unknown> | null;
                  const postSlug = blogPost ? String(blogPost.slug || "") : "";
                  const postStatus = blogPost ? String(blogPost.status || "") : "";

                  return (
                    <tr
                      key={String(kw.id)}
                      className="hover:bg-accent/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{String(kw.keyword)}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {((kw.secondary_keywords as string[]) || []).map(
                            (sk: string) => (
                              <Badge key={sk} variant="outline" className="text-xs">
                                {sk}
                              </Badge>
                            )
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {String(kw.service_category || "-")}
                      </td>
                      <td className="p-4">
                        <span className="font-mono">{String(kw.priority || 0)}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={config.className}>
                          {config.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {postSlug && postStatus === "published" ? (
                          <Link
                            href={`/blog/${postSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 hover:underline"
                          >
                            <ExternalLink size={12} />
                            보기
                          </Link>
                        ) : postSlug ? (
                          <span className="text-xs text-muted-foreground">
                            {postStatus === "scheduled" ? "예약됨" : "초안"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <KeywordActions
                          keywordId={String(kw.id)}
                          status={status}
                        />
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
