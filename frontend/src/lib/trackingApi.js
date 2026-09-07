// Calls to the site's own Netlify Functions (Step C tracking backend) —
// always relative to the current origin, unlike lib/api.js which targets
// the separate Render backend via VITE_API_URL.
async function request(path, { method = "GET", body, auth } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) headers["Authorization"] = `Basic ${btoa(`${auth.user}:${auth.pass}`)}`;

  const res = await fetch(`/.netlify/functions/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export function getTrackingReport(auth) {
  return request("tracking-report", { auth });
}

export function createTrackedMessage(payload, auth) {
  return request("create-message", { method: "POST", body: payload, auth });
}
