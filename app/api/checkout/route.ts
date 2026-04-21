import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const { upsell } = await request.json().catch(() => ({ upsell: false }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const price = upsell ? process.env.STRIPE_UPSELL_PRICE_ID : process.env.STRIPE_PLAYBOOK_PRICE_ID;

  if (!process.env.STRIPE_SECRET_KEY || !price) {
    return NextResponse.json({ url: `${appUrl}/dashboard?checkout=preview` });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: "local-preview-user",
    customer_email: "preview@hardtokill.training",
    line_items: [{ price, quantity: 1 }],
    metadata: {
      userId: "local-preview-user",
      product: upsell ? "advanced_vault" : "core_playbook"
    },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/checkout?checkout=cancelled`,
    allow_promotion_codes: true
  });

  return NextResponse.json({ url: session.url });
}
