import { getSql } from "./_db.js";
import { checkAdminAuth } from "./_auth.js";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (request) => {
  if (request.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  const auth = checkAdminAuth(request);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  try {
    const sql = getSql();

    const messages = await sql`
      SELECT
        m.id AS message_id, m.campaign, m.variant, m.sent_at, m.expires_at,
        p.id AS prospect_id, p.firm, p.name, p.email, p.country, p.do_not_contact
      FROM outreach_messages m
      JOIN prospects p ON p.id = m.prospect_id
      ORDER BY m.sent_at DESC
      LIMIT 500
    `;

    const events = await sql`
      SELECT message_id, event_name, page_key, received_at, confidence
      FROM visit_events
      ORDER BY received_at ASC
    `;

    const eventsByMessage = new Map();
    for (const ev of events) {
      const list = eventsByMessage.get(ev.message_id) || [];
      list.push({ event_name: ev.event_name, page_key: ev.page_key, received_at: ev.received_at, confidence: ev.confidence });
      eventsByMessage.set(ev.message_id, list);
    }

    const report = messages.map((m) => ({
      ...m,
      // Deliberately labeled as evidence of activity via this recipient's
      // link, not proof a specific person acted — see the review doc.
      events: eventsByMessage.get(m.message_id) || [],
    }));

    return json(200, { ok: true, messages: report });
  } catch (err) {
    console.error("[tracking-report] error:", err.message);
    return json(500, { error: "Something went wrong loading the report." });
  }
};
