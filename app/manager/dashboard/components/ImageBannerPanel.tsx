'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import LinkPicker from './LinkPicker'

type BannerForm = {
  image_url: string
  link: string
  alt_text: string
}

const FALLBACK: BannerForm = {
  image_url: 'https://sparkport.co.za/wp-content/uploads/sparkport-web-banner.png',
  link: '/shop',
  alt_text: 'Promotional Banner',
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

export default function ImageBannerPanel() {
  const [form, setForm] = useState<BannerForm>(FALLBACK)
  const [previewUrl, setPreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const displayUrl = previewUrl || form.image_url

  useEffect(() => {
    fetch('/api/image-banner')
      .then(r => r.json())
      .then(data => { if (data?.image_url) setForm(data) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const handleUpload = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/manager/promotions/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Upload failed')
        setPreviewUrl('')
        return
      }
      const { url } = await res.json()
      setForm(f => ({ ...f, image_url: url }))
      setPreviewUrl(url)
    } catch {
      setError('Upload failed — please try again')
      setPreviewUrl('')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.image_url.trim()) { setError('Please upload a banner image'); return }
    if (uploading) { setError('Please wait for the image to finish uploading'); return }
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/manager/image-banner', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: form.image_url, link: form.link, alt_text: form.alt_text }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Save failed')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) {
    return (
      <div className="bg-white rounded-2xl p-5 animate-pulse shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
        <div className="grid grid-cols-[1fr_280px] gap-6">
          <div className="space-y-3">
            <div className="h-8 bg-slate-100 rounded-xl" />
            <div className="h-8 bg-slate-100 rounded-xl" />
            <div className="h-8 bg-slate-100 rounded-xl" />
          </div>
          <div className="rounded-xl bg-slate-100 aspect-[3/1]" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-50">
        <p className="text-sm font-extrabold text-[#184363]">Banner Image</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">Displayed full-width below the featured products section</p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Left — form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#184363] mb-1.5 uppercase tracking-wide">Banner Image</label>
              <UploadButton onUpload={handleUpload} uploading={uploading} />
              {form.image_url && !uploading && (
                <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Image set — upload another to replace
                </p>
              )}
              <p className="text-[10px] text-neutral-400 mt-1">Recommended: 1200×400px or wider. JPG, PNG, WebP.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#184363] mb-1.5 uppercase tracking-wide">Alt Text</label>
              <input
                type="text"
                value={form.alt_text}
                onChange={e => setForm(f => ({ ...f, alt_text: e.target.value }))}
                placeholder="e.g. Promotional Banner"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
              />
            </div>

            <LinkPicker
              value={form.link}
              onChange={path => setForm(f => ({ ...f, link: path }))}
            />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
            )}

            {saved && (
              <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Banner saved successfully
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full py-2.5 bg-[#184363] text-white text-sm font-bold rounded-xl hover:bg-[#009eb9] transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Banner'}
            </button>
          </div>

          {/* Right — preview */}
          <div>
            <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] mb-2">Preview</p>
            <div className="relative w-full rounded-xl overflow-hidden bg-slate-100" style={{ aspectRatio: '3/1' }}>
              {displayUrl ? (
                <Image
                  src={displayUrl}
                  alt={form.alt_text || 'Banner preview'}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
              )}
            </div>
            <p className="text-[9px] text-neutral-300 mt-1.5 text-center">Full-width on the live site</p>
          </div>

        </div>
      </div>
    </div>
  )
}
