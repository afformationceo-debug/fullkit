"use client";

import { deleteTicket } from "@/lib/actions/maintenance-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function TicketDelete({ ticketId }: { ticketId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteTicket(ticketId)}
      redirectTo="/maintenance"
      label="티켓 삭제"
      confirmMessage="티켓을 삭제하면 관련 댓글도 함께 삭제됩니다. 계속하시겠습니까?"
    />
  );
}
