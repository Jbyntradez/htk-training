"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ upsell = false }: { upsell?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upsell })
    });
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setLoading(false);
  }

  return (
    <Button onClick={startCheckout} disabled={loading} className="w-full sm:w-auto">
      {loading ? "Opening Checkout" : upsell ? "Add Advanced Vault" : "Access the System"}
    </Button>
  );
}
