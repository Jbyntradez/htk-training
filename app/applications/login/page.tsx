import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { HtkBadge } from "@/components/htk/HtkBadge";
import { Input } from "@/components/ui/input";
import {
  isAdminAuthenticated,
  isAdminPasswordConfigured
} from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Applications Login | HTK Training",
  description: "Secure admin access for HTK coaching applications."
};

export const dynamic = "force-dynamic";

function getMessage(error?: string, status?: string, configured?: boolean) {
  if (!configured || error === "config") {
    return {
      tone: "error" as const,
      title: "Admin access is not configured yet.",
      body: "Set the ADMIN_PASSWORD environment variable in Vercel before using this page."
    };
  }

  if (error === "invalid") {
    return {
      tone: "error" as const,
      title: "Incorrect password.",
      body: "Check the admin password and try again."
    };
  }

  if (status === "logged_out") {
    return {
      tone: "info" as const,
      title: "Signed out.",
      body: "The admin session cookie has been cleared."
    };
  }

  return null;
}

export default async function ApplicationsLoginPage({
  searchParams
}: {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/applications");
  }

  const params = (await searchParams) ?? {};
  const configured = isAdminPasswordConfigured();
  const message = getMessage(params.error, params.status, configured);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative isolate min-h-screen overflow-hidden">
        <Image
          src="/htk/hero-field-athlete.jpg"
          alt="HTK Training athlete"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-center opacity-[0.16] grayscale-[18%]"
        />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.14),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.86)_0%,rgba(5,5,5,0.98)_100%)]" />

        <div className="container-px mx-auto flex min-h-screen max-w-7xl items-center py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="max-w-3xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/58 transition hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Back to site
              </Link>
              <div className="mt-8">
                <HtkBadge>Restricted admin access</HtkBadge>
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
                Coaching applications stay behind the operator gate.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/64">
                Enter the admin password to review HTK coaching assessments. Access is
                checked server-side and the session is stored in a secure httpOnly cookie.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Server-side gate"
                  body="Application submissions are not fetched or rendered until the cookie is verified on the server."
                />
                <InfoCard
                  title="Cookie session"
                  body="The password never lives in localStorage or the client bundle."
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#090909]/95 p-7 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-red-400">
                    Admin sign-in
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Password-only access for the applications queue.
                  </p>
                </div>
              </div>

              {message ? (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-4 ${
                    message.tone === "error"
                      ? "border-red-500/35 bg-red-500/[0.08] text-red-100"
                      : "border-white/10 bg-white/[0.04] text-white"
                  }`}
                >
                  <p className="text-sm font-black uppercase tracking-wide">
                    {message.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-current/75">{message.body}</p>
                </div>
              ) : null}

              <form action="/api/admin/session" method="post" className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="text-xs font-black uppercase tracking-wide text-red-400"
                  >
                    Admin password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter the admin password"
                    disabled={!configured}
                    className="mt-3 h-12 border-white/15 bg-[#050505] text-white placeholder:text-white/28 focus:border-red-500/45"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!configured}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-500 px-6 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_36px_rgba(220,38,38,0.24)] transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Unlock applications
                </button>
              </form>

              <p className="mt-5 text-sm leading-7 text-white/45">
                This gate is intentionally simple for now: one server-side password and one
                secure cookie-backed session.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-sm font-black uppercase tracking-wide text-red-400">{title}</p>
      <p className="mt-3 text-sm leading-7 text-white/64">{body}</p>
    </article>
  );
}
