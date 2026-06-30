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
  const { data } = await admin()
    .from('managers')
    .select('role')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()
  return data
}

export async function GET() {
  const manager = await getManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await admin()
    .from('hero_banners')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const manager = await getManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { image_url, title, description, cta_text, cta_link, sort_order, is_active } = body as Record<string, unknown>

  if (!image_url || typeof image_url !== 'string' || !image_url.trim()) {
    return NextResponse.json({ error: 'image_url is required' }, { status: 400 })
  }
  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const { data, error } = await admin()
    .from('hero_banners')
    .insert({
      image_url: (image_url as string).trim(),
      title: (title as string).trim(),
      description: typeof description === 'string' ? description.trim() : '',
      cta_text: typeof cta_text === 'string' && cta_text.trim() ? cta_text.trim() : 'Shop Now',
      cta_link: typeof cta_link === 'string' && cta_link.trim() ? cta_link.trim() : '/shop',
      sort_order: typeof sort_order === 'number' ? sort_order : 0,
      is_active: typeof is_active === 'boolean' ? is_active : true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
