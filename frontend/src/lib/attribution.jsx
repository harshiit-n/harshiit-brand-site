import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Per-recipient link tracking (review doc, Step C). Each outreach email gets
// its own random ?ref=<token> link. On first load we capture that token in
// memory and strip it from the visible URL immediately — before any
// analytics script or third-party link (Calendly, YouTube) can see it. It is
// never written to localStorage/cookies and never sent to GA4: it only ever
// goes to our own tracking endpoint, which is the one place able to resolve
// it back to a prospect.
//
// This only recognises the visit that actually used the link. A later
// direct visit, a reload after the token's gone from the URL, another tab,
// or another device won't carry it — that's intentional, not a bug (see the
// review doc's note against fingerprinting/IP-based re-identification).

const AttributionContext = createContext({ token: null });

function extractAndStripRef() {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const ref = url.searchParams.get("ref");
  if (ref) {
    url.searchParams.delete("ref");
    const cleaned = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, "", cleaned);
  }
  return ref || null;
}

export function AttributionProvider({ children }) {
  // Lazy initializer runs synchronously during the first render, before any
  // effect (including the analytics page_view effect) has a chance to fire —
  // that ordering is what guarantees the token is gone from the URL before
  // anything else looks at it.
  const [token] = useState(extractAndStripRef);

  const track = useCallback(
    (eventName, pageKey) => {
      if (!token) return; // Nothing to attribute — this visit didn't come from a tracked link.
      const body = JSON.stringify({
        token,
        event_name: eventName,
        page_key: pageKey,
        event_id: crypto.randomUUID(),
      });
      // Fire-and-forget: tracking must never block or break the UI it's
      // attached to. keepalive lets it survive a page unload from a click
      // that immediately navigates away (e.g. the booking link).
      fetch("/.netlify/functions/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    },
    [token]
  );

  // Record the visit itself — step 1 of the flow ("the recipient loaded the
  // page") — not just the deliberate named events that might follow it.
  useEffect(() => {
    if (token) track("link_visited", "landing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ token, track }), [token, track]);

  return <AttributionContext.Provider value={value}>{children}</AttributionContext.Provider>;
}

export function useAttribution() {
  return useContext(AttributionContext);
}
