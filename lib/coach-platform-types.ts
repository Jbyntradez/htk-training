import type { CoachAccessRole } from "@/lib/role-permissions";

export type CoachRole = CoachAccessRole;

export type CoachProfile = {
  id: string;
  email: string;
  name: string;
  role: CoachRole;
};

export type TrainingStatus = "assigned" | "completed" | "skipped";

export type AthleteTrainingLevel = "beginner" | "intermediate" | "advanced" | "competitive";

export type CoachAthleteListItem = {
  profileId: string;
  email: string;
  fullName: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  createdAt: string;
  trainingLevel: AthleteTrainingLevel | null;
  sport: string | null;
  bmi: number | null;
  primaryGoals: string | null;
  weeklyAvailability: number | null;
  sessionDuration: number | null;
  equipmentAccess: string | null;
  latestReadinessScore: number | null;
  latestCheckInDate: string | null;
  latestPainFlag: boolean | null;
  latestTrainingTitle: string | null;
  latestTrainingStatus: TrainingStatus | null;
  latestTrainingDate: string | null;
};

export type CoachAthleteOnboardingProfile = {
  id: string;
  profileId: string;
  fullName: string;
  age: number;
  unitSystem: "lbs" | "kg";
  heightInches: number | null;
  heightCm: number | null;
  currentWeightLbs: number | null;
  currentWeightKg: number | null;
  bmi: number;
  primaryGoals: string;
  trainingLevel: AthleteTrainingLevel;
  injuriesCurrentPain: string | null;
  sport: string | null;
  weeklyAvailability: number;
  sessionDuration: number;
  equipmentAccess: string;
  clearedForExercise: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CoachCheckInHistoryItem = {
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

export type CoachTrainingHistoryItem = {
  id: string;
  assignedFor: string;
  title: string;
  description: string;
  focus: string;
  estimatedMinutes: number;
  status: TrainingStatus;
  completedAt: string | null;
  clientNotes: string | null;
  updatedAt: string;
};

export type CoachAthleteDetail = {
  athlete: CoachAthleteListItem;
  onboarding: CoachAthleteOnboardingProfile | null;
  checkIns: CoachCheckInHistoryItem[];
  training: CoachTrainingHistoryItem[];
};
