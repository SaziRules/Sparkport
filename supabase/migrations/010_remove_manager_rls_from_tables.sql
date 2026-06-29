-- Remove all manager-referencing RLS policies from non-manager tables.
-- Manager access to these tables is handled server-side via service role
-- in API routes, which bypasses RLS entirely. This eliminates the recursion.

-- profiles
DROP POLICY IF EXISTS "profiles_select_manager" ON profiles;

-- prescriptions
DROP POLICY IF EXISTS "prescriptions_select_franchise_admin" ON prescriptions;
DROP POLICY IF EXISTS "prescriptions_select_store_manager" ON prescriptions;
DROP POLICY IF EXISTS "prescriptions_update_manager" ON prescriptions;

-- prescription_items
DROP POLICY IF EXISTS "prescription_items_select_manager" ON prescription_items;

-- prescription_images
DROP POLICY IF EXISTS "prescription_images_select_manager" ON prescription_images;

-- prescription_status_history
DROP POLICY IF EXISTS "prescription_status_history_select_manager" ON prescription_status_history;
DROP POLICY IF EXISTS "prescription_status_history_insert_manager" ON prescription_status_history;

-- Drop the SECURITY DEFINER helper functions (no longer needed)
DROP FUNCTION IF EXISTS public.is_active_manager();
DROP FUNCTION IF EXISTS public.is_franchise_admin();
DROP FUNCTION IF EXISTS public.is_store_manager_for(uuid, uuid);
