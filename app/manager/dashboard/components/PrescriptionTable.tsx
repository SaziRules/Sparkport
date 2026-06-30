'use client'

import { useState, useMemo } from 'react'
import { Prescription, Pharmacy } from '../types'
import { getAgeInfo, getStatusColor, STATUS_TRANSITIONS } from '../utils'

const PAGE_SIZE = 20
type ViewMode = 'table' | 'card' | 'list'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
  role: 'franchise_admin' | 'store_manager'
  onQuickAction: (id: string, status: string) => Promise<void>
  onRowClick: (prescription: Prescription) => void
}

export default function PrescriptionTable({ prescriptions, pharmacies, role, onQuickAction, onRowClick }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStore, setFilterStore] = useState('all')
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('all')
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const pharmacyMap = useMemo(() => {
    const m: Record<string, string> = {}
    pharmacies.forEach(p => { m[p.id] = p.name })
    return m
  }, [pharmacies])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const now = Date.now()
    const dayMs = 86400000
    return prescriptions.filter(p => {
      if (q && !p.prescription_number.toLowerCase().includes(q) &&
          !p.patient_name.toLowerCase().includes(q) &&
          !p.patient_phone.includes(q)) return false
      if (filterStatus !== 'all' && p.status !== filterStatus) return false
      if (role === 'franchise_admin' && filterStore !== 'all' && p.preferred_pharmacy_id !== filterStore) return false
      if (dateRange === 'today') {
        const start = new Date(); start.setHours(0, 0, 0, 0)
        if (new Date(p.created_at) < start) return false
      } else if (dateRange === '7d' && now - new Date(p.created_at).getTime() > 7 * dayMs) {
        return false
      } else if (dateRange === '30d' && now - new Date(p.created_at).getTime() > 30 * dayMs) {
        return false
      }
      return true
    })
  }, [prescriptions, search, filterStatus, filterStore, dateRange, role])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const reset = () => setPage(1)

  const handleQuickAction = async (e: React.MouseEvent, id: string, next: string) => {
    e.stopPropagation()
    setActionLoading(id)
    try { await onQuickAction(id, next) } finally { setActionLoading(null) }
  }

  const ViewToggle = () => (
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-0.5">
      {([
        { mode: 'table' as ViewMode, title: 'Table', icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
          </svg>
        )},
        { mode: 'card' as ViewMode, title: 'Cards', icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
          </svg>
        )},
        { mode: 'list' as ViewMode, title: 'List', icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )},
      ] as const).map(({ mode, title, icon }) => (
        <button
          key={mode}
          title={title}
          onClick={() => setViewMode(mode)}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === mode ? 'bg-white text-[#009eb9] shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      {/* Controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search name, Rx#, or phone…"
              value={search}
              onChange={e => { setSearch(e.target.value); reset() }}
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); reset() }}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
          >
            <option value="all">All Status</option>
            {['submitted','verifying','verified','dispensing','ready_collect','out_delivery','completed','rejected','cancelled'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
          {role === 'franchise_admin' && (
            <select
              value={filterStore}
              onChange={e => { setFilterStore(e.target.value); reset() }}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
            >
              <option value="all">All Stores</option>
              {pharmacies.map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
            </select>
          )}
          <ViewToggle />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['today', '7d', '30d', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => { setDateRange(r); reset() }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                dateRange === r ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-neutral-500 mb-3 px-1">
        Showing{' '}
        <span className="font-bold text-[#184363]">
          {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
        </span>{' '}
        of <span className="font-bold text-[#184363]">{filtered.length}</span> prescriptions
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-400 text-sm">
          No prescriptions match your filters.
        </div>
      ) : (
        <>
          {/* ── Card view ── */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginated.map(p => {
                const age = getAgeInfo(p.updated_at)
                const transition = STATUS_TRANSITIONS[p.status]
                return (
                  <div
                    key={p.id}
                    onClick={() => onRowClick(p)}
                    className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <p className="font-bold text-[#184363] text-sm group-hover:text-[#009eb9] transition-colors">
                          {p.prescription_number}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{p.patient_name}</p>
                      </div>
                      <span className={`ml-2 shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(p.status)}`}>
                        {p.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-400 space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <span>{p.patient_phone}</span>
                        <span className="capitalize">{p.delivery_method}</span>
                      </div>
                      {role === 'franchise_admin' && (
                        <p className="text-[#009eb9] font-semibold truncate">
                          {pharmacyMap[p.preferred_pharmacy_id] ?? '—'}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${age.colorClass}`}>
                        {age.label}
                      </span>
                      {transition ? (
                        <button
                          onClick={e => handleQuickAction(e, p.id, transition.next)}
                          disabled={actionLoading === p.id}
                          className="px-2.5 py-1 bg-[#009eb9] text-white text-[10px] font-bold rounded-lg hover:bg-[#184363] transition-colors disabled:opacity-50"
                        >
                          {actionLoading === p.id ? '…' : transition.label}
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-300">—</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── List view ── */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {paginated.map(p => {
                const age = getAgeInfo(p.updated_at)
                const transition = STATUS_TRANSITIONS[p.status]
                return (
                  <div
                    key={p.id}
                    onClick={() => onRowClick(p)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[#184363] text-sm">{p.prescription_number}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(p.status)}`}>
                          {p.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">
                        {p.patient_name} · {p.patient_phone}
                        {role === 'franchise_admin' && ` · ${pharmacyMap[p.preferred_pharmacy_id] ?? '—'}`}
                        {' · '}<span className="capitalize">{p.delivery_method}</span>
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${age.colorClass}`}>
                      {age.label}
                    </span>
                    {transition ? (
                      <button
                        onClick={e => handleQuickAction(e, p.id, transition.next)}
                        disabled={actionLoading === p.id}
                        className="px-3 py-1.5 bg-[#009eb9] text-white text-xs font-bold rounded-lg hover:bg-[#184363] transition-colors disabled:opacity-50 shrink-0"
                      >
                        {actionLoading === p.id ? '…' : transition.label}
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-300 shrink-0 w-14 text-center">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Table view ── */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Rx #</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Patient</th>
                      {role === 'franchise_admin' && (
                        <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Store</th>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Delivery</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Age in Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {paginated.map(p => {
                      const age = getAgeInfo(p.updated_at)
                      const transition = STATUS_TRANSITIONS[p.status]
                      return (
                        <tr
                          key={p.id}
                          onClick={() => onRowClick(p)}
                          className="hover:bg-neutral-50 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-bold text-[#184363] whitespace-nowrap">{p.prescription_number}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-neutral-800 whitespace-nowrap">{p.patient_name}</p>
                            <p className="text-xs text-neutral-400">{p.patient_phone}</p>
                          </td>
                          {role === 'franchise_admin' && (
                            <td className="px-4 py-3 text-sm text-neutral-600 whitespace-nowrap">
                              {pharmacyMap[p.preferred_pharmacy_id] ?? '—'}
                            </td>
                          )}
                          <td className="px-4 py-3 text-sm text-neutral-600 capitalize whitespace-nowrap">{p.delivery_method}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(p.status)}`}>
                              {p.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${age.colorClass}`}>
                              {age.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {transition ? (
                              <button
                                onClick={e => handleQuickAction(e, p.id, transition.next)}
                                disabled={actionLoading === p.id}
                                className="px-3 py-1 bg-[#009eb9] text-white text-xs font-bold rounded-lg hover:bg-[#184363] transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                {actionLoading === p.id ? '…' : transition.label}
                              </button>
                            ) : (
                              <span className="text-xs text-neutral-300">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1 text-sm font-semibold text-[#009eb9] disabled:text-neutral-300 hover:text-[#184363] transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-neutral-500">Page {safePage} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1 text-sm font-semibold text-[#009eb9] disabled:text-neutral-300 hover:text-[#184363] transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
