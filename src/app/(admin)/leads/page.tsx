import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LeadFilters } from "./lead-filters";

export const metadata = {
  title: "리드 관리 | Full Kit Admin",
};

const statusLabels: Record<string, string> = {
  new: "신규",
  contacted: "연락완료",
  meeting_scheduled: "미팅예정",
  proposal_sent: "견적발송",
  negotiating: "협상중",
  won: "수주",
  lost: "실패",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  meeting_scheduled: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  proposal_sent: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  negotiating: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  won: "bg-green-500/10 text-green-500 border-green-500/20",
  lost: "bg-red-500/10 text-red-500 border-red-500/20",
};

const serviceLabels: Record<string, string> = {
  homepage: "홈페이지",
  app: "앱",
  solution: "솔루션",
  automation: "자동화",
};

const sourceLabels: Record<string, string> = {
  website: "웹사이트",
  referral: "추천",
  kmong: "크몽",
  naver: "네이버",
  google: "구글",
  youtube: "유튜브",
  email: "이메일",
  other: "기타",
};

interface LeadsPageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const status = params.status || "";
  const source = params.source || "";
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const perPage = 20;

  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  let leads: Array<Record<string, unknown>> = [];
  let count = 0;

  try {
    const { data, count: totalCount, error } = await query;
    if (!error) {
      leads = data || [];
      count = totalCount || 0;
    }
  } catch {
    // Query error
  }

  // Stats query
  let stats = { total: 0, new: 0, contacted: 0, won: 0, lost: 0 };
  try {
    const { data: allLeads } = await supabase.from("leads").select("status");
    if (allLeads) {
      stats = {
        total: allLeads.length,
        new: allLeads.filter((l) => l.status === "new").length,
        contacted: allLeads.filter((l) =>
          ["contacted", "meeting_scheduled", "proposal_sent", "negotiating"].includes(l.status)
        ).length,
        won: allLeads.filter((l) => l.status === "won").length,
        lost: allLeads.filter((l) => l.status === "lost").length,
      };
    }
  } catch {
    // Stats error
  }

  const totalPages = Math.ceil(count / perPage);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">리드 관리</h1>
          <p className="text-muted-foreground mt-1">
            웹사이트 신청폼으로 접수된 리드를 관리합니다.
          </p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/leads/new">
            <Plus size={16} className="mr-1" /> 리드 추가
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "전체", value: stats.total, color: "text-foreground" },
          { label: "신규", value: stats.new, color: "text-blue-500" },
          { label: "진행중", value: stats.contacted, color: "text-yellow-500" },
          { label: "수주", value: stats.won, color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <LeadFilters currentStatus={status} currentSource={source} currentSearch={search} />

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">
              {search || status || source ? "검색 결과가 없습니다." : "아직 접수된 리드가 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search || status || source
                ? "다른 조건으로 검색해 보세요."
                : "신청폼에서 접수되면 여기에 표시됩니다."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">번호</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">이름</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">연락처</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">서비스</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">유입경로</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">접수일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id as string}
                      className="hover:bg-accent/30 transition-colors"
                    >
                      <td className="p-4">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="text-xs font-mono text-brand hover:underline"
                        >
                          {lead.lead_number as string}
                        </Link>
                      </td>
                      <td className="p-4">
                        <Link href={`/leads/${lead.id}`} className="hover:underline">
                          <div className="font-medium">{lead.name as string}</div>
                          {String(lead.company || "") && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Building2 size={12} />
                              {lead.company as string}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-xs">
                            <Phone size={12} className="text-muted-foreground" />
                            {lead.phone as string}
                          </div>
                          {String(lead.email || "") && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail size={12} />
                              {lead.email as string}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {serviceLabels[(lead.service_type as string)] || (lead.service_type as string)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-muted-foreground">
                          {sourceLabels[(lead.source as string)] || (lead.source as string)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusColors[(lead.status as string)] || ""}`}
                        >
                          {statusLabels[(lead.status as string)] || (lead.status as string)}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(lead.created_at as string)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  총 {count}건 중 {from + 1}-{Math.min(to + 1, count)}건
                </span>
                <div className="flex items-center gap-1">
                  {page > 1 && (
                    <Link
                      href={`/leads?page=${page - 1}${status ? `&status=${status}` : ""}${source ? `&source=${source}` : ""}${search ? `&search=${search}` : ""}`}
                    >
                      <Button variant="ghost" size="sm">
                        <ChevronLeft size={14} />
                      </Button>
                    </Link>
                  )}
                  <span className="text-sm px-2">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/leads?page=${page + 1}${status ? `&status=${status}` : ""}${source ? `&source=${source}` : ""}${search ? `&search=${search}` : ""}`}
                    >
                      <Button variant="ghost" size="sm">
                        <ChevronRight size={14} />
                      </Button>
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
