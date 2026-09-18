import { createHash, randomUUID } from "node:crypto";
import { getSql } from "./_db.js";

// A 1x1 transparent pixel for email open-tracking. Paste the returned <img>
// tag (from create-message) into an outreach email's HTML; when the
// recipient's mail client fetches it, we log an "email_opened" event tied to
// that message's token.
//
// Honest caveat about reliability: most mail clients (Gmail included) only
// load images after the recipient allows it, and Gmail specifically proxies
// images through its own servers and caches the fetch — so this reliably
// tells you about a *first* open with images enabled, not every open, and
// not opens with images blocked. Treat it as "there's evidence of activity,"
// not "we know exactly how many times they read it."
//
// Always returns the pixel — even for an invalid/expired token — so a
// broken or probed link never surfaces an error in someone's inbox.

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7",
  "base64"
);
const TOKEN_RE = /^[a-f0-9]{32,64}$/i;

// Two distinct self-fetches happen before any recipient ever sees the mail:
// (1) the Gmail extension inserts the pixel as a live <img> into the compose
// window's own contenteditable body, so the sender's browser loads it within
// seconds to render it; (2) tens of seconds later, Gmail's own backend
// re-renders the just-sent message into the sender's Sent/thread view and
// fetches every embedded image again to do so — independent of the
// recipient. Because the response below is marked no-store, that re-render
// hits this endpoint fresh instead of serving a cached copy, so it shows up
// here just like a real open. Measured against real traffic, that second
// wave lands 40-300s after send, while genuine recipient opens start well
// past 10 minutes — so anything inside this window is a self-fetch, not a
// real open.
const SENDER_PREVIEW_WINDOW_MS = 10 * 60_000;

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function pixelResponse() {
  return new Response(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
    },
  });
}

export default async (request) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("ref");

  if (!token || !TOKEN_RE.test(token)) {
    return pixelResponse();
  }

  try {
    const sql = getSql();
    const tokenHash = hashToken(token);
    const rows = await sql`
      SELECT id, sent_at FROM outreach_messages
      WHERE token_hash = ${tokenHash} AND expires_at > now()
      LIMIT 1
    `;
    if (rows.length > 0) {
      const sinceSent = Date.now() - new Date(rows[0].sent_at).getTime();
      if (sinceSent >= SENDER_PREVIEW_WINDOW_MS) {
        await sql`
          INSERT INTO visit_events (message_id, event_name, page_key, event_id, confidence)
          VALUES (${rows[0].id}, 'email_opened', 'email', ${randomUUID()}, 'approximate')
        `;
      }
    }
  } catch (err) {
    console.error("[open] error:", err.message);
  }

  return pixelResponse();
};
