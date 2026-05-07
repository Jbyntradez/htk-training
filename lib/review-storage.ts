import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  hasSupabaseConfig,
  logSupabaseError,
  shouldAllowLocalFileFallback
} from "@/lib/supabase";
import {
  inferReviewTags,
  type ReviewRating,
  type ReviewStatus,
  type ReviewSubmissionPayload
} from "@/lib/review-submission";

export type StoredReviewSubmission = {
  id: string;
  createdAt: string;
  storage: "supabase" | "local_file";
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
  status: ReviewStatus;
  featured: boolean;
  resultTags: string[];
  source: string;
};

export type ReviewSubmissionsListResult = {
  reviews: StoredReviewSubmission[];
  source: "supabase" | "local_file";
  fallback: boolean;
  issue?: string;
};

type ReviewUpdateInput = {
  displayName?: string;
  status?: ReviewStatus;
  featured?: boolean;
  publicPermission?: boolean;
  rating?: ReviewRating | null;
  resultTags?: string[];
};

type LegacyReviewPayload = {
  version: number;
  full_name: string;
  display_name: string;
  email: string;
  athlete_type: string;
  training_with_htk: string;
  challenge_before: string;
  result_improvement: string;
  testimonial_quote: string;
  rating: ReviewRating | null;
  public_permission: boolean;
  wants_video_testimonial: boolean;
  media_url?: string;
  media_label?: string;
  result_tags: string[];
  status: ReviewStatus;
  featured: boolean;
  source: string;
};

const localReviewPath = path.join(process.cwd(), "data", "review-submissions.ndjson");
const localUploadDir = path.join(process.cwd(), "public", "review-uploads");
const supabaseBucketName = "review-assets";

const fallbackPublicReviews: StoredReviewSubmission[] = [
  {
    id: "fallback-review-1",
    createdAt: "2026-04-20T18:00:00.000Z",
    storage: "local_file",
    fullName: "Marcus Hale",
    displayName: "Marcus H.",
    email: "marcus@example.com",
    athleteType: "Former collegiate defensive back",
    trainingWithHtk: "1:1 coaching",
    challengeBefore:
      "My speed and conditioning had fallen off and I was training hard without clear progression.",
    resultImprovement:
      "My first step came back, my work capacity improved, and recovery stopped lagging into the next week.",
    testimonialQuote:
      "HTK gave me structure that actually translated. I felt faster, cleaner, and more prepared every week.",
    rating: 5,
    publicPermission: true,
    wantsVideoTestimonial: true,
    mediaUrl: "/htk/hero-field-athlete.jpg",
    mediaLabel: "Field session",
    status: "approved",
    featured: true,
    resultTags: ["Explosiveness", "Conditioning", "Recovery"],
    source: "seed"
  },
  {
    id: "fallback-review-2",
    createdAt: "2026-04-19T18:00:00.000Z",
    storage: "local_file",
    fullName: "Alyssa Jordan",
    displayName: "Alyssa J.",
    email: "alyssa@example.com",
    athleteType: "Track athlete",
    trainingWithHtk: "Remote coaching block",
    challengeBefore:
      "I needed better movement quality and stronger conditioning without losing my athletic feel.",
    resultImprovement:
      "Mobility opened up, lower-body power came back, and sessions felt more intentional instead of random.",
    testimonialQuote:
      "The difference was not fluff. My movement cleaned up and my speed work felt natural again.",
    rating: 5,
    publicPermission: true,
    wantsVideoTestimonial: false,
    mediaUrl: "/htk/mirror-conditioning.jpg",
    mediaLabel: "Progress update",
    status: "approved",
    featured: true,
    resultTags: ["Mobility", "Explosiveness", "Confidence"],
    source: "seed"
  },
  {
    id: "fallback-review-3",
    createdAt: "2026-04-18T18:00:00.000Z",
    storage: "local_file",
    fullName: "Noah Carter",
    displayName: "Noah C.",
    email: "noah@example.com",
    athleteType: "Tactical professional",
    trainingWithHtk: "Performance consultation and programming",
    challengeBefore:
      "I wanted better durability and a stronger engine without turning training into random punishment.",
    resultImprovement:
      "I recovered faster, carried more work capacity, and moved with more control under fatigue.",
    testimonialQuote:
      "HTK feels like a real system. Better output, less wasted work, and more confidence in what I can handle.",
    rating: 5,
    publicPermission: true,
    wantsVideoTestimonial: true,
    mediaUrl: "/htk/gym-operator.jpg",
    mediaLabel: "Training floor",
    status: "approved",
    featured: false,
    resultTags: ["Durability", "Endurance", "Conditioning"],
    source: "seed"
  }
];

function getSupabaseConfigIssue() {
  try {
    getSupabaseAdmin();
    return "Supabase configuration check failed.";
  } catch (error) {
    return formatSupabaseError(error);
  }
}

function sanitizeFileName(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return cleaned.toLowerCase();
}

function mapPayloadToStored(
  payload: ReviewSubmissionPayload,
  base: Pick<StoredReviewSubmission, "id" | "createdAt" | "storage">
): StoredReviewSubmission {
  return {
    ...base,
    fullName: payload.fullName,
    displayName: payload.displayName,
    email: payload.email,
    athleteType: payload.athleteType,
    trainingWithHtk: payload.trainingWithHtk,
    challengeBefore: payload.challengeBefore,
    resultImprovement: payload.resultImprovement,
    testimonialQuote: payload.testimonialQuote,
    rating: payload.rating,
    publicPermission: payload.publicPermission,
    wantsVideoTestimonial: payload.wantsVideoTestimonial,
    mediaUrl: payload.mediaUrl,
    mediaLabel: payload.mediaLabel,
    status: "pending",
    featured: false,
    resultTags: payload.resultTags.length
      ? payload.resultTags
      : inferReviewTags(
          payload.testimonialQuote,
          payload.challengeBefore,
          payload.resultImprovement
        ),
    source: payload.source ?? "submit_review"
  };
}

function withDefaultTags(review: StoredReviewSubmission) {
  if (review.resultTags.length > 0) {
    return review;
  }

  return {
    ...review,
    resultTags: inferReviewTags(
      review.testimonialQuote,
      review.challengeBefore,
      review.resultImprovement
    )
  };
}

async function saveLocally(
  payload: ReviewSubmissionPayload
): Promise<StoredReviewSubmission> {
  await mkdir(path.dirname(localReviewPath), { recursive: true });

  const record = withDefaultTags(
    mapPayloadToStored(payload, {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      storage: "local_file"
    })
  );

  await appendFile(localReviewPath, `${JSON.stringify(record)}\n`, "utf8");

  return record;
}

async function listLocalReviews() {
  try {
    const raw = await readFile(localReviewPath, "utf8");

    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredReviewSubmission)
      .map(withDefaultTags)
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function rewriteLocalReviews(reviews: StoredReviewSubmission[]) {
  await mkdir(path.dirname(localReviewPath), { recursive: true });
  const body = reviews.map((review) => JSON.stringify(review)).join("\n");
  await writeFile(localReviewPath, body ? `${body}\n` : "", "utf8");
}

function mapSupabaseRow(row: {
  id: string;
  created_at: string;
  full_name: string;
  display_name: string;
  email: string;
  athlete_type: string;
  training_with_htk: string;
  challenge_before: string;
  result_improvement: string;
  testimonial_quote: string;
  rating: ReviewRating | null;
  public_permission: boolean;
  wants_video_testimonial: boolean;
  media_url: string | null;
  media_label: string | null;
  status: ReviewStatus;
  featured: boolean;
  result_tags: string[] | null;
  source: string | null;
}): StoredReviewSubmission {
  return withDefaultTags({
    id: row.id,
    createdAt: row.created_at,
    storage: "supabase",
    fullName: row.full_name,
    displayName: row.display_name,
    email: row.email,
    athleteType: row.athlete_type,
    trainingWithHtk: row.training_with_htk,
    challengeBefore: row.challenge_before,
    resultImprovement: row.result_improvement,
    testimonialQuote: row.testimonial_quote,
    rating: row.rating,
    publicPermission: row.public_permission,
    wantsVideoTestimonial: row.wants_video_testimonial,
    mediaUrl: row.media_url ?? undefined,
    mediaLabel: row.media_label ?? undefined,
    status: row.status,
    featured: row.featured,
    resultTags: row.result_tags ?? [],
    source: row.source ?? "submit_review"
  });
}

function mapStoredToLegacyPayload(
  review: StoredReviewSubmission
): LegacyReviewPayload {
  return {
    version: 1,
    full_name: review.fullName,
    display_name: review.displayName,
    email: review.email,
    athlete_type: review.athleteType,
    training_with_htk: review.trainingWithHtk,
    challenge_before: review.challengeBefore,
    result_improvement: review.resultImprovement,
    testimonial_quote: review.testimonialQuote,
    rating: review.rating,
    public_permission: review.publicPermission,
    wants_video_testimonial: review.wantsVideoTestimonial,
    media_url: review.mediaUrl,
    media_label: review.mediaLabel,
    result_tags: review.resultTags,
    status: review.status,
    featured: review.featured,
    source: review.source
  };
}

function mapLegacyRow(row: {
  id: string;
  name: string;
  image_url: string;
  result: string;
  rating: number;
  approved: boolean;
  created_at: string;
}): StoredReviewSubmission {
  try {
    const parsed = JSON.parse(row.result) as Partial<LegacyReviewPayload>;

    return withDefaultTags({
      id: row.id,
      createdAt: row.created_at,
      storage: "supabase",
      fullName: parsed.full_name || row.name,
      displayName: parsed.display_name || row.name,
      email: parsed.email || "",
      athleteType: parsed.athlete_type || "HTK client",
      trainingWithHtk: parsed.training_with_htk || "Coaching",
      challengeBefore: parsed.challenge_before || "Client feedback submitted through HTK.",
      resultImprovement: parsed.result_improvement || row.result,
      testimonialQuote: parsed.testimonial_quote || row.result,
      rating:
        parsed.rating ?? (row.rating >= 1 && row.rating <= 5 ? (row.rating as ReviewRating) : null),
      publicPermission: parsed.public_permission ?? row.approved,
      wantsVideoTestimonial: parsed.wants_video_testimonial ?? false,
      mediaUrl: parsed.media_url || row.image_url || undefined,
      mediaLabel: parsed.media_label,
      status: parsed.status ?? (row.approved ? "approved" : "pending"),
      featured: parsed.featured ?? false,
      resultTags: Array.isArray(parsed.result_tags) ? parsed.result_tags : [],
      source: parsed.source || "legacy_reviews"
    });
  } catch {
    return withDefaultTags({
      id: row.id,
      createdAt: row.created_at,
      storage: "supabase",
      fullName: row.name,
      displayName: row.name,
      email: "",
      athleteType: "HTK client",
      trainingWithHtk: "Coaching",
      challengeBefore: "Legacy review submission.",
      resultImprovement: row.result,
      testimonialQuote: row.result,
      rating: row.rating >= 1 && row.rating <= 5 ? (row.rating as ReviewRating) : null,
      publicPermission: row.approved,
      wantsVideoTestimonial: false,
      mediaUrl: row.image_url || undefined,
      status: row.approved ? "approved" : "pending",
      featured: false,
      resultTags: inferReviewTags(row.result),
      source: "legacy_reviews"
    });
  }
}

async function saveToSupabaseTable(
  payload: ReviewSubmissionPayload
): Promise<StoredReviewSubmission> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("review_submissions")
    .insert({
      full_name: payload.fullName,
      display_name: payload.displayName,
      email: payload.email,
      athlete_type: payload.athleteType,
      training_with_htk: payload.trainingWithHtk,
      challenge_before: payload.challengeBefore,
      result_improvement: payload.resultImprovement,
      testimonial_quote: payload.testimonialQuote,
      rating: payload.rating,
      public_permission: payload.publicPermission,
      wants_video_testimonial: payload.wantsVideoTestimonial,
      media_url: payload.mediaUrl ?? null,
      media_label: payload.mediaLabel ?? null,
      status: "pending",
      featured: false,
      result_tags: payload.resultTags,
      source: payload.source ?? "submit_review"
    })
    .select(
      "id, created_at, full_name, display_name, email, athlete_type, training_with_htk, challenge_before, result_improvement, testimonial_quote, rating, public_permission, wants_video_testimonial, media_url, media_label, status, featured, result_tags, source"
    )
    .single();

  if (error) {
    throw error;
  }

  const { error: leadsError } = await supabase
    .from("leads")
    .upsert({ email: payload.email, source: "review_submission" }, { onConflict: "email" });

  if (leadsError) {
    logSupabaseError("review-submissions.leads-upsert", leadsError);
  }

  return mapSupabaseRow(data);
}

async function saveToLegacySupabase(
  payload: ReviewSubmissionPayload
): Promise<StoredReviewSubmission> {
  const supabase = getSupabaseAdmin();
  const review = withDefaultTags(
    mapPayloadToStored(payload, {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      storage: "supabase"
    })
  );

  const legacyPayload = mapStoredToLegacyPayload(review);
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name: review.fullName,
      image_url: review.mediaUrl ?? "",
      result: JSON.stringify(legacyPayload),
      rating: review.rating ?? 5,
      approved: false
    })
    .select("id, name, image_url, result, rating, approved, created_at")
    .single();

  if (error) {
    throw error;
  }

  const { error: leadsError } = await supabase
    .from("leads")
    .upsert({ email: payload.email, source: "review_submission" }, { onConflict: "email" });

  if (leadsError) {
    logSupabaseError("review-submissions.legacy-leads-upsert", leadsError);
  }

  return mapLegacyRow(data);
}

async function listSupabaseTableReviews() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("review_submissions")
    .select(
      "id, created_at, full_name, display_name, email, athlete_type, training_with_htk, challenge_before, result_improvement, testimonial_quote, rating, public_permission, wants_video_testimonial, media_url, media_label, status, featured, result_tags, source"
    )
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapSupabaseRow);
}

async function listLegacySupabaseReviews() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, image_url, result, rating, approved, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapLegacyRow);
}

async function getSupabaseTableReview(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("review_submissions")
    .select(
      "id, created_at, full_name, display_name, email, athlete_type, training_with_htk, challenge_before, result_improvement, testimonial_quote, rating, public_permission, wants_video_testimonial, media_url, media_label, status, featured, result_tags, source"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseRow(data);
}

async function getLegacySupabaseReview(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, image_url, result, rating, approved, created_at")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapLegacyRow(data);
}

async function updateSupabaseTableReview(id: string, updates: ReviewUpdateInput) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("review_submissions")
    .update({
      display_name: updates.displayName,
      status: updates.status,
      featured: updates.featured,
      public_permission: updates.publicPermission,
      rating: updates.rating,
      result_tags: updates.resultTags
    })
    .eq("id", id)
    .select(
      "id, created_at, full_name, display_name, email, athlete_type, training_with_htk, challenge_before, result_improvement, testimonial_quote, rating, public_permission, wants_video_testimonial, media_url, media_label, status, featured, result_tags, source"
    )
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseRow(data);
}

async function updateLegacySupabaseReview(id: string, updates: ReviewUpdateInput) {
  const supabase = getSupabaseAdmin();
  const existing = await getLegacySupabaseReview(id);

  const merged: StoredReviewSubmission = withDefaultTags({
    ...existing,
    displayName: updates.displayName ?? existing.displayName,
    status: updates.status ?? existing.status,
    featured: updates.featured ?? existing.featured,
    publicPermission: updates.publicPermission ?? existing.publicPermission,
    rating: updates.rating === undefined ? existing.rating : updates.rating,
    resultTags: updates.resultTags ?? existing.resultTags
  });

  const { data, error } = await supabase
    .from("reviews")
    .update({
      name: merged.fullName,
      image_url: merged.mediaUrl ?? "",
      result: JSON.stringify(mapStoredToLegacyPayload(merged)),
      rating: merged.rating ?? 5,
      approved: merged.status === "approved" && merged.publicPermission
    })
    .eq("id", id)
    .select("id, name, image_url, result, rating, approved, created_at")
    .single();

  if (error) {
    throw error;
  }

  return mapLegacyRow(data);
}

export async function uploadReviewMedia(file: File | null) {
  if (!file || file.size === 0) {
    return undefined;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Uploads must be image files.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Uploads must be 5 MB or smaller.");
  }

  const extension = path.extname(file.name) || ".png";
  const safeName = sanitizeFileName(path.basename(file.name, extension));
  const fileName = `${Date.now()}-${randomUUID()}-${safeName}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasSupabaseConfig()) {
    try {
      const supabase = getSupabaseAdmin();
      const uploadPath = `review-submissions/${fileName}`;

      const { data, error } = await supabase.storage
        .from(supabaseBucketName)
        .upload(uploadPath, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: publicUrl } = supabase.storage
        .from(supabaseBucketName)
        .getPublicUrl(data.path);

      return {
        url: publicUrl.publicUrl,
        label: file.name
      };
    } catch (error) {
      const message = logSupabaseError("review-submissions.upload", error);

      if (!shouldAllowLocalFileFallback()) {
        throw new Error(message);
      }

      console.error("[review-submissions.upload] Falling back to local file storage.");
    }
  }

  if (!hasSupabaseConfig() && !shouldAllowLocalFileFallback()) {
    throw new Error(getSupabaseConfigIssue());
  }

  await mkdir(localUploadDir, { recursive: true });
  const localPath = path.join(localUploadDir, fileName);
  await writeFile(localPath, buffer);

  return {
    url: `/review-uploads/${fileName}`,
    label: file.name
  };
}

export async function saveReviewSubmission(
  payload: ReviewSubmissionPayload
): Promise<StoredReviewSubmission> {
  if (hasSupabaseConfig()) {
    try {
      return await saveToSupabaseTable(payload);
    } catch (error) {
      const message = formatSupabaseError(error);

      if (message.includes("review_submissions")) {
        try {
          return await saveToLegacySupabase(payload);
        } catch (legacyError) {
          const legacyMessage = logSupabaseError("review-submissions.save.legacy", legacyError);

          if (!shouldAllowLocalFileFallback()) {
            throw new Error(legacyMessage);
          }

          console.error("[review-submissions.save] Falling back to local file storage.");
          return await saveLocally(payload);
        }
      }

      logSupabaseError("review-submissions.save", error);

      if (!shouldAllowLocalFileFallback()) {
        throw new Error(message);
      }

      console.error("[review-submissions.save] Falling back to local file storage.");
      return await saveLocally(payload);
    }
  }

  if (!shouldAllowLocalFileFallback()) {
    throw new Error(getSupabaseConfigIssue());
  }

  return saveLocally(payload);
}

export async function listReviewSubmissions(): Promise<ReviewSubmissionsListResult> {
  if (hasSupabaseConfig()) {
    try {
      return {
        reviews: await listSupabaseTableReviews(),
        source: "supabase",
        fallback: false
      };
    } catch (error) {
      const message = formatSupabaseError(error);

      try {
        return {
          reviews: await listLegacySupabaseReviews(),
          source: "supabase",
          fallback: false
        };
      } catch (legacyError) {
        const issue = logSupabaseError("review-submissions.list.legacy", legacyError);

        if (!shouldAllowLocalFileFallback()) {
          return {
            reviews: [],
            source: "supabase",
            fallback: false,
            issue: `${message}; legacy fallback failed: ${issue}`
          };
        }

        console.error("[review-submissions.list] Falling back to local file storage.");

        return {
          reviews: await listLocalReviews(),
          source: "local_file",
          fallback: true,
          issue: message
        };
      }
    }
  }

  if (!shouldAllowLocalFileFallback()) {
    return {
      reviews: [],
      source: "supabase",
      fallback: false,
      issue: getSupabaseConfigIssue()
    };
  }

  return {
    reviews: await listLocalReviews(),
    source: "local_file",
    fallback: false
  };
}

export async function getReviewSubmission(id: string) {
  if (hasSupabaseConfig()) {
    try {
      return await getSupabaseTableReview(id);
    } catch (error) {
      try {
        return await getLegacySupabaseReview(id);
      } catch (legacyError) {
        const issue = logSupabaseError("review-submissions.get.legacy", legacyError);

        if (!shouldAllowLocalFileFallback()) {
          throw new Error(issue);
        }

        console.error("[review-submissions.get] Falling back to local file storage.");
      }
    }
  }

  if (!hasSupabaseConfig() && !shouldAllowLocalFileFallback()) {
    throw new Error(getSupabaseConfigIssue());
  }

  const reviews = await listLocalReviews();
  return reviews.find((review) => review.id === id) ?? null;
}

export async function updateReviewSubmission(id: string, updates: ReviewUpdateInput) {
  if (hasSupabaseConfig()) {
    try {
      return await updateSupabaseTableReview(id, updates);
    } catch (error) {
      try {
        return await updateLegacySupabaseReview(id, updates);
      } catch (legacyError) {
        const issue = logSupabaseError("review-submissions.update.legacy", legacyError);

        if (!shouldAllowLocalFileFallback()) {
          throw new Error(issue);
        }

        console.error("[review-submissions.update] Falling back to local file storage.");
      }
    }
  }

  if (!hasSupabaseConfig() && !shouldAllowLocalFileFallback()) {
    throw new Error(getSupabaseConfigIssue());
  }

  const reviews = await listLocalReviews();
  const index = reviews.findIndex((review) => review.id === id);

  if (index === -1) {
    throw new Error("Review not found.");
  }

  const updated = withDefaultTags({
    ...reviews[index],
    displayName: updates.displayName ?? reviews[index].displayName,
    status: updates.status ?? reviews[index].status,
    featured: updates.featured ?? reviews[index].featured,
    publicPermission: updates.publicPermission ?? reviews[index].publicPermission,
    rating: updates.rating === undefined ? reviews[index].rating : updates.rating,
    resultTags: updates.resultTags ?? reviews[index].resultTags
  });

  reviews[index] = updated;
  await rewriteLocalReviews(reviews);

  return updated;
}

export async function listApprovedPublicReviews() {
  const result = await listReviewSubmissions();
  const reviews = result.reviews.filter(
    (review) => review.status === "approved" && review.publicPermission
  );

  if (reviews.length === 0) {
    return fallbackPublicReviews;
  }

  return reviews
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return Number(right.featured) - Number(left.featured);
      }

      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    })
    .slice(0, 24);
}

export function getReviewSubmissionStorageMode() {
  if (!shouldAllowLocalFileFallback()) {
    return "supabase_required";
  }

  return hasSupabaseConfig() ? "supabase_with_local_fallback" : "local_file";
}

export function getLocalReviewSubmissionsPath() {
  return localReviewPath;
}
