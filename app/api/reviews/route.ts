import { NextResponse } from "next/server";
import { getApprovedReviews } from "@/lib/reviews";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

export async function GET() {
  const reviews = await getApprovedReviews();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const body = await request.json();
  const rating = Number(body.rating);

  if (!body.name || !body.result || !body.image_url || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Name, image, result, and 1-5 rating are required." }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        review: {
          id: "preview-review",
          name: body.name,
          image_url: body.image_url,
          result: body.result,
          rating,
          approved: false
        },
        preview: true
      },
      { status: 201 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name: body.name,
      image_url: body.image_url,
      result: body.result,
      rating,
      approved: false
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: data }, { status: 201 });
}
