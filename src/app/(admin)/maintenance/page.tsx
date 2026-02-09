import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Plus, ShieldCheck, Ticket } from "lucide-react";

export const metadata = { title: "유지보수 관리 | Full Kit Admin" };

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

export default async function MaintenancePage() {
  const supabase = await createClient();
  let contracts: Array<Record<string, unknown>> = [];
  let tickets: Array<Record<string, unknown>> = [];

  try {
    const { data } = await supabase
      .from("maintenance_contracts")
      .select("*, clients(company_name), projects(title)")
      .order("created_at", { ascending: false });
    contracts = data || [];
  } catch {}

  try {
    const { data } = await supabase
      .from("tickets")
      .select("*, maintenance_contracts(clients(company_name))")
      .order("created_at", { ascending: false });
    tickets = data || [];
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">유지보수 관리</h1>
          <p className="text-muted-foreground mt-1">유지보수 계약과 지원 티켓을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/maintenance/contracts/new"><ShieldCheck size={16} className="mr-1" /> 계약 추가</Link>
          </Button>
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/maintenance/tickets/new"><Plus size={16} className="mr-1" /> 티켓 추가</Link>
          </Button>
        </div>
      </div>

      {/* Maintenance Contracts Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-green-500" />
          <h2 className="text-lg font-semibold">유지보수 계약</h2>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {contracts.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">아직 등록된 유지보수 계약이 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-1">프로젝트 완료 후 유지보수 계약을 등록하세요.</p>
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
      </div>

      {/* Tickets Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Ticket size={18} className="text-blue-500" />
          <h2 className="text-lg font-semibold">지원 티켓</h2>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">아직 접수된 지원 티켓이 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-1">고객의 지원 요청이 접수되면 여기에 표시됩니다.</p>
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
                          <Badge
                            variant="secondary"
                            className={`text-xs ${priorityColors[(ticket.priority as string)] || ""}`}
                          >
                            {priorityLabels[(ticket.priority as string)] || (ticket.priority as string)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${ticketStatusColors[(ticket.status as string)] || ""}`}
                          >
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
      </div>
    </div>
  );
}
