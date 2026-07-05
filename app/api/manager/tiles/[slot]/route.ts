import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
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
  const { data } = await admin()
    .from('managers')
    .select('role')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()
  return data
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  const manager = await getManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slot: slotStr } = await params
  const slot = parseInt(slotStr, 10)
  if (slot !== 1 && slot !== 2) return NextResponse.json({ error: 'Invalid slot' }, { status: 400 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.image_url === 'string') patch.image_url = body.image_url.trim()
  if (typeof body.title    === 'string') patch.title     = body.title.trim()
  if (typeof body.subtitle === 'string') patch.subtitle  = body.subtitle.trim()
  if (typeof body.link     === 'string') patch.link      = body.link.trim()

  const { data, error } = await admin()
    .from('hero_tiles')
    .update(patch)
    .eq('slot', slot)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
