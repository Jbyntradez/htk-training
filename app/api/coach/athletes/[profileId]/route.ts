import { NextResponse } from "next/server";
import { getCoachAthleteDetail, requireCoachProfile } from "@/lib/coach-platform";
import { OperatorPlatformError } from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    profileId: string;
  }>;
};

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Coach athlete detail request failed." }, { status: 500 });
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireCoachProfile(request);

    const { profileId } = await context.params;
    const detail = await getCoachAthleteDetail(profileId);

    return NextResponse.json({ detail });
  } catch (error) {
    return errorResponse(error);
  }
}
