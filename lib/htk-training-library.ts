export const htkModuleIds = [
  "flexibility-mobility",
  "core-strength-stability",
  "cardio-endurance",
  "balance-body-control",
  "plyometrics-explosiveness",
  "speed-agility-quickness",
  "resistance-functional-strength",
  "durability-recovery",
  "real-world-performance-workouts"
] as const;

export const htkDifficultyOptions = ["Beginner", "Intermediate", "Advanced"] as const;

export type HTKModuleId = (typeof htkModuleIds)[number];
export type HTKDifficulty = (typeof htkDifficultyOptions)[number];
export type DurationFilter = "Under 15" | "15-30" | "30-45" | "45+";

export type HTKExercise = {
  id: string;
  name: string;
  moduleId: HTKModuleId;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: HTKDifficulty[];
  trainingGoal: string;
  movementPattern: string;
  explanation: string;
  coachingCues: string[];
  commonMistakes: string[];
  beginnerModification: string;
  intermediateVersion: string;
  advancedVersion: string;
  setsRepsTime: string;
  safetyNotes: string[];
  progressionNotes: string[];
  videoUrl: string;
  estimatedMinutes: number;
  moduleTitle: string;
  moduleShortDescription: string;
  recommended: string;
  modifications: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
};

export type PresetWorkoutExercise = {
  exerciseId: string;
  prescription: string;
  coachingNote: string;
};

export type HTKPresetWorkout = {
  id: string;
  title: string;
  moduleId: HTKModuleId;
  trainingGoal: string;
  targetMuscles: string[];
  equipment: string[];
  difficulty: HTKDifficulty;
  estimatedDuration: string;
  estimatedMinutes: number;
  durationBucket: DurationFilter;
  description: string;
  purpose: string;
  exercises: PresetWorkoutExercise[];
  warmup: string[];
  cooldown: string[];
  coachingNotes: string[];
  safetyNotes: string[];
  progressionOptions: string[];
  modificationOptions: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
};

export type HTKTrainingModuleLibrary = {
  moduleId: HTKModuleId;
  title: string;
  description: string;
  shortDescription: string;
  goals: string[];
  muscleFilters: string[];
  equipmentOptions: string[];
  difficultyOptions: HTKDifficulty[];
  trainingGoalOptions: string[];
  durationOptions: DurationFilter[];
  movementPatternOptions: string[];
  presetWorkouts: HTKPresetWorkout[];
  exercises: HTKExercise[];
};

type ExerciseSeed = {
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: HTKDifficulty[];
  trainingGoal: string;
  movementPattern: string;
  setsRepsTime: string;
  estimatedMinutes: number;
};

type ModuleSeed = {
  moduleId: HTKModuleId;
  title: string;
  description: string;
  shortDescription: string;
  goals: string[];
  muscleFilters: string[];
  exerciseSeeds: ExerciseSeed[];
  presetTitles: string[];
};

const videoPlaceholder = (exerciseId: string) =>
  `https://videos.hardtokill.training/placeholders/${exerciseId}`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const unique = <T,>(items: T[]) => Array.from(new Set(items));

const getDurationBucket = (minutes: number): DurationFilter => {
  if (minutes < 15) return "Under 15";
  if (minutes <= 30) return "15-30";
  if (minutes <= 45) return "30-45";
  return "45+";
};

const safetyNotes = (moduleTitle: string) => [
  `${moduleTitle} content is general performance training, not medical advice or injury treatment.`,
  "Stop or modify if pain, concerning symptoms, or unsafe mechanics appear.",
  "Athletes with pain or injury concerns should consult a qualified professional."
];

const moduleSeeds: ModuleSeed[] = [
  {
    moduleId: "flexibility-mobility",
    title: "Flexibility & Mobility",
    description: "Mobility flows, flexibility drills, joint prep, movement prep, and recovery-based options.",
    shortDescription: "Restore usable range of motion and build better training positions.",
    goals: ["Increase mobility", "Improve movement prep", "Restore training positions"],
    muscleFilters: ["Hips", "Shoulders", "Ankles", "Spine", "Hamstrings", "Hip Flexors", "Full Body", "Mobility", "Recovery"],
    presetTitles: [
      "10-Minute Daily Mobility Flow",
      "Hip & Spine Reset",
      "Pre-Workout Movement Prep",
      "Shoulder And T-Spine Opener",
      "Lower Body Mobility Primer",
      "Desk Reset Mobility Flow",
      "Ankle And Hip Prep",
      "Full Body Recovery Mobility"
    ],
    exerciseSeeds: [
      { name: "World's Greatest Stretch", category: "Mobility Flow", primaryMuscles: ["Hips", "Hip Flexors"], secondaryMuscles: ["Spine", "Hamstrings", "Full Body"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Increase mobility", movementPattern: "Lunge mobility", setsRepsTime: "2-3 rounds per side", estimatedMinutes: 5 },
      { name: "Hip 90/90 Switch", category: "Hip Mobility", primaryMuscles: ["Hips"], secondaryMuscles: ["Glutes", "Adductors", "Abductors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve hip control", movementPattern: "Hip rotation", setsRepsTime: "2-3 sets of 6-8 switches", estimatedMinutes: 5 },
      { name: "Couch Stretch", category: "Flexibility Drill", primaryMuscles: ["Hip Flexors"], secondaryMuscles: ["Quads", "Glutes"], equipment: ["Bench", "Bodyweight"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Open front-side positions", movementPattern: "Hip extension stretch", setsRepsTime: "1-2 x 30-60 seconds per side", estimatedMinutes: 4 },
      { name: "Ankle Rocker", category: "Joint Prep", primaryMuscles: ["Ankles"], secondaryMuscles: ["Calves", "Quads"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve ankle range", movementPattern: "Ankle dorsiflexion", setsRepsTime: "2 sets of 10-15 reps per side", estimatedMinutes: 4 },
      { name: "Thoracic Open Book", category: "Spine Mobility", primaryMuscles: ["Spine"], secondaryMuscles: ["Shoulders", "Back"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve rotation", movementPattern: "Thoracic rotation", setsRepsTime: "2 sets of 6-8 reps per side", estimatedMinutes: 5 },
      { name: "Deep Squat Hold", category: "Position Hold", primaryMuscles: ["Hips", "Ankles"], secondaryMuscles: ["Quads", "Glutes", "Spine"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Own bottom positions", movementPattern: "Squat mobility", setsRepsTime: "2-4 holds of 30-60 seconds", estimatedMinutes: 5 },
      { name: "Hamstring Floss", category: "Flexibility Drill", primaryMuscles: ["Hamstrings"], secondaryMuscles: ["Calves", "Lower Back"], equipment: ["Bodyweight", "Bands"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve posterior chain range", movementPattern: "Hamstring hinge", setsRepsTime: "2 sets of 10 reps per side", estimatedMinutes: 4 },
      { name: "Shoulder CARs", category: "Joint Prep", primaryMuscles: ["Shoulders"], secondaryMuscles: ["Back", "Chest"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve shoulder control", movementPattern: "Shoulder circle", setsRepsTime: "2 sets of 3-5 slow reps per side", estimatedMinutes: 4 },
      { name: "Hip CARs", category: "Joint Prep", primaryMuscles: ["Hips"], secondaryMuscles: ["Glutes", "Deep Core"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve hip control", movementPattern: "Hip circle", setsRepsTime: "2 sets of 3-5 slow reps per side", estimatedMinutes: 5 },
      { name: "Cat Cow", category: "Spine Mobility", primaryMuscles: ["Spine"], secondaryMuscles: ["Abs", "Lower Back"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner"], trainingGoal: "Restore spine motion", movementPattern: "Spinal flexion extension", setsRepsTime: "2 sets of 8-12 reps", estimatedMinutes: 3 },
      { name: "Child's Pose Reach", category: "Recovery Mobility", primaryMuscles: ["Shoulders", "Back"], secondaryMuscles: ["Spine", "Lats"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner"], trainingGoal: "Decompress upper body", movementPattern: "Overhead reach", setsRepsTime: "2 x 30-45 seconds per side", estimatedMinutes: 4 },
      { name: "Lizard Stretch", category: "Hip Mobility", primaryMuscles: ["Hips", "Adductors"], secondaryMuscles: ["Hip Flexors", "Hamstrings"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Open hips for athletic positions", movementPattern: "Deep lunge mobility", setsRepsTime: "2 x 30-45 seconds per side", estimatedMinutes: 5 },
      { name: "Lat Stretch", category: "Flexibility Drill", primaryMuscles: ["Back", "Shoulders"], secondaryMuscles: ["Spine"], equipment: ["Bench", "Bodyweight"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve overhead positions", movementPattern: "Overhead flexion", setsRepsTime: "2 x 30-45 seconds", estimatedMinutes: 4 },
      { name: "Pigeon Stretch", category: "Hip Mobility", primaryMuscles: ["Glutes", "Hips"], secondaryMuscles: ["Lower Back"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve hip external rotation", movementPattern: "Hip external rotation", setsRepsTime: "1-2 x 30-60 seconds per side", estimatedMinutes: 5 },
      { name: "Spiderman Lunge Rotation", category: "Movement Prep", primaryMuscles: ["Hips", "Spine"], secondaryMuscles: ["Shoulders", "Hip Flexors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Prepare for athletic movement", movementPattern: "Lunge rotation", setsRepsTime: "2 sets of 5 reps per side", estimatedMinutes: 5 }
    ]
  },
  {
    moduleId: "core-strength-stability",
    title: "Core Strength & Stability",
    description: "Anti-extension core, anti-rotation core, carries, bracing drills, and trunk stability work.",
    shortDescription: "Build trunk control that supports force transfer, posture, and athletic movement.",
    goals: ["Build bracing", "Resist rotation", "Improve trunk stability"],
    muscleFilters: ["Abs", "Obliques", "Deep Core", "Lower Back", "Full Core", "Forearms", "Shoulders", "Full Body"],
    presetTitles: [
      "Foundation Core Circuit",
      "Anti-Rotation Strength Builder",
      "Athletic Trunk Stability",
      "Carry And Brace Circuit",
      "Crawl And Core Control",
      "Advanced Anti-Extension Session",
      "Rotational Core Control",
      "Grip And Trunk Stability"
    ],
    exerciseSeeds: [
      { name: "Dead Bug", category: "Anti-Extension Core", primaryMuscles: ["Deep Core", "Abs"], secondaryMuscles: ["Hip Flexors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build bracing", movementPattern: "Anti-extension", setsRepsTime: "2-3 x 6-10 reps per side", estimatedMinutes: 6 },
      { name: "Plank", category: "Anti-Extension Core", primaryMuscles: ["Abs", "Deep Core"], secondaryMuscles: ["Shoulders", "Glutes"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build trunk endurance", movementPattern: "Static brace", setsRepsTime: "3 x 20-45 seconds", estimatedMinutes: 5 },
      { name: "Side Plank", category: "Lateral Core", primaryMuscles: ["Obliques"], secondaryMuscles: ["Shoulders", "Glutes"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Resist lateral flexion", movementPattern: "Lateral brace", setsRepsTime: "3 x 20-40 seconds per side", estimatedMinutes: 6 },
      { name: "Hollow Hold", category: "Anti-Extension Core", primaryMuscles: ["Abs", "Deep Core"], secondaryMuscles: ["Hip Flexors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build total-body tension", movementPattern: "Hollow brace", setsRepsTime: "3 x 15-30 seconds", estimatedMinutes: 5 },
      { name: "Bird Dog", category: "Trunk Stability", primaryMuscles: ["Deep Core", "Lower Back"], secondaryMuscles: ["Glutes", "Shoulders"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve cross-body control", movementPattern: "Contralateral reach", setsRepsTime: "2-3 x 6-8 reps per side", estimatedMinutes: 6 },
      { name: "Pallof Press", category: "Anti-Rotation Core", primaryMuscles: ["Obliques", "Deep Core"], secondaryMuscles: ["Shoulders", "Chest"], equipment: ["Bands"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Resist rotation", movementPattern: "Anti-rotation press", setsRepsTime: "2-4 x 8-12 reps per side", estimatedMinutes: 6 },
      { name: "Suitcase Carry", category: "Carry", primaryMuscles: ["Obliques", "Deep Core"], secondaryMuscles: ["Forearms", "Shoulders"], equipment: ["Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build offset trunk stability", movementPattern: "Loaded carry", setsRepsTime: "3-4 carries of 20-40 yards per side", estimatedMinutes: 8 },
      { name: "Farmer Carry", category: "Carry", primaryMuscles: ["Deep Core", "Forearms"], secondaryMuscles: ["Shoulders", "Back"], equipment: ["Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build bracing under load", movementPattern: "Loaded carry", setsRepsTime: "3-5 carries of 30-60 seconds", estimatedMinutes: 8 },
      { name: "Bear Crawl", category: "Crawl", primaryMuscles: ["Deep Core", "Shoulders"], secondaryMuscles: ["Quads", "Forearms"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve coordinated trunk control", movementPattern: "Crawling", setsRepsTime: "3-4 x 10-20 yards", estimatedMinutes: 7 },
      { name: "Reverse Crunch", category: "Core Flexion", primaryMuscles: ["Abs"], secondaryMuscles: ["Hip Flexors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Control pelvis and abs", movementPattern: "Posterior pelvic tilt", setsRepsTime: "3 x 8-15 reps", estimatedMinutes: 6 },
      { name: "Hanging Knee Raise", category: "Core Flexion", primaryMuscles: ["Abs", "Hip Flexors"], secondaryMuscles: ["Forearms", "Back"], equipment: ["Pull-Up Bar"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build hanging core control", movementPattern: "Hanging knee drive", setsRepsTime: "3 x 6-12 reps", estimatedMinutes: 7 },
      { name: "Ab Wheel Rollout", category: "Anti-Extension Core", primaryMuscles: ["Abs", "Deep Core"], secondaryMuscles: ["Shoulders", "Lats"], equipment: ["Ab Wheel"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build anti-extension strength", movementPattern: "Rollout", setsRepsTime: "3 x 5-10 reps", estimatedMinutes: 7 },
      { name: "Cable Chop", category: "Rotational Core", primaryMuscles: ["Obliques"], secondaryMuscles: ["Shoulders", "Abs"], equipment: ["Cable", "Bands"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Control rotation", movementPattern: "High-to-low chop", setsRepsTime: "3 x 8-12 reps per side", estimatedMinutes: 7 },
      { name: "Cable Lift", category: "Rotational Core", primaryMuscles: ["Obliques", "Deep Core"], secondaryMuscles: ["Shoulders", "Glutes"], equipment: ["Cable", "Bands"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build diagonal force control", movementPattern: "Low-to-high lift", setsRepsTime: "3 x 8-12 reps per side", estimatedMinutes: 7 },
      { name: "Stir The Pot", category: "Anti-Extension Core", primaryMuscles: ["Abs", "Deep Core"], secondaryMuscles: ["Shoulders"], equipment: ["Stability Ball"], difficulty: ["Advanced"], trainingGoal: "Build dynamic trunk stability", movementPattern: "Circular brace", setsRepsTime: "3 x 8-12 circles each way", estimatedMinutes: 6 }
    ]
  },
  {
    moduleId: "cardio-endurance",
    title: "Cardio & Endurance",
    description: "Zone 2 work, intervals, tempo work, conditioning circuits, and aerobic capacity workouts.",
    shortDescription: "Develop conditioning that supports work capacity without random punishment.",
    goals: ["Build aerobic base", "Improve repeatable output", "Increase conditioning capacity"],
    muscleFilters: ["Conditioning", "Full Body", "Calves", "Quads", "Hamstrings", "Glutes", "Athletic Performance"],
    presetTitles: [
      "Zone 2 Base Builder",
      "Tempo Conditioning Session",
      "Hard To Kill Interval Circuit",
      "Low-Impact Aerobic Capacity",
      "Ruck Endurance Session",
      "Shuttle Conditioning Builder",
      "Bike And Rope Engine",
      "Sled Push Conditioning"
    ],
    exerciseSeeds: [
      { name: "Zone 2 Run", category: "Aerobic Base", primaryMuscles: ["Conditioning"], secondaryMuscles: ["Calves", "Quads", "Hamstrings"], equipment: ["No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build aerobic base", movementPattern: "Steady run", setsRepsTime: "20-45 minutes easy aerobic effort", estimatedMinutes: 30 },
      { name: "Zone 2 Bike", category: "Aerobic Base", primaryMuscles: ["Conditioning"], secondaryMuscles: ["Quads", "Glutes"], equipment: ["Bike"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build aerobic base", movementPattern: "Steady bike", setsRepsTime: "25-50 minutes steady effort", estimatedMinutes: 35 },
      { name: "Tempo Run", category: "Tempo Work", primaryMuscles: ["Conditioning"], secondaryMuscles: ["Calves", "Hamstrings", "Glutes"], equipment: ["No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve threshold", movementPattern: "Tempo run", setsRepsTime: "4-8 x 2 minutes tempo", estimatedMinutes: 24 },
      { name: "Assault Bike Intervals", category: "Intervals", primaryMuscles: ["Conditioning", "Full Body"], secondaryMuscles: ["Quads", "Shoulders"], equipment: ["Assault Bike"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve repeat effort", movementPattern: "Bike interval", setsRepsTime: "8-12 x 20 seconds hard / 100 seconds easy", estimatedMinutes: 18 },
      { name: "Rowing Intervals", category: "Intervals", primaryMuscles: ["Conditioning", "Back"], secondaryMuscles: ["Quads", "Glutes", "Forearms"], equipment: ["Rower"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve repeat effort", movementPattern: "Row interval", setsRepsTime: "6-10 x 250 meters", estimatedMinutes: 22 },
      { name: "Jump Rope Intervals", category: "Intervals", primaryMuscles: ["Conditioning", "Calves"], secondaryMuscles: ["Shoulders", "Forearms"], equipment: ["Jump Rope"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve rhythm and conditioning", movementPattern: "Jump rope", setsRepsTime: "8-12 x 45 seconds on / 30 seconds off", estimatedMinutes: 16 },
      { name: "Incline Walk", category: "Low Impact Conditioning", primaryMuscles: ["Conditioning", "Glutes"], secondaryMuscles: ["Calves", "Hamstrings"], equipment: ["Treadmill"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build low-impact capacity", movementPattern: "Incline walk", setsRepsTime: "20-40 minutes steady", estimatedMinutes: 30 },
      { name: "Sprint Intervals", category: "Intervals", primaryMuscles: ["Conditioning", "Hamstrings"], secondaryMuscles: ["Glutes", "Calves"], equipment: ["No Equipment"], difficulty: ["Advanced"], trainingGoal: "Build high-output repeatability", movementPattern: "Sprint interval", setsRepsTime: "6-10 x 10-20 seconds sprint", estimatedMinutes: 20 },
      { name: "EMOM Conditioning", category: "Conditioning Circuit", primaryMuscles: ["Conditioning", "Full Body"], secondaryMuscles: ["Athletic Performance"], equipment: ["Bodyweight", "Dumbbells", "Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build work capacity", movementPattern: "EMOM circuit", setsRepsTime: "12-20 minutes EMOM", estimatedMinutes: 18 },
      { name: "AMRAP Conditioning", category: "Conditioning Circuit", primaryMuscles: ["Conditioning", "Full Body"], secondaryMuscles: ["Athletic Performance"], equipment: ["Bodyweight", "Dumbbells", "Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build sustained output", movementPattern: "AMRAP circuit", setsRepsTime: "10-18 minutes controlled AMRAP", estimatedMinutes: 18 },
      { name: "Shuttle Runs", category: "Field Conditioning", primaryMuscles: ["Conditioning", "Athletic Performance"], secondaryMuscles: ["Quads", "Glutes", "Calves"], equipment: ["Cones", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build field-ready conditioning", movementPattern: "Shuttle run", setsRepsTime: "6-10 shuttles with controlled rest", estimatedMinutes: 20 },
      { name: "Hill Sprints", category: "Field Conditioning", primaryMuscles: ["Conditioning", "Glutes"], secondaryMuscles: ["Hamstrings", "Calves"], equipment: ["No Equipment"], difficulty: ["Advanced"], trainingGoal: "Build power endurance", movementPattern: "Hill sprint", setsRepsTime: "6-10 x 8-15 seconds uphill", estimatedMinutes: 20 },
      { name: "Ruck Walk", category: "Loaded Endurance", primaryMuscles: ["Conditioning", "Full Body"], secondaryMuscles: ["Back", "Glutes", "Calves"], equipment: ["Ruck"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build loaded aerobic capacity", movementPattern: "Loaded walk", setsRepsTime: "30-60 minutes controlled pace", estimatedMinutes: 45 },
      { name: "Sled Push Intervals", category: "Loaded Conditioning", primaryMuscles: ["Conditioning", "Quads"], secondaryMuscles: ["Glutes", "Calves", "Shoulders"], equipment: ["Sled"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build hard repeat effort", movementPattern: "Sled push", setsRepsTime: "6-10 x 20-40 yards", estimatedMinutes: 20 },
      { name: "Battle Rope Intervals", category: "Intervals", primaryMuscles: ["Conditioning", "Shoulders"], secondaryMuscles: ["Forearms", "Back", "Abs"], equipment: ["Battle Ropes"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build upper-body conditioning", movementPattern: "Rope interval", setsRepsTime: "8-12 x 20-30 seconds", estimatedMinutes: 16 }
    ]
  },
  {
    moduleId: "balance-body-control",
    title: "Balance & Body Control",
    description: "Single-leg balance, landing mechanics, coordination, and body control drills.",
    shortDescription: "Own positions, landings, and coordination before adding speed or load.",
    goals: ["Improve single-leg control", "Own landing mechanics", "Build coordination"],
    muscleFilters: ["Glutes", "Quads", "Hamstrings", "Calves", "Adductors", "Abductors", "Deep Core", "Athletic Performance", "Full Body"],
    presetTitles: [
      "Single-Leg Control Session",
      "Landing Mechanics Builder",
      "Coordination & Control Circuit",
      "Crawl And Balance Control",
      "Knee And Hip Control Session",
      "Athletic Balance Circuit",
      "Controlled Lunge Matrix",
      "Body Control Reset"
    ],
    exerciseSeeds: [
      { name: "Single-Leg Balance Reach", category: "Single-Leg Balance", primaryMuscles: ["Glutes", "Deep Core"], secondaryMuscles: ["Calves", "Hamstrings"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve single-leg control", movementPattern: "Single-leg reach", setsRepsTime: "3 x 5 reaches per side", estimatedMinutes: 6 },
      { name: "Single-Leg RDL", category: "Single-Leg Hinge", primaryMuscles: ["Hamstrings", "Glutes"], secondaryMuscles: ["Deep Core", "Calves"], equipment: ["Bodyweight", "Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve hinge control", movementPattern: "Single-leg hinge", setsRepsTime: "3 x 6 reps per side", estimatedMinutes: 7 },
      { name: "Lateral Bound Stick", category: "Landing Mechanics", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Calves", "Adductors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Own lateral landings", movementPattern: "Lateral bound", setsRepsTime: "4 x 4 sticks per side", estimatedMinutes: 6 },
      { name: "Split Squat ISO Hold", category: "Position Hold", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Hip Flexors", "Deep Core"], equipment: ["Bodyweight", "Dumbbells"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build lower-body position control", movementPattern: "Split squat hold", setsRepsTime: "3 x 20-40 seconds per side", estimatedMinutes: 7 },
      { name: "Step Down Control", category: "Eccentric Control", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Calves", "Deep Core"], equipment: ["Bench"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve knee and hip control", movementPattern: "Step down", setsRepsTime: "3 x 6-8 reps per side", estimatedMinutes: 7 },
      { name: "Single-Leg Hop Stick", category: "Landing Mechanics", primaryMuscles: ["Calves", "Quads"], secondaryMuscles: ["Glutes", "Hamstrings"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Own single-leg landing", movementPattern: "Single-leg hop", setsRepsTime: "4 x 3-5 sticks per side", estimatedMinutes: 6 },
      { name: "Bear Crawl Hold", category: "Crawl Hold", primaryMuscles: ["Deep Core", "Shoulders"], secondaryMuscles: ["Quads", "Forearms"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build contralateral control", movementPattern: "Crawl hold", setsRepsTime: "3 x 20-30 seconds", estimatedMinutes: 5 },
      { name: "Cossack Squat", category: "Lateral Squat", primaryMuscles: ["Adductors", "Glutes"], secondaryMuscles: ["Quads", "Hamstrings", "Ankles"], equipment: ["Bodyweight", "Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve lateral control", movementPattern: "Lateral squat", setsRepsTime: "3 x 5-8 reps per side", estimatedMinutes: 8 },
      { name: "Turkish Get-Up", category: "Full Body Control", primaryMuscles: ["Shoulders", "Deep Core"], secondaryMuscles: ["Glutes", "Quads", "Forearms"], equipment: ["Kettlebell", "Dumbbells"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build full-body coordination", movementPattern: "Ground-to-stand", setsRepsTime: "3 x 1-3 reps per side", estimatedMinutes: 10 },
      { name: "Stability Ball Dead Bug", category: "Trunk Control", primaryMuscles: ["Deep Core", "Abs"], secondaryMuscles: ["Hip Flexors"], equipment: ["Stability Ball"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve trunk control", movementPattern: "Anti-extension", setsRepsTime: "3 x 6-8 reps per side", estimatedMinutes: 6 },
      { name: "Balance Board Hold", category: "Balance Hold", primaryMuscles: ["Calves", "Deep Core"], secondaryMuscles: ["Quads", "Glutes"], equipment: ["Balance Board"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve balance under instability", movementPattern: "Static balance", setsRepsTime: "3 x 20-45 seconds", estimatedMinutes: 6 },
      { name: "Single-Leg Calf Raise", category: "Single-Leg Strength", primaryMuscles: ["Calves"], secondaryMuscles: ["Glutes", "Deep Core"], equipment: ["Bodyweight", "Dumbbells"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build ankle control", movementPattern: "Calf raise", setsRepsTime: "3 x 8-15 reps per side", estimatedMinutes: 6 },
      { name: "Controlled Lunge Matrix", category: "Multi-Directional Control", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Adductors", "Hamstrings"], equipment: ["Bodyweight", "Dumbbells"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve multi-direction control", movementPattern: "Lunge matrix", setsRepsTime: "2-3 rounds per side", estimatedMinutes: 8 },
      { name: "Crawling Pattern", category: "Coordination", primaryMuscles: ["Deep Core", "Shoulders"], secondaryMuscles: ["Quads", "Forearms"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve cross-body coordination", movementPattern: "Crawl", setsRepsTime: "3 x 10-20 yards", estimatedMinutes: 7 },
      { name: "Tall Kneeling Press", category: "Postural Control", primaryMuscles: ["Shoulders", "Deep Core"], secondaryMuscles: ["Glutes", "Triceps"], equipment: ["Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build braced pressing control", movementPattern: "Kneeling press", setsRepsTime: "3 x 6-10 reps", estimatedMinutes: 7 }
    ]
  },
  {
    moduleId: "plyometrics-explosiveness",
    title: "Plyometrics & Explosiveness",
    description: "Jumps, bounds, throws, power drills, and explosive bodyweight work.",
    shortDescription: "Train crisp, athletic power with landing quality and controlled dosage.",
    goals: ["Build explosiveness", "Improve power output", "Own elastic mechanics"],
    muscleFilters: ["Glutes", "Quads", "Hamstrings", "Calves", "Chest", "Shoulders", "Abs", "Athletic Performance", "Full Body"],
    presetTitles: [
      "Lower Body Power Primer",
      "Jump & Stick Mechanics",
      "Med Ball Power Circuit",
      "Elastic Contact Session",
      "Rotational Power Builder",
      "Upper Body Explosive Primer",
      "Bounds And Throws Circuit",
      "Kettlebell Power Session"
    ],
    exerciseSeeds: [
      { name: "Pogo Jumps", category: "Elastic Jump", primaryMuscles: ["Calves"], secondaryMuscles: ["Quads", "Glutes"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build elastic stiffness", movementPattern: "Vertical pogo", setsRepsTime: "3-5 x 10-20 seconds", estimatedMinutes: 5 },
      { name: "Broad Jump", category: "Horizontal Jump", primaryMuscles: ["Glutes", "Hamstrings"], secondaryMuscles: ["Quads", "Calves"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build horizontal power", movementPattern: "Horizontal jump", setsRepsTime: "4-6 x 2 reps", estimatedMinutes: 6 },
      { name: "Box Jump", category: "Vertical Jump", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Calves", "Hamstrings"], equipment: ["Box"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build vertical power", movementPattern: "Jump to box", setsRepsTime: "4-6 x 2-4 reps", estimatedMinutes: 6 },
      { name: "Depth Drop", category: "Landing Drill", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Calves", "Deep Core"], equipment: ["Box"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve landing control", movementPattern: "Drop and stick", setsRepsTime: "4 x 3 reps", estimatedMinutes: 6 },
      { name: "Depth Jump", category: "Reactive Jump", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Calves", "Hamstrings"], equipment: ["Box"], difficulty: ["Advanced"], trainingGoal: "Build reactive power", movementPattern: "Drop to jump", setsRepsTime: "4-5 x 2 reps", estimatedMinutes: 7 },
      { name: "Skater Bounds", category: "Lateral Bound", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Adductors", "Calves"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build lateral power", movementPattern: "Skater bound", setsRepsTime: "4 x 4-6 per side", estimatedMinutes: 7 },
      { name: "Lateral Bounds", category: "Lateral Bound", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Calves", "Adductors"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build frontal-plane power", movementPattern: "Lateral jump", setsRepsTime: "4 x 4 per side", estimatedMinutes: 6 },
      { name: "Med Ball Slam", category: "Power Throw", primaryMuscles: ["Abs", "Shoulders"], secondaryMuscles: ["Back", "Glutes"], equipment: ["Medicine Ball"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build aggressive trunk power", movementPattern: "Overhead slam", setsRepsTime: "4-6 x 4-6 reps", estimatedMinutes: 6 },
      { name: "Med Ball Chest Pass", category: "Power Throw", primaryMuscles: ["Chest", "Triceps"], secondaryMuscles: ["Shoulders", "Abs"], equipment: ["Medicine Ball"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build upper-body power", movementPattern: "Chest throw", setsRepsTime: "4-6 x 4-6 reps", estimatedMinutes: 6 },
      { name: "Rotational Med Ball Throw", category: "Rotational Power", primaryMuscles: ["Obliques", "Glutes"], secondaryMuscles: ["Shoulders", "Abs"], equipment: ["Medicine Ball"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build rotational power", movementPattern: "Rotational throw", setsRepsTime: "4-6 x 3-5 reps per side", estimatedMinutes: 7 },
      { name: "Jump Squat", category: "Explosive Bodyweight", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Calves", "Hamstrings"], equipment: ["Bodyweight", "Dumbbells"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build lower-body power", movementPattern: "Squat jump", setsRepsTime: "3-5 x 3-6 reps", estimatedMinutes: 6 },
      { name: "Split Jump", category: "Explosive Bodyweight", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Hip Flexors", "Calves"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build unilateral power", movementPattern: "Split jump", setsRepsTime: "3-4 x 3-5 per side", estimatedMinutes: 6 },
      { name: "Tuck Jump", category: "Explosive Bodyweight", primaryMuscles: ["Quads", "Hip Flexors"], secondaryMuscles: ["Calves", "Abs"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Advanced"], trainingGoal: "Build explosive coordination", movementPattern: "Tuck jump", setsRepsTime: "3-5 x 3-5 reps", estimatedMinutes: 5 },
      { name: "Clap Push-Up", category: "Upper Body Power", primaryMuscles: ["Chest", "Triceps"], secondaryMuscles: ["Shoulders", "Abs"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Advanced"], trainingGoal: "Build upper-body explosiveness", movementPattern: "Explosive push", setsRepsTime: "3-5 x 3-6 reps", estimatedMinutes: 6 },
      { name: "Kettlebell Swing", category: "Hip Power", primaryMuscles: ["Glutes", "Hamstrings"], secondaryMuscles: ["Back", "Forearms", "Abs"], equipment: ["Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build hip snap and power endurance", movementPattern: "Ballistic hinge", setsRepsTime: "4-6 x 8-15 reps", estimatedMinutes: 8 }
    ]
  },
  {
    moduleId: "speed-agility-quickness",
    title: "Speed, Agility & Quickness",
    description: "Sprint drills, acceleration, deceleration, change of direction, and footwork drills.",
    shortDescription: "Build fast mechanics, sharp cuts, and repeatable field movement.",
    goals: ["Improve acceleration", "Sharpen change of direction", "Build quickness"],
    muscleFilters: ["Glutes", "Hamstrings", "Quads", "Calves", "Hip Flexors", "Athletic Performance", "Conditioning", "Full Body"],
    presetTitles: [
      "Acceleration Mechanics Session",
      "Change of Direction Builder",
      "Footwork & Reaction Circuit",
      "Sprint Drill Primer",
      "Deceleration Control Session",
      "Short Speed Power Session",
      "Cone Agility Circuit",
      "Reactive Quickness Session"
    ],
    exerciseSeeds: [
      { name: "A-Skips", category: "Sprint Drill", primaryMuscles: ["Hip Flexors", "Calves"], secondaryMuscles: ["Hamstrings", "Deep Core"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve sprint rhythm", movementPattern: "Sprint drill", setsRepsTime: "3 x 15-20 yards", estimatedMinutes: 5 },
      { name: "B-Skips", category: "Sprint Drill", primaryMuscles: ["Hamstrings", "Hip Flexors"], secondaryMuscles: ["Calves", "Deep Core"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve front-side mechanics", movementPattern: "Sprint drill", setsRepsTime: "3 x 15-20 yards", estimatedMinutes: 5 },
      { name: "Wall Drill", category: "Acceleration Drill", primaryMuscles: ["Glutes", "Hip Flexors"], secondaryMuscles: ["Calves", "Deep Core"], equipment: ["Wall"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve acceleration posture", movementPattern: "Wall march", setsRepsTime: "3 x 10 drives per side", estimatedMinutes: 5 },
      { name: "Falling Start", category: "Acceleration", primaryMuscles: ["Glutes", "Hamstrings"], secondaryMuscles: ["Calves", "Quads"], equipment: ["No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Improve first-step intent", movementPattern: "Sprint start", setsRepsTime: "5-8 x 10 yards", estimatedMinutes: 8 },
      { name: "10-Yard Acceleration", category: "Acceleration", primaryMuscles: ["Glutes", "Hamstrings"], secondaryMuscles: ["Calves", "Quads"], equipment: ["Cones", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build short acceleration", movementPattern: "Short sprint", setsRepsTime: "6-10 x 10 yards", estimatedMinutes: 8 },
      { name: "Flying 10s", category: "Max Velocity", primaryMuscles: ["Hamstrings", "Glutes"], secondaryMuscles: ["Calves", "Hip Flexors"], equipment: ["Cones"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve top-end speed", movementPattern: "Flying sprint", setsRepsTime: "4-6 flying 10-yard reps", estimatedMinutes: 12 },
      { name: "5-10-5 Shuttle", category: "Change Of Direction", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Calves", "Adductors"], equipment: ["Cones"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve change of direction", movementPattern: "Shuttle", setsRepsTime: "4-6 quality reps", estimatedMinutes: 10 },
      { name: "T-Drill", category: "Agility Drill", primaryMuscles: ["Athletic Performance", "Glutes"], secondaryMuscles: ["Quads", "Calves"], equipment: ["Cones"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Blend shuffle, sprint, and backpedal", movementPattern: "Multi-direction drill", setsRepsTime: "4-6 reps", estimatedMinutes: 10 },
      { name: "L-Drill", category: "Agility Drill", primaryMuscles: ["Athletic Performance", "Glutes"], secondaryMuscles: ["Quads", "Hamstrings"], equipment: ["Cones"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve curved acceleration", movementPattern: "Three-cone drill", setsRepsTime: "4-6 reps", estimatedMinutes: 10 },
      { name: "Cone Weave", category: "Footwork Drill", primaryMuscles: ["Calves", "Quads"], secondaryMuscles: ["Glutes", "Athletic Performance"], equipment: ["Cones"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve footwork and control", movementPattern: "Cone weave", setsRepsTime: "4-6 passes", estimatedMinutes: 8 },
      { name: "Ladder In-In-Out-Out", category: "Footwork Drill", primaryMuscles: ["Calves", "Hip Flexors"], secondaryMuscles: ["Athletic Performance"], equipment: ["Ladder"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve foot speed", movementPattern: "Ladder pattern", setsRepsTime: "4-6 passes", estimatedMinutes: 6 },
      { name: "Ladder Ickey Shuffle", category: "Footwork Drill", primaryMuscles: ["Calves", "Hip Flexors"], secondaryMuscles: ["Glutes", "Athletic Performance"], equipment: ["Ladder"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve rhythm and quickness", movementPattern: "Ladder shuffle", setsRepsTime: "4-6 passes", estimatedMinutes: 6 },
      { name: "Deceleration Stick", category: "Deceleration", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Calves", "Hamstrings"], equipment: ["Cones", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Own braking positions", movementPattern: "Sprint to stick", setsRepsTime: "5-8 reps", estimatedMinutes: 8 },
      { name: "Backpedal To Sprint", category: "Transition Drill", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Hamstrings", "Calves"], equipment: ["Cones"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve transition speed", movementPattern: "Backpedal transition", setsRepsTime: "5-8 reps", estimatedMinutes: 9 },
      { name: "Reactive Mirror Drill", category: "Reaction Drill", primaryMuscles: ["Athletic Performance", "Calves"], secondaryMuscles: ["Glutes", "Quads"], equipment: ["Cones", "Partner"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Improve reactive quickness", movementPattern: "Mirror drill", setsRepsTime: "6-10 x 10-20 seconds", estimatedMinutes: 10 }
    ]
  },
  {
    moduleId: "resistance-functional-strength",
    title: "Resistance & Functional Strength",
    description: "Strength training, loaded movement patterns, squats, hinges, pushes, pulls, and carries.",
    shortDescription: "Build useful strength that carries into sport, duty, and real-world movement.",
    goals: ["Build functional strength", "Improve loaded patterns", "Develop full-body capacity"],
    muscleFilters: ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Glutes", "Quads", "Hamstrings", "Full Body"],
    presetTitles: [
      "Full-Body Strength Foundation",
      "Push Pull Legs Performance Session",
      "Loaded Carry Strength Circuit",
      "Lower Body Strength Builder",
      "Upper Body Armor Session",
      "Hinge And Carry Day",
      "Athletic Strength Density",
      "Trap Bar Power Strength"
    ],
    exerciseSeeds: [
      { name: "Goblet Squat", category: "Squat", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Abs", "Back"], equipment: ["Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build lower-body strength", movementPattern: "Squat", setsRepsTime: "3-5 x 6-12 reps", estimatedMinutes: 8 },
      { name: "Front Squat", category: "Squat", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Abs", "Upper Back"], equipment: ["Barbell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build braced squat strength", movementPattern: "Squat", setsRepsTime: "3-5 x 3-8 reps", estimatedMinutes: 10 },
      { name: "Deadlift", category: "Hinge", primaryMuscles: ["Hamstrings", "Glutes", "Back"], secondaryMuscles: ["Forearms", "Abs"], equipment: ["Barbell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build total-body strength", movementPattern: "Hinge", setsRepsTime: "3-5 x 3-6 reps", estimatedMinutes: 10 },
      { name: "Romanian Deadlift", category: "Hinge", primaryMuscles: ["Hamstrings", "Glutes"], secondaryMuscles: ["Back", "Forearms"], equipment: ["Barbell", "Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build posterior-chain strength", movementPattern: "Hinge", setsRepsTime: "3-4 x 6-10 reps", estimatedMinutes: 9 },
      { name: "Push-Up", category: "Push", primaryMuscles: ["Chest", "Triceps"], secondaryMuscles: ["Shoulders", "Abs"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build upper-body pushing strength", movementPattern: "Horizontal push", setsRepsTime: "3-5 x 6-15 reps", estimatedMinutes: 7 },
      { name: "Pull-Up", category: "Pull", primaryMuscles: ["Back", "Biceps"], secondaryMuscles: ["Forearms", "Abs"], equipment: ["Pull-Up Bar"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build upper-body pulling strength", movementPattern: "Vertical pull", setsRepsTime: "3-5 x 3-10 reps", estimatedMinutes: 8 },
      { name: "Dumbbell Row", category: "Pull", primaryMuscles: ["Back"], secondaryMuscles: ["Biceps", "Forearms"], equipment: ["Dumbbells", "Bench"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build horizontal pulling strength", movementPattern: "Horizontal pull", setsRepsTime: "3-4 x 8-12 reps per side", estimatedMinutes: 8 },
      { name: "Bench Press", category: "Push", primaryMuscles: ["Chest", "Triceps"], secondaryMuscles: ["Shoulders"], equipment: ["Barbell", "Bench"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build pressing strength", movementPattern: "Horizontal push", setsRepsTime: "3-5 x 3-8 reps", estimatedMinutes: 9 },
      { name: "Overhead Press", category: "Push", primaryMuscles: ["Shoulders", "Triceps"], secondaryMuscles: ["Abs", "Upper Back"], equipment: ["Barbell", "Dumbbells", "Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build overhead strength", movementPattern: "Vertical push", setsRepsTime: "3-5 x 4-8 reps", estimatedMinutes: 9 },
      { name: "Walking Lunge", category: "Lunge", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Hamstrings", "Calves"], equipment: ["Bodyweight", "Dumbbells", "Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build unilateral strength", movementPattern: "Lunge", setsRepsTime: "3-4 x 8-12 steps per side", estimatedMinutes: 9 },
      { name: "Step-Up", category: "Single-Leg Strength", primaryMuscles: ["Glutes", "Quads"], secondaryMuscles: ["Hamstrings", "Calves"], equipment: ["Bench", "Dumbbells"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build single-leg strength", movementPattern: "Step-up", setsRepsTime: "3-4 x 6-10 reps per side", estimatedMinutes: 8 },
      { name: "Kettlebell Deadlift", category: "Hinge", primaryMuscles: ["Hamstrings", "Glutes"], secondaryMuscles: ["Back", "Forearms"], equipment: ["Kettlebell"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build hinge mechanics", movementPattern: "Hinge", setsRepsTime: "3-4 x 6-10 reps", estimatedMinutes: 8 },
      { name: "Sled Push", category: "Loaded Locomotion", primaryMuscles: ["Quads", "Glutes"], secondaryMuscles: ["Calves", "Shoulders"], equipment: ["Sled"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build loaded drive strength", movementPattern: "Sled push", setsRepsTime: "4-8 x 20-40 yards", estimatedMinutes: 10 },
      { name: "Loaded Carry", category: "Carry", primaryMuscles: ["Forearms", "Deep Core"], secondaryMuscles: ["Shoulders", "Back", "Glutes"], equipment: ["Dumbbells", "Kettlebell", "Trap Bar"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build real-world strength", movementPattern: "Loaded carry", setsRepsTime: "3-5 carries of 30-60 seconds", estimatedMinutes: 8 },
      { name: "Trap Bar Deadlift", category: "Hinge", primaryMuscles: ["Glutes", "Hamstrings", "Quads"], secondaryMuscles: ["Back", "Forearms"], equipment: ["Trap Bar"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build total-body strength", movementPattern: "Trap bar hinge", setsRepsTime: "3-5 x 3-6 reps", estimatedMinutes: 10 }
    ]
  },
  {
    moduleId: "durability-recovery",
    title: "Durability & Recovery",
    description: "Prehab-style strength, tendon and ligament support drills, recovery circuits, joint resilience work, and low-impact restoration.",
    shortDescription: "Build resilient positions, tissue capacity, and repeatable mechanics.",
    goals: ["Improve durability", "Support joint resilience", "Restore low-impact capacity"],
    muscleFilters: ["Shoulders", "Back", "Forearms", "Glutes", "Quads", "Hamstrings", "Calves", "Hip Flexors", "Adductors", "Recovery", "Full Body"],
    presetTitles: [
      "Joint Resilience Circuit",
      "Low-Impact Recovery Session",
      "Shoulder, Hip & Ankle Durability",
      "Knee Capacity Builder",
      "Posterior Chain Armor",
      "Shoulder Health Circuit",
      "Lower Leg Durability",
      "Restoration Strength Flow"
    ],
    exerciseSeeds: [
      { name: "Tibialis Raise", category: "Lower Leg Capacity", primaryMuscles: ["Calves"], secondaryMuscles: ["Ankles"], equipment: ["Bodyweight", "Bands"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build shin and ankle capacity", movementPattern: "Ankle dorsiflexion", setsRepsTime: "3 x 12-20 reps", estimatedMinutes: 5 },
      { name: "Copenhagen Plank", category: "Adductor Strength", primaryMuscles: ["Adductors"], secondaryMuscles: ["Obliques", "Glutes"], equipment: ["Bench"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build groin and lateral trunk capacity", movementPattern: "Adductor plank", setsRepsTime: "3 x 15-30 seconds per side", estimatedMinutes: 6 },
      { name: "Band Pull-Apart", category: "Shoulder Capacity", primaryMuscles: ["Back", "Shoulders"], secondaryMuscles: ["Triceps"], equipment: ["Bands"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build upper-back durability", movementPattern: "Band pull", setsRepsTime: "3 x 15-25 reps", estimatedMinutes: 4 },
      { name: "Face Pull", category: "Shoulder Capacity", primaryMuscles: ["Back", "Shoulders"], secondaryMuscles: ["Biceps"], equipment: ["Bands", "Cable"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build shoulder position", movementPattern: "Face pull", setsRepsTime: "3 x 12-20 reps", estimatedMinutes: 5 },
      { name: "External Rotation", category: "Shoulder Capacity", primaryMuscles: ["Shoulders"], secondaryMuscles: ["Back"], equipment: ["Bands", "Cable"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build shoulder control", movementPattern: "Shoulder rotation", setsRepsTime: "2-3 x 10-15 reps per side", estimatedMinutes: 5 },
      { name: "Spanish Squat ISO", category: "Knee Capacity", primaryMuscles: ["Quads"], secondaryMuscles: ["Glutes"], equipment: ["Bands"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build knee-friendly quad capacity", movementPattern: "Squat isometric", setsRepsTime: "3 x 20-45 seconds", estimatedMinutes: 6 },
      { name: "Nordic Hamstring Curl", category: "Hamstring Capacity", primaryMuscles: ["Hamstrings"], secondaryMuscles: ["Glutes", "Calves"], equipment: ["Partner", "Bench"], difficulty: ["Advanced"], trainingGoal: "Build posterior-chain durability", movementPattern: "Knee flexion eccentric", setsRepsTime: "3 x 3-6 reps", estimatedMinutes: 7 },
      { name: "Reverse Nordic", category: "Quad Capacity", primaryMuscles: ["Quads", "Hip Flexors"], secondaryMuscles: ["Abs"], equipment: ["Bodyweight"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build anterior-chain capacity", movementPattern: "Knee extension eccentric", setsRepsTime: "3 x 4-8 reps", estimatedMinutes: 6 },
      { name: "Calf ISO Hold", category: "Lower Leg Capacity", primaryMuscles: ["Calves"], secondaryMuscles: ["Ankles"], equipment: ["Bodyweight", "Dumbbells"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build tendon capacity", movementPattern: "Calf isometric", setsRepsTime: "3 x 20-45 seconds", estimatedMinutes: 5 },
      { name: "Soleus Raise", category: "Lower Leg Capacity", primaryMuscles: ["Calves"], secondaryMuscles: ["Ankles"], equipment: ["Dumbbells", "Machine"], difficulty: ["Beginner", "Intermediate", "Advanced"], trainingGoal: "Build bent-knee calf capacity", movementPattern: "Seated calf raise", setsRepsTime: "3 x 12-20 reps", estimatedMinutes: 6 },
      { name: "Scap Push-Up", category: "Shoulder Capacity", primaryMuscles: ["Shoulders", "Back"], secondaryMuscles: ["Chest", "Triceps"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Improve shoulder blade control", movementPattern: "Scapular push", setsRepsTime: "3 x 8-15 reps", estimatedMinutes: 5 },
      { name: "Hip Airplane", category: "Hip Capacity", primaryMuscles: ["Glutes", "Hips"], secondaryMuscles: ["Hamstrings", "Deep Core"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build hip stability", movementPattern: "Hip rotation control", setsRepsTime: "2-3 x 3-5 reps per side", estimatedMinutes: 6 },
      { name: "Glute Bridge ISO", category: "Hip Capacity", primaryMuscles: ["Glutes"], secondaryMuscles: ["Hamstrings", "Lower Back"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build posterior-chain position", movementPattern: "Hip extension isometric", setsRepsTime: "3 x 20-45 seconds", estimatedMinutes: 5 },
      { name: "Terminal Knee Extension", category: "Knee Capacity", primaryMuscles: ["Quads"], secondaryMuscles: ["Calves"], equipment: ["Bands"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build controlled knee extension", movementPattern: "Knee extension", setsRepsTime: "3 x 12-20 reps per side", estimatedMinutes: 5 },
      { name: "Wrist Extension Curl", category: "Forearm Capacity", primaryMuscles: ["Forearms"], secondaryMuscles: ["Biceps"], equipment: ["Dumbbells", "Bands"], difficulty: ["Beginner", "Intermediate"], trainingGoal: "Build wrist and forearm capacity", movementPattern: "Wrist extension", setsRepsTime: "2-3 x 12-20 reps", estimatedMinutes: 5 }
    ]
  },
  {
    moduleId: "real-world-performance-workouts",
    title: "Real-World Performance Workouts",
    description: "Hybrid workouts, tactical circuits, athletic circuits, strength and conditioning combinations, and field-ready sessions.",
    shortDescription: "Blend strength, conditioning, carries, crawls, and field-ready performance.",
    goals: ["Build real-world performance", "Blend strength and conditioning", "Perform under controlled fatigue"],
    muscleFilters: ["Full Body", "Conditioning", "Athletic Performance", "Chest", "Back", "Shoulders", "Forearms", "Glutes", "Quads", "Hamstrings", "Abs"],
    presetTitles: [
      "Tactical Conditioning Circuit",
      "Strength + Sprint Combo",
      "Full-Body Athletic Capacity Test",
      "Carry And Crawl Field Session",
      "Ruck And Calisthenics Builder",
      "Push Pull Carry Grind",
      "No-Equipment Hard Session",
      "Kettlebell Athletic Complex"
    ],
    exerciseSeeds: [
      { name: "Full-Body Athletic Circuit", category: "Athletic Circuit", primaryMuscles: ["Full Body", "Athletic Performance"], secondaryMuscles: ["Conditioning", "Abs"], equipment: ["Bodyweight", "Dumbbells", "Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build full-body capacity", movementPattern: "Athletic circuit", setsRepsTime: "3-5 rounds", estimatedMinutes: 24 },
      { name: "Tactical Conditioning Circuit", category: "Tactical Circuit", primaryMuscles: ["Full Body", "Conditioning"], secondaryMuscles: ["Back", "Glutes", "Forearms"], equipment: ["Bodyweight", "Kettlebell", "Sled"], difficulty: ["Advanced"], trainingGoal: "Build tactical work capacity", movementPattern: "Mixed circuit", setsRepsTime: "4-5 controlled rounds", estimatedMinutes: 28 },
      { name: "Sprint + Strength Combo", category: "Hybrid Session", primaryMuscles: ["Athletic Performance", "Glutes"], secondaryMuscles: ["Hamstrings", "Full Body"], equipment: ["Cones", "Dumbbells", "Kettlebell", "Barbell"], difficulty: ["Advanced"], trainingGoal: "Blend speed and strength", movementPattern: "Sprint-strength pairing", setsRepsTime: "5-6 rounds", estimatedMinutes: 24 },
      { name: "Carry + Crawl Circuit", category: "Field Circuit", primaryMuscles: ["Full Body", "Forearms"], secondaryMuscles: ["Shoulders", "Abs", "Glutes"], equipment: ["Dumbbells", "Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build field-ready trunk and grip", movementPattern: "Carry crawl", setsRepsTime: "4 rounds", estimatedMinutes: 22 },
      { name: "Ruck + Calisthenics Session", category: "Loaded Endurance", primaryMuscles: ["Full Body", "Conditioning"], secondaryMuscles: ["Back", "Chest", "Quads"], equipment: ["Ruck", "Bodyweight"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build loaded work capacity", movementPattern: "Ruck calisthenics", setsRepsTime: "30-45 minutes", estimatedMinutes: 40 },
      { name: "Push Pull Carry Circuit", category: "Strength Circuit", primaryMuscles: ["Chest", "Back", "Forearms"], secondaryMuscles: ["Abs", "Shoulders"], equipment: ["Dumbbells", "Kettlebell", "Pull-Up Bar"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build upper-body armor", movementPattern: "Push pull carry", setsRepsTime: "4-5 rounds", estimatedMinutes: 25 },
      { name: "Lower Body Capacity Circuit", category: "Strength Conditioning", primaryMuscles: ["Quads", "Glutes", "Hamstrings"], secondaryMuscles: ["Calves", "Conditioning"], equipment: ["Dumbbells", "Kettlebell", "Sled"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build lower-body capacity", movementPattern: "Lower-body circuit", setsRepsTime: "4 rounds", estimatedMinutes: 24 },
      { name: "Upper Body Armor Circuit", category: "Strength Conditioning", primaryMuscles: ["Chest", "Back", "Shoulders"], secondaryMuscles: ["Triceps", "Forearms", "Abs"], equipment: ["Dumbbells", "Pull-Up Bar", "Bands"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build upper-body durability", movementPattern: "Upper-body circuit", setsRepsTime: "4 rounds", estimatedMinutes: 24 },
      { name: "Grip And Core Circuit", category: "Strength Circuit", primaryMuscles: ["Forearms", "Abs", "Deep Core"], secondaryMuscles: ["Back", "Shoulders"], equipment: ["Dumbbells", "Kettlebell", "Pull-Up Bar"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build grip and trunk capacity", movementPattern: "Grip core circuit", setsRepsTime: "4 rounds", estimatedMinutes: 22 },
      { name: "Hill Sprint Strength Circuit", category: "Hybrid Session", primaryMuscles: ["Glutes", "Hamstrings", "Conditioning"], secondaryMuscles: ["Quads", "Calves"], equipment: ["No Equipment", "Dumbbells"], difficulty: ["Advanced"], trainingGoal: "Build power endurance", movementPattern: "Hill sprint strength", setsRepsTime: "6-8 rounds", estimatedMinutes: 26 },
      { name: "Combat Conditioning Circuit", category: "Tactical Circuit", primaryMuscles: ["Full Body", "Conditioning"], secondaryMuscles: ["Shoulders", "Abs", "Glutes"], equipment: ["Bodyweight", "Medicine Ball", "Kettlebell"], difficulty: ["Advanced"], trainingGoal: "Build hard mixed-output capacity", movementPattern: "Combat circuit", setsRepsTime: "4-6 rounds", estimatedMinutes: 28 },
      { name: "Field-Ready Conditioning", category: "Field Circuit", primaryMuscles: ["Athletic Performance", "Conditioning"], secondaryMuscles: ["Glutes", "Quads", "Calves"], equipment: ["Cones", "Bodyweight"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build field-ready output", movementPattern: "Field circuit", setsRepsTime: "20-30 minutes", estimatedMinutes: 25 },
      { name: "No-Equipment Hard Session", category: "Bodyweight Circuit", primaryMuscles: ["Full Body", "Conditioning"], secondaryMuscles: ["Chest", "Quads", "Abs"], equipment: ["Bodyweight", "No Equipment"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build hard bodyweight capacity", movementPattern: "Bodyweight circuit", setsRepsTime: "4-6 rounds", estimatedMinutes: 22 },
      { name: "Dumbbell Full-Body Grinder", category: "Strength Conditioning", primaryMuscles: ["Full Body", "Forearms"], secondaryMuscles: ["Shoulders", "Glutes", "Back"], equipment: ["Dumbbells"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build dumbbell work capacity", movementPattern: "Dumbbell complex", setsRepsTime: "4-5 rounds", estimatedMinutes: 26 },
      { name: "Kettlebell Athletic Complex", category: "Strength Conditioning", primaryMuscles: ["Full Body", "Glutes"], secondaryMuscles: ["Hamstrings", "Shoulders", "Forearms"], equipment: ["Kettlebell"], difficulty: ["Intermediate", "Advanced"], trainingGoal: "Build athletic kettlebell capacity", movementPattern: "Kettlebell complex", setsRepsTime: "4-6 complexes", estimatedMinutes: 24 }
    ]
  }
];

function buildExercise(moduleSeed: ModuleSeed, seed: ExerciseSeed): HTKExercise {
  const id = `${moduleSeed.moduleId}-${slugify(seed.name)}`;
  const moduleTitle = moduleSeed.title;

  return {
    id,
    name: seed.name,
    moduleId: moduleSeed.moduleId,
    category: seed.category,
    primaryMuscles: seed.primaryMuscles,
    secondaryMuscles: seed.secondaryMuscles,
    equipment: seed.equipment,
    difficulty: seed.difficulty,
    trainingGoal: seed.trainingGoal,
    movementPattern: seed.movementPattern,
    explanation: `${seed.name} is an HTK ${seed.category.toLowerCase()} option used to ${seed.trainingGoal.toLowerCase()} inside the ${moduleTitle} module.`,
    coachingCues: [
      "Set position before adding speed, load, or intensity.",
      "Move with intent while keeping mechanics clean.",
      "End the set before quality falls apart."
    ],
    commonMistakes: [
      "Rushing the setup.",
      "Chasing fatigue instead of clean execution.",
      "Using a version that does not match current readiness."
    ],
    beginnerModification: `Use a lower intensity version of ${seed.name} with shorter range, lighter load, or more rest.`,
    intermediateVersion: `Perform ${seed.name} as prescribed with controlled tempo and clean positions.`,
    advancedVersion: `Progress ${seed.name} with more intent, load, range, speed, or density only when mechanics stay sharp.`,
    setsRepsTime: seed.setsRepsTime,
    safetyNotes: safetyNotes(moduleTitle),
    progressionNotes: [
      "Progress one variable at a time: range, volume, load, speed, or density.",
      "Do not progress if the athlete cannot repeat clean reps."
    ],
    videoUrl: videoPlaceholder(id),
    estimatedMinutes: seed.estimatedMinutes,
    moduleTitle,
    moduleShortDescription: moduleSeed.shortDescription,
    recommended: seed.setsRepsTime,
    modifications: {
      beginner: `Use a lower intensity version of ${seed.name} with shorter range, lighter load, or more rest.`,
      intermediate: `Perform ${seed.name} as prescribed with controlled tempo and clean positions.`,
      advanced: `Progress ${seed.name} with more intent, load, range, speed, or density only when mechanics stay sharp.`
    }
  };
}

function buildPreset(moduleSeed: ModuleSeed, exercises: HTKExercise[], title: string, index: number): HTKPresetWorkout {
  const difficulty = htkDifficultyOptions[index % htkDifficultyOptions.length];
  const selectedExercises = Array.from({ length: 4 }, (_, offset) => exercises[(index * 2 + offset) % exercises.length]);
  const estimatedMinutes = 14 + (index % 5) * 5 + (difficulty === "Advanced" ? 6 : 0);
  const targetMuscles = unique(selectedExercises.flatMap((exercise) => exercise.primaryMuscles)).slice(0, 6);
  const equipment = unique(selectedExercises.flatMap((exercise) => exercise.equipment)).slice(0, 5);
  const trainingGoal = moduleSeed.goals[index % moduleSeed.goals.length];

  return {
    id: `${moduleSeed.moduleId}-${slugify(title)}`,
    title,
    moduleId: moduleSeed.moduleId,
    trainingGoal,
    targetMuscles,
    equipment,
    difficulty,
    estimatedDuration: `${estimatedMinutes} minutes`,
    estimatedMinutes,
    durationBucket: getDurationBucket(estimatedMinutes),
    description: `${title} is an HTK ${moduleSeed.title} preset built to ${trainingGoal.toLowerCase()} with module-specific exercise selection.`,
    purpose: `${title} is an HTK ${moduleSeed.title} preset built to ${trainingGoal.toLowerCase()} with module-specific exercise selection.`,
    exercises: selectedExercises.map((exercise, exerciseIndex) => ({
      exerciseId: exercise.id,
      prescription: exercise.setsRepsTime,
      coachingNote: exerciseIndex === 0 ? "Use this as the quality anchor for the session." : "Keep execution clean and repeatable."
    })),
    warmup: [
      "Start with 5-8 minutes of easy movement and progressive ramp-up.",
      `Use low-intensity ${moduleSeed.title.toLowerCase()} prep before the first work block.`
    ],
    cooldown: [
      "Bring breathing back under control.",
      "Record what felt strong, limited, or worth adjusting next time."
    ],
    coachingNotes: [
      "Keep the session aligned to the module intent.",
      "Quality and repeatability beat random fatigue.",
      "Scale volume before sacrificing mechanics."
    ],
    safetyNotes: safetyNotes(moduleSeed.title),
    progressionOptions: [
      "Beginner: reduce total rounds, range, intensity, or load.",
      "Intermediate: use the listed work with disciplined rest.",
      "Advanced: add one progression variable only if output stays clean."
    ],
    modificationOptions: {
      beginner: "Reduce volume, range, intensity, or load.",
      intermediate: "Use the listed session as written with clean rest discipline.",
      advanced: "Add density, load, speed, or one extra round only when quality holds."
    }
  };
}

export const htkExercises: HTKExercise[] = moduleSeeds.flatMap((moduleSeed) =>
  moduleSeed.exerciseSeeds.map((seed) => buildExercise(moduleSeed, seed))
);

export const htkPresetWorkouts: HTKPresetWorkout[] = moduleSeeds.flatMap((moduleSeed) => {
  const moduleExercises = htkExercises.filter((exercise) => exercise.moduleId === moduleSeed.moduleId);
  return moduleSeed.presetTitles.map((title, index) => buildPreset(moduleSeed, moduleExercises, title, index));
});

export const htkTrainingModules: HTKTrainingModuleLibrary[] = moduleSeeds.map((moduleSeed) => {
  const exercises = htkExercises.filter((exercise) => exercise.moduleId === moduleSeed.moduleId);
  const presetWorkouts = htkPresetWorkouts.filter((workout) => workout.moduleId === moduleSeed.moduleId);
  const equipmentOptions = unique(exercises.flatMap((exercise) => exercise.equipment));
  const trainingGoalOptions = unique(exercises.map((exercise) => exercise.trainingGoal));
  const movementPatternOptions = unique(exercises.map((exercise) => exercise.movementPattern));

  return {
    moduleId: moduleSeed.moduleId,
    title: moduleSeed.title,
    description: moduleSeed.description,
    shortDescription: moduleSeed.shortDescription,
    goals: moduleSeed.goals,
    muscleFilters: moduleSeed.muscleFilters,
    equipmentOptions,
    difficultyOptions: [...htkDifficultyOptions],
    trainingGoalOptions,
    durationOptions: ["Under 15", "15-30", "30-45", "45+"],
    movementPatternOptions,
    presetWorkouts,
    exercises
  };
});

export function getHTKTrainingModule(moduleId: string): HTKTrainingModuleLibrary | undefined {
  return htkTrainingModules.find((module) => module.moduleId === moduleId);
}

export function getPresetWorkoutExercises(module: HTKTrainingModuleLibrary, presetWorkout: HTKPresetWorkout) {
  return presetWorkout.exercises
    .map((presetExercise) => {
      const exercise = module.exercises.find((item) => item.id === presetExercise.exerciseId);
      if (!exercise) return null;

      return {
        ...exercise,
        presetPrescription: presetExercise.prescription,
        presetCoachingNote: presetExercise.coachingNote
      };
    })
    .filter((exercise): exercise is HTKExercise & { presetPrescription: string; presetCoachingNote: string } =>
      Boolean(exercise)
    );
}

export const htkTrainingLibraryStats = {
  exerciseCount: htkExercises.length,
  presetWorkoutCount: htkPresetWorkouts.length
};
