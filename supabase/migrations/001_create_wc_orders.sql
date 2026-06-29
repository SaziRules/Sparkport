CREATE TABLE wc_orders (
  id             INTEGER PRIMARY KEY,
  number         TEXT NOT NULL,
  status         TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_wc_id INTEGER,
  billing_name   TEXT,
  billing_city   TEXT,
  payment_method TEXT,
  total          NUMERIC(10,2) NOT NULL,
  subtotal       NUMERIC(10,2),
  discount       NUMERIC(10,2) DEFAULT 0,
  date_created   TIMESTAMPTZ NOT NULL,
  date_modified  TIMESTAMPTZ NOT NULL,
  raw            JSONB,
  synced_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wc_orders_email  ON wc_orders(customer_email);
CREATE INDEX idx_wc_orders_status ON wc_orders(status);
CREATE INDEX idx_wc_orders_date   ON wc_orders(date_created);
CREATE INDEX idx_wc_orders_wc_id  ON wc_orders(customer_wc_id);
