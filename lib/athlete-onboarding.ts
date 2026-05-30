export const athleteUnitSystems = ["lbs", "kg"] as const;

export const athleteTrainingLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "competitive"
] as const;

export type AthleteUnitSystem = (typeof athleteUnitSystems)[number];
export type AthleteTrainingLevel = (typeof athleteTrainingLevels)[number];

export type AthleteOnboardingPayload = {
  fullName: string;
  age: number | null;
  unitSystem: AthleteUnitSystem | "";
  height: number | null;
  currentWeight: number | null;
  primaryGoals: string;
  trainingLevel: AthleteTrainingLevel | "";
  injuriesCurrentPain: string;
  sport: string;
  weeklyAvailability: number | null;
  sessionDuration: number | null;
  equipmentAccess: string;
  clearedForExercise: boolean | null;
};

type CompleteAthleteOnboardingPayload = {
  fullName: string;
  age: number;
  unitSystem: AthleteUnitSystem;
  height: number;
  currentWeight: number;
  primaryGoals: string;
  trainingLevel: AthleteTrainingLevel;
  injuriesCurrentPain: string;
  sport: string;
  weeklyAvailability: number;
  sessionDuration: number;
  equipmentAccess: string;
  clearedForExercise: boolean;
};

export type AthleteOnboardingRecord = {
  fullName: string;
  age: number;
  unitSystem: AthleteUnitSystem;
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
};

export type AthleteOnboardingErrors = Partial<
  Record<keyof AthleteOnboardingPayload | "bmi", string>
>;

const textLimits = {
  fullName: 120,
  primaryGoals: 1000,
  injuriesCurrentPain: 1000,
  sport: 120,
  equipmentAccess: 1000
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true" || value === "yes") {
      return true;
    }

    if (value === "false" || value === "no") {
      return false;
    }
  }

  return null;
}

function isUnitSystem(value: string): value is AthleteUnitSystem {
  return athleteUnitSystems.includes(value as AthleteUnitSystem);
}

function isTrainingLevel(value: string): value is AthleteTrainingLevel {
  return athleteTrainingLevels.includes(value as AthleteTrainingLevel);
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateBmi(input:
  | {
      unitSystem: "lbs";
      heightInches: number;
      currentWeightLbs: number;
    }
  | {
      unitSystem: "kg";
      heightCm: number;
      currentWeightKg: number;
    }
) {
  if (input.unitSystem === "lbs") {
    return roundToTwo((703 * input.currentWeightLbs) / input.heightInches ** 2);
  }

  const heightMeters = input.heightCm / 100;

  return roundToTwo(input.currentWeightKg / heightMeters ** 2);
}

export function normalizeAthleteOnboardingPayload(input: unknown): AthleteOnboardingPayload {
  const payload = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const unitSystem = asText(payload.unitSystem ?? payload.unit_system);
  const trainingLevel = asText(payload.trainingLevel ?? payload.training_level);

  return {
    fullName: asText(payload.fullName ?? payload.full_name),
    age: asNumber(payload.age),
    unitSystem: isUnitSystem(unitSystem) ? unitSystem : "",
    height: asNumber(
      payload.height ??
      payload.heightInches ??
      payload.height_inches ??
      payload.heightCm ??
      payload.height_cm
    ),
    currentWeight: asNumber(
      payload.currentWeight ??
      payload.currentWeightLbs ??
      payload.current_weight_lbs ??
      payload.currentWeightKg ??
      payload.current_weight_kg
    ),
    primaryGoals: asText(payload.primaryGoals ?? payload.primary_goals),
    trainingLevel: isTrainingLevel(trainingLevel) ? trainingLevel : "",
    injuriesCurrentPain: asText(payload.injuriesCurrentPain ?? payload.injuries_current_pain),
    sport: asText(payload.sport),
    weeklyAvailability: asNumber(payload.weeklyAvailability ?? payload.weekly_availability),
    sessionDuration: asNumber(payload.sessionDuration ?? payload.session_duration),
    equipmentAccess: asText(payload.equipmentAccess ?? payload.equipment_access),
    clearedForExercise: asBoolean(payload.clearedForExercise ?? payload.cleared_for_exercise)
  };
}

function validateText(
  errors: AthleteOnboardingErrors,
  field: keyof AthleteOnboardingPayload,
  value: string,
  label: string,
  maxLength: number,
  required = true
) {
  if (required && !value) {
    errors[field] = `${label} is required.`;
    return;
  }

  if (value.length > maxLength) {
    errors[field] = `${label} must be ${maxLength} characters or fewer.`;
  }
}

function validateIntegerRange(
  errors: AthleteOnboardingErrors,
  field: keyof AthleteOnboardingPayload,
  value: number | null,
  label: string,
  min: number,
  max: number
) {
  if (value === null) {
    errors[field] = `${label} is required.`;
    return;
  }

  if (!Number.isInteger(value) || value < min || value > max) {
    errors[field] = `${label} must be between ${min} and ${max}.`;
  }
}

function validateNumberRange(
  errors: AthleteOnboardingErrors,
  field: keyof AthleteOnboardingPayload,
  value: number | null,
  label: string,
  min: number,
  max: number
) {
  if (value === null) {
    errors[field] = `${label} is required.`;
    return;
  }

  if (value < min || value > max) {
    errors[field] = `${label} must be between ${min} and ${max}.`;
  }
}

export function validateAthleteOnboardingPayload(input: unknown) {
  const payload = normalizeAthleteOnboardingPayload(input);
  const errors: AthleteOnboardingErrors = {};

  validateText(errors, "fullName", payload.fullName, "Full name", textLimits.fullName);
  validateIntegerRange(errors, "age", payload.age, "Age", 13, 100);

  if (!payload.unitSystem) {
    errors.unitSystem = "Choose lbs or kg.";
  }

  if (payload.unitSystem === "lbs") {
    validateNumberRange(errors, "height", payload.height, "Height in inches", 36, 96);
    validateNumberRange(errors, "currentWeight", payload.currentWeight, "Current weight in pounds", 50, 700);
  }

  if (payload.unitSystem === "kg") {
    validateNumberRange(errors, "height", payload.height, "Height in centimeters", 90, 245);
    validateNumberRange(errors, "currentWeight", payload.currentWeight, "Current weight in kilograms", 25, 320);
  }

  validateText(
    errors,
    "primaryGoals",
    payload.primaryGoals,
    "Primary goals",
    textLimits.primaryGoals
  );

  if (!payload.trainingLevel) {
    errors.trainingLevel = "Choose a training level.";
  }

  validateText(
    errors,
    "injuriesCurrentPain",
    payload.injuriesCurrentPain,
    "Injuries/current pain",
    textLimits.injuriesCurrentPain,
    false
  );
  validateText(errors, "sport", payload.sport, "Sport", textLimits.sport, false);
  validateIntegerRange(
    errors,
    "weeklyAvailability",
    payload.weeklyAvailability,
    "Weekly availability",
    1,
    14
  );
  validateIntegerRange(
    errors,
    "sessionDuration",
    payload.sessionDuration,
    "Session duration",
    15,
    180
  );
  validateText(
    errors,
    "equipmentAccess",
    payload.equipmentAccess,
    "Equipment access",
    textLimits.equipmentAccess
  );

  if (payload.clearedForExercise === null) {
    errors.clearedForExercise = "Choose whether you are cleared for exercise.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      payload,
      errors,
      isValid: false,
      record: null
    };
  }

  const record = buildAthleteOnboardingRecord({
    fullName: payload.fullName,
    age: payload.age as number,
    unitSystem: payload.unitSystem as AthleteUnitSystem,
    height: payload.height as number,
    currentWeight: payload.currentWeight as number,
    primaryGoals: payload.primaryGoals,
    trainingLevel: payload.trainingLevel as AthleteTrainingLevel,
    injuriesCurrentPain: payload.injuriesCurrentPain,
    sport: payload.sport,
    weeklyAvailability: payload.weeklyAvailability as number,
    sessionDuration: payload.sessionDuration as number,
    equipmentAccess: payload.equipmentAccess,
    clearedForExercise: payload.clearedForExercise as boolean
  });

  if (record.bmi < 10 || record.bmi > 80) {
    return {
      payload,
      errors: {
        bmi: "BMI must be between 10 and 80."
      } satisfies AthleteOnboardingErrors,
      isValid: false,
      record: null
    };
  }

  return {
    payload,
    errors,
    isValid: true,
    record
  };
}

export function buildAthleteOnboardingRecord(
  payload: CompleteAthleteOnboardingPayload
): AthleteOnboardingRecord {
  if (payload.unitSystem === "lbs") {
    const heightInches = roundToTwo(payload.height);
    const currentWeightLbs = roundToTwo(payload.currentWeight);

    return {
      fullName: payload.fullName,
      age: payload.age,
      unitSystem: payload.unitSystem,
      heightInches,
      heightCm: null,
      currentWeightLbs,
      currentWeightKg: null,
      bmi: calculateBmi({
        unitSystem: "lbs",
        heightInches,
        currentWeightLbs
      }),
      primaryGoals: payload.primaryGoals,
      trainingLevel: payload.trainingLevel,
      injuriesCurrentPain: payload.injuriesCurrentPain || null,
      sport: payload.sport || null,
      weeklyAvailability: payload.weeklyAvailability,
      sessionDuration: payload.sessionDuration,
      equipmentAccess: payload.equipmentAccess,
      clearedForExercise: payload.clearedForExercise
    };
  }

  const heightCm = roundToTwo(payload.height);
  const currentWeightKg = roundToTwo(payload.currentWeight);

  return {
    fullName: payload.fullName,
    age: payload.age,
    unitSystem: payload.unitSystem,
    heightInches: null,
    heightCm,
    currentWeightLbs: null,
    currentWeightKg,
    bmi: calculateBmi({
      unitSystem: "kg",
      heightCm,
      currentWeightKg
    }),
    primaryGoals: payload.primaryGoals,
    trainingLevel: payload.trainingLevel,
    injuriesCurrentPain: payload.injuriesCurrentPain || null,
    sport: payload.sport || null,
    weeklyAvailability: payload.weeklyAvailability,
    sessionDuration: payload.sessionDuration,
    equipmentAccess: payload.equipmentAccess,
    clearedForExercise: payload.clearedForExercise
  };
}
