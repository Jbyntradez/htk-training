"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/analytics";

let lastTrackedUrl = "";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const url = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!url) {
      return;
    }

    let active = true;

    function track() {
      if (!active || lastTrackedUrl === url) {
        return;
      }

      lastTrackedUrl = url;
      pageview(url);
    }

    if (window.htkGaReady) {
      track();
      return () => {
        active = false;
      };
    }

    window.addEventListener("htk-ga-ready", track, { once: true });

    return () => {
      active = false;
      window.removeEventListener("htk-ga-ready", track);
    };
  }, [url]);

  return null;
}
