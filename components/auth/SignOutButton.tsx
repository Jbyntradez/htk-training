"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="rounded-md border border-white/10 px-3 py-2 text-xs font-black uppercase text-accent/55 transition hover:border-white/20 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Signing Out" : "Sign Out"}
    </button>
  );
}
