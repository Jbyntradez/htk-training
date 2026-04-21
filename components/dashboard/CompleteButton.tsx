"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CompleteButton({ moduleId, completed }: { moduleId: string; completed: boolean }) {
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);

  async function markComplete() {
    setLoading(true);
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, completed: true })
    });

    if (response.ok) {
      setDone(true);
    }

    setLoading(false);
  }

  return (
    <Button onClick={markComplete} disabled={done || loading}>
      {done ? "Completed" : loading ? "Saving" : "Mark Complete"}
    </Button>
  );
}
