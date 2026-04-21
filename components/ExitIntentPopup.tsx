"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { LeadCapture } from "@/components/LeadCapture";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("htk_exit_seen");

    function onMouseOut(event: MouseEvent) {
      if (seen || event.clientY > 12) {
        return;
      }
      sessionStorage.setItem("htk_exit_seen", "1");
      setOpen(true);
    }

    const timer = window.setTimeout(() => {
      if (!sessionStorage.getItem("htk_exit_seen")) {
        sessionStorage.setItem("htk_exit_seen", "1");
        setOpen(true);
      }
    }, 45000);

    document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <div className="relative w-full max-w-lg rounded-md border border-white/10 bg-primary p-6 shadow-premium">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-accent/60 hover:bg-white/10 hover:text-accent"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <p className="text-xs font-black uppercase text-accent/50">Before you leave</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">Take the faceless income brief.</h2>
        <p className="mt-3 text-sm leading-6 text-accent/65">
          Get the operating checklist for AI offers, faceless content, and buyer capture.
        </p>
        <div className="mt-6">
          <LeadCapture source="exit_intent" />
        </div>
      </div>
    </div>
  );
}
