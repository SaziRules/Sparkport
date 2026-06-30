-- Drop the recursive franchise_admin policy and any broken SECURITY DEFINER refs.
-- All manager dashboard queries only need own-row access;
-- cross-manager reads use service role API routes.

DROP POLICY IF EXISTS "managers_select_franchise_admin" ON managers;
DROP FUNCTION IF EXISTS public.is_active_manager();
DROP FUNCTION IF EXISTS public.is_franchise_admin();
DROP FUNCTION IF EXISTS public.is_store_manager_for(uuid, uuid);

ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "managers_select_own" ON managers;
CREATE POLICY "managers_select_own" ON managers
  FOR SELECT USING (auth_user_id = auth.uid());
