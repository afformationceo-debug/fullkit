"use client";

import { deleteClient_ } from "@/lib/actions/client-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function ClientDelete({ clientId }: { clientId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteClient_(clientId)}
      redirectTo="/clients"
      label="거래처 삭제"
      confirmMessage="거래처를 삭제하면 관련 연락처 정보도 함께 삭제됩니다. 계속하시겠습니까?"
    />
  );
}
