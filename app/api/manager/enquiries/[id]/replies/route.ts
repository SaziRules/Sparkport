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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const manager = await getManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { message, is_internal } = body as { message: string; is_internal?: boolean }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const { data: reply, error: replyError } = await admin()
    .from('enquiry_replies')
    .insert({
      enquiry_id: id,
      author_type: 'staff',
      author_name: manager.name,
      message: message.trim(),
      is_internal: is_internal === true,
    })
    .select()
    .single()

  if (replyError) return NextResponse.json({ error: replyError.message }, { status: 500 })

  // Bump updated_at on the parent enquiry and move it to 'in_progress' if it was 'open'
  const db = admin()
  const { data: current } = await db.from('enquiries').select('status').eq('id', id).single()
  await db
    .from('enquiries')
    .update({
      updated_at: new Date().toISOString(),
      ...(current?.status === 'open' ? { status: 'in_progress' } : {}),
    })
    .eq('id', id)

  return NextResponse.json(reply, { status: 201 })
}
