"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SupabaseLoginForm() {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 text-left">
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
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Your Supabase Auth password"
        />
      </label>
      {message ? <p className="text-sm leading-6 text-red-300">{message}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing In" : "Sign In"}
      </Button>
    </form>
  );
}
