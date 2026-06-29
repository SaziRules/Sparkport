-- Migration 010 could not drop the SECURITY DEFINER functions because
-- managers_select_franchise_admin on the managers table still depends on
-- is_franchise_admin(). Drop the managers-table policies that reference
-- these functions first, then drop the functions.
--
-- After this migration the managers table retains only managers_select_own
-- (auth_user_id = auth.uid()), which is all that middleware + dashboard
-- auth checks need. Franchise-admin queries across all managers go through
-- service role in API routes, not client-side RLS.

-- 1. Drop manager-table policies that depend on the SECURITY DEFINER functions
DROP POLICY IF EXISTS "managers_select_franchise_admin" ON managers;
DROP POLICY IF EXISTS "managers_select_store_manager"   ON managers;
DROP POLICY IF EXISTS "managers_select_active"          ON managers;

-- 2. Drop the SECURITY DEFINER functions (CASCADE removes any stray dependents)
DROP FUNCTION IF EXISTS public.is_active_manager()                CASCADE;
DROP FUNCTION IF EXISTS public.is_franchise_admin()               CASCADE;
DROP FUNCTION IF EXISTS public.is_store_manager_for(uuid, uuid)   CASCADE;
