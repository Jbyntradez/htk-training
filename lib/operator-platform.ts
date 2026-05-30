import type { User } from "@supabase/supabase-js";
import { canManagePlatform, normalizeProfileRole } from "@/lib/role-permissions";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import type {
  AthleteOnboardingSummary,
  DailyCheckIn,
  OperatorProfile,
  TodayDashboardState,
  TodayTrainingAssignment
} from "@/lib/operator-platform-types";

const HTK_TIME_ZONE = "America/Los_Angeles";

type AssignmentRow = {
  id: string;
  assigned_for: string;
  title: string;
  description: string;
  focus: string;
  estimated_minutes: number;
  status: "assigned" | "completed" | "skipped";
  completed_at: string | null;
  client_notes: string | null;
};

type CheckInRow = {
  id: string;
  checkin_date: string;
  sleep_quality: number;
  energy: number;
  soreness: number;
  stress: number;
  pain_flag: boolean;
  body_notes: string | null;
  readiness_score: number;
  updated_at: string;
};

type OnboardingSummaryRow = {
  full_name: string;
  training_level: "beginner" | "intermediate" | "advanced" | "competitive";
  sport: string | null;
  bmi: number;
  primary_goals: string;
  weekly_availability: number;
  session_duration: number;
  equipment_access: string;
};

type OperatorProfileRow = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  role: unknown;
  has_access: boolean | null;
  access_status: string | null;
  access_source: string | null;
  access_expires_at: string | null;
};

export class OperatorPlatformError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function getTodayDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HTK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

function getNameFromUser(user: User) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  if (metadataName.trim()) {
    return metadataName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "HTK Operator";
}

function getInitials(name: string, email: string | null | undefined) {
  const source = name.trim() || email || "HTK Operator";
  const words = source
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "HTK";
}

function mapAssignment(row: AssignmentRow): TodayTrainingAssignment {
  return {
    id: row.id,
    assignedFor: row.assigned_for,
    title: row.title,
    description: row.description,
    focus: row.focus,
    estimatedMinutes: row.estimated_minutes,
    status: row.status,
    completedAt: row.completed_at,
    clientNotes: row.client_notes
  };
}

function mapCheckIn(row: CheckInRow): DailyCheckIn {
  return {
    id: row.id,
    checkInDate: row.checkin_date,
    sleepQuality: row.sleep_quality,
    energy: row.energy,
    soreness: row.soreness,
    stress: row.stress,
    painFlag: row.pain_flag,
    bodyNotes: row.body_notes,
    readinessScore: row.readiness_score,
    updatedAt: row.updated_at
  };
}

function mapOnboardingSummary(row: OnboardingSummaryRow): AthleteOnboardingSummary {
  return {
    fullName: row.full_name,
    trainingLevel: row.training_level,
    sport: row.sport,
    bmi: row.bmi,
    primaryGoals: row.primary_goals,
    weeklyAvailability: row.weekly_availability,
    sessionDuration: row.session_duration,
    equipmentAccess: row.equipment_access
  };
}

function asRating(value: unknown, label: string) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new OperatorPlatformError(`${label} must be a 1-5 rating.`, 400);
  }

  return number;
}

function calculateReadinessScore({
  sleepQuality,
  energy,
  soreness,
  stress,
  painFlag
}: {
  sleepQuality: number;
  energy: number;
  soreness: number;
  stress: number;
  painFlag: boolean;
}) {
  const raw = sleepQuality + energy + (6 - soreness) + (6 - stress);
  const score = Math.round((raw / 20) * 100) - (painFlag ? 15 : 0);

  return Math.max(0, Math.min(100, score));
}

function accessWindowIsActive(expiresAt: string | null) {
  if (!expiresAt) {
    return true;
  }

  const timestamp = new Date(expiresAt).getTime();

  return Number.isFinite(timestamp) && timestamp > Date.now();
}

export async function requireOperatorProfile(request: Request): Promise<OperatorProfile> {
  if (!hasSupabaseConfig()) {
    throw new OperatorPlatformError("Supabase is not configured.", 503);
  }

  const token = getBearerToken(request);

  if (!token) {
    throw new OperatorPlatformError("Sign in required.", 401);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new OperatorPlatformError("Your session expired. Sign in again.", 401);
  }

  const user = data.user;
  const now = new Date().toISOString();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        clerk_user_id: user.id,
        email: user.email ?? null,
        updated_at: now
      },
      { onConflict: "clerk_user_id" }
    )
    .select(
      "id, clerk_user_id, email, full_name, role, has_access, access_status, access_source, access_expires_at"
    )
    .single();

  if (profileError || !profile) {
    throw new OperatorPlatformError(
      profileError?.message ?? "Could not load operator profile.",
      500
    );
  }

  const profileRow = profile as unknown as OperatorProfileRow;
  const role = normalizeProfileRole(profileRow.role);
  const profileName =
    typeof profileRow.full_name === "string" && profileRow.full_name.trim()
      ? profileRow.full_name.trim()
      : "";
  const name = profileName || getNameFromUser(user);
  const accessActive = Boolean(profileRow.has_access) && accessWindowIsActive(profileRow.access_expires_at);
  const hasAccess = accessActive || canManagePlatform(role);

  return {
    id: profileRow.id,
    authUserId: profileRow.clerk_user_id,
    email: profileRow.email ?? user.email ?? "",
    name,
    initials: getInitials(name, profileRow.email ?? user.email),
    role,
    hasAccess,
    accessStatus: canManagePlatform(role)
      ? "admin"
      : Boolean(profileRow.has_access) && !accessActive
        ? "expired"
        : profileRow.access_status ?? "none",
    accessSource: canManagePlatform(role) ? "role" : profileRow.access_source,
    accessExpiresAt: profileRow.access_expires_at
  };
}

export function requireAthleteDashboardAccess(profile: OperatorProfile) {
  if (!profile.hasAccess) {
    throw new OperatorPlatformError("Access required to use the HTK athlete dashboard.", 402);
  }
}

async function ensureTodayAssignment(profileId: string, today: string) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from("client_assignments")
    .select(
      "id, assigned_for, title, description, focus, estimated_minutes, status, completed_at, client_notes"
    )
    .eq("profile_id", profileId)
    .eq("assigned_for", today)
    .maybeSingle();

  if (readError) {
    throw new OperatorPlatformError(readError.message, 500);
  }

  if (existing) {
    return mapAssignment(existing as AssignmentRow);
  }

  const { data: inserted, error: insertError } = await supabase
    .from("client_assignments")
    .insert({
      profile_id: profileId,
      assigned_for: today,
      title: "HTK Baseline Operator Session",
      description:
        "Complete today's assigned training block, then log a short note on output, fatigue, and anything your coach should know.",
      focus: "Strength, conditioning, movement quality",
      estimated_minutes: 45
    })
    .select(
      "id, assigned_for, title, description, focus, estimated_minutes, status, completed_at, client_notes"
    )
    .single();

  if (insertError || !inserted) {
    throw new OperatorPlatformError(
      insertError?.message ?? "Could not assign today's training.",
      500
    );
  }

  return mapAssignment(inserted as AssignmentRow);
}

async function getTodayCheckIn(profileId: string, today: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("daily_checkins")
    .select(
      "id, checkin_date, sleep_quality, energy, soreness, stress, pain_flag, body_notes, readiness_score, updated_at"
    )
    .eq("profile_id", profileId)
    .eq("checkin_date", today)
    .maybeSingle();

  if (error) {
    throw new OperatorPlatformError(error.message, 500);
  }

  return data ? mapCheckIn(data as CheckInRow) : null;
}

async function getOnboardingSummary(profileId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("athlete_onboarding")
    .select(
      "full_name, training_level, sport, bmi, primary_goals, weekly_availability, session_duration, equipment_access"
    )
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new OperatorPlatformError(error.message, 500);
  }

  return data ? mapOnboardingSummary(data as unknown as OnboardingSummaryRow) : null;
}

export async function getTodayDashboardState(
  profile: OperatorProfile
): Promise<TodayDashboardState> {
  requireAthleteDashboardAccess(profile);

  const today = getTodayDate();
  const assignment = await ensureTodayAssignment(profile.id, today);
  const checkIn = await getTodayCheckIn(profile.id, today);
  const onboarding = await getOnboardingSummary(profile.id);

  return {
    today,
    profile,
    assignment,
    checkIn,
    onboarding
  };
}

export async function saveDailyCheckIn(profile: OperatorProfile, input: unknown) {
  requireAthleteDashboardAccess(profile);

  const payload = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const sleepQuality = asRating(payload.sleepQuality, "Sleep quality");
  const energy = asRating(payload.energy, "Energy");
  const soreness = asRating(payload.soreness, "Soreness");
  const stress = asRating(payload.stress, "Stress");
  const painFlag = Boolean(payload.painFlag);
  const bodyNotes = typeof payload.bodyNotes === "string" ? payload.bodyNotes.trim() : "";
  const readinessScore = calculateReadinessScore({
    sleepQuality,
    energy,
    soreness,
    stress,
    painFlag
  });

  const today = getTodayDate();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("daily_checkins")
    .upsert(
      {
        profile_id: profile.id,
        checkin_date: today,
        sleep_quality: sleepQuality,
        energy,
        soreness,
        stress,
        pain_flag: painFlag,
        body_notes: bodyNotes || null,
        readiness_score: readinessScore,
        updated_at: new Date().toISOString()
      },
      { onConflict: "profile_id,checkin_date" }
    )
    .select(
      "id, checkin_date, sleep_quality, energy, soreness, stress, pain_flag, body_notes, readiness_score, updated_at"
    )
    .single();

  if (error || !data) {
    throw new OperatorPlatformError(error?.message ?? "Could not save check-in.", 500);
  }

  return mapCheckIn(data as CheckInRow);
}

export async function completeTrainingAssignment(profile: OperatorProfile, input: unknown) {
  requireAthleteDashboardAccess(profile);

  const payload = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const assignmentId = typeof payload.assignmentId === "string" ? payload.assignmentId : "";
  const clientNotes = typeof payload.clientNotes === "string" ? payload.clientNotes.trim() : "";

  if (!assignmentId) {
    throw new OperatorPlatformError("Training assignment is required.", 400);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("client_assignments")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      client_notes: clientNotes || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", assignmentId)
    .eq("profile_id", profile.id)
    .select(
      "id, assigned_for, title, description, focus, estimated_minutes, status, completed_at, client_notes"
    )
    .single();

  if (error || !data) {
    throw new OperatorPlatformError(error?.message ?? "Could not complete training.", 500);
  }

  return mapAssignment(data as AssignmentRow);
}
