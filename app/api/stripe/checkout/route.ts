import { NextResponse } from "next/server";
import { OperatorPlatformError, requireOperatorProfile } from "@/lib/operator-platform";
import { HTK_MEMBERSHIP_PRICE_ID, getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof OperatorPlatformError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : "Stripe checkout request failed.";

  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const profile = await requireOperatorProfile(request);

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new OperatorPlatformError("Stripe is not configured.", 503);
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: profile.id,
      customer_email: profile.email || undefined,
      line_items: [
        {
          price: HTK_MEMBERSHIP_PRICE_ID,
          quantity: 1
        }
      ],
      metadata: {
        profileId: profile.id,
        supabaseUserId: profile.authUserId,
        product: "htk_membership"
      },
      subscription_data: {
        metadata: {
          profileId: profile.id,
          supabaseUserId: profile.authUserId,
          product: "htk_membership"
        }
      },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
      allow_promotion_codes: true
    });

    if (!session.url) {
      throw new OperatorPlatformError("Stripe did not return a checkout URL.", 500);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return errorResponse(error);
  }
}
