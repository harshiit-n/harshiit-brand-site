import { getSql } from "./_db.js";
import { checkAdminAuth } from "./_auth.js";

// One-off cleanup: delete 'email_opened' events that were actually the
// Gmail extension's own sender-side pixel preview-load (see open.js), not a
// real recipient open. Those always land within seconds of the message's
// sent_at; anything under 30s is the self-fetch. Safe to remove this file
// once run — it's not part of normal operation.

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
        AND v.received_at - m.sent_at < interval '30 seconds'
      RETURNING v.id, v.message_id, v.received_at, m.sent_at
    `;
    return json(200, { ok: true, deleted_count: deleted.length, deleted });
  } catch (err) {
    console.error("[cleanup-false-opens] error:", err.message);
    return json(500, { error: err.message });
  }
};
