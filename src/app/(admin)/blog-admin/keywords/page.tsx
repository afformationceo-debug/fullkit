import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { KeywordForm } from "./keyword-form";

export const metadata = { title: "키워드 관리 | Full Kit Admin" };

export default async function KeywordsPage() {
  const supabase = await createClient();

  const { data: keywords } = await supabase
    .from("blog_keywords")
    .select("*")
    .order("priority", { ascending: false });

  const items = keywords || [];
  const usedCount = items.filter((k) => k.used).length;
  const unusedCount = items.filter((k) => !k.used).length;

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
          <Link href="/blog-admin">
            블로그 목록
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">전체</span>
          <p className="text-2xl font-bold mt-1">{items.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">미사용</span>
          <p className="text-2xl font-bold mt-1 text-blue-500">{unusedCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground">사용됨</span>
          <p className="text-2xl font-bold mt-1 text-green-500">{usedCount}</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((kw) => (
                  <tr key={kw.id as string} className="hover:bg-accent/30 transition-colors">
                    <td className="p-4 font-medium">{kw.keyword as string}</td>
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
                      {(kw.service_category as string) || "-"}
                    </td>
                    <td className="p-4">
                      <span className="font-mono">{String(kw.priority || 0)}</span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={
                          kw.used
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                      >
                        {kw.used ? "사용됨" : "대기중"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
