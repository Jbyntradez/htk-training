import { NextResponse } from "next/server";
import { listCoachAthletes, requireCoachProfile } from "@/lib/coach-platform";
import { OperatorPlatformError } from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Coach athletes request failed." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const coach = await requireCoachProfile(request);
    const athletes = await listCoachAthletes();

    return NextResponse.json({ coach, athletes });
  } catch (error) {
    return errorResponse(error);
  }
}
