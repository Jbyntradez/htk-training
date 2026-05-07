export const reviewStatuses = ["pending", "approved", "rejected"] as const;

export const reviewRatingOptions = [1, 2, 3, 4, 5] as const;

export const suggestedReviewTags = [
  "Explosiveness",
  "Endurance",
  "Mobility",
  "Durability",
  "Conditioning",
  "Confidence",
  "Strength",
  "Recovery",
  "Body Composition"
] as const;

export type ReviewStatus = (typeof reviewStatuses)[number];

export type ReviewRating = (typeof reviewRatingOptions)[number];

export type ReviewSubmissionPayload = {
  fullName: string;
  displayName: string;
  email: string;
  athleteType: string;
  trainingWithHtk: string;
  challengeBefore: string;
  resultImprovement: string;
  testimonialQuote: string;
  rating: ReviewRating | null;
  publicPermission: boolean;
  wantsVideoTestimonial: boolean;
  mediaUrl?: string;
  mediaLabel?: string;
  resultTags: string[];
  source?: string;
};

export type ReviewSubmissionErrors = Partial<
  Record<
    | "fullName"
    | "displayName"
    | "email"
    | "athleteType"
    | "trainingWithHtk"
    | "challengeBefore"
    | "resultImprovement"
    | "testimonialQuote"
    | "rating"
    | "media",
    string
  >
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tagKeywordMap: Array<{ tag: string; keywords: string[] }> = [
  { tag: "Explosiveness", keywords: ["explosive", "explosiveness", "speed", "pop", "vertical"] },
  { tag: "Endurance", keywords: ["endurance", "stamina", "engine", "cardio"] },
  { tag: "Mobility", keywords: ["mobility", "hips", "range of motion", "movement"] },
  { tag: "Durability", keywords: ["durable", "durability", "resilience", "resilient"] },
  { tag: "Conditioning", keywords: ["conditioning", "work capacity", "gassing", "repeat effort"] },
  { tag: "Confidence", keywords: ["confidence", "confident", "mindset"] },
  { tag: "Strength", keywords: ["strength", "stronger", "power"] },
  { tag: "Recovery", keywords: ["recovery", "recover", "bounce back"] },
  { tag: "Body Composition", keywords: ["leaner", "fat loss", "body composition", "weight"] }
];

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return false;
  }

  return value === "true" || value === "on" || value === "1" || value === "yes";
}

function asRating(value: unknown): ReviewRating | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return reviewRatingOptions.includes(parsed as ReviewRating)
    ? (parsed as ReviewRating)
    : null;
}

function sanitizeTags(tags: string[]) {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 6);
}

export function inferReviewTags(...inputs: string[]) {
  const haystack = inputs.join(" ").toLowerCase();

  return sanitizeTags(
    tagKeywordMap
      .filter((entry) => entry.keywords.some((keyword) => haystack.includes(keyword)))
      .map((entry) => entry.tag)
  );
}

export function normalizeReviewSubmissionPayload(
  input: unknown
): ReviewSubmissionPayload {
  const payload =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const testimonialQuote = asText(payload.testimonialQuote);
  const challengeBefore = asText(payload.challengeBefore);
  const resultImprovement = asText(payload.resultImprovement);

  return {
    fullName: asText(payload.fullName),
    displayName: asText(payload.displayName),
    email: asText(payload.email).toLowerCase(),
    athleteType: asText(payload.athleteType),
    trainingWithHtk: asText(payload.trainingWithHtk),
    challengeBefore,
    resultImprovement,
    testimonialQuote,
    rating: asRating(payload.rating),
    publicPermission: asBoolean(payload.publicPermission),
    wantsVideoTestimonial: asBoolean(payload.wantsVideoTestimonial),
    mediaUrl: asText(payload.mediaUrl) || undefined,
    mediaLabel: asText(payload.mediaLabel) || undefined,
    resultTags: sanitizeTags(
      Array.isArray(payload.resultTags)
        ? payload.resultTags.filter((value): value is string => typeof value === "string")
        : inferReviewTags(testimonialQuote, challengeBefore, resultImprovement)
    ),
    source: asText(payload.source) || "submit_review"
  };
}

export function validateReviewSubmissionPayload(input: unknown) {
  const payload = normalizeReviewSubmissionPayload(input);
  const errors: ReviewSubmissionErrors = {};

  if (!payload.fullName) {
    errors.fullName = "Enter your full name.";
  }

  if (!payload.displayName) {
    errors.displayName = "Enter the name or initials you want displayed publicly.";
  }

  if (!payload.email) {
    errors.email = "Enter your email.";
  } else if (!emailPattern.test(payload.email)) {
    errors.email = "Enter a valid email.";
  }

  if (!payload.athleteType) {
    errors.athleteType = "Share your athlete type, profession, or background.";
  }

  if (!payload.trainingWithHtk) {
    errors.trainingWithHtk = "Tell us how you trained with HTK.";
  }

  if (!payload.challengeBefore) {
    errors.challengeBefore = "Share the biggest challenge you were dealing with before HTK.";
  }

  if (!payload.resultImprovement) {
    errors.resultImprovement = "Share the result or improvement you experienced.";
  }

  if (!payload.testimonialQuote) {
    errors.testimonialQuote = "Add the testimonial quote you want us to review.";
  }

  return {
    payload,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}

