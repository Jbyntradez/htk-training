import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { isProductionEnvironment } from "@/lib/supabase";

const ADMIN_SESSION_COOKIE = "htk_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const APPLICATIONS_LOGIN_PATH = "/applications/login";

export class AdminAuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthConfigurationError";
  }
}

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!password) {
    throw new AdminAuthConfigurationError(
      "Missing ADMIN_PASSWORD environment variable."
    );
  }

  return password;
}

function createAdminSessionValue(password: string) {
  return createHash("sha256")
    .update(`htk-admin-session:v1:${password}`)
    .digest("hex");
}

function valuesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminPasswordConfigured() {
  try {
    getAdminPassword();
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(input: string) {
  const candidate = input.trim();

  if (!candidate) {
    return false;
  }

  const expectedPassword = getAdminPassword();

  return valuesMatch(
    createAdminSessionValue(candidate),
    createAdminSessionValue(expectedPassword)
  );
}

function getAdminSessionCookieValue() {
  return createAdminSessionValue(getAdminPassword());
}

function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProductionEnvironment(),
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE
  };
}

export async function isAdminAuthenticated() {
  if (!isAdminPasswordConfigured()) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!session) {
    return false;
  }

  return valuesMatch(session, getAdminSessionCookieValue());
}

export async function requireAdminAuth() {
  if (!(await isAdminAuthenticated())) {
    redirect(APPLICATIONS_LOGIN_PATH);
  }
}

export function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    getAdminSessionCookieValue(),
    getAdminSessionCookieOptions()
  );
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0
  });
}

export function getAdminLoginPath() {
  return APPLICATIONS_LOGIN_PATH;
}
