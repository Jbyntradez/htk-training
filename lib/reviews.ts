import { defaultTestimonials } from "@/lib/content";
import { getSupabaseAdmin, type Review } from "@/lib/supabase";

export async function getApprovedReviews() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,image_url,result,rating,approved,created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error || !data?.length) {
      return defaultTestimonials;
    }

    return data as Review[];
  } catch {
    return defaultTestimonials;
  }
}
