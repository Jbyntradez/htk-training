import Stripe from "stripe";

export const HTK_MEMBERSHIP_PRICE_ID =
  process.env.STRIPE_MEMBERSHIP_PRICE_ID ?? "price_1TcFTxKBfTFeKbeESvDoYM7O";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return new Stripe(key, {
    apiVersion: "2024-06-20"
  });
}
