import { createClient } from "@supabase/supabase-js";

export type Review = {
  id: string;
  name: string;
  image_url: string;
  result: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const looksLikeUrl = /^https?:\/\//.test(url);
  const looksLikeJwt = serviceKey.split(".").length === 3;

  if (!looksLikeUrl || !looksLikeJwt) {
    throw new Error(
      "Invalid Supabase environment variables. NEXT_PUBLIC_SUPABASE_URL should be the project URL and SUPABASE_SERVICE_ROLE_KEY should be the service role JWT."
    );
  }

  return { url, serviceKey };
}

export function hasSupabaseConfig() {
  try {
    getSupabaseConfig();
    return true;
  } catch {
    return false;
  }
}

export function getSupabaseAdmin() {
  const { url, serviceKey } = getSupabaseConfig();

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
