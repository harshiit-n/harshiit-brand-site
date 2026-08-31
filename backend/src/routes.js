import { Router } from "express";
import db from "./db.js";
import { isValidEmail, cleanString } from "./validate.js";
import { adminAuth } from "./adminAuth.js";
import { sendNotification, checkEmailConfig } from "./email.js";

const router = Router();

// --- Public form endpoints ------------------------------------------------

router.post("/contact", (req, res) => {
  const name = cleanString(req.body?.name, 200);
  const email = cleanString(req.body?.email, 254);
  const firm = cleanString(req.body?.firm, 200);
  const message = cleanString(req.body?.message, 4000);

  if (!name || !isValidEmail(email) || !message) {
    return res.status(400).json({ error: "Please provide your name, a valid email, and a message." });
  }

  const stmt = db.prepare(
    "INSERT INTO contact_submissions (name, email, firm, message) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(name, email, firm || null, message);

  sendNotification({
    subject: `New contact form submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nFirm: ${firm || "-"}\n\nMessage:\n${message}`,
  });

  return res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

router.post("/waitlist", (req, res) => {
  const name = cleanString(req.body?.name, 200);
  const email = cleanString(req.body?.email, 254);

  if (!name || !isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide your name and a valid email." });
  }

  try {
    const stmt = db.prepare("INSERT INTO waitlist_signups (name, email) VALUES (?, ?)");
    const info = stmt.run(name, email);

    sendNotification({
      subject: `New waitlist signup from ${name}`,
      text: `Name: ${name}\nEmail: ${email}`,
    });

    return res.status(201).json({ ok: true, id: info.lastInsertRowid });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(200).json({ ok: true, alreadySignedUp: true });
    }
    throw err;
  }
});

router.post("/newsletter", (req, res) => {
  const email = cleanString(req.body?.email, 254);

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  try {
    const stmt = db.prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
    const info = stmt.run(email);

    sendNotification({
      subject: "New newsletter subscriber",
      text: `Email: ${email}`,
    });

    return res.status(201).json({ ok: true, id: info.lastInsertRowid });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }
    throw err;
  }
});

// Temporary, unauthenticated diagnostic route — see email.js. Reports only
// booleans and an error message, no secret values. Remove once resolved.
router.get("/email-status", async (_req, res) => {
  const status = await checkEmailConfig();
  res.json(status);
});

// --- Simple admin endpoints (protected via HTTP Basic Auth) ---------------

router.use("/admin", adminAuth);

router.get("/admin/contact", (_req, res) => {
  const rows = db.prepare("SELECT * FROM contact_submissions ORDER BY id DESC").all();
  res.json(rows);
});

router.get("/admin/waitlist", (_req, res) => {
  const rows = db.prepare("SELECT * FROM waitlist_signups ORDER BY id DESC").all();
  res.json(rows);
});

router.get("/admin/newsletter", (_req, res) => {
  const rows = db.prepare("SELECT * FROM newsletter_subscribers ORDER BY id DESC").all();
  res.json(rows);
});


export default router;
