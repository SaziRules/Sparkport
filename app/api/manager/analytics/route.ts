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
import {
  getRevenueKPIs,
  getRevenueByDay,
  getOrdersByStatus,
  getTopProducts,
  getCustomerGrowth,
  getPrescriptionMetrics,
  getRecentOrders,
  getPrescriptionsByDay,
} from '@/lib/supabase/analytics'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: manager } = await admin()
    .from('managers')
    .select('role')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!manager) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [kpis, revenueByDay, ordersByStatus, topProducts, customerGrowth, prescriptionMetrics, recentOrders, prescriptionsByDay] =
    await Promise.all([
      getRevenueKPIs(),
      getRevenueByDay(30),
      getOrdersByStatus(),
      getTopProducts(10),
      getCustomerGrowth(6),
      getPrescriptionMetrics(),
      getRecentOrders(10),
      getPrescriptionsByDay(30),
    ])

  return NextResponse.json({ kpis, revenueByDay, ordersByStatus, topProducts, customerGrowth, prescriptionMetrics, recentOrders, prescriptionsByDay })
}
