CREATE TABLE wc_order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES wc_orders(id) ON DELETE CASCADE,
  product_id   INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL,
  line_total   NUMERIC(10,2) NOT NULL,
  image_url    TEXT
);

CREATE INDEX idx_wc_order_items_order ON wc_order_items(order_id);
CREATE INDEX idx_wc_order_items_prod  ON wc_order_items(product_id);
