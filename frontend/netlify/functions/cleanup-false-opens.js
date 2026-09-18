import { getSql } from "./_db.js";
import { checkAdminAuth } from "./_auth.js";

// One-off cleanup: delete 'email_opened' events that were actually Gmail's
// own self-fetch (extension pixel-insert preview, or Gmail's backend
// re-rendering the just-sent message into Sent/thread view) rather than a
// real recipient open — see open.js for the full explanation and window.
// Safe to remove this file once run — it's not part of normal operation.

const SENDER_PREVIEW_WINDOW = "10 minutes";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const auth = checkAdminAuth(request);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  try {
    const sql = getSql();
    const deleted = await sql`
      DELETE FROM visit_events v
      USING outreach_messages m
      WHERE v.message_id = m.id
        AND v.event_name = 'email_opened'
        AND v.received_at - m.sent_at < interval '10 minutes'
      RETURNING v.id, v.message_id, v.received_at, m.sent_at
    `;
    return json(200, { ok: true, deleted_count: deleted.length, deleted });
  } catch (err) {
    console.error("[cleanup-false-opens] error:", err.message);
    return json(500, { error: err.message });
  }
};
