"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { event as analyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField<Key extends keyof ContactFormState>(key: Key, value: ContactFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));

    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    analyticsEvent("button_click", "CTA", "Contact Us");
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" })
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(result?.error ?? "Message could not be sent. Try again in a minute.");
        return;
      }

      analyticsEvent("contact_form_submit", "Contact Funnel", "Contact Us");
      setStatus("success");
      setMessage("Message received. I will respond by email.");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setMessage("Connection dropped. Try again when you are ready.");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-white/10 bg-[#090909] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-7">
      <div className="border-b border-white/10 pb-6">
        <p className="text-sm font-black uppercase text-red-400">Contact HTK Training</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Send a direct message.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
          Ask about coaching, consultations, resources, or whether HTK is the right fit
          for your next training phase.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-3 block text-sm font-black text-white">Name</span>
          <Input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your full name"
            autoComplete="name"
          />
        </label>
        <label>
          <span className="mb-3 block text-sm font-black text-white">Email</span>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="mt-6 block">
        <span className="mb-3 block text-sm font-black text-white">Message</span>
        <Textarea
          required
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell me what you are trying to solve or build."
          className="min-h-[180px]"
        />
      </label>

      {message ? (
        <p
          className={cn(
            "mt-5 text-sm leading-6",
            status === "error" ? "text-red-300" : "text-white/68"
          )}
        >
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-white/45">
          Serious inquiries only. Coaching applications should use the assessment page.
        </p>
        <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? "Sending" : "Contact Us"}
        </Button>
      </div>
    </form>
  );
}
