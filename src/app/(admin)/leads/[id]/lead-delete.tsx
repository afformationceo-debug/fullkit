"use client";

import { deleteLead } from "@/lib/actions/lead-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function LeadDelete({ leadId }: { leadId: string }) {
  return (
    <DeleteButton
      label="리드 삭제"
      confirmMessage="이 리드를 삭제하면 관련 메모도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
      onDelete={() => deleteLead(leadId)}
      redirectTo="/leads"
    />
  );
}
