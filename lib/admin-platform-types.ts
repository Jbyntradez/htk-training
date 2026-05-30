import type { PlatformManagerRole, ProfileRole } from "@/lib/role-permissions";

export type AdminProfile = {
  id: string;
  email: string;
  name: string;
  role: PlatformManagerRole;
};

export type AdminProfileListItem = {
  id: string;
  email: string;
  fullName: string;
  role: ProfileRole;
  onboardingCompleted: boolean;
  createdAt: string;
};

export type AssignmentStatusCounts = {
  total: number;
  assigned: number;
  completed: number;
  skipped: number;
};

export type AdminOverview = {
  roleCounts: Record<ProfileRole, number> & {
    total: number;
  };
  onboardingCompleted: number;
  totalCheckIns: number;
  assignmentStatusCounts: AssignmentStatusCounts;
  recentProfiles: AdminProfileListItem[];
};
