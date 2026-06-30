import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, first_name, last_name, phone, source } = body as Record<string, string>

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const { error } = await admin()
    .from('subscribers')
    .upsert(
      {
        email: email.trim().toLowerCase(),
        first_name: first_name?.trim() || null,
        last_name: last_name?.trim() || null,
        phone: phone?.trim() || null,
        source: source?.trim() || 'footer',
        is_active: true,
        consent_marketing: true,
        consent_date: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
