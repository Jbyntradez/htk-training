import { OperatorPlatformError, requireOperatorProfile } from "@/lib/operator-platform";
import {
  canManagePlatform,
  normalizeProfileRole,
  type ProfileRole
} from "@/lib/role-permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  AdminOverview,
  AdminProfile,
  AdminProfileListItem,
  AssignmentStatusCounts
} from "@/lib/admin-platform-types";

type AdminProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: ProfileRole;
};

type PlatformProfileRow = AdminProfileRow & {
  onboarding_completed: boolean;
  created_at: string;
};

type AssignmentStatusRow = {
  status: "assigned" | "completed" | "skipped";
};

function getDisplayName(profile: Pick<AdminProfileRow, "email" | "full_name">) {
  if (profile.full_name?.trim()) {
    return profile.full_name.trim();
  }

  if (profile.email) {
    return profile.email.split("@")[0];
  }

  return "Unnamed profile";
}

function mapProfileListItem(row: PlatformProfileRow): AdminProfileListItem {
  return {
    id: row.id,
    email: row.email ?? "",
    fullName: getDisplayName(row),
    role: normalizeProfileRole(row.role),
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at
  };
}

function getRoleCounts(profiles: PlatformProfileRow[]) {
  const roleCounts = {
    athlete: 0,
    coach: 0,
    admin: 0,
    total: profiles.length
  };

  for (const profile of profiles) {
    roleCounts[normalizeProfileRole(profile.role)] += 1;
  }

  return roleCounts;
}

function getAssignmentStatusCounts(assignments: AssignmentStatusRow[]): AssignmentStatusCounts {
  const counts: AssignmentStatusCounts = {
    total: assignments.length,
    assigned: 0,
    completed: 0,
    skipped: 0
  };

  for (const assignment of assignments) {
    counts[assignment.status] += 1;
  }

  return counts;
}

export async function requireAdminProfile(request: Request): Promise<AdminProfile> {
  const operatorProfile = await requireOperatorProfile(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", operatorProfile.id)
    .single();

  if (error || !data) {
    throw new OperatorPlatformError(error?.message ?? "Could not load admin profile.", 500);
  }

  const profile = data as unknown as AdminProfileRow;
  const role = normalizeProfileRole(profile.role);

  if (!canManagePlatform(role)) {
    throw new OperatorPlatformError("Admin access required.", 403);
  }

  return {
    id: profile.id,
    email: profile.email ?? operatorProfile.email,
    name: getDisplayName(profile),
    role
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = getSupabaseAdmin();
  const [profileResult, checkInResult, assignmentResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, role, onboarding_completed, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("daily_checkins")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("client_assignments")
      .select("status")
      .limit(5000)
  ]);

  if (profileResult.error) {
    throw new OperatorPlatformError(profileResult.error.message, 500);
  }

  if (checkInResult.error) {
    throw new OperatorPlatformError(checkInResult.error.message, 500);
  }

  if (assignmentResult.error) {
    throw new OperatorPlatformError(assignmentResult.error.message, 500);
  }

  const profiles = (profileResult.data ?? []) as unknown as PlatformProfileRow[];
  const assignments = (assignmentResult.data ?? []) as unknown as AssignmentStatusRow[];

  return {
    roleCounts: getRoleCounts(profiles),
    onboardingCompleted: profiles.filter((profile) => profile.onboarding_completed).length,
    totalCheckIns: checkInResult.count ?? 0,
    assignmentStatusCounts: getAssignmentStatusCounts(assignments),
    recentProfiles: profiles.slice(0, 8).map(mapProfileListItem)
  };
}
