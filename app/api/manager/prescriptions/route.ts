import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function getManager() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await admin()
    .from('managers')
    .select('role, assigned_pharmacy_id')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()

  return data
}

export async function GET() {
  const manager = await getManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let query = admin().from('prescriptions').select('*').order('created_at', { ascending: false })

  if (manager.role === 'store_manager') {
    query = query.eq('preferred_pharmacy_id', manager.assigned_pharmacy_id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
