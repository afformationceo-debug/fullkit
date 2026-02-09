import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

export const metadata = { title: "산출물 관리 | Full Kit Admin" };

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

export default async function DeliverablesPage() {
  const supabase = await createClient();
  let deliverables: Array<Record<string, unknown>> = [];

  try {
    const { data } = await supabase
      .from("deliverables")
      .select("*, projects(title)")
      .order("created_at", { ascending: false });
    deliverables = data || [];
  } catch {}

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

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {deliverables.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">아직 등록된 산출물이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-1">프로젝트 진행 시 산출물을 등록하세요.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
