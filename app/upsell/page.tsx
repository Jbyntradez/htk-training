import { CheckoutButton } from "@/components/CheckoutButton";
import { Navbar } from "@/components/Navbar";

export default function UpsellPage() {
  return (
    <>
      <Navbar />
      <main className="container-px mx-auto grid min-h-[calc(100svh-64px)] max-w-4xl place-items-center py-16">
        <section className="rounded-md border border-white/10 bg-primary p-6 md:p-10">
          <p className="text-sm font-black uppercase text-accent/45">Advanced vault</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">Add the scale layer.</h1>
          <p className="mt-5 text-lg leading-8 text-accent/65">
            Advanced prompt chains, content sprint templates, and offer optimization resources for faster execution.
          </p>
          <div className="mt-8">
            <CheckoutButton upsell />
          </div>
        </section>
      </main>
    </>
  );
}
