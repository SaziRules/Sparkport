import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const { data } = await admin()
    .from('image_banner')
    .select('image_url, link, alt_text')
    .eq('id', 1)
    .single()

  return NextResponse.json(
    data ?? { image_url: '', link: '/shop', alt_text: 'Promotional Banner' }
  )
}
