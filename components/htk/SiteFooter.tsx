import Link from "next/link";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL, HTK_CONTACT_EMAIL } from "@/lib/htk-config";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Results", href: "/results" },
  { label: "Apply", href: HTK_APPLICATION_PATH },
  { label: "Submit Review", href: "/submit-review" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] py-10 pb-24 md:pb-10">
      <div className="container-px mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="text-sm font-black uppercase tracking-wide text-red-400">HTK Training</p>
          <p className="mt-4 text-base leading-8 text-white/58">
            Hard to Kill Training for athletes and disciplined high performers building
            explosiveness, endurance, mobility, durability, and real coaching standards.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">Navigate</p>
            <div className="mt-4 grid gap-3 text-sm text-white/58">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">Action</p>
            <div className="mt-4 grid gap-3 text-sm text-white/58">
              <a
                href={HTK_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                Book a Consultation
              </a>
              <a
                href={`mailto:${HTK_CONTACT_EMAIL}`}
                className="transition hover:text-white"
              >
                {HTK_CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">Trust</p>
            <div className="mt-4 grid gap-3 text-sm text-white/58">
              <p>Performance-driven coaching</p>
              <p>Structured applications</p>
              <p>Real client proof</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
