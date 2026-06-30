import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

// Routes only accessible to managers
const MANAGER_ROUTES = ['/manager/dashboard'];

// Customer-facing routes managers are blocked from
const CUSTOMER_ROUTES = [
  '/account',
  '/shop',
  '/product',
  '/categories',
  '/cart',
  '/checkout',
  '/fill-script',
];

function isManagerRoute(path: string) {
  return MANAGER_ROUTES.some(r => path === r || path.startsWith(r + '/'));
}

function isCustomerRoute(path: string) {
  return CUSTOMER_ROUTES.some(r => path === r || path.startsWith(r + '/'));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Forward any refreshed session cookies onto a redirect response
  function makeRedirect(destination: string) {
    const response = NextResponse.redirect(new URL(destination, request.url));
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) =>
      response.cookies.set(name, value, opts)
    );
    return response;
  }

  // ── Unauthenticated user ──────────────────────────────────────
  if (!user) {
    if (isManagerRoute(path)) {
      return makeRedirect('/manager/login');
    }
    // Let unauthenticated users through to public + customer pages
    // (individual pages handle their own auth prompts)
    return supabaseResponse;
  }

  // ── Authenticated user — check manager status once ───────────
  const needsRoleCheck = isManagerRoute(path) || isCustomerRoute(path) || path === '/manager/login';

  if (!needsRoleCheck) {
    return supabaseResponse;
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: manager } = await adminClient
    .from('managers')
    .select('role, is_active')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single();

  const isManager = !!manager;

  // Manager trying to access customer pages → send to dashboard
  if (isManager && isCustomerRoute(path)) {
    return makeRedirect('/manager/dashboard');
  }

  // Manager already logged in trying to hit /manager/login → send to dashboard
  if (isManager && path === '/manager/login') {
    return makeRedirect('/manager/dashboard');
  }

  // Non-manager trying to access manager dashboard → send home
  if (!isManager && isManagerRoute(path)) {
    return makeRedirect('/');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
