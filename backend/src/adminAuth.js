// Minimal HTTP Basic Auth gate for the /api/admin/* routes, so submissions
// aren't publicly readable. Set ADMIN_USER and ADMIN_PASSWORD in .env
// before deploying. If either is unset, admin routes are disabled
// entirely (return 503) rather than left open.
//
// Deliberately omits the WWW-Authenticate response header: sending it makes
// browsers pop up their own native credential prompt on top of any custom
// login form calling this from fetch(), which is not what we want here.
export function adminAuth(req, res, next) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return res.status(503).json({
      error: "Admin routes are disabled. Set ADMIN_USER and ADMIN_PASSWORD in the backend .env to enable them.",
    });
  }

  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [reqUser, reqPass] = decoded.split(":");

  if (reqUser !== user || reqPass !== pass) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  return next();
}
