const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email.trim()) && email.length <= 254;
}

export function cleanString(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

const YOUTUBE_ID_RE = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYouTubeId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(YOUTUBE_ID_RE);
  return match ? match[1] : null;
}
