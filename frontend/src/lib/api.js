// Thin wrapper around the backend API. In dev, Vite proxies /api to the
// Express server (see vite.config.js). In production, set VITE_API_URL
// to the deployed backend's base URL (e.g. https://api.yourdomain.com).
const BASE_URL = import.meta.env.VITE_API_URL || "";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

export function submitWaitlist(payload) {
  return post("/api/waitlist", payload);
}

export function submitContact(payload) {
  return post("/api/contact", payload);
}

export function submitNewsletter(payload) {
  return post("/api/newsletter", payload);
}
