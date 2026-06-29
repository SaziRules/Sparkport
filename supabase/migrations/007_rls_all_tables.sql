-- ============================================================
-- RLS for all remaining tables
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Managers can read any profile (needed to look up customers)
CREATE POLICY "profiles_select_manager" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- ── delivery_addresses ───────────────────────────────────────
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_addresses_select_own" ON delivery_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "delivery_addresses_insert_own" ON delivery_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delivery_addresses_update_own" ON delivery_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "delivery_addresses_delete_own" ON delivery_addresses
  FOR DELETE USING (auth.uid() = user_id);

-- ── doctors ──────────────────────────────────────────────────
-- Public read (needed for prescription form autocomplete)
-- Writes only via service role / SQL
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "doctors_select_public" ON doctors
  FOR SELECT USING (true);

-- ── pharmacies ───────────────────────────────────────────────
-- Public read (store locator, prescription form)
-- Writes only via service role / SQL
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pharmacies_select_public" ON pharmacies
  FOR SELECT USING (is_active = true);

-- ── prescriptions ────────────────────────────────────────────
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Customers see their own prescriptions
CREATE POLICY "prescriptions_select_own" ON prescriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Customers (and guests via service role) can submit
CREATE POLICY "prescriptions_insert_own" ON prescriptions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Franchise admin sees all prescriptions
CREATE POLICY "prescriptions_select_franchise_admin" ON prescriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid()
        AND is_active = true
        AND role = 'franchise_admin'
    )
  );

-- Store manager sees prescriptions for their assigned pharmacy
CREATE POLICY "prescriptions_select_store_manager" ON prescriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid()
        AND is_active = true
        AND role = 'store_manager'
        AND (
          assigned_pharmacy_id = prescriptions.collection_pharmacy_id
          OR assigned_pharmacy_id = prescriptions.preferred_pharmacy_id
        )
    )
  );

-- Managers can update prescription status
CREATE POLICY "prescriptions_update_manager" ON prescriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- ── prescription_items ───────────────────────────────────────
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescription_items_select_own" ON prescription_items
  FOR SELECT USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "prescription_items_select_manager" ON prescription_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- ── prescription_images ──────────────────────────────────────
ALTER TABLE prescription_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescription_images_select_own" ON prescription_images
  FOR SELECT USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "prescription_images_select_manager" ON prescription_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- ── prescription_status_history ──────────────────────────────
ALTER TABLE prescription_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescription_status_history_select_own" ON prescription_status_history
  FOR SELECT USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "prescription_status_history_select_manager" ON prescription_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "prescription_status_history_insert_manager" ON prescription_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM managers
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- ── notifications ────────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can mark notifications as read
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ── managers ─────────────────────────────────────────────────
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

-- Managers can read their own row (for role checks on login)
CREATE POLICY "managers_select_own" ON managers
  FOR SELECT USING (auth_user_id = auth.uid());

-- Franchise admins can read all managers
CREATE POLICY "managers_select_franchise_admin" ON managers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers m2
      WHERE m2.auth_user_id = auth.uid()
        AND m2.is_active = true
        AND m2.role = 'franchise_admin'
    )
  );
