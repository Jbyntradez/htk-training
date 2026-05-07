import { ShieldCheck, Star } from "lucide-react";
import { getApprovedReviews } from "@/lib/reviews";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function Testimonials() {
  const reviews = await getApprovedReviews();

  return (
    <section id="proof" className="border-b border-white/10 py-24 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-red-400">Social proof</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Proof from athletes and high performers doing real work.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/60">
            Approved HTK reviews, structured feedback, and performance wins that support the next booking decision.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-white/10 bg-[#090909] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.26)] transition hover:-translate-y-1 hover:border-red-500/45"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-sm font-black text-white">
                    {getInitials(review.displayName)}
                  </span>
                  <div>
                    <h3 className="font-black text-white">{review.displayName}</h3>
                    <p className="mt-1 text-xs uppercase text-white/40">{review.athleteType}</p>
                    <div className="mt-1 flex text-red-400">
                      {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <ShieldCheck className="h-5 w-5 shrink-0 text-white/40" />
              </div>
              <p className="mt-7 text-lg font-bold leading-7 text-white">
                {review.testimonialQuote}
              </p>
              <div className="mt-6 border-t border-white/10 pt-4 text-xs font-bold uppercase text-white/40">
                {review.resultTags.slice(0, 2).join(" • ") || "Approved HTK review"}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
