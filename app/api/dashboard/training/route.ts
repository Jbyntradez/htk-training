import { NextResponse } from "next/server";
import {
  OperatorPlatformError,
  completeTrainingAssignment,
  requireOperatorProfile
} from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Training request failed." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const profile = await requireOperatorProfile(request);
    const body = await request.json().catch(() => ({}));
    const assignment = await completeTrainingAssignment(profile, body);

    return NextResponse.json({ ok: true, assignment });
  } catch (error) {
    return errorResponse(error);
  }
}
