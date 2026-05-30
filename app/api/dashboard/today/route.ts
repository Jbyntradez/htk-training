import { NextResponse } from "next/server";
import {
  OperatorPlatformError,
  getTodayDashboardState,
  requireOperatorProfile
} from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Dashboard request failed." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const profile = await requireOperatorProfile(request);
    const state = await getTodayDashboardState(profile);

    return NextResponse.json(state);
  } catch (error) {
    return errorResponse(error);
  }
}
