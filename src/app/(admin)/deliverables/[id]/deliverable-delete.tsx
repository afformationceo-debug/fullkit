"use client";

import { deleteDeliverable } from "@/lib/actions/deliverable-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function DeliverableDelete({ deliverableId }: { deliverableId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteDeliverable(deliverableId)}
      redirectTo="/deliverables"
      label="산출물 삭제"
      confirmMessage="산출물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    />
  );
}
