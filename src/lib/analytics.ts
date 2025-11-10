type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props: AnalyticsPayload }) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  if (typeof window !== "undefined") {
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: payload });
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: name,
        ...payload,
      });
    }
  }

  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${name}`, payload);
  }
}

export function trackPageview(path: string) {
  trackEvent("pageview", { path });
}
