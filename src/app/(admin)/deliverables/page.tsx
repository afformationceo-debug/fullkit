import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/admin/search-input";

export const metadata = { title: "산출물 관리 | WhyKit Admin" };

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
    month: "short",
    day: "numeric",
  });
}

interface DeliverablesPageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function DeliverablesPage({ searchParams }: DeliverablesPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const supabase = await createClient();
  let deliverables: Array<Record<string, unknown>> = [];
  let count = 0;

  try {
    let query = supabase
      .from("deliverables")
      .select("*, projects(title)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`title.ilike.%${search}%`);
    }

    const { data, count: totalCount } = await query;
    deliverables = data || [];
    count = totalCount || 0;
  } catch {}

  const totalPages = Math.ceil(count / perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">산출물 관리</h1>
          <p className="text-muted-foreground mt-1">프로젝트 산출물과 첨부파일을 관리합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/deliverables/new"><Plus size={16} className="mr-1" /> 산출물 추가</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput placeholder="산출물 검색..." defaultValue={search} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {deliverables.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              {search ? "검색 결과가 없습니다." : "아직 등록된 산출물이 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? "다른 검색어를 입력해 보세요." : "프로젝트 진행 시 산출물을 등록하세요."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">제목</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">프로젝트</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">유형</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">버전</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">등록일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deliverables.map((item) => {
                    const project = item.projects as { title: string } | null;
                    return (
                      <tr key={item.id as string} className="hover:bg-accent/30 transition-colors">
                        <td className="p-4 font-medium">
                          <Link href={`/deliverables/${item.id}`} className="hover:underline">
                            {item.title as string}
                          </Link>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {project?.title || "-"}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {typeLabels[(item.type as string)] || (item.type as string)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-mono text-muted-foreground">
                            {(item.version as string) || "v1.0"}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(item.created_at as string)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <span className="text-xs text-muted-foreground">총 {count}건 중 {from + 1}-{Math.min(to + 1, count)}건</span>
                <div className="flex items-center gap-1">
                  {page > 1 && (
                    <Link href={`/deliverables?page=${page - 1}${search ? `&search=${search}` : ""}`}>
                      <Button variant="ghost" size="sm"><ChevronLeft size={14} /></Button>
                    </Link>
                  )}
                  <span className="text-sm px-2">{page} / {totalPages}</span>
                  {page < totalPages && (
                    <Link href={`/deliverables?page=${page + 1}${search ? `&search=${search}` : ""}`}>
                      <Button variant="ghost" size="sm"><ChevronRight size={14} /></Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
