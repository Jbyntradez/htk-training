"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadCapture({ source = "inline" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source })
    });

    setStatus(response.ok ? "success" : "error");
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
      <Input
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
      />
      <Button type="submit" disabled={status === "loading"} className="shrink-0">
        {status === "loading" ? "Sending" : "Get the Brief"}
      </Button>
      {status === "success" && <p className="text-sm text-accent/65 sm:pt-3">Check your inbox. Move fast.</p>}
      {status === "error" && <p className="text-sm text-accent/65 sm:pt-3">Try again with a valid email.</p>}
    </form>
  );
}
