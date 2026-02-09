import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FolderKanban,
  ShieldCheck,
  Ticket,
  FileText,
} from "lucide-react";
import { ContractDelete } from "./contract-delete";

const ticketStatusLabels: Record<string, string> = {
  open: "접수",
  in_progress: "처리중",
  resolved: "해결",
  closed: "종료",
};

const ticketStatusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  resolved: "bg-green-500/10 text-green-500",
  closed: "bg-gray-500/10 text-gray-500",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
}

interface ContractDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contract, error } = await supabase
    .from("maintenance_contracts")
    .select("*, clients(company_name), projects(title, project_number), tickets(id, title, status, priority, ticket_number, created_at)")
    .eq("id", id)
    .single();

  if (error || !contract) notFound();

  const client = contract.clients as { company_name: string } | null;
  const project = contract.projects as { title: string; project_number: string } | null;
  const tickets = (contract.tickets as Array<Record<string, unknown>>) || [];

  const infoItems = [
    { icon: Building2, label: "거래처", value: client?.company_name || "-" },
    { icon: FolderKanban, label: "프로젝트", value: project ? `${project.title} (${project.project_number})` : "-" },
    { icon: Calendar, label: "시작일", value: formatDate(contract.start_date as string | null) },
    { icon: Calendar, label: "종료일", value: formatDate(contract.end_date as string | null) },
    { icon: DollarSign, label: "월 비용", value: formatCurrency((contract.monthly_fee as number) || 0) },
    { icon: ShieldCheck, label: "상태", value: (contract.status as string) === "active" ? "활성" : (contract.status as string) === "expired" ? "만료" : (contract.status as string) || "-" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/maintenance"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 유지보수 관리
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">유지보수 계약</h1>
            <Badge variant={(contract.status as string) === "active" ? "default" : "secondary"}>
              {(contract.status as string) === "active" ? "활성" : (contract.status as string) === "expired" ? "만료" : (contract.status as string)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{contract.contract_number as string}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">계약 정보</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scope */}
          {(contract.scope as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} />
                <h2 className="font-semibold">계약 범위</h2>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {contract.scope as string}
              </p>
            </div>
          )}

          {/* Related Tickets */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ticket size={16} />
              <h2 className="font-semibold">관련 티켓</h2>
              <span className="text-xs text-muted-foreground">({tickets.length})</span>
            </div>
            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">관련 티켓이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {tickets
                  .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
                  .map((ticket) => (
                    <Link
                      key={ticket.id as string}
                      href={`/maintenance/tickets/${ticket.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{ticket.title as string}</p>
                        <p className="text-xs font-mono text-muted-foreground">{ticket.ticket_number as string}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${ticketStatusColors[(ticket.status as string)] || ""}`}
                      >
                        {ticketStatusLabels[(ticket.status as string)] || (ticket.status as string)}
                      </Badge>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">계약 요약</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">총 티켓</p>
                <p className="text-2xl font-bold">{tickets.length}건</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">미해결 티켓</p>
                <p className="text-2xl font-bold text-orange-500">
                  {tickets.filter((t) => t.status === "open" || t.status === "in_progress").length}건
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">월 비용</p>
                <p className="text-2xl font-bold">{formatCurrency((contract.monthly_fee as number) || 0)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">위험 영역</h2>
            <ContractDelete contractId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
