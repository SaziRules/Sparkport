import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  let body: { id?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, type } = body
  if (!id || !type || !['impression', 'click'].includes(type)) {
    return NextResponse.json({ error: 'id and type (impression|click) required' }, { status: 400 })
  }

  await admin().rpc('increment_promotion_stat', { p_id: id, p_field: type })
  return NextResponse.json({ ok: true })
}
