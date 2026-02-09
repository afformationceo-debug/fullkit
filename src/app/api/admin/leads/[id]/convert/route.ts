import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get lead data
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: "리드를 찾을 수 없습니다." }, { status: 404 });
  }

  // Create client from lead
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({
      company_name: lead.company || lead.name,
      contact_name: lead.name,
      contact_email: lead.email,
      contact_phone: lead.phone,
      lead_id: id,
    })
    .select()
    .single();

  if (clientError) {
    return NextResponse.json({ error: clientError.message }, { status: 400 });
  }

  // Update lead status to won
  await supabase.from("leads").update({ status: "won" }).eq("id", id);

  return NextResponse.json({ success: true, clientId: client.id });
}
