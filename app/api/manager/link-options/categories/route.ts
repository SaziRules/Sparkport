import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getProductCategories } from '@/lib/wordpress/products'
import { isPromotionalCategory } from '@/lib/wordpress/filters'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

async function isManager() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await admin()
    .from('managers')
    .select('id')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()
  return !!data
}

export async function GET() {
  if (!await isManager()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await getProductCategories()
  const list = categories
    .filter(c => c.count > 0 && c.slug !== 'uncategorized')
    .map(c => ({ name: c.name, slug: c.slug, count: c.count, isPromo: isPromotionalCategory(c.slug) }))
    .sort((a, b) => Number(b.isPromo) - Number(a.isPromo))

  return NextResponse.json(list, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
