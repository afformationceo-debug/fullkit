import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { TicketStatusActions } from "./ticket-status-actions";
import { TicketComments } from "./ticket-comments";
import { TicketDelete } from "./ticket-delete";

const statusLabels: Record<string, string> = {
  open: "접수",
  in_progress: "처리중",
  resolved: "해결",
  closed: "종료",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  resolved: "bg-green-500/10 text-green-500",
  closed: "bg-gray-500/10 text-gray-500",
};

const priorityLabels: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*, maintenance_contracts(contract_number, clients(company_name)), ticket_comments(id, content, created_at, created_by)")
    .eq("id", id)
    .single();

  if (error || !ticket) notFound();

  const contract = ticket.maintenance_contracts as { contract_number: string; clients: { company_name: string } | null } | null;
  const comments = (ticket.ticket_comments as Array<Record<string, unknown>>) || [];

  const infoItems = [
    { icon: ShieldCheck, label: "계약", value: contract?.contract_number || "-" },
    { icon: ShieldCheck, label: "거래처", value: contract?.clients?.company_name || "-" },
    { icon: AlertTriangle, label: "우선순위", value: priorityLabels[(ticket.priority as string)] || (ticket.priority as string) || "-" },
    { icon: Calendar, label: "접수일", value: formatDate(ticket.created_at as string) },
    { icon: Calendar, label: "해결일", value: formatDate(ticket.resolved_at as string | null) },
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
            <h1 className="text-2xl font-bold">{ticket.title as string}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[(ticket.status as string)] || ""}`}
            >
              {statusLabels[(ticket.status as string)] || (ticket.status as string)}
            </Badge>
            <Badge
              variant="secondary"
              className={`${priorityColors[(ticket.priority as string)] || ""}`}
            >
              {priorityLabels[(ticket.priority as string)] || (ticket.priority as string)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{ticket.ticket_number as string}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">기본 정보</h2>
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

          {/* Description */}
          {(ticket.description as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">상세 설명</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {ticket.description as string}
              </p>
            </div>
          )}

          {/* Comments */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} />
              <h2 className="font-semibold">댓글</h2>
              <span className="text-xs text-muted-foreground">({comments.length})</span>
            </div>
            <TicketComments
              ticketId={id}
              comments={comments.map((c) => ({
                id: c.id as string,
                content: c.content as string,
                created_at: c.created_at as string,
              }))}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">상태 관리</h2>
            <TicketStatusActions ticketId={id} currentStatus={ticket.status as string} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">위험 영역</h2>
            <TicketDelete ticketId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
