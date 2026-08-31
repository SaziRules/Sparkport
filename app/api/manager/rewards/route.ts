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

async function verifyManager() {
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
  const manager = await verifyManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = admin()

  const [kpiRes, topEarnersRes, recentTxRes, tierDistRes] = await Promise.all([
    db.from('rewards').select('points, tier', { count: 'exact', head: false }),
    db
      .from('rewards')
      .select('user_id, points, tier, profiles(first_name, last_name, email, member_number)')
      .order('points', { ascending: false })
      .limit(10),
    db
      .from('rewards_transactions')
      .select('id, user_id, points, type, description, created_at, profiles(first_name, last_name, email)')
      .order('created_at', { ascending: false })
      .limit(20),
    db
      .from('rewards')
      .select('tier'),
  ])

  const members = kpiRes.data ?? []
  const totalMembers = members.length
  const totalPoints = members.reduce((s, r) => s + (r.points ?? 0), 0)
  const avgPoints = totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0

  const tierCounts: Record<string, number> = { bronze: 0, silver: 0, gold: 0, platinum: 0 }
  for (const r of tierDistRes.data ?? []) {
    const t = r.tier as string
    if (t in tierCounts) tierCounts[t]++
  }

  return NextResponse.json({
    kpis: { totalMembers, totalPoints, avgPoints },
    tierCounts,
    topEarners: topEarnersRes.data ?? [],
    recentTransactions: recentTxRes.data ?? [],
  })
}
