'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import LinkPicker from './LinkPicker'

type Slot = 'surgical' | 'flu_season' | 'healthcare'

type BannerForm = {
  image_url: string
  link: string
  badge_text: string
  title: string
  title_line2: string
  cta_text: string
}

const BANNER_CONFIG: {
  slot: Slot
  label: string
  sublabel: string
  hasText: boolean
  previewRatio: string
  gradient?: string
}[] = [
  {
    slot: 'surgical',
    label: 'Full-Width Banner',
    sublabel: 'Top of section — spans full width, image only',
    hasText: false,
    previewRatio: '860/280',
  },
  {
    slot: 'flu_season',
    label: 'Left Banner',
    sublabel: 'Left column — image with text overlay',
    hasText: true,
    previewRatio: '860/560',
    gradient: 'from-slate-800/90 to-slate-900/85',
  },
  {
    slot: 'healthcare',
    label: 'Right Banner',
    sublabel: 'Right column — image with text overlay',
    hasText: true,
    previewRatio: '860/560',
    gradient: 'from-[#009eb9]/90 to-[#007a8f]/90',
  },
]

const FALLBACKS: Record<Slot, BannerForm> = {
  surgical: {
    image_url: 'https://sparkport.co.za/wp-content/uploads/SURGICAL-BANNER.png',
    link: '/surgical-catalogue',
    badge_text: '', title: '', title_line2: '', cta_text: '',
  },
  flu_season: {
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    link: '/flu-protection-guide',
    badge_text: 'Quick, Safe & Effective',
    title: 'Protect Yourself',
    title_line2: 'This Flu Season',
    cta_text: 'Read the Guide',
  },
  healthcare: {
    image_url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
    link: '/health-care-services',
    badge_text: 'Your Health, Our Priority',
    title: 'Comprehensive Care',
    title_line2: 'Close to Home',
    cta_text: 'Learn More About Our Services',
  },
}

function BannerPreview({
  imageUrl,
  form,
  config,
}: {
  imageUrl: string
  form: BannerForm
  config: typeof BANNER_CONFIG[number]
}) {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden bg-slate-100"
      style={{ aspectRatio: config.previewRatio }}
    >
      {/* Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className={config.hasText ? 'object-cover' : 'object-contain'}
          unoptimized
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient ?? 'from-[#184363] to-[#009eb9]'}`} />
      )}

      {/* Gradient overlay for text banners */}
      {config.hasText && config.gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
      )}

      {/* Text content overlay */}
      {config.hasText && (
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          {form.badge_text && (
            <span className="self-start px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-bold uppercase tracking-wide mb-3">
              {form.badge_text}
            </span>
          )}
          <p className="text-white font-extrabold text-xl leading-tight drop-shadow mb-2">
            {form.title || 'Heading Line 1'}
            {form.title_line2 && <span className="block mt-0.5">{form.title_line2}</span>}
          </p>
          {form.cta_text && (
            <div className="inline-flex items-center gap-1.5 text-white font-semibold text-sm">
              {form.cta_text}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="text-white text-[9px] font-bold uppercase tracking-wide">Live Preview</span>
      </div>
    </div>
  )
}

function UploadButton({ onUpload, uploading }: { onUpload: (file: File) => void; uploading: boolean }) {
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

export default function PromotionalBannersPanel() {
  const [forms, setForms] = useState<Record<Slot, BannerForm>>({ ...FALLBACKS })
  const [previewUrls, setPreviewUrls] = useState<Record<Slot, string>>({ surgical: '', flu_season: '', healthcare: '' })
  const [saving, setSaving] = useState<Record<Slot, boolean>>({ surgical: false, flu_season: false, healthcare: false })
  const [uploading, setUploading] = useState<Record<Slot, boolean>>({ surgical: false, flu_season: false, healthcare: false })
  const [errors, setErrors] = useState<Record<Slot, string | null>>({ surgical: null, flu_season: null, healthcare: null })
  const [saved, setSaved] = useState<Record<Slot, boolean>>({ surgical: false, flu_season: false, healthcare: false })
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/promotional-banners')
      .then(r => r.json())
      .then((data: (BannerForm & { slot: Slot })[]) => {
        if (Array.isArray(data)) {
          setForms(prev => {
            const next = { ...prev }
            data.forEach(b => {
              if (b.slot in next) {
                next[b.slot] = {
                  image_url: b.image_url,
                  link: b.link,
                  badge_text: b.badge_text,
                  title: b.title,
                  title_line2: b.title_line2,
                  cta_text: b.cta_text,
                }
              }
            })
            return next
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const setField = (slot: Slot, field: keyof BannerForm, value: string) =>
    setForms(prev => ({ ...prev, [slot]: { ...prev[slot], [field]: value } }))

  const handleUpload = async (slot: Slot, file: File) => {
    setPreviewUrls(prev => ({ ...prev, [slot]: URL.createObjectURL(file) }))
    setUploading(prev => ({ ...prev, [slot]: true }))
    setErrors(prev => ({ ...prev, [slot]: null }))
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/manager/promotions/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        setErrors(prev => ({ ...prev, [slot]: d.error ?? 'Upload failed' }))
        setPreviewUrls(prev => ({ ...prev, [slot]: '' }))
        return
      }
      const { url } = await res.json()
      setForms(prev => ({ ...prev, [slot]: { ...prev[slot], image_url: url } }))
      setPreviewUrls(prev => ({ ...prev, [slot]: url }))
    } catch {
      setErrors(prev => ({ ...prev, [slot]: 'Upload failed — please try again' }))
      setPreviewUrls(prev => ({ ...prev, [slot]: '' }))
    } finally {
      setUploading(prev => ({ ...prev, [slot]: false }))
    }
  }

  const handleSave = async (slot: Slot) => {
    const form = forms[slot]
    if (!form.image_url.trim()) { setErrors(prev => ({ ...prev, [slot]: 'Please upload an image' })); return }
    if (uploading[slot]) { setErrors(prev => ({ ...prev, [slot]: 'Please wait for the upload to finish' })); return }
    setErrors(prev => ({ ...prev, [slot]: null }))
    setSaving(prev => ({ ...prev, [slot]: true }))
    try {
      const res = await fetch(`/api/manager/promotional-banners/${slot}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Save failed')
      }
      setSaved(prev => ({ ...prev, [slot]: true }))
      setTimeout(() => setSaved(prev => ({ ...prev, [slot]: false })), 3000)
    } catch (err) {
      setErrors(prev => ({ ...prev, [slot]: err instanceof Error ? err.message : 'Save failed' }))
    } finally {
      setSaving(prev => ({ ...prev, [slot]: false }))
    }
  }

  const cancelEdit = () => setEditingSlot(null)

  const activeConfig = editingSlot ? BANNER_CONFIG.find(c => c.slot === editingSlot)! : null

  if (!loaded) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
            <div className="flex gap-4 items-center">
              <div className="w-36 h-20 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-40" />
                <div className="h-3 bg-slate-50 rounded w-56" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${editingSlot ? 'xl:grid-cols-[1fr_440px]' : ''}`}>

      {/* ── Banner list ── */}
      <div className="space-y-3">
        {BANNER_CONFIG.map(config => {
          const form = forms[config.slot]
          const displayUrl = previewUrls[config.slot] || form.image_url
          const isEditing = editingSlot === config.slot

          return (
            <div
              key={config.slot}
              className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden transition-all ${
                isEditing ? 'ring-2 ring-[#009eb9]' : ''
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                {/* Thumbnail */}
                <div className="w-36 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  {displayUrl ? (
                    <Image
                      src={displayUrl}
                      alt={config.label}
                      fill
                      className={config.hasText ? 'object-cover' : 'object-contain'}
                      unoptimized
                      onError={() => {}}
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient ?? 'from-[#184363] to-[#009eb9]'}`} />
                  )}
                  {config.hasText && config.gradient && displayUrl && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-60`} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#184363] truncate">{config.label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5 truncate">{config.sublabel}</p>
                  {config.hasText && form.title && (
                    <p className="text-[10px] text-neutral-300 mt-1 truncate italic">
                      "{form.title}{form.title_line2 ? ` ${form.title_line2}` : ''}"
                    </p>
                  )}
                </div>

                {/* Edit button */}
                <button
                  type="button"
                  onClick={() => setEditingSlot(isEditing ? null : config.slot)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isEditing
                      ? 'bg-[#009eb9] text-white'
                      : 'text-neutral-400 hover:text-[#009eb9] hover:bg-[#009eb9]/10'
                  }`}
                >
                  {isEditing ? 'Editing' : 'Edit'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Edit panel ── */}
      {editingSlot && activeConfig && (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
          {/* Panel header */}
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-[#184363]">{activeConfig.label}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{activeConfig.sublabel}</p>
            </div>
            <button
              type="button"
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
              <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-2">
                {activeConfig.hasText ? 'Preview — gradient & text rendered live' : 'Preview'}
              </p>
              <BannerPreview
                imageUrl={previewUrls[editingSlot] || forms[editingSlot].image_url}
                form={forms[editingSlot]}
                config={activeConfig}
              />
            </div>

            {/* Upload */}
            <div>
              <label className="block text-xs font-bold text-[#184363] mb-1.5">Image</label>
              <UploadButton
                onUpload={file => handleUpload(editingSlot, file)}
                uploading={uploading[editingSlot]}
              />
              {forms[editingSlot].image_url && !uploading[editingSlot] && (
                <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Image set — upload another to replace
                </p>
              )}
              <p className="text-[10px] text-neutral-400 mt-1">
                {activeConfig.hasText ? 'Recommended: 800×560px. JPG, PNG, WebP.' : 'Recommended: 1200×400px or wider. JPG, PNG, WebP.'}
              </p>
            </div>

            {/* Text fields — text-overlay banners only */}
            {activeConfig.hasText && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#184363] mb-1.5">Badge Text</label>
                  <input
                    type="text"
                    value={forms[editingSlot].badge_text}
                    onChange={e => setField(editingSlot, 'badge_text', e.target.value)}
                    placeholder="e.g. Quick, Safe & Effective"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#184363] mb-1.5">Heading</label>
                  <input
                    type="text"
                    value={forms[editingSlot].title}
                    onChange={e => setField(editingSlot, 'title', e.target.value)}
                    placeholder="Line 1"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] mb-2"
                  />
                  <input
                    type="text"
                    value={forms[editingSlot].title_line2}
                    onChange={e => setField(editingSlot, 'title_line2', e.target.value)}
                    placeholder="Line 2 (optional)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#184363] mb-1.5">CTA Text</label>
                  <input
                    type="text"
                    value={forms[editingSlot].cta_text}
                    onChange={e => setField(editingSlot, 'cta_text', e.target.value)}
                    placeholder="e.g. Read the Guide"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
              </>
            )}

            <LinkPicker
              value={forms[editingSlot].link}
              onChange={v => setField(editingSlot, 'link', v)}
            />

            {errors[editingSlot] && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {errors[editingSlot]}
              </p>
            )}

            {saved[editingSlot] && (
              <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Banner saved successfully
              </p>
            )}

            <button
              type="button"
              onClick={() => handleSave(editingSlot)}
              disabled={saving[editingSlot] || uploading[editingSlot]}
              className="w-full py-2.5 bg-[#184363] text-white text-sm font-bold rounded-xl hover:bg-[#009eb9] transition-colors disabled:opacity-60"
            >
              {saving[editingSlot] ? 'Saving…' : 'Save Banner'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
