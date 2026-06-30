import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import FranchiseAdminDashboard from './FranchiseAdminDashboard';
import StoreManagerDashboard from './StoreManagerDashboard';

export default async function ManagerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/manager/login');

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: manager } = await admin
    .from('managers')
    .select('id, name, email, role, assigned_pharmacy_id, pharmacy:pharmacies(id, name, city)')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!manager) redirect('/manager/login');

  const pharmacy = Array.isArray(manager.pharmacy)
    ? manager.pharmacy[0] ?? null
    : manager.pharmacy ?? null;

  const managerData = { ...manager, pharmacy };

  if (manager.role === 'franchise_admin') return <FranchiseAdminDashboard initialManager={managerData} />;
  if (manager.role === 'store_manager') return <StoreManagerDashboard initialManager={managerData} />;

  redirect('/manager/login');
}
