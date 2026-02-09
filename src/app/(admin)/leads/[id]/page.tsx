import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Calendar,
  Globe,
  DollarSign,
  FileText,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { LeadStatusActions } from "./lead-status-actions";
import { LeadNotes } from "./lead-notes";
import { LeadDelete } from "./lead-delete";

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
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-yellow-500/10 text-yellow-500",
  meeting_scheduled: "bg-purple-500/10 text-purple-500",
  proposal_sent: "bg-orange-500/10 text-orange-500",
  negotiating: "bg-cyan-500/10 text-cyan-500",
  won: "bg-green-500/10 text-green-500",
  lost: "bg-red-500/10 text-red-500",
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

const budgetLabels: Record<string, string> = {
  "under-300": "300만원 미만",
  "300-500": "300~500만원",
  "500-1000": "500~1,000만원",
  "1000-3000": "1,000~3,000만원",
  "3000-5000": "3,000~5,000만원",
  "over-5000": "5,000만원 이상",
  undecided: "미정",
};

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*, lead_notes(id, content, created_at, created_by)")
    .eq("id", id)
    .single();

  if (error || !lead) notFound();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const infoItems = [
    { icon: Phone, label: "연락처", value: lead.phone },
    { icon: Mail, label: "이메일", value: lead.email },
    { icon: Building2, label: "회사", value: lead.company },
    { icon: Globe, label: "서비스", value: serviceLabels[lead.service_type] || lead.service_type },
    { icon: DollarSign, label: "예산", value: budgetLabels[lead.budget_range] || lead.budget_range },
    { icon: FileText, label: "유입경로", value: sourceLabels[lead.source] || lead.source },
    { icon: Calendar, label: "접수일", value: formatDate(lead.created_at) },
  ].filter((item) => item.value);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/leads"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 리드 목록
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[lead.status] || ""}`}
            >
              {statusLabels[lead.status] || lead.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{lead.lead_number}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/leads/${id}/edit`}><Pencil size={14} className="mr-1.5" /> 수정</Link>
        </Button>
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
          {lead.description && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">프로젝트 설명</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {lead.description}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} />
              <h2 className="font-semibold">메모</h2>
              <span className="text-xs text-muted-foreground">
                ({(lead.lead_notes as Array<Record<string, unknown>>)?.length || 0})
              </span>
            </div>
            <LeadNotes
              leadId={id}
              notes={(lead.lead_notes as Array<{ id: string; content: string; created_at: string }>) || []}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">상태 관리</h2>
            <LeadStatusActions leadId={id} currentStatus={lead.status} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">위험 영역</h2>
            <LeadDelete leadId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
