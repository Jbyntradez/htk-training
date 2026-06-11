export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

export type ExerciseModification = {
  beginner: string;
  intermediate: string;
  advanced: string;
};

export type Exercise = {
  id: string;
  name: string;
  explanation: string;
  coachingCues: string[];
  commonMistakes: string[];
  modifications: ExerciseModification;
  videoUrl: string;
  recommended: string;
  safetyNotes: string[];
  progressionNotes: string[];
};

export type TrainingModule = {
  id: string;
  title: string;
  shortDescription: string;
  trainingGoal: string;
  difficultyLevel: DifficultyLevel;
  equipmentNeeded: string[];
  exercises: Exercise[];
};

export type Module = TrainingModule;

const videoPlaceholder = (exerciseId: string) =>
  `https://videos.hardtokill.training/placeholders/${exerciseId}`;

export const modules: TrainingModule[] = [
  {
    id: "flexibility-mobility",
    title: "Flexibility & Mobility",
    shortDescription: "Restore usable range of motion and build better training positions.",
    trainingGoal: "Improve hip, shoulder, and spine movement quality so strength and conditioning work feel smoother.",
    difficultyLevel: "All Levels",
    equipmentNeeded: ["Mat", "Bench or wall"],
    exercises: [
      {
        id: "worlds-greatest-stretch",
        name: "World's Greatest Stretch",
        explanation:
          "A full-body mobility drill that links a long lunge, hip opening, thoracic rotation, and hamstring reach.",
        coachingCues: [
          "Keep the front foot planted.",
          "Reach long through the spine before rotating.",
          "Move slowly enough to own each position."
        ],
        commonMistakes: [
          "Rushing through the rotation.",
          "Letting the front knee collapse inward.",
          "Forcing range instead of breathing into it."
        ],
        modifications: {
          beginner: "Place the back knee down and use a hand on a block or bench.",
          intermediate: "Perform from a full lunge with a controlled elbow-to-instep reach.",
          advanced: "Add a hamstring sweep and pause for two breaths in each end position."
        },
        videoUrl: videoPlaceholder("worlds-greatest-stretch"),
        recommended: "2-3 rounds per side before training",
        safetyNotes: ["Move within controlled range.", "Do not force painful hip, knee, or back positions."],
        progressionNotes: ["Progress by increasing control, pause time, and breathing quality before adding speed."]
      },
      {
        id: "hip-90-90-switch",
        name: "Hip 90/90 Switch",
        explanation:
          "A seated hip rotation drill that trains internal and external hip control without needing heavy loading.",
        coachingCues: [
          "Sit tall through the crown of the head.",
          "Rotate from the hips, not the low back.",
          "Keep the movement smooth and deliberate."
        ],
        commonMistakes: [
          "Leaning back and losing trunk position.",
          "Dropping into the end range without control.",
          "Using momentum to switch sides."
        ],
        modifications: {
          beginner: "Use hands behind the body for support.",
          intermediate: "Switch sides hands-free with a controlled torso.",
          advanced: "Add a hip lift or forward fold in each 90/90 position."
        },
        videoUrl: videoPlaceholder("hip-90-90-switch"),
        recommended: "2 sets of 6-8 switches",
        safetyNotes: ["Stay out of sharp knee or hip discomfort.", "Reduce range if position control breaks down."],
        progressionNotes: ["Progress from assisted to hands-free before adding holds or lifts."]
      },
      {
        id: "couch-stretch",
        name: "Couch Stretch",
        explanation:
          "A hip flexor and quad mobility position used to open the front side of the hip after sitting or hard lower-body work.",
        coachingCues: [
          "Squeeze the glute on the down-knee side.",
          "Keep ribs stacked over the pelvis.",
          "Breathe slowly instead of arching the low back."
        ],
        commonMistakes: [
          "Overextending the lower back.",
          "Letting the knee flare or slide.",
          "Pushing too aggressively into the stretch."
        ],
        modifications: {
          beginner: "Place the back foot on the floor instead of the wall.",
          intermediate: "Use the wall or bench with upright posture.",
          advanced: "Add overhead reach while maintaining rib and pelvis control."
        },
        videoUrl: videoPlaceholder("couch-stretch"),
        recommended: "1-2 sets of 30-60 seconds per side",
        safetyNotes: ["Use padding under the knee.", "Avoid forcing end range if the knee or back feels irritated."],
        progressionNotes: ["Progress by improving posture and breathing before increasing hold time."]
      }
    ]
  },
  {
    id: "core-strength-stability",
    title: "Core Strength & Stability",
    shortDescription: "Build trunk control that supports force transfer, posture, and athletic movement.",
    trainingGoal: "Improve bracing, anti-rotation, and positional control under fatigue and load.",
    difficultyLevel: "All Levels",
    equipmentNeeded: ["Mat", "Resistance band or cable"],
    exercises: [
      {
        id: "dead-bug",
        name: "Dead Bug",
        explanation:
          "A low-risk trunk control drill that teaches the athlete to move the limbs while keeping the ribs and pelvis organized.",
        coachingCues: [
          "Press the low back gently toward the floor.",
          "Exhale as the arm and leg reach.",
          "Move only as far as you can control."
        ],
        commonMistakes: [
          "Arching the low back.",
          "Moving too fast.",
          "Holding breath without control."
        ],
        modifications: {
          beginner: "Move one leg at a time with arms fixed.",
          intermediate: "Alternate opposite arm and leg reaches.",
          advanced: "Add a light band pulldown or longer lever reach."
        },
        videoUrl: videoPlaceholder("dead-bug"),
        recommended: "2-3 sets of 6-10 controlled reps per side",
        safetyNotes: ["Stop if low-back discomfort increases.", "Shorten range before adding difficulty."],
        progressionNotes: ["Progress by increasing lever length, pause time, or band tension."]
      },
      {
        id: "plank",
        name: "Plank",
        explanation:
          "A foundational anti-extension position used to train full-body tension and trunk endurance.",
        coachingCues: [
          "Stack elbows under shoulders.",
          "Squeeze glutes and brace the trunk.",
          "Keep a straight line from head to heels."
        ],
        commonMistakes: [
          "Letting hips sag.",
          "Piking hips too high.",
          "Holding longer than position quality allows."
        ],
        modifications: {
          beginner: "Use an incline plank with hands on a bench.",
          intermediate: "Hold a forearm plank with clean alignment.",
          advanced: "Add shoulder taps, long-lever position, or loaded plank variation."
        },
        videoUrl: videoPlaceholder("plank"),
        recommended: "3 sets of 20-45 seconds",
        safetyNotes: ["End the set when alignment fails.", "Avoid pushing through shoulder or back pain."],
        progressionNotes: ["Progress by adding time only while position quality stays high."]
      },
      {
        id: "pallof-press",
        name: "Pallof Press",
        explanation:
          "An anti-rotation press using a band or cable to teach the trunk to resist unwanted movement.",
        coachingCues: [
          "Stand tall with ribs stacked.",
          "Press straight out from the chest.",
          "Resist rotation as the arms extend."
        ],
        commonMistakes: [
          "Letting the hips twist.",
          "Using too much band tension.",
          "Shrugging shoulders during the press."
        ],
        modifications: {
          beginner: "Use a light band and short hold.",
          intermediate: "Press and hold for 2-3 seconds each rep.",
          advanced: "Use a split stance, tall kneeling position, or walkout variation."
        },
        videoUrl: videoPlaceholder("pallof-press"),
        recommended: "2-4 sets of 8-12 reps per side",
        safetyNotes: ["Use a secure anchor.", "Choose tension that allows full control."],
        progressionNotes: ["Progress by increasing tension, hold duration, or stance challenge."]
      },
      {
        id: "suitcase-carry",
        name: "Suitcase Carry",
        explanation:
          "A loaded carry that trains lateral trunk stability, bracing, posture, and controlled gait under offset load.",
        coachingCues: [
          "Stand tall without leaning away from the load.",
          "Brace before the first step.",
          "Walk with quiet, controlled steps."
        ],
        commonMistakes: [
          "Letting the torso tilt.",
          "Rushing the carry distance.",
          "Choosing a load that breaks posture."
        ],
        modifications: {
          beginner: "Use a light dumbbell or kettlebell and carry for short distances.",
          intermediate: "Carry a moderate load for controlled distance or time.",
          advanced: "Use heavier offset loading, longer distances, or slower tempo steps."
        },
        videoUrl: videoPlaceholder("suitcase-carry"),
        recommended: "3-4 carries of 20-40 yards per side",
        safetyNotes: ["Keep posture clean.", "Stop the set if grip, trunk, or shoulder position collapses."],
        progressionNotes: ["Progress distance and posture before load. Add load only when the carry stays controlled."]
      }
    ]
  },
  {
    id: "cardio-endurance",
    title: "Cardio & Endurance",
    shortDescription: "Develop conditioning that supports work capacity without random punishment.",
    trainingGoal: "Build aerobic base, repeatable output, and conditioning specific to the athlete's goal.",
    difficultyLevel: "All Levels",
    equipmentNeeded: ["Running route", "Bike, rower, or assault bike", "Timer"],
    exercises: [
      {
        id: "zone-2-run",
        name: "Zone 2 Run",
        explanation:
          "A controlled aerobic session performed at a conversational pace to build sustainable work capacity.",
        coachingCues: [
          "Keep breathing controlled.",
          "Maintain a pace you could repeat tomorrow.",
          "Finish feeling like more work was available."
        ],
        commonMistakes: [
          "Turning every run into a race.",
          "Starting too fast.",
          "Ignoring terrain, heat, or fatigue."
        ],
        modifications: {
          beginner: "Use a walk-run approach with nasal or conversational breathing.",
          intermediate: "Run continuously at steady aerobic effort.",
          advanced: "Extend duration or use rolling terrain while keeping output controlled."
        },
        videoUrl: videoPlaceholder("zone-2-run"),
        recommended: "20-45 minutes at easy aerobic effort",
        safetyNotes: ["Use safe routes and visibility.", "Stop for concerning symptoms and seek appropriate guidance."],
        progressionNotes: ["Progress duration before pace. Keep intensity controlled."]
      },
      {
        id: "tempo-intervals",
        name: "Tempo Intervals",
        explanation:
          "Repeatable conditioning intervals performed below all-out speed to develop rhythm and sustainable output.",
        coachingCues: [
          "Run tall and relaxed.",
          "Keep each rep repeatable.",
          "Recover enough to preserve mechanics."
        ],
        commonMistakes: [
          "Sprinting the first interval.",
          "Letting mechanics fall apart.",
          "Using too little recovery."
        ],
        modifications: {
          beginner: "Use shorter intervals such as 6 x 30 seconds.",
          intermediate: "Use 6-10 repeats at controlled tempo.",
          advanced: "Increase reps or distance while keeping pace consistent."
        },
        videoUrl: videoPlaceholder("tempo-intervals"),
        recommended: "6-10 rounds of 30-90 seconds with controlled recovery",
        safetyNotes: ["Warm up before faster running.", "Avoid maximal sprinting if not prepared."],
        progressionNotes: ["Progress total volume before increasing speed."]
      },
      {
        id: "assault-bike-intervals",
        name: "Assault Bike Intervals",
        explanation:
          "Low-skill, high-output intervals that build repeat power and conditioning without impact.",
        coachingCues: [
          "Drive with both arms and legs.",
          "Keep posture strong.",
          "Match output to the session goal."
        ],
        commonMistakes: [
          "Going all-out on every interval.",
          "Letting the torso collapse.",
          "Skipping warm-up."
        ],
        modifications: {
          beginner: "Use moderate 20-second pushes with long recovery.",
          intermediate: "Use repeat hard efforts with consistent wattage.",
          advanced: "Use sprint intervals or mixed aerobic/anaerobic blocks."
        },
        videoUrl: videoPlaceholder("assault-bike-intervals"),
        recommended: "8-12 rounds of 15-30 seconds work / 60-90 seconds easy",
        safetyNotes: ["Build intensity gradually.", "Stop if dizziness, chest pain, or unusual symptoms occur."],
        progressionNotes: ["Progress by improving repeatability, then volume, then peak output."]
      }
    ]
  },
  {
    id: "balance-body-control",
    title: "Balance & Body Control",
    shortDescription: "Improve single-leg control, landing quality, and coordination under movement demand.",
    trainingGoal: "Build body control that carries into sprinting, cutting, jumping, lifting, and field work.",
    difficultyLevel: "All Levels",
    equipmentNeeded: ["Open floor space", "Light dumbbell or kettlebell optional"],
    exercises: [
      {
        id: "single-leg-balance-reach",
        name: "Single-Leg Balance Reach",
        explanation:
          "A single-leg control drill that challenges balance while the athlete reaches in different directions.",
        coachingCues: [
          "Grip the floor with the stance foot.",
          "Keep the knee tracking over the toes.",
          "Reach slowly and return with control."
        ],
        commonMistakes: [
          "Letting the arch collapse.",
          "Reaching too far too soon.",
          "Losing posture to chase range."
        ],
        modifications: {
          beginner: "Use a wall or dowel for light support.",
          intermediate: "Reach front, side, and diagonal without support.",
          advanced: "Add a light load or unstable visual target."
        },
        videoUrl: videoPlaceholder("single-leg-balance-reach"),
        recommended: "2-3 sets of 4-6 reaches per direction per side",
        safetyNotes: ["Use clear floor space.", "Choose a range that keeps control."],
        progressionNotes: ["Progress reach distance, directions, or light loading."]
      },
      {
        id: "lateral-bound-stick",
        name: "Lateral Bound Stick",
        explanation:
          "A lateral jump and landing drill that trains body control, deceleration, and single-leg stability.",
        coachingCues: [
          "Push the ground away.",
          "Land quietly with knee and foot aligned.",
          "Stick the landing before resetting."
        ],
        commonMistakes: [
          "Landing loud or stiff.",
          "Letting the knee cave inward.",
          "Jumping farther than control allows."
        ],
        modifications: {
          beginner: "Step laterally and hold the landing position.",
          intermediate: "Bound side to side and stick each landing.",
          advanced: "Increase distance or add reactive direction changes."
        },
        videoUrl: videoPlaceholder("lateral-bound-stick"),
        recommended: "3 sets of 3-5 controlled reps per side",
        safetyNotes: ["Use a non-slip surface.", "Do not increase distance if landing quality drops."],
        progressionNotes: ["Progress distance only after quiet, stable landings are consistent."]
      },
      {
        id: "single-leg-rdl",
        name: "Single-Leg RDL",
        explanation:
          "A hinge pattern that builds posterior-chain strength, hip control, and single-leg stability.",
        coachingCues: [
          "Reach the back leg long.",
          "Keep hips square to the floor.",
          "Move through the hip, not the spine."
        ],
        commonMistakes: [
          "Opening the hip toward the ceiling.",
          "Rounding the back.",
          "Bending the stance knee too much."
        ],
        modifications: {
          beginner: "Use a kickstand stance or hand support.",
          intermediate: "Perform bodyweight or light-loaded single-leg reps.",
          advanced: "Use heavier load, slower tempo, or reach variations."
        },
        videoUrl: videoPlaceholder("single-leg-rdl"),
        recommended: "2-4 sets of 6-10 reps per side",
        safetyNotes: ["Keep range controlled.", "Stop if balance loss creates unsafe movement."],
        progressionNotes: ["Progress from supported to unsupported, then add load."]
      }
    ]
  },
  {
    id: "plyometrics-explosiveness",
    title: "Plyometrics & Explosiveness",
    shortDescription: "Train crisp, athletic power with landing quality and controlled dosage.",
    trainingGoal: "Improve elastic response, jumping power, and force production without chasing fatigue.",
    difficultyLevel: "Intermediate",
    equipmentNeeded: ["Open space", "Med ball optional"],
    exercises: [
      {
        id: "pogo-jumps",
        name: "Pogo Jumps",
        explanation:
          "A low-amplitude jump drill that develops ankle stiffness, rhythm, and elastic reactivity.",
        coachingCues: [
          "Stay tall through the torso.",
          "Use quick contacts with the ground.",
          "Keep jumps small and springy."
        ],
        commonMistakes: [
          "Bending the knees too much.",
          "Landing loud.",
          "Turning it into conditioning."
        ],
        modifications: {
          beginner: "Use low two-leg pogos with short sets.",
          intermediate: "Increase rhythm and total contacts.",
          advanced: "Use single-leg or forward-moving pogos when ready."
        },
        videoUrl: videoPlaceholder("pogo-jumps"),
        recommended: "3-5 sets of 10-20 contacts",
        safetyNotes: ["Use low volume at first.", "Avoid if landing quality or lower-leg comfort is poor."],
        progressionNotes: ["Progress contact quality before height, speed, or single-leg versions."]
      },
      {
        id: "broad-jump",
        name: "Broad Jump",
        explanation:
          "A horizontal power drill that trains aggressive hip extension and controlled landing mechanics.",
        coachingCues: [
          "Load the hips.",
          "Swing arms with intent.",
          "Land balanced and stick the finish."
        ],
        commonMistakes: [
          "Landing with knees collapsing inward.",
          "Jumping for distance before landing well.",
          "Resetting too quickly between reps."
        ],
        modifications: {
          beginner: "Use a snap-down to stick landing without a jump.",
          intermediate: "Perform single broad jumps with full reset.",
          advanced: "Use repeat broad jumps only if landing quality stays high."
        },
        videoUrl: videoPlaceholder("broad-jump"),
        recommended: "3-5 sets of 2-4 quality reps",
        safetyNotes: ["Use open space and a grippy surface.", "Stop when landings become unstable."],
        progressionNotes: ["Progress distance only after stable landings are repeatable."]
      },
      {
        id: "med-ball-slam",
        name: "Med Ball Slam",
        explanation:
          "A full-body power exercise that teaches aggressive trunk and hip output with a simple implement.",
        coachingCues: [
          "Reach tall before the slam.",
          "Drive through the floor.",
          "Finish with the ribs down and core braced."
        ],
        commonMistakes: [
          "Using only the arms.",
          "Overarching the back overhead.",
          "Choosing a ball that is too heavy."
        ],
        modifications: {
          beginner: "Use a light ball and controlled overhead slam.",
          intermediate: "Use repeat slams with crisp resets.",
          advanced: "Use rotational or step-in slams when mechanics are sharp."
        },
        videoUrl: videoPlaceholder("med-ball-slam"),
        recommended: "3-5 sets of 4-8 powerful reps",
        safetyNotes: ["Use a slam-safe ball and surface.", "Keep the face clear of rebound path."],
        progressionNotes: ["Progress intent and variation before adding heavy volume."]
      }
    ]
  },
  {
    id: "speed-agility-quickness",
    title: "Speed, Agility & Quickness",
    shortDescription: "Build acceleration mechanics, foot rhythm, and change-of-direction control.",
    trainingGoal: "Improve first-step speed, body position, and repeatable agility without sloppy fatigue reps.",
    difficultyLevel: "Intermediate",
    equipmentNeeded: ["Open space", "Cones", "Timer optional"],
    exercises: [
      {
        id: "a-skips",
        name: "A-Skips",
        explanation:
          "A sprint mechanics drill that reinforces posture, front-side rhythm, and coordinated arm action.",
        coachingCues: [
          "Stay tall.",
          "Punch the knee up and foot down.",
          "Keep arms coordinated with the legs."
        ],
        commonMistakes: [
          "Leaning back.",
          "Overstriding in front.",
          "Letting rhythm get sloppy."
        ],
        modifications: {
          beginner: "Perform A-march before adding bounce.",
          intermediate: "Use controlled A-skips over 10-20 yards.",
          advanced: "Blend A-skips into buildups or acceleration work."
        },
        videoUrl: videoPlaceholder("a-skips"),
        recommended: "2-4 passes of 10-20 yards",
        safetyNotes: ["Warm up before sprint drills.", "Use a clear, flat surface."],
        progressionNotes: ["Progress from marching to skipping to build-up runs."]
      },
      {
        id: "10-yard-acceleration",
        name: "10-Yard Acceleration",
        explanation:
          "A short sprint start used to develop first-step intent, forward lean, and powerful ground drive.",
        coachingCues: [
          "Push, do not pop up.",
          "Drive arms violently but cleanly.",
          "Accelerate through the line."
        ],
        commonMistakes: [
          "Standing upright too early.",
          "Taking choppy first steps.",
          "Running too many low-quality reps."
        ],
        modifications: {
          beginner: "Use falling starts at 70-80 percent effort.",
          intermediate: "Use 3-point or athletic stance starts.",
          advanced: "Use timed reps or resisted starts with full recovery."
        },
        videoUrl: videoPlaceholder("10-yard-acceleration"),
        recommended: "4-8 reps with full recovery",
        safetyNotes: ["Sprint only after a full warm-up.", "Stop if mechanics or surface quality becomes unsafe."],
        progressionNotes: ["Progress intensity and start variation before increasing volume."]
      },
      {
        id: "5-10-5-shuttle",
        name: "5-10-5 Shuttle",
        explanation:
          "A change-of-direction drill that trains acceleration, deceleration, and re-acceleration.",
        coachingCues: [
          "Lower the hips before changing direction.",
          "Plant outside the foot and push away.",
          "Stay balanced through the turns."
        ],
        commonMistakes: [
          "Overrunning the line.",
          "Rounding the turn.",
          "Letting the knees collapse during the plant."
        ],
        modifications: {
          beginner: "Walk through the pattern and rehearse plant mechanics.",
          intermediate: "Run controlled reps at 80-90 percent.",
          advanced: "Use timed reps with full recovery and consistent technique."
        },
        videoUrl: videoPlaceholder("5-10-5-shuttle"),
        recommended: "3-6 quality reps with full recovery",
        safetyNotes: ["Use a grippy surface.", "Do not chase times if cutting mechanics break down."],
        progressionNotes: ["Progress speed only after clean deceleration and re-acceleration."]
      }
    ]
  },
  {
    id: "resistance-functional-strength",
    title: "Resistance & Functional Strength",
    shortDescription: "Build strength patterns that support athletic movement and real-world capacity.",
    trainingGoal: "Develop squat, push, hinge, and total-body strength with movement quality and progression.",
    difficultyLevel: "All Levels",
    equipmentNeeded: ["Dumbbell or kettlebell", "Bench or floor space"],
    exercises: [
      {
        id: "goblet-squat",
        name: "Goblet Squat",
        explanation:
          "A front-loaded squat that develops lower-body strength, trunk control, and clean squat mechanics.",
        coachingCues: [
          "Hold the weight tight to the chest.",
          "Drive knees in line with toes.",
          "Stand tall through the whole foot."
        ],
        commonMistakes: [
          "Rounding the back.",
          "Letting heels lift.",
          "Dropping below controlled range."
        ],
        modifications: {
          beginner: "Squat to a box with bodyweight or light load.",
          intermediate: "Use a controlled goblet squat with full-foot pressure.",
          advanced: "Use tempo, pauses, or heavier loading while keeping form."
        },
        videoUrl: videoPlaceholder("goblet-squat"),
        recommended: "3-4 sets of 6-12 reps",
        safetyNotes: ["Use a load you can control.", "Stop if pain or position loss occurs."],
        progressionNotes: ["Progress range, reps, tempo, or load based on quality."]
      },
      {
        id: "push-up",
        name: "Push-Up",
        explanation:
          "A horizontal pushing exercise that builds upper-body strength, trunk tension, and shoulder control.",
        coachingCues: [
          "Keep a straight line from head to heels.",
          "Screw hands into the floor.",
          "Lower with control and press the floor away."
        ],
        commonMistakes: [
          "Sagging hips.",
          "Flaring elbows too wide.",
          "Cutting range without intent."
        ],
        modifications: {
          beginner: "Use an incline push-up on a bench.",
          intermediate: "Use a full floor push-up with clean alignment.",
          advanced: "Add tempo, deficit, load, or explosive intent."
        },
        videoUrl: videoPlaceholder("push-up"),
        recommended: "3-5 sets of 6-15 reps",
        safetyNotes: ["Choose a variation that preserves shoulder comfort and trunk position."],
        progressionNotes: ["Lower the incline over time before adding advanced variations."]
      },
      {
        id: "kettlebell-deadlift",
        name: "Kettlebell Deadlift",
        explanation:
          "A hinge pattern that builds posterior-chain strength and teaches the athlete to load the hips.",
        coachingCues: [
          "Push hips back.",
          "Keep the kettlebell close.",
          "Stand tall by driving the floor away."
        ],
        commonMistakes: [
          "Squatting instead of hinging.",
          "Letting the back round.",
          "Reaching the bell too far forward."
        ],
        modifications: {
          beginner: "Elevate the kettlebell on a block to reduce range.",
          intermediate: "Use a standard kettlebell deadlift from the floor.",
          advanced: "Use heavier loads, tempo, or double-kettlebell variations."
        },
        videoUrl: videoPlaceholder("kettlebell-deadlift"),
        recommended: "3-4 sets of 6-10 reps",
        safetyNotes: ["Keep the spine controlled.", "Do not chase load if hinge mechanics break down."],
        progressionNotes: ["Progress range and load only after hinge pattern is consistent."]
      },
      {
        id: "farmer-carry",
        name: "Farmer Carry",
        explanation:
          "A loaded carry that builds grip, trunk stiffness, shoulder position, and total-body strength for real-world work.",
        coachingCues: [
          "Crush the handles without shrugging.",
          "Walk tall with ribs stacked over pelvis.",
          "Keep steps smooth and deliberate."
        ],
        commonMistakes: [
          "Letting the shoulders roll forward.",
          "Overstriding under load.",
          "Choosing load before owning posture."
        ],
        modifications: {
          beginner: "Use light dumbbells and carry for short, clean intervals.",
          intermediate: "Use moderate dumbbells or kettlebells for distance-based carries.",
          advanced: "Use heavy implements, longer carries, or carry variations after posture is proven."
        },
        videoUrl: videoPlaceholder("farmer-carry"),
        recommended: "3-5 carries of 30-60 seconds",
        safetyNotes: ["Use a clear path.", "Set the load down under control before grip or posture fails."],
        progressionNotes: ["Progress by increasing distance, then load, then density."]
      }
    ]
  },
  {
    id: "durability-recovery",
    title: "Durability & Recovery",
    shortDescription: "Build support work that helps athletes tolerate training and recover between outputs.",
    trainingGoal: "Improve tissue capacity, positional strength, and recovery habits without making medical claims.",
    difficultyLevel: "All Levels",
    equipmentNeeded: ["Band", "Bench", "Wall or slant board optional"],
    exercises: [
      {
        id: "tibialis-raises",
        name: "Tibialis Raises",
        explanation:
          "A lower-leg capacity exercise that strengthens the front of the shin through controlled ankle movement.",
        coachingCues: [
          "Keep heels planted.",
          "Pull toes up with control.",
          "Lower slowly instead of dropping."
        ],
        commonMistakes: [
          "Using momentum.",
          "Letting reps get sloppy.",
          "Doing too much volume too soon."
        ],
        modifications: {
          beginner: "Perform against a wall with a small range.",
          intermediate: "Increase distance from the wall for more challenge.",
          advanced: "Use longer sets or weighted tibialis raises if available."
        },
        videoUrl: videoPlaceholder("tibialis-raises"),
        recommended: "2-4 sets of 12-25 reps",
        safetyNotes: ["Build volume gradually.", "Reduce range or volume if discomfort appears."],
        progressionNotes: ["Progress reps first, then range, then loading."]
      },
      {
        id: "copenhagen-plank",
        name: "Copenhagen Plank",
        explanation:
          "An adductor and trunk strength exercise that challenges lateral stability and hip control.",
        coachingCues: [
          "Keep hips stacked.",
          "Drive the top leg into the bench.",
          "Brace the trunk and breathe."
        ],
        commonMistakes: [
          "Letting the hips sag.",
          "Using too long of a lever too soon.",
          "Holding through poor position."
        ],
        modifications: {
          beginner: "Use a bent-knee Copenhagen hold.",
          intermediate: "Use a straight-leg hold with short duration.",
          advanced: "Add controlled reps or longer lever holds."
        },
        videoUrl: videoPlaceholder("copenhagen-plank"),
        recommended: "2-3 sets of 10-25 seconds per side",
        safetyNotes: ["Start conservatively.", "Stop if groin discomfort becomes sharp or concerning."],
        progressionNotes: ["Progress from bent knee to straight leg, then duration or reps."]
      },
      {
        id: "band-pull-aparts",
        name: "Band Pull-Aparts",
        explanation:
          "A simple upper-back and shoulder-control drill used to reinforce posture and pulling volume.",
        coachingCues: [
          "Keep ribs down.",
          "Pull the band apart with shoulder blades moving smoothly.",
          "Control the return."
        ],
        commonMistakes: [
          "Shrugging shoulders.",
          "Overarching the back.",
          "Using a band that is too heavy."
        ],
        modifications: {
          beginner: "Use a light band and shorter range.",
          intermediate: "Use full-range reps with controlled tempo.",
          advanced: "Use pauses, diagonals, or higher total volume."
        },
        videoUrl: videoPlaceholder("band-pull-aparts"),
        recommended: "2-4 sets of 12-25 reps",
        safetyNotes: ["Use smooth reps.", "Avoid forcing shoulder range."],
        progressionNotes: ["Progress band tension or volume while keeping shoulders relaxed."]
      }
    ]
  },
  {
    id: "real-world-performance-workouts",
    title: "Real-World Performance Workouts",
    shortDescription: "Combine strength, conditioning, mobility, and athletic work into field-ready sessions.",
    trainingGoal: "Build repeatable capacity for real-world demands without turning every workout into a test.",
    difficultyLevel: "Intermediate",
    equipmentNeeded: ["Kettlebell or dumbbells", "Med ball optional", "Open space", "Timer"],
    exercises: [
      {
        id: "full-body-athletic-circuit",
        name: "Full-Body Athletic Circuit",
        explanation:
          "A balanced circuit using squat, push, pull, hinge, carry, and conditioning elements for total-body output.",
        coachingCues: [
          "Move with intent but keep technique sharp.",
          "Choose loads you can repeat.",
          "Treat transitions as part of the session."
        ],
        commonMistakes: [
          "Going too heavy too early.",
          "Letting movement quality collapse.",
          "Turning skill work into sloppy fatigue work."
        ],
        modifications: {
          beginner: "Use 3 movements and longer rest.",
          intermediate: "Use 5-6 movements with moderate rest.",
          advanced: "Use tighter rest windows or higher output while preserving quality."
        },
        videoUrl: videoPlaceholder("full-body-athletic-circuit"),
        recommended: "3-5 rounds of 5-6 movements, 30-45 seconds each",
        safetyNotes: ["Select movements within current ability.", "Stop or modify if concerning pain appears."],
        progressionNotes: ["Progress by improving consistency, then density, then load."]
      },
      {
        id: "tactical-conditioning-circuit",
        name: "Tactical Conditioning Circuit",
        explanation:
          "A mixed-capacity circuit using carries, loaded movement, bodyweight work, and conditioning to develop readiness.",
        coachingCues: [
          "Stay composed under fatigue.",
          "Keep posture strong on carries.",
          "Use repeatable output, not panic pace."
        ],
        commonMistakes: [
          "Using loads that break posture.",
          "Skipping recovery between rounds.",
          "Ignoring breathing control."
        ],
        modifications: {
          beginner: "Use lighter carries and fewer stations.",
          intermediate: "Use moderate loads and consistent round times.",
          advanced: "Use heavier carries or longer work intervals with strict form."
        },
        videoUrl: videoPlaceholder("tactical-conditioning-circuit"),
        recommended: "4-6 rounds with 3-5 stations",
        safetyNotes: ["Keep the training area clear.", "Do not use maximal loads when fatigued."],
        progressionNotes: ["Progress load, distance, or density one variable at a time."]
      },
      {
        id: "sprint-strength-combo",
        name: "Sprint + Strength Combo",
        explanation:
          "A contrast-style session pairing short acceleration work with strength movements for athletic output.",
        coachingCues: [
          "Sprint only when warm and prepared.",
          "Rest enough to keep reps fast.",
          "Keep strength reps crisp."
        ],
        commonMistakes: [
          "Turning sprints into conditioning.",
          "Pairing too many exercises.",
          "Rushing rest and losing speed."
        ],
        modifications: {
          beginner: "Use fast marches, skips, or low-intensity accelerations before strength.",
          intermediate: "Pair 10-yard accelerations with goblet squats or push-ups.",
          advanced: "Use timed sprints with heavier strength pairings and full recovery."
        },
        videoUrl: videoPlaceholder("sprint-strength-combo"),
        recommended: "4-6 rounds of 1 sprint + 1 strength movement",
        safetyNotes: ["Warm up thoroughly.", "Avoid maximal sprinting if mechanics or surface quality are not ready."],
        progressionNotes: ["Progress sprint quality and recovery discipline before adding volume."]
      }
    ]
  }
];

export function getModuleById(id: string) {
  return modules.find((module) => module.id === id);
}

export const defaultTestimonials = [
  {
    name: "Marcus V.",
    image_url: "https://i.pravatar.cc/160?img=12",
    result: "Built better conditioning, mobility, and confidence in real-world training.",
    rating: 5
  },
  {
    name: "Elena R.",
    image_url: "https://i.pravatar.cc/160?img=32",
    result: "Got a clear performance structure instead of random workouts.",
    rating: 5
  },
  {
    name: "Drew K.",
    image_url: "https://i.pravatar.cc/160?img=15",
    result: "Improved consistency with strength, conditioning, and recovery work.",
    rating: 5
  }
];
