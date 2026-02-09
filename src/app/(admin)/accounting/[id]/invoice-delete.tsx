"use client";

import { deleteInvoice } from "@/lib/actions/invoice-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function InvoiceDelete({ invoiceId }: { invoiceId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteInvoice(invoiceId)}
      redirectTo="/accounting"
      label="청구서 삭제"
      confirmMessage="청구서를 삭제하면 관련 항목도 함께 삭제됩니다. 계속하시겠습니까?"
    />
  );
}
