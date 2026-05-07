import { NextRequest, NextResponse } from "next/server";
import {
  AdminAuthConfigurationError,
  clearAdminSessionCookie,
  getAdminLoginPath,
  setAdminSessionCookie,
  verifyAdminPassword
} from "@/lib/admin-auth";

function redirectToLogin(request: NextRequest, error?: string) {
  const url = new URL(getAdminLoginPath(), request.url);

  if (error) {
    url.searchParams.set("error", error);
  }

  const response = NextResponse.redirect(url, { status: 303 });
  clearAdminSessionCookie(response);
  return response;
}

export async function POST(request: NextRequest) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return redirectToLogin(request, "invalid");
  }

  const password = formData.get("password");

  if (typeof password !== "string") {
    return redirectToLogin(request, "invalid");
  }

  try {
    if (!verifyAdminPassword(password)) {
      return redirectToLogin(request, "invalid");
    }
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      return redirectToLogin(request, "config");
    }

    throw error;
  }

  const response = NextResponse.redirect(new URL("/applications", request.url), {
    status: 303
  });
  setAdminSessionCookie(response);
  return response;
}
