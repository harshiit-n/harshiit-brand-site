import nodemailer from "nodemailer";
import dns from "node:dns";

// Render's outbound networking has no route to Gmail's IPv6 SMTP address,
// so the default "IPv6 first" DNS resolution order causes every connection
// attempt to fail with ENETUNREACH before Node ever tries the IPv4 address.
// This forces IPv4-first resolution for the whole process.
dns.setDefaultResultOrder("ipv4first");

// Sends a quick heads-up email whenever a form is submitted, so submissions
// don't just sit silently in SQLite. Configured via SMTP env vars; if they
// aren't set, this quietly no-ops (logs once) rather than breaking the form.
// Works with Gmail (an App Password, not your normal password) or any SMTP
// provider (Resend, Postmark, Mailgun, etc.) — see backend/.env.example.

let transporter = null;
let warnedMissingConfig = false;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    if (!warnedMissingConfig) {
      console.warn(
        "[email] SMTP_* env vars not fully set — submission notifications are disabled. See backend/.env.example."
      );
      warnedMissingConfig = true;
    }
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    // Render's outbound networking doesn't reliably support IPv6. Gmail's
    // SMTP host resolves to an IPv6 address first, which then fails with
    // ENETUNREACH on Render even though the SMTP credentials are fine.
    // Forcing IPv4 here avoids that failure mode.
    family: 4,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

// Temporary diagnostic helper — reports whether SMTP env vars are present
// and whether Gmail actually accepts the credentials, without leaking the
// values themselves. Remove once email delivery is confirmed working.
export async function checkEmailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;
  const present = {
    SMTP_HOST: Boolean(SMTP_HOST),
    SMTP_PORT: Boolean(SMTP_PORT),
    SMTP_USER: Boolean(SMTP_USER),
    SMTP_PASS: Boolean(SMTP_PASS),
    NOTIFY_EMAIL: Boolean(NOTIFY_EMAIL),
  };

  const t = getTransporter();
  if (!t) {
    return { present, verified: false, verifyError: "Transporter not created — one or more SMTP_* vars missing." };
  }

  try {
    await t.verify();
    return { present, verified: true, verifyError: null };
  } catch (err) {
    return { present, verified: false, verifyError: err.message };
  }
}

export async function sendNotification({ subject, text }) {
  const t = getTransporter();
  if (!t) return;

  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

  try {
    await t.sendMail({
      from: `"Site Notifications" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
  } catch (err) {
    // A failed notification email should never break the form submission
    // itself — the row is already saved in SQLite either way.
    console.error("[email] Failed to send notification:", err.message);
  }
}
