import { redirect } from "next/navigation";
import { HTK_BOOKING_URL } from "@/lib/htk-config";

export default function BookPage() {
  redirect(HTK_BOOKING_URL);
}
