import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STABLE_CHECKS = 3; // consecutive matching reads before we trust the position
const POLL_INTERVAL = 60;
const MAX_WAIT = 1500; // safety net so we always start scrolling eventually
const LANDED_TOLERANCE = 4; // px
const VERIFY_DELAY = 500; // give the smooth animation this long to land

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = location.hash.slice(1);
    let cancelled = false;
    let stableCount = 0;
    let lastTop = null;
    let intervalId = null;
    let timeoutId = null;
    let verifyId = null;

    // Custom fonts and async content (e.g. the fetched blog feed) can reflow
    // the page after mount, shifting every section below the fold while a
    // scroll is already in flight. Rather than guess a fixed delay, poll the
    // target's position until it stops moving between reads, then scroll —
    // with a hard cap so we never wait forever. Smooth-scroll animations can
    // also just fail to complete, so we verify we actually landed and snap
    // instantly to correct it if not.
    const attempt = (behavior) => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior, block: "start" });
      verifyId = setTimeout(() => {
        if (cancelled) return;
        const stillEl = document.getElementById(id);
        if (!stillEl) return;
        if (Math.abs(stillEl.getBoundingClientRect().top) > LANDED_TOLERANCE) {
          stillEl.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, VERIFY_DELAY);
    };

    const finish = () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      attempt("smooth");
    };

    const check = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top === lastTop) {
        stableCount++;
        if (stableCount >= STABLE_CHECKS) {
          finish();
        }
      } else {
        stableCount = 0;
        lastTop = top;
      }
    };

    check();
    intervalId = setInterval(check, POLL_INTERVAL);
    timeoutId = setTimeout(finish, MAX_WAIT);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      if (verifyId) clearTimeout(verifyId);
    };
  }, [location]);

  return null;
}
