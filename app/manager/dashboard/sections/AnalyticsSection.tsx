'use client'

import { useMemo } from 'react'
import { Prescription, Pharmacy, Analytics } from '../types'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
  analytics: Analytics | null
  analyticsLoading: boolean
  role: 'franchise_admin' | 'store_manager'
}

const STATUS_ORDER = ['submitted', 'verifying', 'dispensing', 'ready_collect', 'completed']
const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  verifying: 'Verifying',
  dispensing: 'Dispensing',
  ready_collect: 'Ready',
  completed: 'Completed',
  rejected: 'Rejected',
}
const ACTIVE_STATUSES = ['submitted', 'verifying', 'dispensing', 'ready_collect']

const STATUS_COLORS: Record<string, string> = {
  submitted: '#EAB308',
  verifying: '#3B82F6',
  verified: '#8B5CF6',
  dispensing: '#6366F1',
  ready_collect: '#22C55E',
  out_delivery: '#06B6D4',
  completed: '#9CA3AF',
  rejected: '#EF4444',
  cancelled: '#D1D5DB',
}

const LoadingBlock = ({ h = 'h-40' }: { h?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 ${h} animate-pulse`} />
)

// ── Reusable vertical bar chart with gridlines ─────────────────────────────
function BarChart({
  data,
  color = '#009eb9',
  secondColor,
  height = 160,
  formatValue,
}: {
  data: { label: string; value: number; value2?: number }[]
  color?: string
  secondColor?: string
  height?: number
  formatValue?: (v: number) => string
}) {
  const max = Math.max(...data.flatMap(d => [d.value, d.value2 ?? 0]), 1)
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  const labelW = 28

  if (data.every(d => d.value === 0 && !d.value2)) {
    return <p className="text-sm text-neutral-400 text-center py-8">No data yet.</p>
  }

  return (
    <div style={{ paddingLeft: labelW }}>
      <div className="relative" style={{ height }}>
        {/* Horizontal gridlines + Y labels */}
        {ticks.map(t => (
          <div
            key={t}
            className="absolute left-0 right-0 border-t border-neutral-100"
            style={{ bottom: `${t * 100}%` }}
          >
            <span
              className="absolute right-full pr-1 text-[9px] text-neutral-300 tabular-nums"
              style={{ transform: 'translateY(-50%)' }}
            >
              {t === 0 ? '' : formatValue ? formatValue(max * t) : Math.round(max * t)}
            </span>
          </div>
        ))}
        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-1">
          {data.map((d, i) => {
            const h1 = Math.max((d.value / max) * 100, d.value > 0 ? 2 : 0)
            const h2 = d.value2 !== undefined ? Math.max((d.value2 / max) * 100, d.value2 > 0 ? 2 : 0) : null
            return (
              <div key={i} className="flex-1 flex items-end justify-center gap-0.5 h-full group relative">
                <div
                  className="rounded-t-sm transition-all hover:opacity-80 cursor-default flex-1"
                  style={{ height: `${h1}%`, background: color }}
                />
                {h2 !== null && secondColor && (
                  <div
                    className="rounded-t-sm transition-all hover:opacity-80 cursor-default flex-1"
                    style={{ height: `${h2}%`, background: secondColor }}
                  />
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#184363] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-lg">
                  {formatValue ? formatValue(d.value) : d.value}
                  {d.value2 !== undefined && ` / ${formatValue ? formatValue(d.value2) : d.value2}`}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="flex gap-1 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px] text-neutral-400 leading-tight block truncate">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Donut chart via CSS conic-gradient ─────────────────────────────────────
function DonutChart({ prescriptions }: { prescriptions: Prescription[] }) {
  const total = prescriptions.length
  if (total === 0) {
    return <p className="text-sm text-neutral-400 text-center py-8">No prescriptions yet.</p>
  }

  const groups = Object.entries(STATUS_COLORS)
    .map(([status, color]) => ({
      status,
      color,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      count: prescriptions.filter(p => p.status === status).length,
    }))
    .filter(g => g.count > 0)

  let cum = 0
  const gradient = groups.map(g => {
    const start = cum
    const pct = (g.count / total) * 100
    cum += pct
    return `${g.color} ${start.toFixed(2)}% ${cum.toFixed(2)}%`
  }).join(', ')

  const completionRate = Math.round(
    (prescriptions.filter(p => p.status === 'completed').length / total) * 100
  )

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0">
        <div
          className="w-full h-full rounded-full shadow-md"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <p className="text-3xl font-extrabold text-[#184363] leading-none">{total}</p>
            <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Total Rx</p>
            <p className="text-[10px] text-green-500 font-bold mt-1">{completionRate}% done</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 flex-1">
        {groups.map(g => (
          <div key={g.status} className="flex items-center gap-2 min-w-0">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: g.color }} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-700 truncate">{g.label}</p>
              <p className="text-[10px] text-neutral-400">
                {g.count} · {((g.count / total) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsSection({ prescriptions, pharmacies, analytics, analyticsLoading, role }: Props) {
  const now = Date.now()

  // Pipeline bar chart data from analytics metrics
  const pipelineData = useMemo(() => {
    const map: Record<string, number> = {}
    analytics?.prescriptionMetrics.forEach(m => { map[m.status] = m.count })
    return STATUS_ORDER.map(s => ({ label: STATUS_LABELS[s], value: map[s] ?? 0 }))
  }, [analytics])

  // Per-store comparison (franchise admin)
  const storeBarData = useMemo(() => {
    if (role !== 'franchise_admin') return []
    return pharmacies
      .map(ph => ({
        label: ph.name.split(' ')[0],
        value: prescriptions.filter(p => p.preferred_pharmacy_id === ph.id).length,
      }))
      .sort((a, b) => b.value - a.value)
  }, [pharmacies, prescriptions, role])

  // Avg age by status
  const avgAgeByStatus = useMemo(() => {
    return ACTIVE_STATUSES.map(status => {
      const matching = prescriptions.filter(p => p.status === status)
      if (!matching.length) return null
      const avgMs = matching.reduce((sum, p) => sum + (now - new Date(p.updated_at).getTime()), 0) / matching.length
      return { status, label: STATUS_LABELS[status], avgHours: avgMs / 3600000, count: matching.length }
    }).filter((x): x is NonNullable<typeof x> => x !== null)
  }, [prescriptions, now])

  // Submissions sparkline data → bar chart
  const submissionBarData = useMemo(() => {
    if (!analytics?.prescriptionsByDay) return []
    const days = analytics.prescriptionsByDay
    // Show every 3rd label to avoid crowding
    return days.map((d, i) => ({
      label: i % 5 === 0 || i === days.length - 1 ? d.date.slice(5) : '',
      value: d.count,
    }))
  }, [analytics])

  // Customer growth bar data
  const customerBarData = useMemo(() => {
    if (!analytics?.customerGrowth) return []
    return analytics.customerGrowth.map(m => ({
      label: m.month.slice(5),
      value: m.new_customers,
    }))
  }, [analytics])

  // Revenue bar data
  const revenueBarData = useMemo(() => {
    if (!analytics?.revenueByDay) return []
    return analytics.revenueByDay.map((d, i) => ({
      label: i % 7 === 0 || i === analytics.revenueByDay.length - 1 ? d.date.slice(5) : '',
      value: d.revenue,
    }))
  }, [analytics])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Analytics</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Prescription and commerce metrics</p>
      </div>

      {/* ── Prescription Analytics ── */}
      <section>
        <h2 className="text-lg font-extrabold text-[#184363] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#009eb9] rounded-full inline-block" />
          Prescription Analytics
        </h2>

        <div className="space-y-4">
          {/* Status distribution donut + pipeline bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Donut */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-5">Status Distribution</h3>
              <DonutChart prescriptions={prescriptions} />
            </div>

            {/* Pipeline vertical bars */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-5">Pipeline Volume</h3>
              {analyticsLoading ? (
                <div className="h-40 bg-neutral-100 rounded animate-pulse" />
              ) : (
                <BarChart
                  data={pipelineData}
                  color="#009eb9"
                  height={160}
                />
              )}
            </div>
          </div>

          {/* Submissions per day */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#184363] mb-5">Submissions Per Day — Last 30 Days</h3>
            {analyticsLoading ? (
              <div className="h-44 bg-neutral-100 rounded animate-pulse" />
            ) : submissionBarData.length === 0 ? (
              <p className="text-sm text-neutral-400">No data.</p>
            ) : (
              <BarChart data={submissionBarData} color="#009eb9" height={160} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Avg time in status */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-5">Avg Time in Status (Active Scripts)</h3>
              {avgAgeByStatus.length === 0 ? (
                <p className="text-sm text-neutral-400">No active prescriptions.</p>
              ) : (
                <BarChart
                  data={avgAgeByStatus.map(s => ({
                    label: s.label,
                    value: parseFloat(s.avgHours.toFixed(1)),
                  }))}
                  color="#6366F1"
                  height={140}
                  formatValue={v => v < 1 ? `${Math.round(v * 60)}m` : `${v.toFixed(1)}h`}
                />
              )}
              {/* Color legend for urgency */}
              <div className="mt-3 flex gap-4 justify-center text-[10px] text-neutral-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" />{'< 2h healthy'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" />2–8h caution</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" />{'>8h urgent'}</span>
              </div>
            </div>

            {/* Per-store comparison (franchise) or store breakdown (store manager) */}
            {role === 'franchise_admin' ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#184363] mb-5">Prescriptions by Store</h3>
                {storeBarData.length === 0 ? (
                  <p className="text-sm text-neutral-400">No store data.</p>
                ) : (
                  <BarChart data={storeBarData} color="#184363" height={140} />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#184363] mb-5">My Store — Status Breakdown</h3>
                {prescriptions.length === 0 ? (
                  <p className="text-sm text-neutral-400">No prescriptions yet.</p>
                ) : (
                  <BarChart
                    data={['submitted', 'verifying', 'dispensing', 'ready_collect', 'completed', 'rejected'].map(s => ({
                      label: STATUS_LABELS[s] ?? s,
                      value: prescriptions.filter(p => p.status === s).length,
                    }))}
                    color="#009eb9"
                    height={140}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Commerce Analytics ── */}
      <section>
        <h2 className="text-lg font-extrabold text-[#184363] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#184363] rounded-full inline-block" />
          Commerce Analytics
          {role === 'store_manager' && (
            <span className="text-xs font-normal text-neutral-400 ml-1">(all branches)</span>
          )}
        </h2>

        {analyticsLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <LoadingBlock key={i} h="h-24" />)}
            </div>
            <LoadingBlock h="h-56" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LoadingBlock /><LoadingBlock />
            </div>
          </div>
        ) : !analytics?.kpis ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-400">
            Failed to load commerce analytics.
          </div>
        ) : (
          <div className="space-y-4">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today's Revenue", value: `R ${analytics.kpis.today.toFixed(2)}`, sub: 'completed orders', color: 'text-[#009eb9]', bg: 'bg-[#009eb9]/5 border-[#009eb9]/20' },
                { label: 'This Month', value: `R ${analytics.kpis.thisMonth.toFixed(2)}`, sub: 'month to date', color: 'text-[#184363]', bg: 'bg-[#184363]/5 border-[#184363]/20' },
                {
                  label: 'MoM Growth',
                  value: analytics.kpis.growthPct !== null
                    ? `${analytics.kpis.growthPct > 0 ? '+' : ''}${analytics.kpis.growthPct}%`
                    : '—',
                  sub: 'vs last month',
                  color: analytics.kpis.growthPct !== null && analytics.kpis.growthPct >= 0 ? 'text-green-600' : 'text-red-500',
                  bg: 'bg-neutral-50 border-neutral-200',
                },
                { label: 'Total Orders', value: analytics.kpis.totalOrders.toString(), sub: 'all time', color: 'text-[#184363]', bg: 'bg-neutral-50 border-neutral-200' },
              ].map(({ label, value, sub, color, bg }) => (
                <div key={label} className={`bg-white rounded-xl border p-5 shadow-sm ${bg}`}>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue bar chart */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-5">Revenue — Last 30 Days (Completed Orders)</h3>
              {analytics.revenueByDay.every(d => d.revenue === 0) ? (
                <p className="text-sm text-neutral-400 text-center py-6">No completed orders yet.</p>
              ) : (
                <BarChart
                  data={revenueBarData}
                  color="#184363"
                  height={160}
                  formatValue={v => `R${v.toFixed(0)}`}
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Orders by Status */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#184363] mb-5">Orders by Status</h3>
                {analytics.ordersByStatus.length === 0 ? (
                  <p className="text-sm text-neutral-400">No orders yet.</p>
                ) : (
                  <>
                    <BarChart
                      data={analytics.ordersByStatus.map(o => ({
                        label: o.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                        value: o.count,
                      }))}
                      color="#009eb9"
                      height={120}
                    />
                    <div className="mt-4 space-y-1.5">
                      {analytics.ordersByStatus.map(({ status, count, total: rev }) => (
                        <div key={status} className="flex items-center justify-between text-xs">
                          <span className="capitalize text-neutral-600">{status.replace(/-/g, ' ')}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-400">R {rev.toFixed(2)}</span>
                            <span className="font-bold text-[#009eb9] w-6 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Customer Growth */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#184363] mb-5">New Customers — Last 6 Months</h3>
                {analytics.customerGrowth.every(m => m.new_customers === 0) ? (
                  <p className="text-sm text-neutral-400">No customer data yet.</p>
                ) : (
                  <BarChart
                    data={customerBarData}
                    color="#184363"
                    secondColor="#009eb9"
                    height={140}
                  />
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-[#184363]">Top 10 Products by Revenue</h3>
              </div>
              {analytics.topProducts.length === 0 ? (
                <p className="text-sm text-neutral-400 p-6">No order item data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">#</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Product</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-500 uppercase tracking-wide">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Revenue</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {(() => {
                        const totalRev = analytics.topProducts.reduce((s, p) => s + p.revenue, 0) || 1
                        return analytics.topProducts.map((p, i) => (
                          <tr key={i} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-3 text-xs text-neutral-400 font-bold">{i + 1}</td>
                            <td className="px-6 py-3 text-sm text-[#184363] font-semibold">{p.product_name}</td>
                            <td className="px-6 py-3 text-sm text-center text-neutral-600">{p.qty}</td>
                            <td className="px-6 py-3 text-sm text-right font-bold text-[#009eb9]">R {p.revenue.toFixed(2)}</td>
                            <td className="px-6 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#009eb9] rounded-full"
                                    style={{ width: `${(p.revenue / totalRev) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-neutral-400 w-8 text-right">
                                  {((p.revenue / totalRev) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-[#184363]">Recent Orders</h3>
              </div>
              {analytics.recentOrders.length === 0 ? (
                <p className="text-sm text-neutral-400 p-6">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Total</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {analytics.recentOrders.map(o => (
                        <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3 text-sm font-bold text-[#184363]">#{o.number}</td>
                          <td className="px-6 py-3 text-sm text-neutral-600">{o.billing_name || '—'}</td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 capitalize">
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-right text-[#009eb9]">R {o.total.toFixed(2)}</td>
                          <td className="px-6 py-3 text-xs text-neutral-400 text-right">
                            {new Date(o.date_created).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
