import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = location.hash.slice(1);
    let cancelled = false;

    const scrollNow = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // The custom heading font loads async and can reflow the page (shifting
    // every section below the fold) right as a scroll-into-view animation is
    // in flight, throwing it off mid-scroll. Wait for fonts, then scroll, and
    // re-affirm once more shortly after in case anything else shifted layout.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scrollNow);
    } else {
      scrollNow();
    }
    const retry = setTimeout(scrollNow, 300);

    return () => {
      cancelled = true;
      clearTimeout(retry);
    };
  }, [location]);

  return null;
}
