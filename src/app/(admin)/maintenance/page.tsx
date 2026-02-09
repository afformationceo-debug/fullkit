import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Plus, ShieldCheck, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/admin/search-input";

export const metadata = { title: "유지보수 관리 | Full Kit Admin" };

const PAGE_SIZE = 20;

const ticketStatusLabels: Record<string, string> = {
  open: "접수",
  in_progress: "처리중",
  resolved: "해결",
  closed: "종료",
};

const ticketStatusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const priorityLabels: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
}

interface MaintenancePageProps {
  searchParams: Promise<{ tab?: string; search?: string; status?: string; page?: string }>;
}

export default async function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const { tab = "contracts", search = "", status = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  // Build preserved params for links
  function buildParams(overrides: Record<string, string>) {
    const base: Record<string, string> = { tab };
    if (search) base.search = search;
    if (status) base.status = status;
    return new URLSearchParams({ ...base, ...overrides }).toString();
  }

  if (tab === "tickets") {
    // ── Tickets tab ──
    let query = supabase
      .from("tickets")
      .select("*, maintenance_contracts(clients(company_name))", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,ticket_number.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data, count } = await query.range(from, to);
    const tickets = (data || []) as Array<Record<string, unknown>>;
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
      <div>
        <PageHeader tab={tab} />

        {/* Tabs */}
        <TabSwitcher tab={tab} search={search} />

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <SearchInput placeholder="티켓번호, 제목 검색..." />
          <div className="flex gap-1.5 ml-auto">
            <Link href={`/maintenance?${buildParams({ status: "", page: "1" })}`}>
              <Badge variant={!status ? "default" : "outline"} className="cursor-pointer text-xs">전체</Badge>
            </Link>
            {Object.entries(ticketStatusLabels).map(([key, label]) => (
              <Link key={key} href={`/maintenance?${buildParams({ status: key, page: "1" })}`}>
                <Badge variant={status === key ? "default" : "outline"} className="cursor-pointer text-xs">{label}</Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Tickets Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">조건에 맞는 티켓이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">티켓번호</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">제목</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">거래처</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">우선순위</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">접수일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((ticket) => {
                    const contract = ticket.maintenance_contracts as { clients: { company_name: string } | null } | null;
                    return (
                      <tr key={ticket.id as string} className="hover:bg-accent/30 transition-colors">
                        <td className="p-4">
                          <Link href={`/maintenance/tickets/${ticket.id}`} className="text-xs font-mono text-brand hover:underline">
                            {ticket.ticket_number as string}
                          </Link>
                        </td>
                        <td className="p-4 font-medium">
                          <Link href={`/maintenance/tickets/${ticket.id}`} className="hover:underline">
                            {ticket.title as string}
                          </Link>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {contract?.clients?.company_name || "-"}
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-xs ${priorityColors[(ticket.priority as string)] || ""}`}>
                            {priorityLabels[(ticket.priority as string)] || (ticket.priority as string)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-xs ${ticketStatusColors[(ticket.status as string)] || ""}`}>
                            {ticketStatusLabels[(ticket.status as string)] || (ticket.status as string)}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(ticket.created_at as string | null)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} from={from} pageSize={PAGE_SIZE} buildParams={buildParams} />
      </div>
    );
  }

  // ── Contracts tab (default) ──
  let contractQuery = supabase
    .from("maintenance_contracts")
    .select("*, clients(company_name), projects(title)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    contractQuery = contractQuery.or(`contract_number.ilike.%${search}%`);
  }
  if (status) {
    contractQuery = contractQuery.eq("status", status);
  }

  const { data: contractData, count: contractCount } = await contractQuery.range(from, to);
  const contracts = (contractData || []) as Array<Record<string, unknown>>;
  const totalContractCount = contractCount || 0;
  const totalContractPages = Math.ceil(totalContractCount / PAGE_SIZE);

  return (
    <div>
      <PageHeader tab={tab} />

      {/* Tabs */}
      <TabSwitcher tab={tab} search="" />

      {/* Search + Status Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SearchInput placeholder="계약번호 검색..." />
        <div className="flex gap-1.5 ml-auto">
          <Link href={`/maintenance?${buildParams({ status: "", page: "1" })}`}>
            <Badge variant={!status ? "default" : "outline"} className="cursor-pointer text-xs">전체</Badge>
          </Link>
          <Link href={`/maintenance?${buildParams({ status: "active", page: "1" })}`}>
            <Badge variant={status === "active" ? "default" : "outline"} className="cursor-pointer text-xs">활성</Badge>
          </Link>
          <Link href={`/maintenance?${buildParams({ status: "expired", page: "1" })}`}>
            <Badge variant={status === "expired" ? "default" : "outline"} className="cursor-pointer text-xs">만료</Badge>
          </Link>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {contracts.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">조건에 맞는 유지보수 계약이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">계약번호</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">거래처</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">프로젝트</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">시작일</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">종료일</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">월 비용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((contract) => {
                  const client = contract.clients as { company_name: string } | null;
                  const project = contract.projects as { title: string } | null;
                  return (
                    <tr key={contract.id as string} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4">
                        <Link href={`/maintenance/contracts/${contract.id}`} className="text-xs font-mono text-brand hover:underline">
                          {contract.contract_number as string}
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {client?.company_name || "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {project?.title || "-"}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(contract.start_date as string | null)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(contract.end_date as string | null)}
                      </td>
                      <td className="p-4 text-right font-medium whitespace-nowrap">
                        {formatCurrency((contract.monthly_fee as number) || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalContractPages} totalCount={totalContractCount} from={from} pageSize={PAGE_SIZE} buildParams={buildParams} />
    </div>
  );
}

// ── Sub-components ──

function PageHeader({ tab }: { tab: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">유지보수 관리</h1>
        <p className="text-muted-foreground mt-1">유지보수 계약과 지원 티켓을 관리합니다.</p>
      </div>
      <div className="flex gap-2">
        {tab === "tickets" ? (
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/maintenance/tickets/new"><Plus size={16} className="mr-1" /> 티켓 추가</Link>
          </Button>
        ) : (
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/maintenance/contracts/new"><ShieldCheck size={16} className="mr-1" /> 계약 추가</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function TabSwitcher({ tab, search }: { tab: string; search: string }) {
  return (
    <div className="flex gap-1 mb-4 border-b border-border">
      <Link
        href={`/maintenance?tab=contracts`}
        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
          tab === "contracts"
            ? "border-brand text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        <ShieldCheck size={15} /> 계약
      </Link>
      <Link
        href={`/maintenance?tab=tickets${search ? `&search=${encodeURIComponent(search)}` : ""}`}
        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
          tab === "tickets"
            ? "border-brand text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        <Ticket size={15} /> 티켓
      </Link>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalCount,
  from,
  pageSize,
  buildParams,
}: {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  from: number;
  pageSize: number;
  buildParams: (o: Record<string, string>) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-muted-foreground">
        총 {totalCount}건 중 {from + 1}-{Math.min(from + pageSize, totalCount)}
      </p>
      <div className="flex gap-1">
        {currentPage > 1 && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/maintenance?${buildParams({ page: String(currentPage - 1) })}`}>
              <ChevronLeft size={14} />
            </Link>
          </Button>
        )}
        <span className="flex items-center px-3 text-xs text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        {currentPage < totalPages && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/maintenance?${buildParams({ page: String(currentPage + 1) })}`}>
              <ChevronRight size={14} />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
