import { useEffect, useState } from "react";
import { getConsent, setConsent, initAnalyticsIfConsented } from "../lib/analytics";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent()) {
      initAnalyticsIfConsented();
    } else {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function choose(value) {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] border-t border-gray-200 bg-white/97 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-gray-600">
          This site uses analytics to see which pages are useful. No personal data is sent to
          Google, and nothing loads until you accept.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="btn-lift rounded-md bg-[var(--color-navy)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--color-navy-light)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
