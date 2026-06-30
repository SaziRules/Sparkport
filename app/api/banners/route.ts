import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const { data, error } = await admin()
    .from('promotions')
    .select('id, image_url, title, description, cta_text, cta_link')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data ?? [])
}
