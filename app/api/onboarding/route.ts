import { NextResponse } from "next/server";
import {
  validateAthleteOnboardingPayload,
  type AthleteOnboardingRecord
} from "@/lib/athlete-onboarding";
import { OperatorPlatformError, requireOperatorProfile } from "@/lib/operator-platform";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type AthleteOnboardingRow = {
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
  training_level: "beginner" | "intermediate" | "advanced" | "competitive";
  injuries_current_pain: string | null;
  sport: string | null;
  weekly_availability: number;
  session_duration: number;
  equipment_access: string;
  cleared_for_exercise: boolean;
  created_at: string;
  updated_at: string;
};

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

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Onboarding request failed." }, { status: 500 });
}

function mapOnboarding(row: AthleteOnboardingRow) {
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

function recordToRow(profileId: string, record: AthleteOnboardingRecord) {
  return {
    profile_id: profileId,
    full_name: record.fullName,
    age: record.age,
    unit_system: record.unitSystem,
    height_inches: record.heightInches,
    height_cm: record.heightCm,
    current_weight_lbs: record.currentWeightLbs,
    current_weight_kg: record.currentWeightKg,
    bmi: record.bmi,
    primary_goals: record.primaryGoals,
    training_level: record.trainingLevel,
    injuries_current_pain: record.injuriesCurrentPain,
    sport: record.sport,
    weekly_availability: record.weeklyAvailability,
    session_duration: record.sessionDuration,
    equipment_access: record.equipmentAccess,
    cleared_for_exercise: record.clearedForExercise,
    updated_at: new Date().toISOString()
  };
}

export async function GET(request: Request) {
  try {
    const profile = await requireOperatorProfile(request);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("athlete_onboarding")
      .select(onboardingSelect)
      .eq("profile_id", profile.id)
      .maybeSingle();

    if (error) {
      throw new OperatorPlatformError(error.message, 500);
    }

    return NextResponse.json({
      onboarding: data ? mapOnboarding(data as unknown as AthleteOnboardingRow) : null
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const profile = await requireOperatorProfile(request);
    const body = await request.json().catch(() => null);
    const validation = validateAthleteOnboardingPayload(body);

    if (!validation.isValid || !validation.record) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted onboarding fields.",
          fieldErrors: validation.errors
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const completedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("athlete_onboarding")
      .upsert(recordToRow(profile.id, validation.record), { onConflict: "profile_id" })
      .select(onboardingSelect)
      .single();

    if (error || !data) {
      throw new OperatorPlatformError(error?.message ?? "Could not save onboarding.", 500);
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: validation.record.fullName,
        onboarding_completed: true,
        onboarding_completed_at: completedAt,
        updated_at: completedAt
      })
      .eq("id", profile.id);

    if (profileError) {
      throw new OperatorPlatformError(profileError.message, 500);
    }

    return NextResponse.json({
      ok: true,
      onboarding: mapOnboarding(data as unknown as AthleteOnboardingRow)
    });
  } catch (error) {
    return errorResponse(error);
  }
}
