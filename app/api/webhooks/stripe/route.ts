import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function subscriptionAccessState(subscription: Stripe.Subscription) {
  const status = subscription.status;
  const currentPeriodEnd =
    typeof subscription.current_period_end === "number"
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;

  if (status === "active" || status === "trialing") {
    return {
      has_access: true,
      access_status: status,
      access_expires_at: currentPeriodEnd
    };
  }

  if (status === "past_due" || status === "unpaid" || status === "canceled") {
    return {
      has_access: false,
      access_status: status,
      access_expires_at: currentPeriodEnd
    };
  }

  return {
    has_access: false,
    access_status: status === "incomplete_expired" ? "expired" : "none",
    access_expires_at: currentPeriodEnd
  };
}

async function grantAccessFromCheckoutSession(session: Stripe.Checkout.Session) {
  const profileId =
    typeof session.metadata?.profileId === "string" && uuidPattern.test(session.metadata.profileId)
      ? session.metadata.profileId
      : typeof session.client_reference_id === "string" && uuidPattern.test(session.client_reference_id)
        ? session.client_reference_id
        : "";
  const authUserId =
    typeof session.metadata?.supabaseUserId === "string"
      ? session.metadata.supabaseUserId
      : typeof session.metadata?.clerkUserId === "string"
        ? session.metadata.clerkUserId
        : "";
  const customerId = typeof session.customer === "string" ? session.customer : null;
  const update = {
    email: session.customer_details?.email ?? null,
    has_access: true,
    access_status: "active",
    access_source: "stripe",
    access_expires_at: null,
    stripe_customer_id: customerId,
    updated_at: new Date().toISOString()
  };
  const supabase = getSupabaseAdmin();

  if (profileId) {
    await supabase
      .from("profiles")
      .update(update)
      .eq("id", profileId);
    return;
  }

  if (authUserId) {
    await supabase.from("profiles").upsert(
      {
        clerk_user_id: authUserId,
        ...update
      },
      { onConflict: "clerk_user_id" }
    );
  }
}

async function syncSubscriptionAccess(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : "";
  const profileId =
    typeof subscription.metadata?.profileId === "string" && uuidPattern.test(subscription.metadata.profileId)
      ? subscription.metadata.profileId
      : "";

  if (!customerId && !profileId) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const state = subscriptionAccessState(subscription);
  const update = {
    ...state,
    access_source: "stripe",
    stripe_customer_id: customerId || null,
    updated_at: new Date().toISOString()
  };

  if (profileId) {
    await supabase
      .from("profiles")
      .update(update)
      .eq("id", profileId);
    return;
  }

  await supabase
    .from("profiles")
    .update(update)
    .eq("stripe_customer_id", customerId);
}

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
    await grantAccessFromCheckoutSession(event.data.object);
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await syncSubscriptionAccess(event.data.object);
  }

  return NextResponse.json({ received: true });
}
