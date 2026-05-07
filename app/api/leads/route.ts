import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email, source } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ ok: true, preview: true });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("leads")
    .upsert({ email: email.toLowerCase(), source: source ?? "site" }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
