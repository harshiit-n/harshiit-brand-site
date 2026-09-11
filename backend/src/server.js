import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "*").split(",").map((o) => o.trim());

app.use(cors({ origin: ALLOWED_ORIGINS.includes("*") ? "*" : ALLOWED_ORIGINS }));
app.use(express.json({ limit: "50kb" }));

// Basic abuse protection on the public form endpoints — 20 requests per
// 15 minutes per IP is generous for a genuine visitor, tight for a bot.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/contact", formLimiter);
app.use("/api/waitlist", formLimiter);
app.use("/api/newsletter", formLimiter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api", routes);

// Central error handler — keeps stack traces out of API responses.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end. Please try again shortly." });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
