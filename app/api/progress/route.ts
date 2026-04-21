import { NextResponse } from "next/server";
import { modules } from "@/lib/content";

export async function POST(request: Request) {
  const { moduleId, completed } = await request.json();

  if (!modules.some((module) => module.id === moduleId)) {
    return NextResponse.json({ error: "Unknown module." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    preview: true,
    moduleId,
    completed: Boolean(completed)
  });
}
