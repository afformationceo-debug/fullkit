import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/admin/search-input";

export const metadata = { title: "거래처 관리 | WhyKit Admin" };

interface ClientsPageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const supabase = await createClient();
  let clients: Array<Record<string, unknown>> = [];
  let count = 0;

  try {
    let query = supabase
      .from("clients")
      .select("*, projects(id)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%,client_number.ilike.%${search}%`);
    }

    const { data, count: totalCount } = await query;
    clients = data || [];
    count = totalCount || 0;
  } catch {}

  const totalPages = Math.ceil(count / perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">거래처 관리</h1>
          <p className="text-muted-foreground mt-1">거래처와 담당자 정보를 관리합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/clients/new"><Plus size={16} className="mr-1" /> 거래처 추가</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput placeholder="거래처 검색..." defaultValue={search} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              {search ? "검색 결과가 없습니다." : "아직 등록된 거래처가 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? "다른 검색어를 입력해 보세요." : "리드를 수주하면 거래처로 전환됩니다."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">번호</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">회사명</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">담당자</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">연락처</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">프로젝트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map((client) => (
                    <tr key={client.id as string} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4">
                        <Link href={`/clients/${client.id}`} className="text-xs font-mono text-brand hover:underline">
                          {client.client_number as string}
                        </Link>
                      </td>
                      <td className="p-4 font-medium">
                        <Link href={`/clients/${client.id}`} className="hover:underline">
                          {client.company_name as string}
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground">{client.contact_name as string}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          {String(client.contact_phone || "") && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone size={12} className="text-muted-foreground" />
                              {String(client.contact_phone)}
                            </div>
                          )}
                          {String(client.contact_email || "") && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail size={12} />
                              {String(client.contact_email)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-xs">
                          {(client.projects as Array<unknown>)?.length || 0}개
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <span className="text-xs text-muted-foreground">총 {count}건 중 {from + 1}-{Math.min(to + 1, count)}건</span>
                <div className="flex items-center gap-1">
                  {page > 1 && (
                    <Link href={`/clients?page=${page - 1}${search ? `&search=${search}` : ""}`}>
                      <Button variant="ghost" size="sm"><ChevronLeft size={14} /></Button>
                    </Link>
                  )}
                  <span className="text-sm px-2">{page} / {totalPages}</span>
                  {page < totalPages && (
                    <Link href={`/clients?page=${page + 1}${search ? `&search=${search}` : ""}`}>
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
