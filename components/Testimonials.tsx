import { ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import { getApprovedReviews } from "@/lib/reviews";

export async function Testimonials() {
  const reviews = await getApprovedReviews();

  return (
    <section id="proof" className="border-b border-white/10 py-24 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-accent/45">Social proof</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Proof from builders who prefer leverage over attention.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-accent/60">
            Verified buyers. Practical execution. No influencer theater.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {reviews.map((review, index) => (
            <article key={review.name} className="rounded-md border border-white/10 bg-primary p-6 shadow-premium transition hover:-translate-y-1 hover:border-white/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                <Image src={review.image_url} alt={review.name} width={56} height={56} className="h-14 w-14 rounded-md object-cover" />
                <div>
                  <h3 className="font-black">{review.name}</h3>
                    <p className="mt-1 text-xs uppercase text-accent/40">{index === 0 ? "Digital offer" : index === 1 ? "Content system" : "Faceless launch"}</p>
                  <div className="mt-1 flex text-accent">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                </div>
                <ShieldCheck className="h-5 w-5 shrink-0 text-accent/45" />
              </div>
              <p className="mt-7 text-lg font-bold leading-7">{review.result}</p>
              <div className="mt-6 border-t border-white/10 pt-4 text-xs font-bold uppercase text-accent/40">
                Verified playbook buyer
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
