'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Promotion } from '../types'
import LinkPicker from '../components/LinkPicker'
import HeroTilesPanel from '../components/HeroTilesPanel'
import ImageBannerPanel from '../components/ImageBannerPanel'
import PromotionalBannersPanel from '../components/PromotionalBannersPanel'

const CATEGORIES = [
  { label: 'Promotion', value: 'promotion' },
  { label: 'Competition', value: 'competition' },
  { label: 'Article', value: 'article' },
  { label: 'Announcement', value: 'announcement' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'General', value: 'general' },
]

const EMPTY_FORM = {
  image_url: '',
  title: '',
  description: '',
  cta_text: 'Shop Now',
  cta_link: '/shop',
  category: 'promotion',
  is_active: true,
}

type FormState = typeof EMPTY_FORM

function SlidePreview({ imageUrl, form }: { imageUrl: string; form: FormState }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-100" style={{ aspectRatio: '860/500' }}>
      {imageUrl ? (
        <Image src={imageUrl} alt={form.title || 'Preview'} fill className="object-cover" unoptimized />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-white font-extrabold text-lg leading-tight mb-1 drop-shadow">
          {form.title || 'Promotion Title'}
        </p>
        <p className="text-white/80 text-xs leading-relaxed mb-3 max-w-xs">
          {form.description || 'Description will appear here'}
        </p>
        <span className="self-start px-4 py-1.5 bg-white text-[#184363] text-xs font-bold rounded-full shadow">
          {form.cta_text || 'Shop Now'}
        </span>
      </div>
      {imageUrl && (
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white text-[9px] font-bold uppercase tracking-wide">Live Preview</span>
        </div>
      )}
    </div>
  )
}

function UploadButton({
  onUpload,
  uploading,
}: {
  onUpload: (file: File) => void
  uploading: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#009eb9]/40 rounded-xl text-sm font-semibold text-[#009eb9] hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all disabled:opacity-50 w-full justify-center"
      >
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Uploading…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Image
          </>
        )}
      </button>
    </>
  )
}

export default function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const displayUrl = previewUrl || form.image_url

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/manager/promotions')
    if (res.ok) setPromotions(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (p: Promotion) => {
    setIsAdding(false)
    setEditingId(p.id)
    setForm({
      image_url: p.image_url,
      title: p.title,
      description: p.description,
      cta_text: p.cta_text,
      cta_link: p.cta_link,
      category: p.category,
      is_active: p.is_active,
    })
    setPreviewUrl('')
    setSaveError(null)
  }

  const startAdd = () => {
    setEditingId(null)
    setIsAdding(true)
    setForm(EMPTY_FORM)
    setPreviewUrl('')
    setSaveError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setPreviewUrl('')
    setSaveError(null)
  }

  const handleFileUpload = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/manager/promotions/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        setSaveError(d.error ?? 'Upload failed')
        setPreviewUrl('')
        return
      }
      const { url } = await res.json()
      setForm(f => ({ ...f, image_url: url }))
      setPreviewUrl(url)
    } catch {
      setSaveError('Upload failed — please try again')
      setPreviewUrl('')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    setSaveError(null)
    if (!form.image_url.trim()) { setSaveError('Please upload an image'); return }
    if (!form.title.trim()) { setSaveError('Title is required'); return }
    if (uploading) { setSaveError('Please wait for the image to finish uploading'); return }

    setSaving(true)
    try {
      if (isAdding) {
        const res = await fetch('/api/manager/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, sort_order: promotions.length }),
        })
        if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      } else if (editingId) {
        const res = await fetch(`/api/manager/promotions/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form }),
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

  const toggleActive = async (p: Promotion) => {
    const res = await fetch(`/api/manager/promotions/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    })
    if (res.ok) setPromotions(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const reorder = async (from: number, to: number) => {
    if (from === to) return
    const updated = [...promotions]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    const reordered = updated.map((p, i) => ({ ...p, sort_order: i }))
    setPromotions(reordered)
    await Promise.all(
      reordered.map(p =>
        fetch(`/api/manager/promotions/${p.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: p.sort_order }),
        })
      )
    )
  }

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== idx) setDragOverIndex(idx)
  }

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIndex !== null) reorder(dragIndex, idx)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const deletePromotion = async (id: string) => {
    const res = await fetch(`/api/manager/promotions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPromotions(prev => prev.filter(p => p.id !== id))
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
          <h1 className="text-2xl font-extrabold text-[#184363]">Promotions</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Manage the home page hero slider</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#184363] text-white text-sm font-bold rounded-xl hover:bg-[#009eb9] transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Slide
        </button>
      </div>

      <div className={`grid gap-6 ${showPanel ? 'xl:grid-cols-[1fr_440px]' : ''}`}>

        {/* ── Promotions list ── */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
                <div className="flex gap-4">
                  <div className="w-36 h-24 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-50 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))
          ) : promotions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18M3 19.5h18M21 4.5v15" />
                </svg>
              </div>
              <p className="text-sm font-bold text-neutral-400">No promotions yet</p>
              <p className="text-xs text-neutral-300 mt-1">Click "Add Slide" to create your first hero slide</p>
            </div>
          ) : (
            promotions.map((promo, idx) => (
              <div
                key={promo.id}
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={e => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden transition-all select-none ${
                  dragIndex === idx ? 'opacity-40 shadow-xl scale-[0.99]' : ''
                } ${
                  dragOverIndex === idx && dragIndex !== idx ? 'ring-2 ring-[#009eb9] ring-offset-1' : ''
                } ${
                  editingId === promo.id && dragIndex === null ? 'ring-2 ring-[#009eb9]' : ''
                }`}
              >
                <div className="flex items-center gap-3 p-4">
                  {/* Drag handle */}
                  <div
                    className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-400 shrink-0 px-0.5"
                    title="Drag to reorder"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="9" cy="5" r="1.5" />
                      <circle cx="15" cy="5" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="19" r="1.5" />
                      <circle cx="15" cy="19" r="1.5" />
                    </svg>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-36 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                    <Image
                      src={promo.image_url}
                      alt={promo.title}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => {}}
                    />
                    {!promo.is_active && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Hidden</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">#{idx + 1}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        promo.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-neutral-400'
                      }`}>
                        {promo.is_active ? 'Live' : 'Hidden'}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#184363]/8 text-[#184363] capitalize">
                        {promo.category}
                      </span>
                      {typeof promo.impressions === 'number' && promo.impressions > 0 && (
                        <span className="text-[10px] text-neutral-400">{promo.impressions.toLocaleString()} views · {promo.clicks ?? 0} clicks</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#184363] truncate leading-tight">{promo.title}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{promo.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#009eb9]/10 text-[#009eb9]">
                        {promo.cta_text}
                      </span>
                      <span className="text-[10px] text-neutral-300 truncate max-w-[160px]">{promo.cta_link}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleActive(promo)}
                      className={`w-8 h-4 rounded-full transition-colors relative ${promo.is_active ? 'bg-[#009eb9]' : 'bg-slate-200'}`}
                      title={promo.is_active ? 'Hide slide' : 'Show slide'}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${promo.is_active ? 'translate-x-4' : ''}`} />
                    </button>
                    <button
                      onClick={() => startEdit(promo)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#009eb9] hover:bg-[#009eb9]/10 transition-colors mt-1"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(promo.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {deleteConfirm === promo.id && (
                  <div className="px-4 pb-4 flex items-center gap-3 bg-red-50/50">
                    <p className="text-xs text-red-600 flex-1 font-medium">Delete this slide? This cannot be undone.</p>
                    <button onClick={() => deletePromotion(promo.id)} className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
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

          {!loading && promotions.length > 0 && (
            <p className="text-[10px] text-neutral-400 px-1">
              {promotions.filter(p => p.is_active).length} of {promotions.length} slide{promotions.length !== 1 ? 's' : ''} live on home page
            </p>
          )}
        </div>

        {/* ── Edit / Add panel ── */}
        {showPanel && (
          <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <p className="text-sm font-extrabold text-[#184363]">
                {isAdding ? 'New Slide' : 'Edit Slide'}
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
                <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-2">Preview (860×500px on desktop)</p>
                <SlidePreview imageUrl={displayUrl} form={form} />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-[#184363] mb-1.5">Slide Image</label>
                <UploadButton onUpload={handleFileUpload} uploading={uploading} />
                {form.image_url && (
                  <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Image ready — upload another to replace
                  </p>
                )}
                <p className="text-[10px] text-neutral-400 mt-1">
                  Recommended: 860×500px or wider. JPG, PNG, WebP. Text in safe zone (bottom 40%).
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

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#184363] mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 pr-8 text-sm font-medium text-[#184363] border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-[#009eb9] hover:border-slate-300 transition-all"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* CTA text + destination */}
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

              <LinkPicker
                value={form.cta_link}
                onChange={path => setForm(f => ({ ...f, cta_link: path }))}
              />

              {/* Active toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-bold text-[#184363]">Live on home page</p>
                  <p className="text-[10px] text-neutral-400">Toggle off to save without publishing</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? 'bg-[#009eb9]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {saveError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{saveError}</p>
              )}

              <button
                onClick={save}
                disabled={saving || uploading}
                className="w-full py-2.5 bg-[#184363] text-white text-sm font-bold rounded-xl hover:bg-[#009eb9] transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : isAdding ? 'Add Slide' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Side Tiles ── */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#184363]">Side Tiles</h2>
          <p className="text-neutral-500 text-sm mt-0.5">The two cards displayed beside the hero slider on the home page</p>
        </div>
        <HeroTilesPanel />
      </div>

      {/* ── Promotional Banner ── */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#184363]">Promotional Banner</h2>
          <p className="text-neutral-500 text-sm mt-0.5">Full-width banner displayed below the featured products on the home page</p>
        </div>
        <ImageBannerPanel />
      </div>

      {/* ── Promotional Banners Section ── */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#184363]">Promotional Banners</h2>
          <p className="text-neutral-500 text-sm mt-0.5">The three banners displayed in the mid-page promotions section</p>
        </div>
        <PromotionalBannersPanel />
      </div>

    </div>
  )
}
