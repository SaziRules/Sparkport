// app/auth/actions.ts (FIXED - Better error handling)
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  receiveMarketing: boolean;
}

interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  const supabase = await createClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      },
    },
  });

  if (authError) {
    console.error('Auth error:', authError);
    return { 
      success: false, 
      error: authError.message 
    };
  }

  if (!authData.user) {
    console.error('No user returned from signup');
    return { 
      success: false, 
      error: 'Failed to create user' 
    };
  }

  // Create profile in database
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      receive_marketing: data.receiveMarketing,
    })
    .select()
    .single();

  if (profileError) {
    console.error('Profile creation error:', profileError);
    // Don't fail the whole signup, but log it
    // The trigger will still match prescriptions
    return {
      success: true,
      userId: authData.user.id,
      needsEmailVerification: !authData.user.email_confirmed_at,
      warning: 'Account created but profile setup incomplete. Please contact support if you experience issues.'
    };
  }

  // Match any anonymous prescriptions
  // This will be handled by the database trigger we created earlier
  
  return { 
    success: true, 
    userId: authData.user.id,
    needsEmailVerification: !authData.user.email_confirmed_at
  };
}

export async function signIn(data: SignInData) {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error('Sign in error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }

  // Check if profile exists, create if missing
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', authData.user.id)
    .single();

  if (!profile) {
    // Create profile if it doesn't exist
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: authData.user.user_metadata?.first_name || '',
        last_name: authData.user.user_metadata?.last_name || '',
        phone: authData.user.user_metadata?.phone || '',
      });

    if (profileError) {
      console.error('Profile creation error on signin:', profileError);
    }
  }

  return { 
    success: true, 
    user: authData.user 
  };
}

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Social login (Google)
export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

// Social login (Facebook)
export async function signInWithFacebook() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}