CREATE TABLE rewards_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points      INTEGER NOT NULL,
  type        TEXT NOT NULL,
  description TEXT NOT NULL,
  reference   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rewards_tx_user ON rewards_transactions(user_id);
CREATE INDEX idx_rewards_tx_date ON rewards_transactions(created_at);
