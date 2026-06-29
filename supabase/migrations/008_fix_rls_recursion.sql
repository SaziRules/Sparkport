-- ============================================================
-- Fix: infinite recursion in manager-referencing RLS policies
-- Solution: SECURITY DEFINER functions bypass RLS on managers,
-- breaking the recursion cycle.
-- ============================================================

-- ── Helper functions ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_active_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.managers
    WHERE auth_user_id = auth.uid()
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_franchise_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.managers
    WHERE auth_user_id = auth.uid()
      AND is_active = true
      AND role = 'franchise_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_store_manager_for(p_collection uuid, p_preferred uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.managers
    WHERE auth_user_id = auth.uid()
      AND is_active = true
      AND role = 'store_manager'
      AND (
        assigned_pharmacy_id = p_collection
        OR assigned_pharmacy_id = p_preferred
      )
  );
$$;

-- ── Drop and recreate all manager-referencing policies ────────

-- profiles
DROP POLICY IF EXISTS "profiles_select_manager" ON profiles;
CREATE POLICY "profiles_select_manager" ON profiles
  FOR SELECT USING (is_active_manager());

-- prescriptions
DROP POLICY IF EXISTS "prescriptions_select_franchise_admin" ON prescriptions;
CREATE POLICY "prescriptions_select_franchise_admin" ON prescriptions
  FOR SELECT USING (is_franchise_admin());

DROP POLICY IF EXISTS "prescriptions_select_store_manager" ON prescriptions;
CREATE POLICY "prescriptions_select_store_manager" ON prescriptions
  FOR SELECT USING (
    is_store_manager_for(collection_pharmacy_id, preferred_pharmacy_id)
  );

DROP POLICY IF EXISTS "prescriptions_update_manager" ON prescriptions;
CREATE POLICY "prescriptions_update_manager" ON prescriptions
  FOR UPDATE USING (is_active_manager());

-- prescription_items
DROP POLICY IF EXISTS "prescription_items_select_manager" ON prescription_items;
CREATE POLICY "prescription_items_select_manager" ON prescription_items
  FOR SELECT USING (is_active_manager());

-- prescription_images
DROP POLICY IF EXISTS "prescription_images_select_manager" ON prescription_images;
CREATE POLICY "prescription_images_select_manager" ON prescription_images
  FOR SELECT USING (is_active_manager());

-- prescription_status_history
DROP POLICY IF EXISTS "prescription_status_history_select_manager" ON prescription_status_history;
CREATE POLICY "prescription_status_history_select_manager" ON prescription_status_history
  FOR SELECT USING (is_active_manager());

DROP POLICY IF EXISTS "prescription_status_history_insert_manager" ON prescription_status_history;
CREATE POLICY "prescription_status_history_insert_manager" ON prescription_status_history
  FOR INSERT WITH CHECK (is_active_manager());

-- managers (self-referencing policy — replace with function too)
DROP POLICY IF EXISTS "managers_select_franchise_admin" ON managers;
CREATE POLICY "managers_select_franchise_admin" ON managers
  FOR SELECT USING (is_franchise_admin());
