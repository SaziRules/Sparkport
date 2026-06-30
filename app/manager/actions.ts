'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function serviceClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Manager Sign In
 * Authenticates manager and verifies they have a manager profile
 */
export async function managerSignIn(email: string, password: string) {
  const supabase = await createClient();

  try {
    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Manager auth error:', authError);
      return { 
        error: 'Invalid email or password. Please check your credentials and try again.' 
      };
    }

    if (!authData.user) {
      return { error: 'Authentication failed. Please try again.' };
    }

    // 2. Verify manager profile exists and is active (service role bypasses RLS)
    const { data: manager, error: managerError } = await serviceClient()
      .from('managers')
      .select('role')
      .eq('auth_user_id', authData.user.id)
      .eq('is_active', true)
      .single();

    if (managerError || !manager) {
      console.error('Manager profile error:', managerError);
      
      // Sign out the user since they're not a valid manager
      await supabase.auth.signOut();
      
      return { 
        error: 'This account is not authorized for manager access. Please contact support.' 
      };
    }

    // 3. Success - revalidate and redirect
    revalidatePath('/manager', 'layout');
    
  } catch (error) {
    console.error('Unexpected manager sign in error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  // Redirect outside try-catch (Next.js requirement)
  redirect('/manager/dashboard');
}

/**
 * Manager Sign Out
 */
export async function managerSignOut() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  revalidatePath('/manager', 'layout');
  redirect('/manager/login');
}

/**
 * Get Current Manager Profile
 * Returns manager profile with pharmacy info
 */
export async function getCurrentManager() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: manager, error } = await supabase
    .from('managers')
    .select(`
      *,
      pharmacy:pharmacies(*)
    `)
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching manager:', error);
    return null;
  }

  return manager;
}

/**
 * Get Manager Role
 * Returns 'franchise_admin', 'store_manager', or null
 */
export async function getManagerRole() {
  const manager = await getCurrentManager();
  return manager?.role || null;
}

/**
 * Check if current user is Franchise Admin
 */
export async function isFranchiseAdmin() {
  const role = await getManagerRole();
  return role === 'franchise_admin';
}

/**
 * Check if current user is Store Manager
 */
export async function isStoreManager() {
  const role = await getManagerRole();
  return role === 'store_manager';
}

/**
 * Verify Manager Access
 * Throws redirect if not authenticated manager
 */
export async function verifyManagerAccess() {
  const manager = await getCurrentManager();
  
  if (!manager) {
    redirect('/manager/login');
  }
  
  return manager;
}

/**
 * Verify Franchise Admin Access
 * Throws redirect if not franchise admin
 */
export async function verifyFranchiseAdminAccess() {
  const manager = await verifyManagerAccess();
  
  if (manager.role !== 'franchise_admin') {
    redirect('/manager/dashboard');
  }
  
  return manager;
}