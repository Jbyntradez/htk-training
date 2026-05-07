import { randomUUID } from "node:crypto";
import { mkdir, appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import type { CoachingApplicationPayload } from "@/lib/coaching-application";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

export type StoredCoachingApplication = {
  id: string;
  createdAt: string;
  storage: "supabase" | "local_file";
  source: string;
  name: string;
  email: string;
  primaryGoal: string;
  currentState: string;
  nextPhaseGoal: string;
  timeFrame: string;
  commitmentLevel: string;
};

export type CoachingApplicationsListResult = {
  applications: StoredCoachingApplication[];
  source: "supabase" | "local_file";
  fallback: boolean;
  issue?: string;
};

const localApplicationsPath = path.join(
  process.cwd(),
  "data",
  "coaching-applications.ndjson"
);

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "Supabase request failed.";
}

function mapPayloadToStored(
  payload: CoachingApplicationPayload,
  base: Pick<StoredCoachingApplication, "id" | "createdAt" | "storage">
): StoredCoachingApplication {
  return {
    ...base,
    source: payload.source ?? "apply_page",
    name: payload.name,
    email: payload.email,
    primaryGoal: payload.primaryGoal,
    currentState: payload.currentState,
    nextPhaseGoal: payload.nextPhaseGoal,
    timeFrame: payload.timeFrame,
    commitmentLevel: payload.commitmentLevel
  };
}

async function saveLocally(payload: CoachingApplicationPayload): Promise<StoredCoachingApplication> {
  await mkdir(path.dirname(localApplicationsPath), { recursive: true });

  const record = mapPayloadToStored(payload, {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    storage: "local_file"
  });

  await appendFile(localApplicationsPath, `${JSON.stringify(record)}\n`, "utf8");

  return record;
}

async function listLocalApplications(): Promise<StoredCoachingApplication[]> {
  try {
    const raw = await readFile(localApplicationsPath, "utf8");

    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredCoachingApplication)
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function saveToSupabase(
  payload: CoachingApplicationPayload
): Promise<StoredCoachingApplication> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("coaching_applications")
    .insert({
      name: payload.name,
      email: payload.email,
      primary_goal: payload.primaryGoal,
      current_state: payload.currentState,
      next_phase_goal: payload.nextPhaseGoal,
      time_frame: payload.timeFrame,
      commitment_level: payload.commitmentLevel,
      source: payload.source ?? "apply_page"
    })
    .select("id, created_at")
    .single();

  if (error) {
    throw error;
  }

  await supabase
    .from("leads")
    .upsert({ email: payload.email, source: "coaching_application" }, { onConflict: "email" });

  return mapPayloadToStored(payload, {
    id: data.id,
    createdAt: data.created_at,
    storage: "supabase"
  });
}

async function listSupabaseApplications(): Promise<StoredCoachingApplication[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("coaching_applications")
    .select(
      "id, created_at, source, name, email, primary_goal, current_state, next_phase_goal, time_frame, commitment_level"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    storage: "supabase",
    source: row.source,
    name: row.name,
    email: row.email,
    primaryGoal: row.primary_goal,
    currentState: row.current_state,
    nextPhaseGoal: row.next_phase_goal,
    timeFrame: row.time_frame,
    commitmentLevel: row.commitment_level
  }));
}

export async function saveCoachingApplication(
  payload: CoachingApplicationPayload
): Promise<StoredCoachingApplication> {
  if (hasSupabaseConfig()) {
    try {
      return await saveToSupabase(payload);
    } catch (error) {
      console.error(
        `[coaching-applications] Supabase save failed, using local fallback: ${getErrorMessage(error)}`
      );
      return saveLocally(payload);
    }
  }

  return saveLocally(payload);
}

export async function listCoachingApplications(): Promise<StoredCoachingApplication[]> {
  const result = await listCoachingApplicationsWithSource();

  return result.applications;
}

export async function listCoachingApplicationsWithSource(): Promise<CoachingApplicationsListResult> {
  if (hasSupabaseConfig()) {
    try {
      return {
        applications: await listSupabaseApplications(),
        source: "supabase",
        fallback: false
      };
    } catch (error) {
      console.error(
        `[coaching-applications] Supabase read failed, using local fallback: ${getErrorMessage(error)}`
      );
      return {
        applications: await listLocalApplications(),
        source: "local_file",
        fallback: true,
        issue: getErrorMessage(error)
      };
    }
  }

  return {
    applications: await listLocalApplications(),
    source: "local_file",
    fallback: false
  };
}

export function getCoachingApplicationStorageMode() {
  return hasSupabaseConfig() ? "supabase_with_local_fallback" : "local_file";
}

export function getLocalCoachingApplicationsPath() {
  return localApplicationsPath;
}
