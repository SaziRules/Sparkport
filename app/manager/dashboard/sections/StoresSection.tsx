'use client'

import { useMemo } from 'react'
import { Prescription, Pharmacy } from '../types'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
}

const PIPELINE: { key: string; label: string; hex: string; shortLabel: string }[] = [
  { key: 'submitted',    label: 'Submitted',    hex: '#EAB308', shortLabel: 'Subm.' },
  { key: 'verifying',   label: 'Verifying',   hex: '#3B82F6', shortLabel: 'Verify' },
  { key: 'dispensing',  label: 'Dispensing',  hex: '#6366F1', shortLabel: 'Disp.' },
  { key: 'ready_collect', label: 'Ready',     hex: '#22C55E', shortLabel: 'Ready' },
  { key: 'out_delivery',  label: 'Delivery',  hex: '#06B6D4', shortLabel: 'OFD' },
  { key: 'completed',   label: 'Completed',   hex: '#9CA3AF', shortLabel: 'Done' },
  { key: 'rejected',    label: 'Rejected',    hex: '#EF4444', shortLabel: 'Rej.' },
  { key: 'cancelled',   label: 'Cancelled',   hex: '#D1D5DB', shortLabel: 'Canc.' },
]

type StoreData = {
  id: string
  name: string
  city: string
  street: string
  phone: string | null
  total: number
  pending: number
  active: number
  completed: number
  rejected: number
  completionRate: number
  statusCounts: Record<string, number>
  last7: number
  prev7: number
  pickup: number
  delivery: number
  avgAgeHours: number | null
  loadPct: number
  rank: number
}

function PipelineBar({ statusCounts, total }: { statusCounts: Record<string, number>; total: number }) {
  if (total === 0) return <div className="h-3 bg-slate-100 rounded-full" />
  return (
    <div className="h-3 rounded-full overflow-hidden flex w-full">
      {PIPELINE.filter(s => (statusCounts[s.key] ?? 0) > 0).map(s => (
        <div
          key={s.key}
          title={`${s.label}: ${statusCounts[s.key]}`}
          className="h-full transition-all"
          style={{
            width: `${((statusCounts[s.key] ?? 0) / total) * 100}%`,
            background: s.hex,
          }}
        />
      ))}
    </div>
  )
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous
  if (current === 0 && previous === 0)
    return <span className="text-[10px] text-neutral-300 font-semibold">No submissions</span>
  if (diff === 0)
    return <span className="text-[10px] text-neutral-400 font-semibold">= Same as last week</span>
  const up = diff > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? 'text-emerald-600' : 'text-amber-600'}`}>
      {up ? '▲' : '▼'} {up ? '+' : ''}{diff} vs last week
    </span>
  )
}

function ProgressBar({ value, color = '#009eb9' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(value, 100)}%`, background: color }}
      />
    </div>
  )
}

function StoreCard({ store }: { store: StoreData }) {
  const rankColors = ['bg-amber-400', 'bg-slate-400', 'bg-orange-400']
  const rankColor = store.rank <= 3 ? rankColors[store.rank - 1] : 'bg-slate-200'
  const rankLabel = store.rank <= 3 ? ['1st', '2nd', '3rd'][store.rank - 1] : `#${store.rank}`

  const activeStatuses = PIPELINE.filter(s =>
    !['completed', 'rejected', 'cancelled'].includes(s.key) && (store.statusCounts[s.key] ?? 0) > 0
  )
  const terminalStatuses = PIPELINE.filter(s =>
    ['completed', 'rejected', 'cancelled'].includes(s.key) && (store.statusCounts[s.key] ?? 0) > 0
  )

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">

      {/* ── Card header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-extrabold text-[#184363] leading-tight truncate">{store.name}</h3>
              <span className={`shrink-0 text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-full ${rankColor}`}>
                {rankLabel}
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate">
              {store.city}
              {store.street && <> · {store.street}</>}
            </p>
            {store.phone && (
              <p className="text-xs text-neutral-400 mt-0.5">{store.phone}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">Network load</p>
            <p className="text-lg font-extrabold text-[#009eb9] leading-tight">{store.loadPct.toFixed(0)}%</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={store.loadPct} color="#009eb9" />
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-4 divide-x divide-slate-50">
        {[
          {
            label: 'Pending',
            value: store.pending,
            color: store.pending > 0 ? 'text-red-500' : 'text-neutral-300',
            bg: store.pending > 0 ? 'bg-red-50/50' : '',
            sublabel: store.pending > 0 ? 'needs action' : 'clear',
          },
          {
            label: 'Active',
            value: store.active,
            color: 'text-[#009eb9]',
            bg: 'bg-[#009eb9]/5',
            sublabel: 'in progress',
          },
          {
            label: 'Completed',
            value: store.completed,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
            sublabel: `${store.completionRate}% rate`,
          },
          {
            label: 'Total',
            value: store.total,
            color: 'text-[#184363]',
            bg: '',
            sublabel: 'all time',
          },
        ].map(({ label, value, color, bg, sublabel }) => (
          <div key={label} className={`px-4 py-3 text-center ${bg}`}>
            <p className={`text-2xl font-extrabold leading-none ${color}`}>{value}</p>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">{label}</p>
            <p className="text-[9px] text-neutral-300 mt-0.5">{sublabel}</p>
          </div>
        ))}
      </div>

      {/* ── Pipeline distribution ── */}
      <div className="px-5 py-4 border-t border-slate-50">
        <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-2.5">Pipeline Distribution</p>
        <PipelineBar statusCounts={store.statusCounts} total={store.total} />
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {/* Active pipeline statuses */}
          {activeStatuses.map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.hex }} />
                <span className="text-xs text-neutral-500">{s.label}</span>
              </div>
              <span className="text-xs font-bold text-neutral-700">{store.statusCounts[s.key] ?? 0}</span>
            </div>
          ))}
          {/* Terminal statuses */}
          {terminalStatuses.map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.hex }} />
                <span className="text-xs text-neutral-400">{s.label}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-400">{store.statusCounts[s.key] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Completion rate ── */}
      <div className="px-5 py-3 border-t border-slate-50">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em]">Completion Rate</p>
          <span className={`text-xs font-extrabold ${store.completionRate >= 70 ? 'text-emerald-600' : store.completionRate >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
            {store.completionRate}%
          </span>
        </div>
        <ProgressBar
          value={store.completionRate}
          color={store.completionRate >= 70 ? '#22C55E' : store.completionRate >= 40 ? '#F59E0B' : '#EF4444'}
        />
      </div>

      {/* ── Footer: trend + avg age + delivery split ── */}
      <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-1">This Week</p>
          <p className="text-sm font-extrabold text-[#184363]">{store.last7}</p>
          <TrendBadge current={store.last7} previous={store.prev7} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-1">Avg Wait</p>
          {store.avgAgeHours !== null ? (
            <>
              <p className={`text-sm font-extrabold ${store.avgAgeHours > 8 ? 'text-red-500' : store.avgAgeHours > 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {store.avgAgeHours < 1
                  ? `${Math.round(store.avgAgeHours * 60)}m`
                  : `${store.avgAgeHours.toFixed(1)}h`}
              </p>
              <p className="text-[10px] text-neutral-300">active scripts</p>
            </>
          ) : (
            <p className="text-sm font-extrabold text-neutral-300">—</p>
          )}
        </div>
        <div>
          <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-1">Delivery</p>
          {store.total > 0 ? (
            <>
              <p className="text-sm font-extrabold text-[#009eb9]">
                {Math.round((store.delivery / Math.max(store.delivery + store.pickup, 1)) * 100)}%
              </p>
              <p className="text-[10px] text-neutral-300">
                {store.delivery}d · {store.pickup}p
              </p>
            </>
          ) : (
            <p className="text-sm font-extrabold text-neutral-300">—</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StoresSection({ prescriptions, pharmacies }: Props) {
  const now = Date.now()
  const day = 86400000

  const networkStats = useMemo(() => {
    const total = prescriptions.length
    const pending = prescriptions.filter(p => p.status === 'submitted' || p.status === 'verifying').length
    const completed = prescriptions.filter(p => p.status === 'completed').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const last7 = prescriptions.filter(p => now - new Date(p.created_at).getTime() < 7 * day).length
    return { total, pending, completed, completionRate, last7 }
  }, [prescriptions, now])

  const storeCards = useMemo<StoreData[]>(() => {
    const cards = pharmacies.map(ph => {
      const store = prescriptions.filter(p => p.preferred_pharmacy_id === ph.id)
      const total = store.length

      const statusCounts: Record<string, number> = {}
      PIPELINE.forEach(s => { statusCounts[s.key] = 0 })
      store.forEach(p => { if (p.status in statusCounts) statusCounts[p.status]++ })

      const pending = (statusCounts.submitted ?? 0) + (statusCounts.verifying ?? 0)
      const active = store.filter(p =>
        ['submitted','verifying','dispensing','ready_collect','out_delivery'].includes(p.status)
      ).length
      const completed = statusCounts.completed ?? 0
      const rejected = (statusCounts.rejected ?? 0) + (statusCounts.cancelled ?? 0)
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      const last7 = store.filter(p => now - new Date(p.created_at).getTime() < 7 * day).length
      const prev7 = store.filter(p => {
        const age = now - new Date(p.created_at).getTime()
        return age >= 7 * day && age < 14 * day
      }).length

      const pickup = store.filter(p =>
        ['pickup', 'collection', 'collect'].includes((p.delivery_method ?? '').toLowerCase())
      ).length
      const delivery = store.filter(p =>
        (p.delivery_method ?? '').toLowerCase() === 'delivery'
      ).length

      const activeRx = store.filter(p =>
        ['submitted','verifying','dispensing','ready_collect'].includes(p.status)
      )
      const avgAgeHours = activeRx.length > 0
        ? (activeRx.reduce((s, p) => s + (now - new Date(p.updated_at).getTime()), 0) / activeRx.length) / 3600000
        : null

      const loadPct = prescriptions.length > 0 ? (total / prescriptions.length) * 100 : 0

      return {
        id: ph.id, name: ph.name, city: ph.city,
        street: ph.street_address, phone: ph.phone,
        total, pending, active, completed, rejected, completionRate,
        statusCounts, last7, prev7, pickup, delivery, avgAgeHours, loadPct,
        rank: 0,
      }
    })

    return cards
      .sort((a, b) => b.total - a.total)
      .map((c, i) => ({ ...c, rank: i + 1 }))
  }, [pharmacies, prescriptions, now])

  if (pharmacies.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#184363]">Stores</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Live performance across all pharmacy locations</p>
        </div>
        <div className="bg-white rounded-2xl p-12 text-center shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
          <p className="text-neutral-400 text-sm">No stores in the network yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Stores</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Live performance across all pharmacy locations</p>
      </div>

      {/* Network summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Locations',
            value: pharmacies.length,
            sub: 'in the network',
            accent: 'bg-[#184363]/5',
            numColor: 'text-[#184363]',
            icon: (
              <svg className="w-5 h-5 text-[#184363]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
          },
          {
            label: 'Network Rx',
            value: networkStats.total,
            sub: 'total prescriptions',
            accent: 'bg-[#009eb9]/10',
            numColor: 'text-[#009eb9]',
            icon: (
              <svg className="w-5 h-5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
          {
            label: 'Pending Action',
            value: networkStats.pending,
            sub: networkStats.pending > 0 ? 'needs attention' : 'all clear',
            accent: networkStats.pending > 0 ? 'bg-red-50' : 'bg-neutral-50',
            numColor: networkStats.pending > 0 ? 'text-red-500' : 'text-neutral-300',
            icon: (
              <svg className={`w-5 h-5 ${networkStats.pending > 0 ? 'text-red-500' : 'text-neutral-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Network Completion',
            value: `${networkStats.completionRate}%`,
            sub: `${networkStats.completed} completed`,
            accent: 'bg-emerald-50',
            numColor: 'text-emerald-600',
            icon: (
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ].map(({ label, value, sub, accent, numColor, icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
              {icon}
            </div>
            <p className={`text-3xl font-extrabold leading-none mb-1 ${numColor}`}>{value}</p>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
            <p className="text-[11px] text-neutral-300 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Network pipeline legend */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] flex flex-wrap items-center gap-4">
        <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] shrink-0">Pipeline Key</p>
        {PIPELINE.filter(s => !['rejected','cancelled'].includes(s.key)).map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: s.hex }} />
            <span className="text-xs font-medium text-neutral-500">{s.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#EF4444' }} />
          <span className="text-xs font-medium text-neutral-500">Rejected / Cancelled</span>
        </div>
      </div>

      {/* Store cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {storeCards.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  )
}
