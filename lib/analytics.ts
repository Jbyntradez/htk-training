export type GtagConfigParams = {
  page_path?: string;
  page_location?: string;
  page_title?: string;
  send_page_view?: boolean;
};

export type GtagEventParams = {
  event_category: string;
  event_label?: string;
  value?: number;
};

type GtagCommand =
  | ["js", Date]
  | ["config", string, GtagConfigParams?]
  | ["event", string, GtagEventParams]
  | ["set", Record<string, string | number | boolean | null>];

type Gtag = (...args: GtagCommand) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    htkGaReady?: boolean;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function getGtag(): Gtag | null {
  if (typeof window === "undefined" || !GA_ID) {
    return null;
  }

  window.dataLayer = window.dataLayer ?? [];

  if (typeof window.gtag !== "function") {
    window.gtag = (...args: GtagCommand) => {
      window.dataLayer?.push(args);
    };
  }

  return window.gtag;
}

function normalizeLabel(label: string) {
  return label.replace(/\s+/g, " ").trim();
}

function normalizeHref(href?: string) {
  return href?.toLowerCase() ?? "";
}

function pageLocation(url: string) {
  if (typeof window === "undefined") {
    return url;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
}

export function pageview(url: string) {
  const gtag = getGtag();

  if (!gtag || !GA_ID) {
    return;
  }

  gtag("config", GA_ID, {
    page_path: url,
    page_location: pageLocation(url)
  });
}

export function event(action: string, category: string, label?: string, value?: number) {
  const gtag = getGtag();
  const normalizedAction = normalizeLabel(action);
  const normalizedCategory = normalizeLabel(category);
  const normalizedLabel = label ? normalizeLabel(label) : undefined;

  if (!gtag || !normalizedAction || !normalizedCategory) {
    return;
  }

  const params: GtagEventParams = {
    event_category: normalizedCategory
  };

  if (normalizedLabel) {
    params.event_label = normalizedLabel;
  }

  if (typeof value === "number") {
    params.value = value;
  }

  gtag("event", normalizedAction, params);
}

export function isPrimaryCta(label: string, href?: string) {
  const normalizedLabel = normalizeLabel(label).toLowerCase();
  const normalizedHref = normalizeHref(href);

  return (
    normalizedHref === "/apply" ||
    normalizedHref === "/book" ||
    normalizedHref === "/checkout" ||
    normalizedLabel.includes("apply") ||
    normalizedLabel.includes("assessment") ||
    normalizedLabel.includes("book") ||
    normalizedLabel.includes("consultation") ||
    normalizedLabel.includes("join htk") ||
    normalizedLabel.includes("start membership") ||
    normalizedLabel.includes("access the system") ||
    normalizedLabel.includes("unlock")
  );
}

export function trackCtaClick(label: string, href?: string) {
  const normalizedLabel = normalizeLabel(label);
  const normalizedLabelLower = normalizedLabel.toLowerCase();
  const normalizedHref = normalizeHref(href);

  if (!normalizedLabel) {
    return;
  }

  event("button_click", "CTA", normalizedLabel);

  if (
    normalizedHref === "/book" ||
    normalizedLabelLower.includes("book") ||
    normalizedLabelLower.includes("consultation")
  ) {
    event("consultation_click", "Calendly Funnel", normalizedLabel);
  }

  if (
    normalizedHref === "/apply" ||
    normalizedLabelLower.includes("apply") ||
    normalizedLabelLower.includes("assessment")
  ) {
    event("apply_now_click", "Coaching Funnel", normalizedLabel);
  }

  if (
    normalizedHref === "/checkout" ||
    normalizedLabelLower.includes("join htk") ||
    normalizedLabelLower.includes("start membership") ||
    normalizedLabelLower.includes("access the system") ||
    normalizedLabelLower.includes("unlock")
  ) {
    event("join_htk_click", "Coaching Funnel", normalizedLabel);
  }
}

export function trackPrimaryCtaClick(label: string, href?: string) {
  if (!isPrimaryCta(label, href)) {
    return;
  }

  trackCtaClick(label, href);
}
