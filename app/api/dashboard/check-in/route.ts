import { NextResponse } from "next/server";
import {
  OperatorPlatformError,
  requireOperatorProfile,
  saveDailyCheckIn
} from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Check-in request failed." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const profile = await requireOperatorProfile(request);
    const body = await request.json().catch(() => ({}));
    const checkIn = await saveDailyCheckIn(profile, body);

    return NextResponse.json({ ok: true, checkIn });
  } catch (error) {
    return errorResponse(error);
  }
}
