"use client";

import { useEffect } from "react";
import { event as analyticsEvent } from "@/lib/analytics";

type CalendlyMessage = {
  event?: string;
  payload?: unknown;
};

function isCalendlyMessage(data: unknown): data is CalendlyMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "event" in data &&
    typeof (data as CalendlyMessage).event === "string" &&
    Boolean((data as CalendlyMessage).event?.startsWith("calendly."))
  );
}

export function CalendlyBooking({ url }: { url: string }) {
  useEffect(() => {
    function receiveMessage(message: MessageEvent<unknown>) {
      if (!isCalendlyMessage(message.data)) {
        return;
      }

      if (message.data.event === "calendly.event_scheduled") {
        analyticsEvent("consultation_booked", "Calendly Funnel", "HTK Consultation");
      }
    }

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return (
    <iframe
      src={url}
      title="Book an HTK Training consultation"
      className="h-[760px] w-full rounded-lg border border-white/10 bg-white"
    />
  );
}
