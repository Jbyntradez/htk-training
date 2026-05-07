import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { formatSupabaseError, getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe webhook signature." }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId;

    if (clerkUserId) {
      try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.from("profiles").upsert(
          {
            clerk_user_id: clerkUserId,
            email: session.customer_details?.email,
            has_access: true,
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
            updated_at: new Date().toISOString()
          },
          { onConflict: "clerk_user_id" }
        );

        if (error) {
          console.error(`[stripe-webhook] Supabase profile upsert failed: ${formatSupabaseError(error)}`);
          return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
        }
      } catch (error) {
        return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
