CREATE TABLE rewards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points     INTEGER NOT NULL DEFAULT 0,
  tier       TEXT NOT NULL DEFAULT 'bronze',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
