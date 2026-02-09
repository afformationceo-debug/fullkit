import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  User,
  FileText,
  ListChecks,
} from "lucide-react";
import { MeetingStatusActions } from "./meeting-status-actions";
import { MeetingDelete } from "./meeting-delete";
import { FollowUpList } from "./follow-up-list";

const statusLabels: Record<string, string> = {
  scheduled: "예정",
  completed: "완료",
  cancelled: "취소",
  no_show: "불참",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-500",
  completed: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
  no_show: "bg-yellow-500/10 text-yellow-500",
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: meeting, error } = await supabase
    .from("meetings")
    .select("*, leads(name, company), clients(company_name), follow_ups(id, content, status, due_date, created_at)")
    .eq("id", id)
    .single();

  if (error || !meeting) notFound();

  const lead = meeting.leads as { name: string; company: string | null } | null;
  const client = meeting.clients as { company_name: string } | null;
  const followUps = (meeting.follow_ups as Array<Record<string, unknown>>) || [];

  const relatedName = client
    ? client.company_name
    : lead
      ? `${lead.name}${lead.company ? ` (${lead.company})` : ""}`
      : "-";

  const infoItems = [
    { icon: Calendar, label: "일시", value: formatDateTime(meeting.meeting_date as string) },
    { icon: MapPin, label: "장소", value: (meeting.location as string) || "-" },
    { icon: User, label: "관련 고객", value: relatedName },
    { icon: Clock, label: "등록일", value: formatDateTime(meeting.created_at as string) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/meetings"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 미팅 목록
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{meeting.title as string}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[(meeting.status as string)] || ""}`}
            >
              {statusLabels[(meeting.status as string)] || (meeting.status as string)}
            </Badge>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/meetings/${id}/edit`}><Pencil size={14} className="mr-1.5" /> 수정</Link>
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

          {/* Agenda */}
          {(meeting.agenda as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} />
                <h2 className="font-semibold">안건</h2>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {meeting.agenda as string}
              </p>
            </div>
          )}

          {/* Notes */}
          {(meeting.notes as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">메모</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {meeting.notes as string}
              </p>
            </div>
          )}

          {/* Follow-ups */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks size={16} />
              <h2 className="font-semibold">후속 조치</h2>
              <span className="text-xs text-muted-foreground">({followUps.length})</span>
            </div>
            <FollowUpList
              meetingId={id}
              followUps={followUps.map((f) => ({
                id: f.id as string,
                content: f.content as string,
                status: f.status as string,
                due_date: f.due_date as string | null,
                created_at: f.created_at as string,
              }))}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">상태 관리</h2>
            <MeetingStatusActions meetingId={id} currentStatus={meeting.status as string} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">위험 영역</h2>
            <MeetingDelete meetingId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
