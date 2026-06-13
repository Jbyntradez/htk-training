import { ButtonLink } from "@/components/ui/button";

export function ConversionCta({
  eyebrow,
  title,
  body,
  secondary = false
}: {
  eyebrow: string;
  title: string;
  body: string;
  secondary?: boolean;
}) {
  return (
    <section className="border-b border-white/10 py-16 md:py-20">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:grid-cols-[1fr_auto] md:items-center md:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-accent/45">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-accent/62 sm:text-base">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <ButtonLink href="/checkout" className="w-full sm:w-auto">Join HTK</ButtonLink>
            {secondary && (
              <ButtonLink href="/product" variant="outline" className="w-full sm:w-auto">
                See What Is Inside
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
