import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { formatSupabaseError } from "@/lib/supabase";
import {
  validateCoachingApplicationPayload
} from "@/lib/coaching-application";
import {
  getCoachingApplicationNotificationStatus,
  sendCoachingApplicationNotification
} from "@/lib/coaching-application-notifications";
import {
  listCoachingApplicationsWithSource,
  saveCoachingApplication
} from "@/lib/coaching-application-storage";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await listCoachingApplicationsWithSource();

    return NextResponse.json({
      ...result,
      notification: getCoachingApplicationNotificationStatus()
    });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid application payload." }, { status: 400 });
  }

  const validation = validateCoachingApplicationPayload(body);

  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: "Please correct the highlighted fields.",
        fieldErrors: validation.errors
      },
      { status: 400 }
    );
  }

  try {
    const storedApplication = await saveCoachingApplication(validation.payload);
    const notification = await sendCoachingApplicationNotification(storedApplication);

    return NextResponse.json({
      ok: true,
      id: storedApplication.id,
      createdAt: storedApplication.createdAt,
      storage: storedApplication.storage,
      notification
    });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}
