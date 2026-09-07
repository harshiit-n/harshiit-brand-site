// Minimal HTTP Basic Auth check for admin-only functions (create-message,
// tracking-report). Mirrors backend/src/adminAuth.js: deliberately omits the
// WWW-Authenticate response header, since sending it makes browsers pop up
// their own native credential prompt on top of a custom login form calling
// this from fetch().
export function checkAdminAuth(request) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return { ok: false, status: 503, error: "Admin routes are disabled. Set ADMIN_USER and ADMIN_PASSWORD." };
  }

  const header = request.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return { ok: false, status: 401, error: "Authentication required." };
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [reqUser, reqPass] = decoded.split(":");
  if (reqUser !== user || reqPass !== pass) {
    return { ok: false, status: 401, error: "Invalid credentials." };
  }

  return { ok: true };
}
