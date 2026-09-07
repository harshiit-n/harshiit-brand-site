import { neon } from "@neondatabase/serverless";

// Neon's HTTP driver — no persistent connections to manage, which fits a
// serverless function that may cold-start on every invocation. DATABASE_URL
// is a Netlify environment variable (server-side only; never expose it via
// a VITE_* variable, which gets bundled into the public frontend).
let sql = null;

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set");
  }
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}
