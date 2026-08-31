// Thin wrapper around the backend API. In dev, Vite proxies /api to the
// Express server (see vite.config.js). In production, set VITE_API_URL
// to the deployed backend's base URL (e.g. https://api.yourdomain.com).
const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, auth } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) headers["Authorization"] = `Basic ${btoa(`${auth.user}:${auth.pass}`)}`;

  const res = await fetch(`${BASE_URL}${path}`, {
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

export function submitWaitlist(payload) {
  return request("/api/waitlist", { method: "POST", body: payload });
}

export function submitContact(payload) {
  return request("/api/contact", { method: "POST", body: payload });
}

export function submitNewsletter(payload) {
  return request("/api/newsletter", { method: "POST", body: payload });
}

export function getVideos() {
  return request("/api/videos");
}

export function adminListVideos(auth) {
  return request("/api/admin/videos", { auth });
}

export function adminCreateVideo(payload, auth) {
  return request("/api/admin/videos", { method: "POST", body: payload, auth });
}

export function adminDeleteVideo(id, auth) {
  return request(`/api/admin/videos/${id}`, { method: "DELETE", auth });
}

export function getPosts() {
  return request("/api/posts");
}

export function adminListPosts(auth) {
  return request("/api/admin/posts", { auth });
}

export function adminCreatePost(payload, auth) {
  return request("/api/admin/posts", { method: "POST", body: payload, auth });
}

export function adminDeletePost(id, auth) {
  return request(`/api/admin/posts/${id}`, { method: "DELETE", auth });
}
