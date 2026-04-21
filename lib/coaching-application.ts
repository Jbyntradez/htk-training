export const coachingApplicationTimeFrames = [
  "30 days",
  "60 days",
  "90 days",
  "6+ months"
] as const;

export const coachingApplicationCommitmentLevels = [
  "Just exploring",
  "Somewhat serious",
  "Ready to commit",
  "Fully locked in"
] as const;

export type CoachingApplicationTimeFrame = (typeof coachingApplicationTimeFrames)[number];
export type CoachingApplicationCommitmentLevel =
  (typeof coachingApplicationCommitmentLevels)[number];

export type CoachingApplicationPayload = {
  name: string;
  email: string;
  primaryGoal: string;
  currentState: string;
  nextPhaseGoal: string;
  timeFrame: CoachingApplicationTimeFrame | "";
  commitmentLevel: CoachingApplicationCommitmentLevel | "";
  source?: string;
};

export type CoachingApplicationErrors = Partial<
  Record<keyof CoachingApplicationPayload, string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeCoachingApplicationPayload(
  input: unknown
): CoachingApplicationPayload {
  const payload = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};

  return {
    name: asText(payload.name),
    email: asText(payload.email).toLowerCase(),
    primaryGoal: asText(payload.primaryGoal),
    currentState: asText(payload.currentState),
    nextPhaseGoal: asText(payload.nextPhaseGoal),
    timeFrame: asText(payload.timeFrame) as CoachingApplicationPayload["timeFrame"],
    commitmentLevel: asText(payload.commitmentLevel) as CoachingApplicationPayload["commitmentLevel"],
    source: asText(payload.source) || "apply_page"
  };
}

export function validateCoachingApplicationPayload(input: unknown) {
  const payload = normalizeCoachingApplicationPayload(input);
  const errors: CoachingApplicationErrors = {};

  if (!payload.name) {
    errors.name = "Enter your name.";
  }

  if (!payload.email) {
    errors.email = "Enter your email.";
  } else if (!emailPattern.test(payload.email)) {
    errors.email = "Enter a valid email.";
  }

  if (!payload.primaryGoal) {
    errors.primaryGoal = "Share your primary goal.";
  }

  if (!payload.currentState) {
    errors.currentState = "Share where you are right now.";
  }

  if (!payload.nextPhaseGoal) {
    errors.nextPhaseGoal = "Describe where you want to be next.";
  }

  if (!coachingApplicationTimeFrames.includes(payload.timeFrame as CoachingApplicationTimeFrame)) {
    errors.timeFrame = "Choose a time frame.";
  }

  if (
    !coachingApplicationCommitmentLevels.includes(
      payload.commitmentLevel as CoachingApplicationCommitmentLevel
    )
  ) {
    errors.commitmentLevel = "Choose your current level of commitment.";
  }

  return {
    payload,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
