import { NextResponse } from "next/server";
import { formatSupabaseError } from "@/lib/supabase";
import {
  getReviewSubmission,
  updateReviewSubmission
} from "@/lib/review-storage";
import {
  reviewRatingOptions,
  reviewStatuses,
  type ReviewRating,
  type ReviewStatus
} from "@/lib/review-submission";

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return false;
  }

  return value === "true" || value === "1" || value === "on";
}

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))];
  }

  if (typeof value === "string") {
    return [
      ...new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      )
    ];
  }

  return [];
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const review = await getReviewSubmission(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
  }

  const payload = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const status = payload.status;
  const ratingValue = payload.rating;

  if (status && !reviewStatuses.includes(status as ReviewStatus)) {
    return NextResponse.json({ error: "Invalid review status." }, { status: 400 });
  }

  let rating: ReviewRating | null | undefined;

  if (ratingValue === null || ratingValue === "" || ratingValue === undefined) {
    rating = ratingValue === undefined ? undefined : null;
  } else {
    const numericRating = Number(ratingValue);

    if (!reviewRatingOptions.includes(numericRating as ReviewRating)) {
      return NextResponse.json({ error: "Invalid review rating." }, { status: 400 });
    }

    rating = numericRating as ReviewRating;
  }

  try {
    const review = await updateReviewSubmission(id, {
      displayName:
        typeof payload.displayName === "string" && payload.displayName.trim()
          ? payload.displayName.trim()
          : undefined,
      status: status as ReviewStatus | undefined,
      featured: payload.featured === undefined ? undefined : normalizeBoolean(payload.featured),
      publicPermission:
        payload.publicPermission === undefined
          ? undefined
          : normalizeBoolean(payload.publicPermission),
      rating,
      resultTags: payload.resultTags === undefined ? undefined : normalizeTags(payload.resultTags)
    });

    return NextResponse.json({ ok: true, review });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}
