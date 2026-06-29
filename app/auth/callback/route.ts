// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // Get user data
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // Create profile if doesn't exist (social login)
      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata.full_name?.split(' ')[0] || '',
          last_name: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
        });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/account/dashboard`);
}