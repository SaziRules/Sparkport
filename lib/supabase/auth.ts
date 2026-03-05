import { supabase } from './client';
import { matchAnonymousPrescriptions } from './prescriptions';

export async function signUp(
  email: string, 
  password: string, 
  fullName: string,
  phone?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) return { success: false, error: error.message };

  // Create profile and match prescriptions
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        phone: phone || null,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // 🎯 AUTO-MATCH ANONYMOUS PRESCRIPTIONS
    if (phone) {
      const { success, count } = await matchAnonymousPrescriptions(
        data.user.id,
        phone,
        email
      );
      
      if (success && count > 0) {
        console.log(`✅ Linked ${count} prescription(s) to new account`);
        // You could add a notification here
      }
    }
  }

  return { success: true, data };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}