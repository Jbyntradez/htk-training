import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function parseEnvFile(content) {
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function loadEnvFromFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);

  try {
    const content = await readFile(filePath, "utf8");
    parseEnvFile(content);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first."
    );
  }

  if (!/^https?:\/\//.test(url) || serviceKey.split(".").length !== 3) {
    throw new Error(
      "Invalid Supabase env vars. NEXT_PUBLIC_SUPABASE_URL must be the project URL and SUPABASE_SERVICE_ROLE_KEY must be the service role JWT."
    );
  }

  return { url, serviceKey };
}

function getLocalApplicationsPath() {
  return path.join(process.cwd(), "data", "coaching-applications.ndjson");
}

function mapRecordToRow(record) {
  return {
    id: record.id,
    created_at: record.createdAt,
    source: record.source || "apply_page",
    name: record.name,
    email: record.email,
    primary_goal: record.primaryGoal,
    current_state: record.currentState,
    next_phase_goal: record.nextPhaseGoal,
    time_frame: record.timeFrame,
    commitment_level: record.commitmentLevel
  };
}

function getUniqueLeads(records) {
  return [...new Map(records.map((record) => [record.email, record])).values()].map((record) => ({
    email: record.email,
    source: "coaching_application"
  }));
}

async function main() {
  await loadEnvFromFile(".env.local");
  await loadEnvFromFile(".env");

  const { url, serviceKey } = getSupabaseConfig();
  const localApplicationsPath = getLocalApplicationsPath();

  const raw = await readFile(localApplicationsPath, "utf8").catch((error) => {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      throw new Error(`No local backup file found at ${localApplicationsPath}`);
    }

    throw error;
  });

  const records = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  if (records.length === 0) {
    console.log(`No local coaching applications found in ${localApplicationsPath}`);
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { error: applicationsError } = await supabase
    .from("coaching_applications")
    .upsert(records.map(mapRecordToRow), { onConflict: "id" });

  if (applicationsError) {
    throw new Error(`Supabase import failed: ${applicationsError.message}`);
  }

  const leads = getUniqueLeads(records);
  const { error: leadsError } = await supabase
    .from("leads")
    .upsert(leads, { onConflict: "email" });

  if (leadsError) {
    console.warn(`[coaching-applications] Lead sync warning: ${leadsError.message}`);
  }

  console.log(
    `Imported ${records.length} coaching application${records.length === 1 ? "" : "s"} into Supabase from ${localApplicationsPath}`
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
