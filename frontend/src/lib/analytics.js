// Thin GA4 wrapper. Consent-gated: nothing loads or sends until the visitor
// accepts (see ConsentBanner). Never pass names, emails, message text, or
// the attribution ref token here — see attribution.js for that path, which
// goes to our own backend instead of Google.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CONSENT_KEY = "hn_analytics_consent"; // "granted" | "denied"

let scriptLoaded = false;

function loadGtagScript() {
  if (scriptLoaded || !MEASUREMENT_ID) return;
  scriptLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // We send page_view ourselves on route change (see RouteAnalytics) so the
  // SPA doesn't double-count: one automatic view on script load, another
  // from our own tracker.
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage unavailable (private mode, etc.) — treat as a one-time choice.
  }
  if (value === "granted") loadGtagScript();
}

export function initAnalyticsIfConsented() {
  if (getConsent() === "granted") loadGtagScript();
}

export function trackPageView(path) {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: document.title,
  });
}

// Allowlisted, deliberately-named events only — see the review doc. Params
// should describe the interaction (e.g. { variant: "a" }), never identify
// the visitor.
export function trackEvent(name, params = {}) {
  if (!window.gtag) return;
  window.gtag("event", name, params);
}
