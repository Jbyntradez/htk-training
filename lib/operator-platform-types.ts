import type { ProfileRole } from "@/lib/role-permissions";

export type OperatorProfile = {
  id: string;
  authUserId: string;
  email: string;
  name: string;
  initials: string;
  role: ProfileRole;
  hasAccess: boolean;
  accessStatus: string;
  accessSource: string | null;
  accessExpiresAt: string | null;
};

export type TodayTrainingAssignment = {
  id: string;
  assignedFor: string;
  title: string;
  description: string;
  focus: string;
  estimatedMinutes: number;
  status: "assigned" | "completed" | "skipped";
  completedAt: string | null;
  clientNotes: string | null;
};

export type DailyCheckIn = {
  id: string;
  checkInDate: string;
  sleepQuality: number;
  energy: number;
  soreness: number;
  stress: number;
  painFlag: boolean;
  bodyNotes: string | null;
  readinessScore: number;
  updatedAt: string;
};

export type AthleteOnboardingSummary = {
  fullName: string;
  trainingLevel: "beginner" | "intermediate" | "advanced" | "competitive";
  sport: string | null;
  bmi: number;
  primaryGoals: string;
  weeklyAvailability: number;
  sessionDuration: number;
  equipmentAccess: string;
};

export type TodayDashboardState = {
  today: string;
  profile: OperatorProfile;
  assignment: TodayTrainingAssignment;
  checkIn: DailyCheckIn | null;
  onboarding: AthleteOnboardingSummary | null;
};
