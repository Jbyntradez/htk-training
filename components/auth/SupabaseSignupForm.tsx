"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SupabaseSignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim()
          }
        }
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      window.location.href = "/onboarding";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Signup failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 text-left">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-accent/75">Full name</span>
        <Input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          autoComplete="name"
          placeholder="Your full name"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-accent/75">Email</span>
        <Input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-accent/75">Password</span>
        <Input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
      </label>
      {message ? <p className="text-sm leading-6 text-red-300">{message}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Account" : "Create Account"}
      </Button>
      <ButtonLink href="/login" variant="ghost" className="w-full">
        Already Have Access
      </ButtonLink>
    </form>
  );
}
