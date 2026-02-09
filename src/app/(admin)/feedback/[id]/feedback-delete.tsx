"use client";

import { deleteFeedback } from "@/lib/actions/feedback-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function FeedbackDelete({ feedbackId }: { feedbackId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteFeedback(feedbackId)}
      redirectTo="/feedback"
      label="피드백 삭제"
      confirmMessage="피드백을 삭제하면 관련 댓글도 함께 삭제됩니다. 계속하시겠습니까?"
    />
  );
}
