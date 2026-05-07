import { listApprovedPublicReviews } from "@/lib/review-storage";

export async function getApprovedReviews() {
  return listApprovedPublicReviews();
}
