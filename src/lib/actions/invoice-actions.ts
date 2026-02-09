"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createInvoice(formData: {
  client_id: string;
  project_id?: string;
  due_date: string;
  items: Array<{ description: string; quantity: number; unit_price: number }>;
  notes?: string;
  tax_rate?: number;
}) {
  const supabase = await createClient();

  const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxRate = formData.tax_rate || 10;
  const taxAmount = Math.round(subtotal * taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      client_id: formData.client_id,
      project_id: formData.project_id || null,
      due_date: formData.due_date,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Insert line items
  const items = formData.items.map((item, index) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    amount: item.quantity * item.unit_price,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase.from("invoice_items").insert(items);
  if (itemsError) return { success: false, error: itemsError.message };

  revalidatePath("/accounting");
  return { success: true, invoiceId: invoice.id };
}

export async function updateInvoice(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").update(data).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/accounting");
  revalidatePath(`/accounting/${id}`);
  return { success: true };
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status };
  if (status === "paid") {
    updateData.paid_at = new Date().toISOString();
  }

  const { error } = await supabase.from("invoices").update(updateData).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/accounting");
  revalidatePath(`/accounting/${id}`);
  return { success: true };
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  // Delete items first
  await supabase.from("invoice_items").delete().eq("invoice_id", id);
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/accounting");
  return { success: true };
}
