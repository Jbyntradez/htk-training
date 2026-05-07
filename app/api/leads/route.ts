import { NextResponse } from "next/server";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  hasSupabaseConfig,
  isProductionEnvironment
} from "@/lib/supabase";

export async function POST(request: Request) {
  const { email, source } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    if (isProductionEnvironment()) {
      try {
        getSupabaseAdmin();
      } catch (error) {
        return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, preview: true });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("leads")
      .upsert({ email: email.toLowerCase(), source: source ?? "site" }, { onConflict: "email" });

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}
