import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

// Fires one GA4 page_view per route change. Reads window.location directly
// (rather than location.pathname + location.search from the router) so it
// always reflects the URL *after* AttributionProvider has already stripped
// the ?ref= token — that provider's strip runs synchronously during render,
// before this effect ever gets a chance to fire.
export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
  }, [location]);

  return null;
}
