'use client'

import { useState, useEffect, useRef } from 'react'

const SITE_PAGES = [
  {
    label: 'Shop', path: '/shop',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  },
  {
    label: 'Health Services', path: '/health-care-services',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
  {
    label: 'Fill Prescription', path: '/fill-script',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    label: 'Health Insurance', path: '/health-insurance',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    label: 'Get Rewarded', path: '/get-rewarded',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
  },
  {
    label: 'Blog', path: '/blog',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
  },
  {
    label: 'Contact Us', path: '/contact',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    label: 'Store Locator', path: '/store-locator',
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
]

type Mode = 'page' | 'category' | 'article'

type PickerOption = { label: string; path: string; meta?: string }

function SearchList({
  options,
  onSelect,
  placeholder,
}: {
  options: PickerOption[]
  onSelect: (path: string) => void
  placeholder: string
}) {
  const [q, setQ] = useState('')
  const filtered = q.trim()
    ? options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()))
    : options

  return (
    <div className="space-y-2">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
        />
      </div>
      <div className="max-h-52 overflow-y-auto space-y-0.5 pr-0.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-neutral-400 text-center py-4">No results</p>
        ) : (
          filtered.map(o => (
            <button
              key={o.path}
              type="button"
              onClick={() => onSelect(o.path)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#009eb9]/8 hover:text-[#184363] transition-colors group"
            >
              <span className="text-xs font-semibold text-[#184363] group-hover:text-[#009eb9] block leading-tight truncate">
                {o.label}
              </span>
              {o.meta && (
                <span className="text-[10px] text-neutral-400 truncate block">{o.meta}</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default function LinkPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (path: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('page')
  const [categories, setCategories] = useState<PickerOption[]>([])
  const [articles, setArticles] = useState<PickerOption[]>([])
  const [loadingCats, setLoadingCats] = useState(false)
  const [loadingArts, setLoadingArts] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadCategories = async () => {
    if (categories.length > 0 || loadingCats) return
    setLoadingCats(true)
    try {
      const res = await fetch('/api/manager/link-options/categories')
      if (res.ok) {
        const data: { name: string; slug: string; count: number; isPromo: boolean }[] = await res.json()
        setCategories(data.map(c => ({
          label: c.name,
          path: `/shop?category=${c.slug}`,
          meta: c.isPromo
            ? `Seasonal / Promo · ${c.count} product${c.count !== 1 ? 's' : ''}`
            : `${c.count} product${c.count !== 1 ? 's' : ''}`,
        })))
      }
    } finally {
      setLoadingCats(false)
    }
  }

  const loadArticles = async () => {
    if (articles.length > 0 || loadingArts) return
    setLoadingArts(true)
    try {
      const res = await fetch('/api/manager/link-options/articles')
      if (res.ok) {
        const data: { title: string; slug: string; date: string }[] = await res.json()
        setArticles(data.map(a => ({
          label: a.title,
          path: `/blog/${a.slug}`,
          meta: new Date(a.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
        })))
      }
    } finally {
      setLoadingArts(false)
    }
  }

  const handleModeChange = (m: Mode) => {
    setMode(m)
    if (m === 'category') loadCategories()
    if (m === 'article') loadArticles()
  }

  const handleSelect = (path: string) => {
    onChange(path)
    setOpen(false)
  }

  const displayLabel = (() => {
    const page = SITE_PAGES.find(p => p.path === value)
    if (page) return page.label
    if (value.startsWith('/shop?category=')) {
      const cat = categories.find(c => c.path === value)
      return cat ? cat.label : value.replace('/shop?category=', '') + ' (category)'
    }
    if (value.startsWith('/blog/')) {
      const art = articles.find(a => a.path === value)
      return art ? art.label : value.replace('/blog/', '') + ' (article)'
    }
    return value || 'Choose a destination…'
  })()

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-bold text-[#184363] mb-1.5">Destination</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border rounded-lg transition-all ${
          open ? 'border-[#009eb9] ring-2 ring-[#009eb9]' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={`truncate text-left ${value ? 'text-[#184363] font-medium' : 'text-neutral-400'}`}>
          {displayLabel}
        </span>
        <svg className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 bottom-full mb-1.5 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Mode tabs */}
          <div className="flex border-b border-slate-100">
            {(['page', 'category', 'article'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors ${
                  mode === m
                    ? 'text-[#009eb9] border-b-2 border-[#009eb9]'
                    : 'text-neutral-400 hover:text-[#184363]'
                }`}
              >
                {m === 'page' ? 'Site Page' : m === 'category' ? 'Category' : 'Article'}
              </button>
            ))}
          </div>

          <div className="p-3">
            {/* Site pages — grid of quick picks */}
            {mode === 'page' && (
              <div className="grid grid-cols-2 gap-1.5">
                {SITE_PAGES.map(p => (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => handleSelect(p.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      value === p.path
                        ? 'bg-[#009eb9]/10 text-[#009eb9]'
                        : 'hover:bg-slate-50 text-[#184363]'
                    }`}
                  >
                    <span className="shrink-0 text-[#009eb9]">{p.icon}</span>
                    <span className="text-xs font-semibold truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* WC Categories — searchable list */}
            {mode === 'category' && (
              loadingCats ? (
                <div className="py-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Loading categories…
                </div>
              ) : (
                <SearchList
                  options={categories}
                  onSelect={handleSelect}
                  placeholder="Search categories…"
                />
              )
            )}

            {/* Articles — searchable list */}
            {mode === 'article' && (
              loadingArts ? (
                <div className="py-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Loading articles…
                </div>
              ) : (
                <SearchList
                  options={articles}
                  onSelect={handleSelect}
                  placeholder="Search articles…"
                />
              )
            )}
          </div>

          {/* Current path preview */}
          {value && (
            <div className="px-3 pb-3">
              <p className="text-[10px] text-neutral-400 bg-slate-50 px-2 py-1.5 rounded-lg font-mono truncate">
                {value}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
