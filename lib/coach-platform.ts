import { OperatorPlatformError, requireOperatorProfile } from "@/lib/operator-platform";
import { canAccessCoachTools, normalizeProfileRole, type ProfileRole } from "@/lib/role-permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  AthleteTrainingLevel,
  CoachAthleteDetail,
  CoachAthleteListItem,
  CoachAthleteOnboardingProfile,
  CoachCheckInHistoryItem,
  CoachProfile,
  CoachTrainingHistoryItem,
  TrainingStatus
} from "@/lib/coach-platform-types";

type CoachProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: ProfileRole;
};

type AthleteProfileRow = CoachProfileRow & {
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  created_at: string;
};

type OnboardingRow = {
  id: string;
  profile_id: string;
  full_name: string;
  age: number;
  unit_system: "lbs" | "kg";
  height_inches: number | null;
  height_cm: number | null;
  current_weight_lbs: number | null;
  current_weight_kg: number | null;
  bmi: number;
  primary_goals: string;
  training_level: AthleteTrainingLevel;
  injuries_current_pain: string | null;
  sport: string | null;
  weekly_availability: number;
  session_duration: number;
  equipment_access: string;
  cleared_for_exercise: boolean;
  created_at: string;
  updated_at: string;
};

type CheckInHistoryRow = {
  id: string;
  profile_id: string;
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

type TrainingHistoryRow = {
  id: string;
  profile_id: string;
  assigned_for: string;
  title: string;
  description: string;
  focus: string;
  estimated_minutes: number;
  status: TrainingStatus;
  completed_at: string | null;
  client_notes: string | null;
  updated_at: string;
};

const athleteProfileSelect = [
  "id",
  "email",
  "full_name",
  "onboarding_completed",
  "onboarding_completed_at",
  "created_at",
  "role"
].join(", ");

const onboardingSelect = [
  "id",
  "profile_id",
  "full_name",
  "age",
  "unit_system",
  "height_inches",
  "height_cm",
  "current_weight_lbs",
  "current_weight_kg",
  "bmi",
  "primary_goals",
  "training_level",
  "injuries_current_pain",
  "sport",
  "weekly_availability",
  "session_duration",
  "equipment_access",
  "cleared_for_exercise",
  "created_at",
  "updated_at"
].join(", ");

const checkInSelect = [
  "id",
  "profile_id",
  "checkin_date",
  "sleep_quality",
  "energy",
  "soreness",
  "stress",
  "pain_flag",
  "body_notes",
  "readiness_score",
  "updated_at"
].join(", ");

const trainingSelect = [
  "id",
  "profile_id",
  "assigned_for",
  "title",
  "description",
  "focus",
  "estimated_minutes",
  "status",
  "completed_at",
  "client_notes",
  "updated_at"
].join(", ");

function getDisplayName(profile: Pick<CoachProfileRow, "email" | "full_name">) {
  if (profile.full_name?.trim()) {
    return profile.full_name.trim();
  }

  if (profile.email) {
    return profile.email.split("@")[0];
  }

  return "Unnamed athlete";
}

function mapOnboarding(row: OnboardingRow): CoachAthleteOnboardingProfile {
  return {
    id: row.id,
    profileId: row.profile_id,
    fullName: row.full_name,
    age: row.age,
    unitSystem: row.unit_system,
    heightInches: row.height_inches,
    heightCm: row.height_cm,
    currentWeightLbs: row.current_weight_lbs,
    currentWeightKg: row.current_weight_kg,
    bmi: row.bmi,
    primaryGoals: row.primary_goals,
    trainingLevel: row.training_level,
    injuriesCurrentPain: row.injuries_current_pain,
    sport: row.sport,
    weeklyAvailability: row.weekly_availability,
    sessionDuration: row.session_duration,
    equipmentAccess: row.equipment_access,
    clearedForExercise: row.cleared_for_exercise,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCheckIn(row: CheckInHistoryRow): CoachCheckInHistoryItem {
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

function mapTraining(row: TrainingHistoryRow): CoachTrainingHistoryItem {
  return {
    id: row.id,
    assignedFor: row.assigned_for,
    title: row.title,
    description: row.description,
    focus: row.focus,
    estimatedMinutes: row.estimated_minutes,
    status: row.status,
    completedAt: row.completed_at,
    clientNotes: row.client_notes,
    updatedAt: row.updated_at
  };
}

function mapAthleteListItem({
  profile,
  onboarding,
  latestCheckIn,
  latestTraining
}: {
  profile: AthleteProfileRow;
  onboarding: OnboardingRow | null;
  latestCheckIn: CheckInHistoryRow | null;
  latestTraining: TrainingHistoryRow | null;
}): CoachAthleteListItem {
  return {
    profileId: profile.id,
    email: profile.email ?? "",
    fullName: onboarding?.full_name ?? getDisplayName(profile),
    onboardingCompleted: profile.onboarding_completed,
    onboardingCompletedAt: profile.onboarding_completed_at,
    createdAt: profile.created_at,
    trainingLevel: onboarding?.training_level ?? null,
    sport: onboarding?.sport ?? null,
    bmi: onboarding?.bmi ?? null,
    primaryGoals: onboarding?.primary_goals ?? null,
    weeklyAvailability: onboarding?.weekly_availability ?? null,
    sessionDuration: onboarding?.session_duration ?? null,
    equipmentAccess: onboarding?.equipment_access ?? null,
    latestReadinessScore: latestCheckIn?.readiness_score ?? null,
    latestCheckInDate: latestCheckIn?.checkin_date ?? null,
    latestPainFlag: latestCheckIn?.pain_flag ?? null,
    latestTrainingTitle: latestTraining?.title ?? null,
    latestTrainingStatus: latestTraining?.status ?? null,
    latestTrainingDate: latestTraining?.assigned_for ?? null
  };
}

function firstByProfileId<T extends { profile_id: string }>(rows: T[]) {
  const map = new Map<string, T>();

  for (const row of rows) {
    if (!map.has(row.profile_id)) {
      map.set(row.profile_id, row);
    }
  }

  return map;
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown) {
  const number = typeof value === "string" ? Number(value.trim()) : Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    return null;
  }

  return number;
}

function isDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export async function requireCoachProfile(request: Request): Promise<CoachProfile> {
  const operatorProfile = await requireOperatorProfile(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", operatorProfile.id)
    .single();

  if (error || !data) {
    throw new OperatorPlatformError(error?.message ?? "Could not load coach profile.", 500);
  }

  const profile = data as unknown as CoachProfileRow;
  const role = normalizeProfileRole(profile.role);

  if (!canAccessCoachTools(role)) {
    throw new OperatorPlatformError("Coach access required.", 403);
  }

  return {
    id: profile.id,
    email: profile.email ?? operatorProfile.email,
    name: getDisplayName(profile),
    role
  };
}

export async function listCoachAthletes(): Promise<CoachAthleteListItem[]> {
  const supabase = getSupabaseAdmin();
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(athleteProfileSelect)
    .eq("role", "athlete")
    .order("created_at", { ascending: false });

  if (profileError) {
    throw new OperatorPlatformError(profileError.message, 500);
  }

  const profiles = (profileData ?? []) as unknown as AthleteProfileRow[];
  const profileIds = profiles.map((profile) => profile.id);

  if (profileIds.length === 0) {
    return [];
  }

  const [onboardingResult, checkInResult, trainingResult] = await Promise.all([
    supabase
      .from("athlete_onboarding")
      .select(onboardingSelect)
      .in("profile_id", profileIds),
    supabase
      .from("daily_checkins")
      .select(checkInSelect)
      .in("profile_id", profileIds)
      .order("checkin_date", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(1000),
    supabase
      .from("client_assignments")
      .select(trainingSelect)
      .in("profile_id", profileIds)
      .order("assigned_for", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(1000)
  ]);

  if (onboardingResult.error) {
    throw new OperatorPlatformError(onboardingResult.error.message, 500);
  }

  if (checkInResult.error) {
    throw new OperatorPlatformError(checkInResult.error.message, 500);
  }

  if (trainingResult.error) {
    throw new OperatorPlatformError(trainingResult.error.message, 500);
  }

  const onboardingByProfile = new Map(
    ((onboardingResult.data ?? []) as unknown as OnboardingRow[]).map((row) => [row.profile_id, row])
  );
  const checkInByProfile = firstByProfileId(
    (checkInResult.data ?? []) as unknown as CheckInHistoryRow[]
  );
  const trainingByProfile = firstByProfileId(
    (trainingResult.data ?? []) as unknown as TrainingHistoryRow[]
  );

  return profiles.map((profile) =>
    mapAthleteListItem({
      profile,
      onboarding: onboardingByProfile.get(profile.id) ?? null,
      latestCheckIn: checkInByProfile.get(profile.id) ?? null,
      latestTraining: trainingByProfile.get(profile.id) ?? null
    })
  );
}

export async function getCoachAthleteDetail(profileId: string): Promise<CoachAthleteDetail> {
  if (!profileId) {
    throw new OperatorPlatformError("Athlete profile is required.", 400);
  }

  const supabase = getSupabaseAdmin();
  const [profileResult, onboardingResult, checkInResult, trainingResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(athleteProfileSelect)
      .eq("id", profileId)
      .eq("role", "athlete")
      .maybeSingle(),
    supabase
      .from("athlete_onboarding")
      .select(onboardingSelect)
      .eq("profile_id", profileId)
      .maybeSingle(),
    supabase
      .from("daily_checkins")
      .select(checkInSelect)
      .eq("profile_id", profileId)
      .order("checkin_date", { ascending: false })
      .limit(30),
    supabase
      .from("client_assignments")
      .select(trainingSelect)
      .eq("profile_id", profileId)
      .order("assigned_for", { ascending: false })
      .limit(30)
  ]);

  if (profileResult.error) {
    throw new OperatorPlatformError(profileResult.error.message, 500);
  }

  if (!profileResult.data) {
    throw new OperatorPlatformError("Athlete not found.", 404);
  }

  if (onboardingResult.error) {
    throw new OperatorPlatformError(onboardingResult.error.message, 500);
  }

  if (checkInResult.error) {
    throw new OperatorPlatformError(checkInResult.error.message, 500);
  }

  if (trainingResult.error) {
    throw new OperatorPlatformError(trainingResult.error.message, 500);
  }

  const profile = profileResult.data as unknown as AthleteProfileRow;
  const onboarding = onboardingResult.data as unknown as OnboardingRow | null;
  const checkIns = (checkInResult.data ?? []) as unknown as CheckInHistoryRow[];
  const training = (trainingResult.data ?? []) as unknown as TrainingHistoryRow[];
  const latestCheckIn = checkIns[0] ?? null;
  const latestTraining = training[0] ?? null;

  return {
    athlete: mapAthleteListItem({
      profile,
      onboarding,
      latestCheckIn,
      latestTraining
    }),
    onboarding: onboarding ? mapOnboarding(onboarding) : null,
    checkIns: checkIns.map(mapCheckIn),
    training: training.map(mapTraining)
  };
}

export async function assignCoachTrainingSession(input: unknown): Promise<CoachTrainingHistoryItem> {
  const payload = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const profileId = asText(payload.profileId ?? payload.profile_id);
  const assignedFor = asText(payload.assignedFor ?? payload.assigned_for);
  const title = asText(payload.title);
  const description = asText(payload.description);
  const focus = asText(payload.focus);
  const estimatedMinutes = asPositiveInteger(payload.estimatedMinutes ?? payload.estimated_minutes);

  if (!profileId) {
    throw new OperatorPlatformError("Athlete is required.", 400);
  }

  if (!isDateInput(assignedFor)) {
    throw new OperatorPlatformError("Assigned date must use YYYY-MM-DD.", 400);
  }

  if (!title || title.length > 160) {
    throw new OperatorPlatformError("Title is required and must be 160 characters or fewer.", 400);
  }

  if (!description || description.length > 2000) {
    throw new OperatorPlatformError("Description is required and must be 2000 characters or fewer.", 400);
  }

  if (!focus || focus.length > 500) {
    throw new OperatorPlatformError("Focus is required and must be 500 characters or fewer.", 400);
  }

  if (!estimatedMinutes || estimatedMinutes > 240) {
    throw new OperatorPlatformError("Estimated minutes must be between 1 and 240.", 400);
  }

  const supabase = getSupabaseAdmin();
  const { data: athlete, error: athleteError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .eq("role", "athlete")
    .maybeSingle();

  if (athleteError) {
    throw new OperatorPlatformError(athleteError.message, 500);
  }

  if (!athlete) {
    throw new OperatorPlatformError("Athlete not found.", 404);
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("client_assignments")
    .upsert(
      {
        profile_id: profileId,
        assigned_for: assignedFor,
        title,
        description,
        focus,
        estimated_minutes: estimatedMinutes,
        status: "assigned",
        completed_at: null,
        client_notes: null,
        updated_at: now
      },
      { onConflict: "profile_id,assigned_for" }
    )
    .select(trainingSelect)
    .single();

  if (error || !data) {
    throw new OperatorPlatformError(error?.message ?? "Could not save training assignment.", 500);
  }

  return mapTraining(data as unknown as TrainingHistoryRow);
}
