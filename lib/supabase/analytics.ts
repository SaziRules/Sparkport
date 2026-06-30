import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface RevenueKPIs {
  today: number
  thisMonth: number
  lastMonth: number
  growthPct: number | null
  totalOrders: number
}

export interface DayRevenue {
  date: string
  revenue: number
}

export interface OrderStatusStat {
  status: string
  count: number
  total: number
}

export interface TopProduct {
  product_name: string
  qty: number
  revenue: number
}

export interface CustomerGrowthMonth {
  month: string
  new_customers: number
}

export interface PrescriptionMetric {
  status: string
  count: number
}

export interface RecentOrder {
  id: number
  number: string
  status: string
  billing_name: string
  total: number
  date_created: string
}

export async function getRevenueKPIs(): Promise<RevenueKPIs> {
  const supabase = adminClient()
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

  const [todayRes, thisMonthRes, lastMonthRes, countRes] = await Promise.all([
    supabase.from('wc_orders').select('total').eq('status', 'completed').gte('date_created', startOfToday),
    supabase.from('wc_orders').select('total').eq('status', 'completed').gte('date_created', startOfMonth),
    supabase.from('wc_orders').select('total').eq('status', 'completed').gte('date_created', startOfLastMonth).lt('date_created', startOfMonth),
    supabase.from('wc_orders').select('id', { count: 'exact', head: true }),
  ])

  const sum = (rows: { total: number }[] | null) =>
    (rows ?? []).reduce((acc, r) => acc + Number(r.total), 0)

  const today = sum(todayRes.data)
  const thisMonth = sum(thisMonthRes.data)
  const lastMonth = sum(lastMonthRes.data)
  const growthPct = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null

  return { today, thisMonth, lastMonth, growthPct, totalOrders: countRes.count ?? 0 }
}

export async function getRevenueByDay(days = 30): Promise<DayRevenue[]> {
  const supabase = adminClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const { data } = await supabase
    .from('wc_orders')
    .select('date_created, total')
    .eq('status', 'completed')
    .gte('date_created', since)

  const byDate: Record<string, number> = {}
  for (const row of data ?? []) {
    const date = row.date_created.slice(0, 10)
    byDate[date] = (byDate[date] ?? 0) + Number(row.total)
  }

  const result: DayRevenue[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, revenue: byDate[dateStr] ?? 0 })
  }
  return result
}

export async function getOrdersByStatus(): Promise<OrderStatusStat[]> {
  const supabase = adminClient()
  const { data } = await supabase.from('wc_orders').select('status, total')

  const map: Record<string, { count: number; total: number }> = {}
  for (const row of data ?? []) {
    if (!map[row.status]) map[row.status] = { count: 0, total: 0 }
    map[row.status].count++
    map[row.status].total += Number(row.total)
  }

  return Object.entries(map)
    .map(([status, v]) => ({ status, count: v.count, total: Math.round(v.total * 100) / 100 }))
    .sort((a, b) => b.count - a.count)
}

export async function getTopProducts(limit = 10): Promise<TopProduct[]> {
  const supabase = adminClient()
  const { data } = await supabase.from('wc_order_items').select('product_name, quantity, line_total')

  const map: Record<string, { qty: number; revenue: number }> = {}
  for (const row of data ?? []) {
    if (!map[row.product_name]) map[row.product_name] = { qty: 0, revenue: 0 }
    map[row.product_name].qty += row.quantity
    map[row.product_name].revenue += Number(row.line_total)
  }

  return Object.entries(map)
    .map(([product_name, v]) => ({ product_name, qty: v.qty, revenue: Math.round(v.revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export async function getCustomerGrowth(months = 6): Promise<CustomerGrowthMonth[]> {
  const supabase = adminClient()
  const since = new Date()
  since.setMonth(since.getMonth() - months)

  const { data } = await supabase
    .from('wc_customers')
    .select('date_registered')
    .gte('date_registered', since.toISOString())

  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    if (!row.date_registered) continue
    const month = row.date_registered.slice(0, 7)
    map[month] = (map[month] ?? 0) + 1
  }

  const result: CustomerGrowthMonth[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const month = d.toISOString().slice(0, 7)
    result.push({ month, new_customers: map[month] ?? 0 })
  }
  return result
}

export async function getPrescriptionMetrics(): Promise<PrescriptionMetric[]> {
  const supabase = adminClient()
  const { data } = await supabase.from('prescriptions').select('status')

  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    map[row.status] = (map[row.status] ?? 0) + 1
  }

  return Object.entries(map)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getRecentOrders(limit = 10): Promise<RecentOrder[]> {
  const supabase = adminClient()
  const { data } = await supabase
    .from('wc_orders')
    .select('id, number, status, billing_name, total, date_created')
    .order('date_created', { ascending: false })
    .limit(limit)

  return (data ?? []).map((r) => ({ ...r, total: Number(r.total) }))
}

export async function getPrescriptionsByDay(days = 30): Promise<{ date: string; count: number }[]> {
  const supabase = adminClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const { data } = await supabase
    .from('prescriptions')
    .select('created_at')
    .gte('created_at', since)

  const byDate: Record<string, number> = {}
  for (const row of data ?? []) {
    const date = row.created_at.slice(0, 10)
    byDate[date] = (byDate[date] ?? 0) + 1
  }

  const result: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, count: byDate[dateStr] ?? 0 })
  }
  return result
}
