'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Banner } from '../types'

const QUICK_LINKS = [
  { label: 'Shop', value: '/shop' },
  { label: 'Promotions', value: '/promotions' },
  { label: 'Healthcare Services', value: '/health-care-services' },
  { label: 'Fill Script', value: '/fill-script' },
  { label: 'Contact', value: '/contact' },
  { label: 'Store Locator', value: '/store-locator' },
  { label: 'Custom…', value: '__custom' },
]

const EMPTY_FORM = {
  image_url: '',
  title: '',
  description: '',
  cta_text: 'Shop Now',
  cta_link: '/shop',
  is_active: true,
}

type FormState = typeof EMPTY_FORM

function ImagePreview({ url }: { url: string }) {
  const [valid, setValid] = useState(false)

  useEffect(() => {
    setValid(false)
    if (!url.trim()) return
    const img = new window.Image()
    img.onload = () => setValid(true)
    img.onerror = () => setValid(false)
    img.src = url
  }, [url])

  if (!url.trim()) {
    return (
      <div className="w-full aspect-video rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 text-neutral-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18M3 19.5h18M21 4.5v15" />
          </svg>
          <p className="text-xs text-neutral-300">Image preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
      {valid ? (
        <>
          <Image src={url} alt="Banner preview" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xs text-red-400 font-medium">Image not reachable</p>
        </div>
      )}
    </div>
  )
}

function SlidePreview({ form }: { form: FormState }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
      {form.image_url ? (
        <Image src={form.image_url} alt={form.title || 'Preview'} fill className="object-cover" unoptimized />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-white font-extrabold text-lg leading-tight mb-1 drop-shadow">
          {form.title || 'Banner Title'}
        </p>
        <p className="text-white/80 text-xs leading-relaxed mb-3 max-w-xs">
          {form.description || 'Banner description will appear here'}
        </p>
        <span className="self-start px-4 py-1.5 bg-white text-[#184363] text-xs font-bold rounded-full shadow">
          {form.cta_text || 'Shop Now'}
        </span>
      </div>
    </div>
  )
}

export default function BannersSection() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [customLink, setCustomLink] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const linkIsCustom = form.cta_link === '__custom' || (!QUICK_LINKS.some(l => l.value === form.cta_link) && form.cta_link !== '__custom')
  const resolvedLink = linkIsCustom ? customLink : form.cta_link

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/manager/banners')
    if (res.ok) setBanners(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (banner: Banner) => {
    setIsAdding(false)
    setEditingId(banner.id)
    const isQuick = QUICK_LINKS.some(l => l.value === banner.cta_link)
    setForm({
      image_url: banner.image_url,
      title: banner.title,
      description: banner.description,
      cta_text: banner.cta_text,
      cta_link: isQuick ? banner.cta_link : '__custom',
      is_active: banner.is_active,
    })
    setCustomLink(isQuick ? '' : banner.cta_link)
    setSaveError(null)
  }

  const startAdd = () => {
    setEditingId(null)
    setIsAdding(true)
    setForm({ ...EMPTY_FORM, sort_order: banners.length } as FormState)
    setCustomLink('')
    setSaveError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setSaveError(null)
  }

  const save = async () => {
    setSaveError(null)
    if (!form.image_url.trim()) { setSaveError('Image URL is required'); return }
    if (!form.title.trim()) { setSaveError('Title is required'); return }

    const finalLink = (form.cta_link === '__custom' || linkIsCustom) ? customLink.trim() || '/shop' : form.cta_link

    setSaving(true)
    try {
      if (isAdding) {
        const res = await fetch('/api/manager/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, cta_link: finalLink, sort_order: banners.length }),
        })
        if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      } else if (editingId) {
        const res = await fetch(`/api/manager/banners/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, cta_link: finalLink }),
        })
        if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      }
      await load()
      cancelEdit()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (banner: Banner) => {
    const res = await fetch(`/api/manager/banners/${banner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !banner.is_active }),
    })
    if (res.ok) setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
  }

  const move = async (id: string, dir: 'up' | 'down') => {
    const idx = banners.findIndex(b => b.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === banners.length - 1) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    const updated = [...banners]
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
    const reordered = updated.map((b, i) => ({ ...b, sort_order: i }))
    setBanners(reordered)
    await Promise.all(
      reordered.map(b =>
        fetch(`/api/manager/banners/${b.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: b.sort_order }),
        })
      )
    )
  }

  const deleteBanner = async (id: string) => {
    const res = await fetch(`/api/manager/banners/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBanners(prev => prev.filter(b => b.id !== id))
      if (editingId === id) cancelEdit()
    }
    setDeleteConfirm(null)
  }

  const showPanel = isAdding || editingId !== null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#184363]">Hero Banners</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Control the home page promotional slider</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#184363] text-white text-sm font-bold rounded-xl hover:bg-[#009eb9] transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Banner
        </button>
      </div>

      <div className={`grid gap-6 ${showPanel ? 'xl:grid-cols-[1fr_420px]' : ''}`}>

        {/* ── Banner list ── */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
                <div className="flex gap-4">
                  <div className="w-32 h-20 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-50 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))
          ) : banners.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18M3 19.5h18M21 4.5v15" />
                </svg>
              </div>
              <p className="text-sm font-bold text-neutral-400">No banners yet</p>
              <p className="text-xs text-neutral-300 mt-1">Click "Add Banner" to create your first slide</p>
            </div>
          ) : (
            banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden transition-all ${
                  editingId === banner.id ? 'ring-2 ring-[#009eb9]' : ''
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-36 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                    <Image
                      src={banner.image_url}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => {}}
                    />
                    {!banner.is_active && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Inactive</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">#{idx + 1}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        banner.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-neutral-400'
                      }`}>
                        {banner.is_active ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#184363] truncate leading-tight">{banner.title}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{banner.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#009eb9]/10 text-[#009eb9]">
                        {banner.cta_text}
                      </span>
                      <span className="text-[10px] text-neutral-300 truncate max-w-[160px]">{banner.cta_link}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    {/* Sort up/down */}
                    <button
                      onClick={() => move(banner.id, 'up')}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-[#184363] hover:bg-slate-100 transition-colors disabled:opacity-20"
                      title="Move up"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => move(banner.id, 'down')}
                      disabled={idx === banners.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-[#184363] hover:bg-slate-100 transition-colors disabled:opacity-20"
                      title="Move down"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Active toggle */}
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`w-8 h-4 rounded-full transition-colors relative mt-1 ${banner.is_active ? 'bg-[#009eb9]' : 'bg-slate-200'}`}
                      title={banner.is_active ? 'Hide banner' : 'Show banner'}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${banner.is_active ? 'translate-x-4' : ''}`} />
                    </button>

                    {/* Edit / Delete */}
                    <button
                      onClick={() => startEdit(banner)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#009eb9] hover:bg-[#009eb9]/10 transition-colors mt-1"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(banner.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Delete confirm inline */}
                {deleteConfirm === banner.id && (
                  <div className="px-4 pb-4 flex items-center gap-3 bg-red-50/50">
                    <p className="text-xs text-red-600 flex-1 font-medium">Delete this banner? This cannot be undone.</p>
                    <button onClick={() => deleteBanner(banner.id)} className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Live count */}
          {!loading && banners.length > 0 && (
            <p className="text-[10px] text-neutral-400 px-1">
              {banners.filter(b => b.is_active).length} of {banners.length} banner{banners.length !== 1 ? 's' : ''} visible on home page
            </p>
          )}
        </div>

        {/* ── Edit / Add panel ── */}
        {showPanel && (
          <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <p className="text-sm font-extrabold text-[#184363]">
                {isAdding ? 'New Banner' : 'Edit Banner'}
              </p>
              <button
                onClick={cancelEdit}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-neutral-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Live preview */}
              <div>
                <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-2">Live Preview</p>
                <SlidePreview form={form} />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-[#184363] mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://… or /images/…"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Paste a full URL or a path like <code className="bg-slate-100 px-1 rounded">/images/photo.jpg</code>
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#184363] mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Back to School Deals"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#184363] mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Short promotional text shown under the title"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] resize-none"
                />
              </div>

              {/* CTA text + link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#184363] mb-1.5">Button Text</label>
                  <input
                    type="text"
                    value={form.cta_text}
                    onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#184363] mb-1.5">Target Page</label>
                  <select
                    value={linkIsCustom ? '__custom' : form.cta_link}
                    onChange={e => {
                      if (e.target.value === '__custom') {
                        setForm(f => ({ ...f, cta_link: '__custom' }))
                      } else {
                        setForm(f => ({ ...f, cta_link: e.target.value }))
                        setCustomLink('')
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  >
                    {QUICK_LINKS.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom link input */}
              {(form.cta_link === '__custom' || linkIsCustom) && (
                <div>
                  <label className="block text-xs font-bold text-[#184363] mb-1.5">Custom URL / Path</label>
                  <input
                    type="text"
                    value={customLink}
                    onChange={e => setCustomLink(e.target.value)}
                    placeholder="/categories/vitamins or https://…"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                    autoFocus
                  />
                </div>
              )}

              {/* Active toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-bold text-[#184363]">Visible on home page</p>
                  <p className="text-[10px] text-neutral-400">Toggle off to hide without deleting</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? 'bg-[#009eb9]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Error */}
              {saveError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{saveError}</p>
              )}

              {/* Save */}
              <button
                onClick={save}
                disabled={saving}
                className="w-full py-2.5 bg-[#184363] text-white text-sm font-bold rounded-xl hover:bg-[#009eb9] transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : isAdding ? 'Add Banner' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
