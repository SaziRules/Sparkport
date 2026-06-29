-- Enable RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;

-- rewards: users can read and write their own row
CREATE POLICY "rewards_select_own" ON rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "rewards_insert_own" ON rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "rewards_update_own" ON rewards
  FOR UPDATE USING (auth.uid() = user_id);

-- rewards_transactions: users can read and insert their own rows (no update/delete — append-only log)
CREATE POLICY "rewards_tx_select_own" ON rewards_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "rewards_tx_insert_own" ON rewards_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- wc_orders and wc_customers: enable RLS but users can only read their own orders
-- (writes come from the webhook via service role, which bypasses RLS)
ALTER TABLE wc_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wc_orders_select_own" ON wc_orders
  FOR SELECT USING (customer_email = auth.email());

CREATE POLICY "wc_order_items_select_own" ON wc_order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM wc_orders WHERE customer_email = auth.email()
    )
  );

CREATE POLICY "wc_customers_select_own" ON wc_customers
  FOR SELECT USING (email = auth.email());
