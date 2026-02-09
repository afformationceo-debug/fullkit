"use client";

import { deleteContract } from "@/lib/actions/maintenance-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function ContractDelete({ contractId }: { contractId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteContract(contractId)}
      redirectTo="/maintenance"
      label="계약 삭제"
      confirmMessage="유지보수 계약을 삭제하면 관련 티켓도 함께 삭제됩니다. 계속하시겠습니까?"
    />
  );
}
