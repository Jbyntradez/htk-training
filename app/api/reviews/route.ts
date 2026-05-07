import { NextResponse } from "next/server";
import { formatSupabaseError } from "@/lib/supabase";
import {
  listApprovedPublicReviews,
  saveReviewSubmission,
  uploadReviewMedia
} from "@/lib/review-storage";
import { validateReviewSubmissionPayload } from "@/lib/review-submission";

export async function GET() {
  try {
    const reviews = await listApprovedPublicReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid review submission." }, { status: 400 });
  }

  const mediaFile = formData.get("media");
  let upload:
    | {
        url: string;
        label: string;
      }
    | undefined;

  try {
    upload = await uploadReviewMedia(mediaFile instanceof File ? mediaFile : null);
  } catch (error) {
    const message = formatSupabaseError(error);

    if (message.startsWith("Uploads must be")) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted fields.",
          fieldErrors: {
            media: message
          }
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

  const validation = validateReviewSubmissionPayload({
    fullName: formData.get("fullName"),
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    athleteType: formData.get("athleteType"),
    trainingWithHtk: formData.get("trainingWithHtk"),
    challengeBefore: formData.get("challengeBefore"),
    resultImprovement: formData.get("resultImprovement"),
    testimonialQuote: formData.get("testimonialQuote"),
    rating: formData.get("rating"),
    publicPermission: formData.get("publicPermission"),
    wantsVideoTestimonial: formData.get("wantsVideoTestimonial"),
    mediaUrl: upload?.url,
    mediaLabel: upload?.label,
    source: "submit_review"
  });

  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: "Please correct the highlighted fields.",
        fieldErrors: validation.errors
      },
      { status: 400 }
    );
  }

  try {
    const review = await saveReviewSubmission(validation.payload);

    return NextResponse.json(
      {
        ok: true,
        review
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
  }
}
