import { EventOnMount } from "@/components/analytics/EventOnMount";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Navbar } from "@/components/Navbar";
import { ScarcityBanner } from "@/components/ScarcityBanner";

export default function CheckoutPage() {
  return (
    <>
      <EventOnMount
        action="checkout_view"
        category="Coaching Funnel"
        label="Checkout Page"
      />
      <ScarcityBanner />
      <Navbar />
      <main className="container-px mx-auto grid min-h-[calc(100svh-104px)] max-w-5xl place-items-center py-16">
        <section className="w-full rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-10">
          <p className="text-sm font-black uppercase text-accent/45">Secure checkout</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-black leading-tight sm:text-6xl">Hard to Kill Digital Playbook</h1>
              <p className="mt-5 max-w-xl text-accent/65">
                One-time access. Dashboard unlocks after Stripe confirms purchase.
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-background p-5">
              <div className="flex items-end justify-between border-b border-white/10 pb-5">
                <span className="font-bold">Core access</span>
                <span className="text-4xl font-black">$97</span>
              </div>
              <ul className="my-6 grid gap-3 text-sm text-accent/65">
                <li>Full playbook dashboard</li>
                <li>Video modules and lesson text</li>
                <li>Progress tracking</li>
                <li>Bonus systems and resources</li>
              </ul>
              <CheckoutButton />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
