import { useCallback } from "react";
import { useAttribution } from "../lib/attribution";
import { trackEvent } from "../lib/analytics";

// Fires the same named event to both GA4 (aggregate campaign reporting) and
// the per-recipient attribution endpoint (Step C — no-ops there if this
// visit didn't come from a tracked link). pageKey identifies where on the
// site the click happened, since the same event name can fire from several
// spots (e.g. "booking_link_clicked" from the nav, hero, and services page).
export default function useTrackedClick(eventName, pageKey, params) {
  const { track } = useAttribution();
  return useCallback(() => {
    trackEvent(eventName, { page_key: pageKey, ...params });
    track(eventName, pageKey);
  }, [track, eventName, pageKey]);
}
