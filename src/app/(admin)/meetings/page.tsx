import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin, User } from "lucide-react";

export const metadata = { title: "미팅 관리 | Full Kit Admin" };

const statusLabels: Record<string, string> = {
  scheduled: "예정",
  completed: "완료",
  cancelled: "취소",
  no_show: "불참",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  no_show: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MeetingsPage() {
  const supabase = await createClient();
  let meetings: Array<Record<string, unknown>> = [];

  try {
    const { data } = await supabase
      .from("meetings")
      .select("*, leads(name, company), clients(company_name)")
      .order("meeting_date", { ascending: false });
    meetings = data || [];
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">미팅 관리</h1>
          <p className="text-muted-foreground mt-1">고객 미팅 일정을 관리하고 후속 조치를 추적합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/meetings/new"><Plus size={16} className="mr-1" /> 미팅 추가</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {meetings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">아직 등록된 미팅이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-1">리드 또는 거래처와의 미팅을 등록하세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">제목</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">일시</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">관련 고객</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">장소</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">메모</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {meetings.map((meeting) => {
                  const lead = meeting.leads as { name: string; company: string | null } | null;
                  const client = meeting.clients as { company_name: string } | null;
                  return (
                    <tr key={meeting.id as string} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4 font-medium">
                        <Link href={`/meetings/${meeting.id}`} className="hover:underline">
                          {meeting.title as string}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar size={12} className="text-muted-foreground" />
                            {formatDate(meeting.meeting_date as string)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            {formatTime(meeting.meeting_date as string)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs">
                          <User size={12} className="text-muted-foreground" />
                          {client
                            ? client.company_name
                            : lead
                              ? `${lead.name}${lead.company ? ` (${lead.company})` : ""}`
                              : "-"}
                        </div>
                      </td>
                      <td className="p-4">
                        {meeting.location ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={12} />
                            {meeting.location as string}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusColors[(meeting.status as string)] || ""}`}
                        >
                          {statusLabels[(meeting.status as string)] || (meeting.status as string)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {(meeting.notes as string) || "-"}
                        </p>
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
