import { randomBytes, createHash } from "node:crypto";
import { getSql } from "./_db.js";
import { checkAdminAuth } from "./_auth.js";

const SITE_URL = process.env.URL || "https://harshiitnemani.consulting";
const EXPIRES_DAYS = 180;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const auth = checkAdminAuth(request);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const firm = cleanString(payload.firm, 200);
  const name = cleanString(payload.name, 200);
  const email = cleanString(payload.email, 254);
  const source = cleanString(payload.source, 200);
  const country = cleanString(payload.country, 100);
  const campaign = cleanString(payload.campaign, 100);
  const variant = cleanString(payload.variant, 100);

  if (!firm || !name || !campaign) {
    return json(400, { error: "firm, name, and campaign are required." });
  }

  try {
    const sql = getSql();

    const prospectRows = await sql`
      INSERT INTO prospects (firm, name, email, source, country)
      VALUES (${firm}, ${name}, ${email || null}, ${source || null}, ${country || null})
      RETURNING id
    `;
    const prospectId = prospectRows[0].id;

    const token = randomBytes(16).toString("hex"); // 128 bits of randomness
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + EXPIRES_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const messageRows = await sql`
      INSERT INTO outreach_messages (prospect_id, campaign, variant, token_hash, expires_at)
      VALUES (${prospectId}, ${campaign}, ${variant || null}, ${tokenHash}, ${expiresAt})
      RETURNING id
    `;
    const messageId = messageRows[0].id;

    const link = `${SITE_URL}/?ref=${token}`;
    const pixelUrl = `${SITE_URL}/.netlify/functions/open?ref=${token}`;
    const pixelHtml = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none" />`;

    return json(201, { ok: true, prospect_id: prospectId, message_id: messageId, link, pixel_url: pixelUrl, pixel_html: pixelHtml });
  } catch (err) {
    console.error("[create-message] error:", err.message);
    return json(500, { error: "Something went wrong creating the link." });
  }
};
