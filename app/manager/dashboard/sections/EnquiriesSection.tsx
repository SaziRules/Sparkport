'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { Enquiry, EnquiryReply, Pharmacy } from '../types'

type Props = {
  role: 'franchise_admin' | 'store_manager'
  pharmacies: Pharmacy[]
}

type DetailEnquiry = Enquiry & { replies: EnquiryReply[] }

const STATUS_CFG: Record<string, { label: string; badge: string; dot: string }> = {
  open:        { label: 'Open',        badge: 'border-amber-200 bg-amber-50 text-amber-700',   dot: 'bg-amber-400' },
  in_progress: { label: 'In Progress', badge: 'border-blue-200  bg-blue-50  text-blue-700',    dot: 'bg-blue-400'  },
  resolved:    { label: 'Resolved',    badge: 'border-green-200 bg-green-50 text-green-700',   dot: 'bg-green-400' },
  closed:      { label: 'Closed',      badge: 'border-slate-200 bg-slate-50 text-neutral-500', dot: 'bg-neutral-300' },
}

const PRIORITY_CFG: Record<string, { label: string; dot: string; text: string }> = {
  low:    { label: 'Low',    dot: 'bg-neutral-300', text: 'text-neutral-400' },
  normal: { label: 'Normal', dot: 'bg-blue-400',    text: 'text-blue-500'   },
  high:   { label: 'High',   dot: 'bg-orange-400',  text: 'text-orange-500' },
  urgent: { label: 'Urgent', dot: 'bg-red-500',     text: 'text-red-500'    },
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General', prescription: 'Prescription', order: 'Order Support',
  product: 'Product Info', rewards: 'Rewards', other: 'Other',
}

const STATUS_FLOW: string[] = ['open', 'in_progress', 'resolved', 'closed']

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.open
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function PriorityDot({ priority }: { priority: string }) {
  const cfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.normal
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} title={cfg.label} />
}

export default function EnquiriesSection({ role, pharmacies }: Props) {
  const [enquiries, setEnquiries]   = useState<Enquiry[]>([])
  const [detail, setDetail]         = useState<DetailEnquiry | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [replyText, setReplyText]   = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [notesText, setNotesText]   = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [mobileShowDetail, setMobileShowDetail] = useState(false)

  const loadEnquiries = useCallback(async () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    const res = await fetch(`/api/manager/enquiries?${params}`)
    if (res.ok) setEnquiries(await res.json())
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { loadEnquiries() }, [loadEnquiries])

  const loadDetail = async (id: string) => {
    setSelectedId(id)
    setDetailLoading(true)
    setMobileShowDetail(true)
    setReplyText('')
    setEditingNotes(false)
    const res = await fetch(`/api/manager/enquiries/${id}`)
    if (res.ok) {
      const data = await res.json()
      setDetail(data)
      setNotesText(data.internal_notes ?? '')
    }
    setDetailLoading(false)
  }

  const patchEnquiry = async (fields: Partial<Enquiry>) => {
    if (!detail) return
    setUpdateLoading(true)
    const res = await fetch(`/api/manager/enquiries/${detail.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    if (res.ok) {
      const updated = await res.json()
      setDetail(prev => prev ? { ...prev, ...updated } : prev)
      setEnquiries(prev => prev.map(e => e.id === detail.id ? { ...e, ...updated } : e))
    }
    setUpdateLoading(false)
  }

  const handleReply = async () => {
    if (!detail || !replyText.trim() || replyLoading) return
    setReplyLoading(true)
    const res = await fetch(`/api/manager/enquiries/${detail.id}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: replyText.trim(), is_internal: isInternal }),
    })
    if (res.ok) {
      const reply: EnquiryReply = await res.json()
      const newStatus = detail.status === 'open' ? 'in_progress' : detail.status
      setDetail(prev => prev ? { ...prev, replies: [...(prev.replies ?? []), reply], status: newStatus as Enquiry['status'] } : prev)
      setEnquiries(prev => prev.map(e => e.id === detail.id ? { ...e, status: newStatus as Enquiry['status'] } : e))
      setReplyText('')
    }
    setReplyLoading(false)
  }

  const saveNotes = async () => {
    await patchEnquiry({ internal_notes: notesText })
    setEditingNotes(false)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return enquiries
    const q = search.toLowerCase()
    return enquiries.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.ticket_number.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q)
    )
  }, [enquiries, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: enquiries.length }
    STATUS_FLOW.forEach(s => { c[s] = enquiries.filter(e => e.status === s).length })
    return c
  }, [enquiries])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Enquiries</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Customer messages and support tickets</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
        <div className="grid xl:grid-cols-[380px_1fr] min-h-[640px]">

          {/* ── Left: Ticket list ── */}
          <div className={`border-r border-slate-100 flex flex-col ${mobileShowDetail ? 'hidden xl:flex' : 'flex'}`}>
            {/* List header */}
            <div className="px-4 py-4 border-b border-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em]">All Tickets</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-neutral-500">
                  {filtered.length}
                </span>
              </div>
              <input
                type="text"
                placeholder="Search name, email, ticket…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] bg-slate-50"
              />
              <div className="flex gap-1 flex-wrap">
                {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      statusFilter === s
                        ? 'bg-[#009eb9] text-white'
                        : 'bg-slate-100 text-neutral-500 hover:bg-slate-200'
                    }`}
                  >
                    {s === 'all' ? 'All' : STATUS_CFG[s].label}
                    {counts[s] > 0 && <span className="ml-1 opacity-70">{counts[s]}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-2 animate-pulse">
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-2 bg-slate-50 rounded w-1/2" />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-300">
                  No tickets match your filters.
                </div>
              ) : (
                filtered.map(e => (
                  <button
                    key={e.id}
                    onClick={() => loadDetail(e.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50/60 transition-colors ${
                      selectedId === e.id ? 'bg-[#009eb9]/5 border-l-2 border-[#009eb9]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <PriorityDot priority={e.priority} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-[11px] font-bold text-neutral-400">{e.ticket_number}</span>
                          <span className="text-[10px] text-neutral-300 shrink-0">{timeAgo(e.created_at)}</span>
                        </div>
                        <p className="text-sm font-bold text-[#184363] truncate leading-tight">{e.subject}</p>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">{e.name} · {e.email}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <StatusBadge status={e.status} />
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-neutral-500">
                            {CATEGORY_LABELS[e.category] ?? e.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Right: Ticket detail ── */}
          <div className={`flex flex-col ${mobileShowDetail ? 'flex' : 'hidden xl:flex'}`}>
            {/* Mobile back */}
            {mobileShowDetail && (
              <button
                onClick={() => setMobileShowDetail(false)}
                className="xl:hidden flex items-center gap-2 px-4 py-3 border-b border-slate-100 text-sm text-[#009eb9] font-semibold"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to tickets
              </button>
            )}

            {detailLoading ? (
              <div className="flex-1 p-8 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-50 rounded w-1/3" />
                <div className="h-24 bg-slate-50 rounded" />
              </div>
            ) : !detail ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-neutral-400">Select a ticket to view</p>
                <p className="text-xs text-neutral-300 mt-1">Click any ticket from the list on the left</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Detail header */}
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex flex-wrap items-start gap-3 justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-neutral-400">{detail.ticket_number}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-neutral-500">
                          {CATEGORY_LABELS[detail.category] ?? detail.category}
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-[#184363] leading-tight">{detail.subject}</h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {detail.name} · {detail.email}
                        {detail.phone && ` · ${detail.phone}`}
                      </p>
                      <p className="text-[10px] text-neutral-300 mt-1">{fmtDateTime(detail.created_at)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status select */}
                      <select
                        value={detail.status}
                        onChange={e => patchEnquiry({ status: e.target.value as Enquiry['status'] })}
                        disabled={updateLoading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:opacity-60 ${STATUS_CFG[detail.status].badge}`}
                      >
                        {STATUS_FLOW.map(s => (
                          <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                        ))}
                      </select>
                      {/* Priority select */}
                      <select
                        value={detail.priority}
                        onChange={e => patchEnquiry({ priority: e.target.value as Enquiry['priority'] })}
                        disabled={updateLoading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:opacity-60 ${PRIORITY_CFG[detail.priority].text}`}
                      >
                        {Object.entries(PRIORITY_CFG).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                      {/* Assign pharmacy (franchise admin only) */}
                      {role === 'franchise_admin' && pharmacies.length > 0 && (
                        <select
                          value={detail.assigned_pharmacy_id ?? ''}
                          onChange={e => patchEnquiry({ assigned_pharmacy_id: e.target.value || null })}
                          disabled={updateLoading}
                          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:opacity-60"
                        >
                          <option value="">Unassigned</option>
                          {pharmacies.map(ph => (
                            <option key={ph.id} value={ph.id}>{ph.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thread + composer — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {/* Original customer message */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#009eb9]/10 flex items-center justify-center text-[#009eb9] text-xs font-bold shrink-0">
                        {detail.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#184363]">{detail.name}</span>
                        <span className="text-[10px] text-neutral-400 ml-2">Customer · {fmtDateTime(detail.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{detail.message}</p>
                  </div>

                  {/* Reply thread */}
                  {(detail.replies ?? []).map(reply => (
                    <div
                      key={reply.id}
                      className={`rounded-xl p-4 ${
                        reply.is_internal
                          ? 'bg-amber-50 border border-amber-100'
                          : reply.author_type === 'staff'
                          ? 'bg-[#184363]/5 border border-[#184363]/10'
                          : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          reply.author_type === 'staff' ? 'bg-[#184363] text-white' : 'bg-[#009eb9]/10 text-[#009eb9]'
                        }`}>
                          {reply.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-[#184363]">{reply.author_name}</span>
                          <span className="text-[10px] text-neutral-400 ml-2">
                            {reply.author_type === 'staff' ? 'Staff' : 'Customer'} · {timeAgo(reply.created_at)}
                          </span>
                        </div>
                        {reply.is_internal && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
                            Internal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  ))}

                  {/* Internal notes */}
                  <div className="border border-dashed border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em]">Internal Notes</p>
                      {!editingNotes && (
                        <button
                          onClick={() => setEditingNotes(true)}
                          className="text-[10px] font-bold text-[#009eb9] hover:text-[#184363] transition-colors"
                        >
                          {notesText ? 'Edit' : '+ Add note'}
                        </button>
                      )}
                    </div>
                    {editingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesText}
                          onChange={e => setNotesText(e.target.value)}
                          rows={3}
                          placeholder="Add internal notes (not visible to customer)…"
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveNotes}
                            className="px-3 py-1 bg-[#184363] text-white text-xs font-bold rounded-lg hover:bg-[#009eb9] transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingNotes(false); setNotesText(detail.internal_notes ?? '') }}
                            className="px-3 py-1 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : notesText ? (
                      <p className="text-sm text-neutral-600 whitespace-pre-wrap">{notesText}</p>
                    ) : (
                      <p className="text-xs text-neutral-300 italic">No internal notes added.</p>
                    )}
                  </div>
                </div>

                {/* Reply composer */}
                {detail.status !== 'closed' && (
                  <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/30">
                    <div className="flex items-center gap-4 mb-3">
                      <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em]">Add Reply</p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          onClick={() => setIsInternal(v => !v)}
                          className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${isInternal ? 'bg-amber-400' : 'bg-slate-200'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${isInternal ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500">
                          {isInternal ? 'Internal note' : 'Reply to customer'}
                        </span>
                      </label>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      placeholder={isInternal ? 'Write an internal note…' : 'Write a reply to the customer…'}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9] resize-none"
                      onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleReply() }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-neutral-300">⌘ + Enter to send</p>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim() || replyLoading}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 ${
                          isInternal
                            ? 'bg-amber-400 text-white hover:bg-amber-500'
                            : 'bg-[#009eb9] text-white hover:bg-[#184363]'
                        }`}
                      >
                        {replyLoading ? '…' : isInternal ? 'Add Note' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {detail.status === 'closed' && (
                  <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-xs text-neutral-400">This ticket is closed.</p>
                    <button
                      onClick={() => patchEnquiry({ status: 'open' })}
                      className="text-xs font-bold text-[#009eb9] hover:text-[#184363] transition-colors"
                    >
                      Reopen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
