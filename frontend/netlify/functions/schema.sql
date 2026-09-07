-- Run this once against your Neon database (Neon console -> SQL Editor,
-- or `psql "$DATABASE_URL" -f schema.sql`) before using the tracking
-- functions. Safe to re-run — every statement is idempotent.

CREATE TABLE IF NOT EXISTS prospects (
  id BIGSERIAL PRIMARY KEY,
  firm TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  source TEXT,
  country TEXT,
  do_not_contact BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_messages (
  id BIGSERIAL PRIMARY KEY,
  prospect_id BIGINT NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  campaign TEXT NOT NULL,
  variant TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_outreach_messages_token_hash ON outreach_messages(token_hash);

CREATE TABLE IF NOT EXISTS visit_events (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES outreach_messages(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  page_key TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_id TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'normal',
  UNIQUE (message_id, event_id)
);
CREATE INDEX IF NOT EXISTS idx_visit_events_message_id ON visit_events(message_id);
