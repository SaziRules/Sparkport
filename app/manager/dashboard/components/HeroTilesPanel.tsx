'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import LinkPicker from './LinkPicker'

type Tile = {
  slot: number
  image_url: string
  title: string
  subtitle: string
  link: string
}

type TileFormState = {
  image_url: string
  title: string
  subtitle: string
  link: string
}

const DEFAULTS: TileFormState[] = [
  { image_url: '/images/card-pills.jpg', title: 'Vitamins & Supplements', subtitle: 'Boost your wellness', link: '/categories/vitamins' },
  { image_url: '/images/card-baby.png',  title: 'Baby Care',              subtitle: 'Everything for baby', link: '/categories/baby' },
]

function TileThumbnail({ image_url, title, subtitle }: Pick<TileFormState, 'image_url' | 'title' | 'subtitle'>) {
  return (
    <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
      {image_url ? (
        <Image src={image_url} alt={title || 'Preview'} fill className="object-cover opacity-75" unoptimized />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9] opacity-60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#184363]/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-1.5">
        <p className="text-[9px] font-bold text-white leading-tight truncate">{title || 'Title'}</p>
        <p className="text-[8px] text-white/70 truncate">{subtitle || 'Subtitle'}</p>
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
        className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-[#009eb9]/40 rounded-xl text-xs font-semibold text-[#009eb9] hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all disabled:opacity-50 w-full justify-center"
      >
        {uploading ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Uploading…
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Image
          </>
        )}
      </button>
    </>
  )
}

function TileEditor({
  slot,
  form,
  previewUrl,
  saving,
  uploading,
  error,
  onChange,
  onUpload,
  onSave,
}: {
  slot: number
  form: TileFormState
  previewUrl: string
  saving: boolean
  uploading: boolean
  error: string | null
  onChange: (field: keyof TileFormState, value: string) => void
  onUpload: (file: File) => void
  onSave: () => void
}) {
  const displayUrl = previewUrl || form.image_url

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-50 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#009eb9]/10 text-[#009eb9] text-[10px] font-bold flex items-center justify-center shrink-0">
          {slot}
        </span>
        <p className="text-sm font-extrabold text-[#184363]">Tile {slot}</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Thumbnail + upload row */}
        <div className="flex items-center gap-3">
          <TileThumbnail image_url={displayUrl} title={form.title} subtitle={form.subtitle} />
          <div className="flex-1">
            <UploadButton onUpload={onUpload} uploading={uploading} />
            {form.image_url && (
              <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Image set
              </p>
            )}
          </div>
        </div>

        {/* Fields */}
        <div>
          <label className="block text-[10px] font-bold text-[#184363] mb-1 uppercase tracking-wide">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => onChange('title', e.target.value)}
            placeholder="e.g. Vitamins & Supplements"
            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#184363] mb-1 uppercase tracking-wide">Subtitle</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={e => onChange('subtitle', e.target.value)}
            placeholder="e.g. Boost your wellness"
            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
          />
        </div>

        <LinkPicker
          value={form.link}
          onChange={path => onChange('link', path)}
        />

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          onClick={onSave}
          disabled={saving || uploading}
          className="w-full py-2 bg-[#184363] text-white text-xs font-bold rounded-xl hover:bg-[#009eb9] transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Tile'}
        </button>
      </div>
    </div>
  )
}

export default function HeroTilesPanel() {
  const [forms, setForms] = useState<TileFormState[]>(DEFAULTS)
  const [previewUrls, setPreviewUrls] = useState<string[]>(['', ''])
  const [saving, setSaving] = useState<boolean[]>([false, false])
  const [uploading, setUploading] = useState<boolean[]>([false, false])
  const [errors, setErrors] = useState<(string | null)[]>([null, null])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/tiles')
      .then(r => r.json())
      .then((data: Tile[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setForms(prev => {
            const next = [...prev]
            data.forEach(t => {
              const idx = t.slot - 1
              if (idx === 0 || idx === 1) {
                next[idx] = { image_url: t.image_url, title: t.title, subtitle: t.subtitle, link: t.link }
              }
            })
            return next
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const setField = (idx: number, field: keyof TileFormState, value: string) => {
    setForms(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const handleUpload = async (idx: number, file: File) => {
    setPreviewUrls(prev => { const n = [...prev]; n[idx] = URL.createObjectURL(file); return n })
    setUploading(prev => { const n = [...prev]; n[idx] = true; return n })
    setErrors(prev => { const n = [...prev]; n[idx] = null; return n })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/manager/promotions/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        setErrors(prev => { const n = [...prev]; n[idx] = d.error ?? 'Upload failed'; return n })
        setPreviewUrls(prev => { const n = [...prev]; n[idx] = ''; return n })
        return
      }
      const { url } = await res.json()
      setForms(prev => { const n = [...prev]; n[idx] = { ...n[idx], image_url: url }; return n })
      setPreviewUrls(prev => { const n = [...prev]; n[idx] = url; return n })
    } catch {
      setErrors(prev => { const n = [...prev]; n[idx] = 'Upload failed — please try again'; return n })
      setPreviewUrls(prev => { const n = [...prev]; n[idx] = ''; return n })
    } finally {
      setUploading(prev => { const n = [...prev]; n[idx] = false; return n })
    }
  }

  const handleSave = async (idx: number) => {
    const form = forms[idx]
    if (!form.image_url.trim()) {
      setErrors(prev => { const n = [...prev]; n[idx] = 'Please upload an image'; return n })
      return
    }
    if (!form.title.trim()) {
      setErrors(prev => { const n = [...prev]; n[idx] = 'Title is required'; return n })
      return
    }
    setErrors(prev => { const n = [...prev]; n[idx] = null; return n })
    setSaving(prev => { const n = [...prev]; n[idx] = true; return n })
    try {
      const res = await fetch(`/api/manager/tiles/${idx + 1}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setErrors(prev => { const n = [...prev]; n[idx] = d.error ?? 'Save failed'; return n })
      }
    } catch {
      setErrors(prev => { const n = [...prev]; n[idx] = 'Save failed — please try again'; return n })
    } finally {
      setSaving(prev => { const n = [...prev]; n[idx] = false; return n })
    }
  }

  if (!loaded) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
            <div className="w-3/4 h-4 bg-slate-100 rounded mb-4" />
            <div className="w-full rounded-xl bg-slate-100" style={{ aspectRatio: '3/2' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[0, 1].map(idx => (
        <TileEditor
          key={idx}
          slot={idx + 1}
          form={forms[idx]}
          previewUrl={previewUrls[idx]}
          saving={saving[idx]}
          uploading={uploading[idx]}
          error={errors[idx]}
          onChange={(field, value) => setField(idx, field, value)}
          onUpload={file => handleUpload(idx, file)}
          onSave={() => handleSave(idx)}
        />
      ))}
    </div>
  )
}
