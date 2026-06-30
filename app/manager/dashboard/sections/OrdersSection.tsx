'use client'

import { useMemo } from 'react'
import { Analytics } from '../types'

type Props = {
  analytics: Analytics | null
  analyticsLoading: boolean
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  completed:  '#22C55E',
  processing: '#3B82F6',
  'on-hold':  '#EAB308',
  pending:    '#F97316',
  cancelled:  '#9CA3AF',
  refunded:   '#8B5CF6',
  failed:     '#EF4444',
}

function BarChart({
  data,
  color = '#009eb9',
  height = 160,
  formatValue,
}: {
  data: { label: string; value: number }[]
  color?: string
  height?: number
  formatValue?: (v: number) => string
}) {
  const max = Math.max(...data.map(d => d.value), 1)
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  const labelW = 36

  if (data.every(d => d.value === 0)) {
    return <p className="text-sm text-neutral-400 text-center py-8">No data yet.</p>
  }

  return (
    <div style={{ paddingLeft: labelW }}>
      <div className="relative" style={{ height }}>
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
        <div className="absolute inset-0 flex items-end gap-1">
          {data.map((d, i) => {
            const h1 = Math.max((d.value / max) * 100, d.value > 0 ? 2 : 0)
            return (
              <div key={i} className="flex-1 flex items-end h-full group relative">
                <div
                  className="w-full rounded-t-sm transition-all hover:opacity-75 cursor-default"
                  style={{ height: `${h1}%`, background: color }}
                />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#184363] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-lg">
                  {formatValue ? formatValue(d.value) : d.value}
                </div>
              </div>
            )
          })}
        </div>
      </div>
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

const LoadingSkeleton = ({ h = 'h-40' }: { h?: string }) => (
  <div className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] ${h} animate-pulse`} />
)

export default function OrdersSection({ analytics, analyticsLoading }: Props) {
  const revenueBarData = useMemo(() => {
    if (!analytics?.revenueByDay) return []
    return analytics.revenueByDay.map((d, i) => ({
      label: i % 7 === 0 || i === analytics.revenueByDay.length - 1 ? d.date.slice(5) : '',
      value: d.revenue,
    }))
  }, [analytics])

  const statusBarData = useMemo(() => {
    if (!analytics?.ordersByStatus) return []
    return analytics.ordersByStatus.map(o => ({
      label: o.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: o.count,
    }))
  }, [analytics])

  if (analyticsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse mb-1" />
          <div className="h-4 w-56 bg-slate-50 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} h="h-24" />)}
        </div>
        <LoadingSkeleton h="h-56" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadingSkeleton /><LoadingSkeleton />
        </div>
        <LoadingSkeleton h="h-64" />
        <LoadingSkeleton h="h-64" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
        <p className="text-neutral-400 text-sm">Failed to load orders data.</p>
      </div>
    )
  }

  const totalRev = analytics.topProducts.reduce((s, p) => s + p.revenue, 0) || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Orders</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Commerce performance and order management</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Revenue",
            value: `R${analytics.kpis.today.toFixed(0)}`,
            sub: 'completed orders',
            accent: 'bg-amber-50',
            numColor: 'text-amber-600',
            icon: (
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'This Month',
            value: `R${analytics.kpis.thisMonth.toFixed(0)}`,
            sub: 'month to date',
            accent: 'bg-[#009eb9]/10',
            numColor: 'text-[#009eb9]',
            icon: (
              <svg className="w-5 h-5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            label: 'MoM Growth',
            value: analytics.kpis.growthPct !== null
              ? `${analytics.kpis.growthPct > 0 ? '+' : ''}${analytics.kpis.growthPct}%`
              : '—',
            sub: 'vs last month',
            accent: analytics.kpis.growthPct !== null && analytics.kpis.growthPct >= 0 ? 'bg-emerald-50' : 'bg-red-50',
            numColor: analytics.kpis.growthPct !== null && analytics.kpis.growthPct >= 0 ? 'text-emerald-600' : 'text-red-500',
            icon: (
              <svg className={`w-5 h-5 ${analytics.kpis.growthPct !== null && analytics.kpis.growthPct >= 0 ? 'text-emerald-500' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
          },
          {
            label: 'Total Orders',
            value: analytics.kpis.totalOrders.toString(),
            sub: 'all time',
            accent: 'bg-slate-50',
            numColor: 'text-[#184363]',
            icon: (
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            ),
          },
        ].map(({ label, value, sub, accent, numColor, icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                {icon}
              </div>
            </div>
            <p className={`text-3xl font-extrabold leading-none mb-1 ${numColor}`}>{value}</p>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
            <p className="text-[11px] text-neutral-300 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Revenue Chart ── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-[#184363]">Revenue — Last 30 Days</h2>
          <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wide">Completed orders only</span>
        </div>
        {analytics.revenueByDay.every(d => d.revenue === 0) ? (
          <p className="text-sm text-neutral-400 text-center py-8">No completed orders yet.</p>
        ) : (
          <BarChart
            data={revenueBarData}
            color="#184363"
            height={180}
            formatValue={v => `R${v.toFixed(0)}`}
          />
        )}
      </div>

      {/* ── Status breakdown + Recent orders ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
          <h2 className="text-sm font-bold text-[#184363] mb-5">Orders by Status</h2>
          {analytics.ordersByStatus.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">No orders yet.</p>
          ) : (
            <>
              <BarChart
                data={statusBarData}
                color="#009eb9"
                height={120}
              />
              <div className="mt-5 space-y-2 border-t border-slate-50 pt-4">
                {analytics.ordersByStatus.map(({ status, count, total: rev }) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: ORDER_STATUS_COLORS[status] ?? '#9CA3AF' }}
                      />
                      <span className="text-sm capitalize text-neutral-600">{status.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-400">R{rev.toFixed(0)}</span>
                      <span className="text-sm font-bold text-[#009eb9] w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#184363]">Recent Orders</h2>
            <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wide">
              {analytics.kpis.totalOrders} total
            </span>
          </div>
          {analytics.recentOrders.length === 0 ? (
            <p className="p-8 text-sm text-neutral-300 text-center">No orders yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {analytics.recentOrders.map(o => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#184363] truncate">#{o.number}</p>
                    <p className="text-xs text-neutral-400 truncate">
                      {o.billing_name || '—'} · {new Date(o.date_created).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: `${ORDER_STATUS_COLORS[o.status] ?? '#9CA3AF'}18`,
                        color: ORDER_STATUS_COLORS[o.status] ?? '#9CA3AF',
                      }}
                    >
                      {o.status}
                    </span>
                    <span className="text-sm font-bold text-[#009eb9]">R{o.total.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Top Products ── */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-[#184363]">Top Products by Revenue</h2>
        </div>
        {analytics.topProducts.length === 0 ? (
          <p className="p-8 text-sm text-neutral-300 text-center">No product data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/60">
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.08em]">#</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.08em]">Product</th>
                  <th className="px-6 py-3 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.08em]">Qty</th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-[0.08em]">Revenue</th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-[0.08em]">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analytics.topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-3 text-xs text-neutral-300 font-bold">{i + 1}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-[#184363]">{p.product_name}</td>
                    <td className="px-6 py-3 text-sm text-center text-neutral-500">{p.qty}</td>
                    <td className="px-6 py-3 text-sm font-bold text-right text-[#009eb9]">R{p.revenue.toFixed(0)}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#009eb9] rounded-full"
                            style={{ width: `${(p.revenue / totalRev) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400 w-8 text-right">
                          {((p.revenue / totalRev) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
