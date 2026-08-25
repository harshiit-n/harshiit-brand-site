import nodemailer from "nodemailer";

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
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
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
