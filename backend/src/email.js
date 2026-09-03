// Sends a quick heads-up email whenever a form is submitted, so submissions
// don't just sit silently in SQLite. Uses Resend's HTTP API rather than raw
// SMTP — Render's network blocks outbound SMTP (port 465/587) entirely, but
// HTTPS (443) works fine, which is what Resend's API runs over.
// If RESEND_API_KEY isn't set, this quietly no-ops (logs once) rather than
// breaking the form.

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "onboarding@resend.dev";

let warnedMissingConfig = false;

export async function checkEmailConfig() {
  const { RESEND_API_KEY, NOTIFY_EMAIL } = process.env;
  const present = {
    RESEND_API_KEY: Boolean(RESEND_API_KEY),
    NOTIFY_EMAIL: Boolean(NOTIFY_EMAIL),
  };

  if (!RESEND_API_KEY) {
    return { present, verified: false, verifyError: "RESEND_API_KEY not set." };
  }

  // Sending-only API keys (the recommended, least-privilege kind) can't call
  // most other Resend endpoints, so there's no cheap way to validate the key
  // without actually sending mail. Presence of both vars is as far as we
  // check here; real delivery is confirmed by sendNotification's own logging.
  return { present, verified: null, verifyError: null };
}

export async function sendNotification({ subject, text }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, NOTIFY_EMAIL } = process.env;

  if (!RESEND_API_KEY) {
    if (!warnedMissingConfig) {
      console.warn("[email] RESEND_API_KEY not set — submission notifications are disabled. See backend/.env.example.");
      warnedMissingConfig = true;
    }
    return;
  }

  const to = NOTIFY_EMAIL;
  if (!to) {
    console.warn("[email] NOTIFY_EMAIL not set — skipping notification.");
    return;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Site Notifications <${RESEND_FROM_EMAIL || DEFAULT_FROM}>`,
        to,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[email] Resend API error:", res.status, body);
    }
  } catch (err) {
    // A failed notification email should never break the form submission
    // itself — the row is already saved in SQLite either way.
    console.error("[email] Failed to send notification:", err.message);
  }
}
