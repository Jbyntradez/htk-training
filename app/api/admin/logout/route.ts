import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie, getAdminLoginPath } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const url = new URL(getAdminLoginPath(), request.url);
  url.searchParams.set("status", "logged_out");

  const response = NextResponse.redirect(url, { status: 303 });
  clearAdminSessionCookie(response);
  return response;
}
