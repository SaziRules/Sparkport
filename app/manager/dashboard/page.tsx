'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import StoreManagerDashboard from './StoreManagerDashboard';
import FranchiseAdminDashboard from './FranchiseAdminDashboard';

export default function ManagerDashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/manager/login';
        return;
      }

      const { data: manager } = await supabase
        .from('managers')
        .select('role')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!manager) {
        window.location.href = '/manager/login';
        return;
      }

      setRole(manager.role);
      setLoading(false);
    }

    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009eb9] mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  if (role === 'franchise_admin') {
    return <FranchiseAdminDashboard />;
  } else if (role === 'store_manager') {
    return <StoreManagerDashboard />;
  }

  return null;
}