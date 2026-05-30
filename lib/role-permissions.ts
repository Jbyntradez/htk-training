export const profileRoles = ["athlete", "coach", "admin"] as const;

export type ProfileRole = (typeof profileRoles)[number];
export type CoachAccessRole = Extract<ProfileRole, "coach" | "admin">;
export type PlatformManagerRole = Extract<ProfileRole, "admin">;

export function normalizeProfileRole(role: unknown): ProfileRole {
  const normalized = role as ProfileRole;

  return profileRoles.includes(normalized) ? normalized : "athlete";
}

export function canAccessCoachTools(role: unknown): role is CoachAccessRole {
  return role === "coach" || role === "admin";
}

export function canManagePlatform(role: unknown): role is PlatformManagerRole {
  return role === "admin";
}
