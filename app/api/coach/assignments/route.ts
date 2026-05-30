import { NextResponse } from "next/server";
import { assignCoachTrainingSession, requireCoachProfile } from "@/lib/coach-platform";
import { OperatorPlatformError } from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Coach assignment request failed." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    await requireCoachProfile(request);

    const body = await request.json().catch(() => ({}));
    const assignment = await assignCoachTrainingSession(body);

    return NextResponse.json({ ok: true, assignment });
  } catch (error) {
    return errorResponse(error);
  }
}
