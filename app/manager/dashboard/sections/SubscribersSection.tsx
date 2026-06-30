'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Subscriber } from '../types'

const SOURCE_CFG: Record<string, { label: string; color: string }> = {
  newsletter:    { label: 'Newsletter',    color: 'bg-teal-50 text-teal-700 border-teal-200' },
  contact_form:  { label: 'Contact Form',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
  manual:        { label: 'Manual',        color: 'bg-purple-50 text-purple-700 border-purple-200' },
  import:        { label: 'Import',        color: 'bg-orange-50 text-orange-700 border-orange-200' },
  referral:      { label: 'Referral',      color: 'bg-pink-50 text-pink-700 border-pink-200' },
  checkout:      { label: 'Checkout',      color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

const MARKETING_CHANNELS = [
  {
    title: 'Email Newsletter',
    desc: 'Compose and send branded newsletters to your subscriber segments.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    color: 'from-teal-500 to-[#009eb9]',
  },
  {
    title: 'Promotional Specials',
    desc: 'Run time-limited offers and specials targeted to your customer base.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    color: 'from-orange-400 to-orange-500',
  },
  {
    title: 'Social Media Audiences',
    desc: 'Export subscriber lists for Facebook, Google, and TikTok ad targeting.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'SMS Campaigns',
    desc: 'Send targeted SMS reminders, refill alerts, and prescription updates.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-3 3.75h3" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Segmented Campaigns',
    desc: 'Create tag-based segments for hyper-targeted messaging and outreach.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: 'Automated Sequences',
    desc: 'Set up drip campaigns, welcome flows, and prescription renewal reminders.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: 'from-rose-500 to-pink-600',
  },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getInitials(first: string | null, last: string | null, email: string) {
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
  if (first) return first.slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

function getFullName(s: Subscriber) {
  const parts = [s.first_name, s.last_name].filter(Boolean)
  return parts.length ? parts.join(' ') : null
}

function exportCSV(subscribers: Subscriber[]) {
  const headers = ['Email', 'First Name', 'Last Name', 'Phone', 'Source', 'Tags', 'Active', 'Consent', 'Subscribed']
  const rows = subscribers.map(s => [
    s.email,
    s.first_name ?? '',
    s.last_name ?? '',
    s.phone ?? '',
    s.source,
    s.tags.join('; '),
    s.is_active ? 'Yes' : 'No',
    s.consent_marketing ? 'Yes' : 'No',
    fmtDate(s.created_at),
  ])
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function TagEditor({ tags, onSave }: { tags: string[]; onSave: (tags: string[]) => void }) {
  const [editing, setEditing] = useState(false)
  const [localTags, setLocalTags] = useState<string[]>(tags)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLocalTags(tags)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const addTag = () => {
    const t = input.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !localTags.includes(t)) {
      setLocalTags(prev => [...prev, t])
    }
    setInput('')
  }

  const removeTag = (tag: string) => setLocalTags(prev => prev.filter(t => t !== tag))

  const save = () => {
    onSave(localTags)
    setEditing(false)
  }

  const cancel = () => {
    setLocalTags(tags)
    setInput('')
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {tags.slice(0, 3).map(t => (
          <span key={t} className="px-1.5 py-0.5 bg-[#009eb9]/10 text-[#009eb9] text-[10px] font-semibold rounded">
            {t}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-[10px] text-neutral-400">+{tags.length - 3}</span>
        )}
        <button
          onClick={startEditing}
          className="w-4 h-4 rounded flex items-center justify-center text-neutral-300 hover:text-[#009eb9] hover:bg-[#009eb9]/10 transition-colors"
          title="Edit tags"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1.5 min-w-[180px]" onClick={e => e.stopPropagation()}>
      <div className="flex flex-wrap gap-1">
        {localTags.map(t => (
          <span key={t} className="flex items-center gap-1 px-1.5 py-0.5 bg-[#009eb9]/10 text-[#009eb9] text-[10px] font-semibold rounded">
            {t}
            <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } if (e.key === 'Escape') cancel() }}
          placeholder="add tag…"
          className="flex-1 text-[10px] px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#009eb9] min-w-0"
        />
        <button onClick={addTag} className="px-1.5 py-1 bg-slate-100 text-neutral-500 text-[10px] rounded hover:bg-slate-200">+</button>
      </div>
      <div className="flex gap-1">
        <button onClick={save} className="px-2 py-0.5 bg-[#009eb9] text-white text-[10px] font-bold rounded hover:bg-[#184363] transition-colors">Save</button>
        <button onClick={cancel} className="px-2 py-0.5 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

export default function SubscribersSection() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hubCollapsed, setHubCollapsed] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (sourceFilter !== 'all') params.set('source', sourceFilter)
    if (search.trim()) params.set('search', search.trim())
    const res = await fetch(`/api/manager/subscribers?${params}`)
    if (res.ok) setSubscribers(await res.json())
    setLoading(false)
  }, [statusFilter, sourceFilter, search])

  useEffect(() => { load() }, [load])

  const patchSubscriber = async (id: string, updates: Partial<Pick<Subscriber, 'tags' | 'notes' | 'is_active'>>) => {
    const res = await fetch(`/api/manager/subscribers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const updated: Subscriber = await res.json()
      setSubscribers(prev => prev.map(s => s.id === id ? updated : s))
    }
  }

  const kpis = useMemo(() => {
    const total = subscribers.length
    const active = subscribers.filter(s => s.is_active).length
    const now = new Date()
    const newThisMonth = subscribers.filter(s => {
      const d = new Date(s.created_at)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }).length
    const withConsent = subscribers.filter(s => s.consent_marketing).length
    const consentRate = total > 0 ? Math.round((withConsent / total) * 100) : 0
    return { total, active, newThisMonth, consentRate }
  }, [subscribers])

  const sources = useMemo(() => {
    const s = new Set(subscribers.map(sub => sub.source))
    return Array.from(s).sort()
  }, [subscribers])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Subscribers</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Newsletter subscribers and marketing audience</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Subscribers',
            value: kpis.total.toLocaleString(),
            sub: 'All time',
            bg: 'bg-[#184363]',
            text: 'text-white',
            sub_text: 'text-white/50',
          },
          {
            label: 'Active',
            value: kpis.active.toLocaleString(),
            sub: `${kpis.total > 0 ? Math.round((kpis.active / kpis.total) * 100) : 0}% of total`,
            bg: 'bg-white',
            text: 'text-[#184363]',
            sub_text: 'text-neutral-400',
          },
          {
            label: 'New This Month',
            value: kpis.newThisMonth.toLocaleString(),
            sub: new Date().toLocaleString('en-ZA', { month: 'long' }),
            bg: 'bg-white',
            text: 'text-[#184363]',
            sub_text: 'text-neutral-400',
          },
          {
            label: 'Consent Rate',
            value: `${kpis.consentRate}%`,
            sub: 'Marketing opt-in',
            bg: kpis.consentRate >= 70 ? 'bg-emerald-50' : kpis.consentRate >= 40 ? 'bg-amber-50' : 'bg-red-50',
            text: kpis.consentRate >= 70 ? 'text-emerald-700' : kpis.consentRate >= 40 ? 'text-amber-700' : 'text-red-700',
            sub_text: kpis.consentRate >= 70 ? 'text-emerald-500/60' : kpis.consentRate >= 40 ? 'text-amber-500/60' : 'text-red-500/60',
          },
        ].map(card => (
          <div
            key={card.label}
            className={`${card.bg} rounded-2xl px-5 py-4 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-2 ${card.sub_text}`}>{card.label}</p>
            <p className={`text-3xl font-extrabold leading-none ${card.text}`}>{card.value}</p>
            <p className={`text-xs mt-1 ${card.sub_text}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Marketing Hub */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
        <button
          onClick={() => setHubCollapsed(v => !v)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-extrabold text-[#184363]">Marketing Hub</p>
              <p className="text-[10px] text-neutral-400">Campaign tools and audience management</p>
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${hubCollapsed ? '' : 'rotate-180'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!hubCollapsed && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {MARKETING_CHANNELS.map(ch => (
                <div
                  key={ch.title}
                  className="relative group rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all cursor-default"
                >
                  <div className={`h-1 bg-gradient-to-r ${ch.color} w-full`} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-white shrink-0`}>
                        {ch.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-[#184363] leading-tight">{ch.title}</p>
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-400 uppercase tracking-widest">
                            Soon
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">{ch.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subscriber list */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-50 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <svg className="w-4 h-4 text-neutral-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search email, name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] bg-slate-50"
              />
            </div>
          </div>

          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
          >
            <option value="all">All Sources</option>
            {sources.map(s => (
              <option key={s} value={s}>{SOURCE_CFG[s]?.label ?? s}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
          >
            <option value="all">All Subscribers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => exportCSV(subscribers)}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184363] text-white text-xs font-bold hover:bg-[#009eb9] transition-colors disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-50">
                {['Subscriber', 'Source', 'Tags', 'Subscribed', 'Consent', 'Active'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 bg-slate-100 rounded w-28" />
                          <div className="h-2 bg-slate-50 rounded w-36" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-slate-50 rounded w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-neutral-400">No subscribers yet</p>
                      <p className="text-xs text-neutral-300">Subscribers from the newsletter footer will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscribers.map(sub => {
                  const name = getFullName(sub)
                  const initials = getInitials(sub.first_name, sub.last_name, sub.email)
                  const sourceCfg = SOURCE_CFG[sub.source]
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Subscriber */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            {name && (
                              <p className="text-sm font-semibold text-[#184363] leading-tight truncate">{name}</p>
                            )}
                            <p className={`text-xs truncate ${name ? 'text-neutral-400' : 'text-[#184363] font-semibold'}`}>
                              {sub.email}
                            </p>
                            {sub.phone && (
                              <p className="text-[10px] text-neutral-300">{sub.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${sourceCfg?.color ?? 'bg-slate-50 text-neutral-500 border-slate-200'}`}>
                          {sourceCfg?.label ?? sub.source}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3">
                        <TagEditor
                          tags={sub.tags ?? []}
                          onSave={tags => patchSubscriber(sub.id, { tags })}
                        />
                      </td>

                      {/* Subscribed */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-neutral-500">{fmtDate(sub.created_at)}</span>
                      </td>

                      {/* Consent */}
                      <td className="px-4 py-3">
                        {sub.consent_marketing ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-300">—</span>
                        )}
                      </td>

                      {/* Active toggle */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => patchSubscriber(sub.id, { is_active: !sub.is_active })}
                          className={`w-9 h-5 rounded-full transition-colors relative ${sub.is_active ? 'bg-[#009eb9]' : 'bg-slate-200'}`}
                          title={sub.is_active ? 'Deactivate' : 'Reactivate'}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${sub.is_active ? 'translate-x-4' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && subscribers.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-50">
            <p className="text-[10px] text-neutral-400">
              Showing <span className="font-bold">{subscribers.length}</span> subscriber{subscribers.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
