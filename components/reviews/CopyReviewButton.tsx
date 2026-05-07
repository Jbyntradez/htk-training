"use client";

import { useState } from "react";

export function CopyReviewButton({
  content,
  label = "Copy review"
}: {
  content: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-4 text-sm font-black text-white transition hover:border-red-500/45 hover:bg-red-500/[0.06]"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
