import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
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
  const { data } = await admin().from('managers').select('role, name, assigned_pharmacy_id').eq('auth_user_id', user.id).eq('is_active', true).single()
  return data
}

export async function GET(req: NextRequest) {
  const manager = await getManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'all'
  const priority = searchParams.get('priority') ?? 'all'
  const category = searchParams.get('category') ?? 'all'
  const search = searchParams.get('search') ?? ''

  let query = admin()
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (status !== 'all') query = query.eq('status', status)
  if (priority !== 'all') query = query.eq('priority', priority)
  if (category !== 'all') query = query.eq('category', category)
  if (search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`name.ilike.${term},email.ilike.${term},ticket_number.ilike.${term},subject.ilike.${term}`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
