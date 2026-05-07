import Link from "next/link";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 border border-white/10 bg-[#070707]/90 p-2 shadow-[0_0_40px_rgba(0,0,0,0.55)] backdrop-blur md:hidden">
      <a
        href={HTK_BOOKING_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-black text-white shadow-[0_0_30px_rgba(220,38,38,0.35)]"
      >
        Book
      </a>
      <Link
        href={HTK_APPLICATION_PATH}
        className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-4 text-sm font-black text-white"
      >
        Apply
      </Link>
    </div>
  );
}
