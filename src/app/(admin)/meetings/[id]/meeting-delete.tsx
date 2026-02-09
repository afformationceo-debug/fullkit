"use client";

import { deleteMeeting } from "@/lib/actions/meeting-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function MeetingDelete({ meetingId }: { meetingId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteMeeting(meetingId)}
      redirectTo="/meetings"
      label="미팅 삭제"
      confirmMessage="이 미팅을 삭제하시겠습니까? 관련 후속 조치도 함께 삭제됩니다."
    />
  );
}
