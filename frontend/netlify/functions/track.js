import { createHash } from "node:crypto";
import { getSql } from "./_db.js";

// Public endpoint — the whole point is that any visitor with a valid token
// can log an event. It must never leak whether a token was valid or expose
// the person it resolves to; every response looks the same regardless.
//
// Origin checks below are an abuse deterrent, not authentication (a request
// forged outside a browser can set any Origin header it likes) — the real
// protections are: allowlisted event names, a token format/length check, a
// bounded body size, and a light per-IP rate limit.

const ALLOWED_EVENTS = new Set([
  "link_visited",
  "sample_view",
  "sample_download_clicked",
  "methodology_view",
  "booking_link_clicked",
  "contact_submitted",
]);
const ALLOWED_ORIGINS = new Set(
  [process.env.URL, process.env.DEPLOY_PRIME_URL, "https://harshiitnemani.netlify.app"].filter(Boolean)
);
const MAX_BODY_BYTES = 2000;
const TOKEN_RE = /^[a-f0-9]{32,64}$/i;

// Best-effort in-memory rate limit. Resets on cold start and isn't shared
// across concurrent instances — a real ceiling, not a precise one, but
// enough to blunt casual abuse of a public endpoint.
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.size > 0 && !ALLOWED_ORIGINS.has(origin)) {
    return new Response(null, { status: 204 }); // Silently drop, no error detail.
  }

  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (rateLimited(ip)) {
    return new Response(null, { status: 204 });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 204 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response(null, { status: 204 });
  }

  const { token, event_name: eventName, page_key: pageKey, event_id: eventId } = payload || {};

  if (
    typeof token !== "string" ||
    !TOKEN_RE.test(token) ||
    typeof eventName !== "string" ||
    !ALLOWED_EVENTS.has(eventName) ||
    typeof eventId !== "string" ||
    eventId.length > 100 ||
    (pageKey !== undefined && pageKey !== null && (typeof pageKey !== "string" || pageKey.length > 100))
  ) {
    return new Response(null, { status: 204 });
  }

  try {
    const sql = getSql();
    const tokenHash = hashToken(token);
    const rows = await sql`
      SELECT id FROM outreach_messages
      WHERE token_hash = ${tokenHash} AND expires_at > now()
      LIMIT 1
    `;
    if (rows.length > 0) {
      const messageId = rows[0].id;
      await sql`
        INSERT INTO visit_events (message_id, event_name, page_key, event_id)
        VALUES (${messageId}, ${eventName}, ${pageKey || null}, ${eventId})
        ON CONFLICT (message_id, event_id) DO NOTHING
      `;
    }
    // Deliberately identical response whether the token resolved or not.
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[track] error:", err.message);
    return new Response(null, { status: 204 });
  }
};
