import { NextResponse } from "next/server";
import { getAdminOverview, requireAdminProfile } from "@/lib/admin-platform";
import { OperatorPlatformError } from "@/lib/operator-platform";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Admin overview request failed." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdminProfile(request);
    const overview = await getAdminOverview();

    return NextResponse.json({ admin, overview });
  } catch (error) {
    return errorResponse(error);
  }
}
