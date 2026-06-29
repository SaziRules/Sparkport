CREATE TABLE wc_customers (
  wc_id           INTEGER PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  first_name      TEXT,
  last_name       TEXT,
  total_spent     NUMERIC(10,2) DEFAULT 0,
  orders_count    INTEGER DEFAULT 0,
  date_registered TIMESTAMPTZ,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wc_customers_email ON wc_customers(email);
