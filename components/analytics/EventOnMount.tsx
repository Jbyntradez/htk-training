"use client";

import { useEffect } from "react";
import { event as analyticsEvent } from "@/lib/analytics";

type EventOnMountProps = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  onceKey?: string;
};

export function EventOnMount({
  action,
  category,
  label,
  value,
  onceKey
}: EventOnMountProps) {
  useEffect(() => {
    if (onceKey) {
      const storageKey = `htk_analytics_${onceKey}`;

      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }

      window.sessionStorage.setItem(storageKey, "true");
    }

    analyticsEvent(action, category, label, value);
  }, [action, category, label, value, onceKey]);

  return null;
}
