'use client'

import { useMemo } from 'react'
import { Prescription, Pharmacy, Analytics } from '../types'
import { getAgeInfo, getStatusColor, getRelativeTime } from '../utils'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
  analytics: Analytics | null
  analyticsLoading: boolean
}

const STATUS_DOT: Record<string, string> = {
  submitted:    'bg-yellow-400',
  verifying:    'bg-blue-400',
  verified:     'bg-purple-400',
  dispensing:   'bg-indigo-400',
  ready_collect: 'bg-green-400',
  out_delivery: 'bg-cyan-400',
  completed:    'bg-neutral-400',
  rejected:     'bg-red-400',
  cancelled:    'bg-neutral-300',
}

function KpiCard({
  label, value, sub, accent, icon,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  accent: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-[#184363] leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-neutral-300 mt-1">{sub}</p>}
    </div>
  )
}

export default function OverviewSection({ prescriptions, pharmacies, analytics, analyticsLoading }: Props) {
  const now = Date.now()

  const pending  = prescriptions.filter(p => p.status === 'submitted' || p.status === 'verifying').length
  const active   = prescriptions.filter(p =>
    ['submitted', 'verifying', 'dispensing', 'ready_collect', 'out_delivery'].includes(p.status)
  ).length
  const completed = prescriptions.filter(p => p.status === 'completed').length
  const total     = prescriptions.length

  const pharmacyMap = useMemo(() => {
    const m: Record<string, string> = {}
    pharmacies.forEach(p => { m[p.id] = p.name })
    return m
  }, [pharmacies])

  const recentPrescriptions = useMemo(() =>
    [...prescriptions]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 8),
    [prescriptions]
  )

  const storeRows = useMemo(() =>
    pharmacies.map(ph => {
      const store = prescriptions.filter(p => p.preferred_pharmacy_id === ph.id)
      const storePending = store.filter(p => p.status === 'submitted' || p.status === 'verifying').length
      const storeActive = store.filter(p =>
        ['submitted', 'verifying', 'dispensing', 'ready_collect', 'out_delivery'].includes(p.status)
      ).length
      const storeCompleted = store.filter(p => p.status === 'completed').length
      return { id: ph.id, name: ph.name, city: ph.city, total: store.length, pending: storePending, active: storeActive, completed: storeCompleted }
    }).sort((a, b) => b.total - a.total),
    [pharmacies, prescriptions]
  )

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-8">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pending Action"
          value={<span className={pending > 0 ? 'text-red-500' : 'text-neutral-300'}>{pending}</span>}
          sub="submitted + verifying"
          accent={pending > 0 ? 'bg-red-50' : 'bg-neutral-50'}
          icon={
            <svg className={`w-5 h-5 ${pending > 0 ? 'text-red-500' : 'text-neutral-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Active Scripts"
          value={active}
          sub="in progress"
          accent="bg-[#009eb9]/10"
          icon={
            <svg className="w-5 h-5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <KpiCard
          label="Completed"
          value={<span className="text-emerald-600">{completed}</span>}
          sub={`${completionRate}% completion rate`}
          accent="bg-emerald-50"
          icon={
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Today's Revenue"
          value={
            analyticsLoading
              ? <span className="text-neutral-200 text-xl">—</span>
              : <span className="text-[#184363]">R{analytics?.kpis.today.toFixed(0) ?? '0'}</span>
          }
          sub="completed orders"
          accent="bg-amber-50"
          icon={
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* ── Two-column: Recent Rx + Recent Orders ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Prescriptions */}
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#184363]">Recent Prescriptions</h2>
            <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wide">{total} total</span>
          </div>
          {recentPrescriptions.length === 0 ? (
            <p className="p-8 text-sm text-neutral-300 text-center">No prescriptions yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentPrescriptions.map(p => {
                const age = getAgeInfo(p.updated_at)
                return (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[p.status] ?? 'bg-neutral-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#184363] truncate">{p.prescription_number}</p>
                      <p className="text-xs text-neutral-400 truncate">
                        {p.patient_name}
                        {pharmacies.length > 0 && (
                          <> · <span className="text-[#009eb9]">{pharmacyMap[p.preferred_pharmacy_id] ?? '—'}</span></>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${age.colorClass}`}>
                        {age.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(p.status)}`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#184363]">Recent Orders</h2>
            {!analyticsLoading && analytics && (
              <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wide">
                {analytics.kpis.totalOrders} total
              </span>
            )}
          </div>
          {analyticsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !analytics || analytics.recentOrders.length === 0 ? (
            <p className="p-8 text-sm text-neutral-300 text-center">No orders yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {analytics.recentOrders.slice(0, 8).map(o => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#184363] truncate">#{o.number}</p>
                    <p className="text-xs text-neutral-400 truncate">{o.billing_name || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 capitalize">
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

      {/* ── Store Overview (franchise only) ── */}
      {pharmacies.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#184363]">Store Overview</h2>
            <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wide">{pharmacies.length} locations</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {storeRows.map(row => {
              const loadPct = total > 0 ? (row.total / total) * 100 : 0
              return (
                <div key={row.id} className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-[#184363] leading-tight">{row.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{row.city}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className={`text-2xl font-extrabold leading-none ${row.pending > 0 ? 'text-red-500' : 'text-neutral-300'}`}>
                        {row.pending}
                      </p>
                      <p className={`text-[9px] font-bold uppercase tracking-wide mt-0.5 ${row.pending > 0 ? 'text-red-400' : 'text-neutral-300'}`}>
                        Pending
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold leading-none text-[#009eb9]">{row.active}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wide mt-0.5 text-[#009eb9]/60">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold leading-none text-[#184363]">{row.total}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wide mt-0.5 text-neutral-300">Total</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#009eb9] rounded-full transition-all"
                      style={{ width: `${loadPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1.5 text-right">{loadPct.toFixed(0)}% of network load</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
