import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const { data } = await admin()
    .from('promotional_banners')
    .select('*')
    .in('slot', ['surgical', 'flu_season', 'healthcare'])

  return NextResponse.json(data ?? [])
}
