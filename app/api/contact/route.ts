import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

const maxNameLength = 120;
const maxMessageLength = 3000;

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  source?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ContactRequestBody;
  const name = cleanText(body.name, maxNameLength);
  const email = cleanText(body.email, 254).toLowerCase();
  const message = cleanText(body.message, maxMessageLength);
  const source = cleanText(body.source, 80) || "contact_page";
  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = "Name is required.";
  }

  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Valid email is required.";
  }

  if (!message) {
    fieldErrors.message = "Message is required.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ fieldErrors }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ ok: true, preview: true });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    message,
    source
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("leads")
    .upsert({ email, source }, { onConflict: "email" });

  return NextResponse.json({ ok: true });
}
