'use client'

import { useEffect, useState, useMemo } from 'react'
import { Prescription } from '../types'
import { getStatusColor, STATUS_TRANSITIONS } from '../utils'

type LogEntry = {
  id: string
  status: string
  actor_name: string | null
  actor_role: string
  note: string | null
  created_at: string
}

type Props = {
  prescription: Prescription
  onClose: () => void
  onStatusUpdate: (id: string, status: string, note?: string) => Promise<void>
}

export default function PrescriptionRoadmapModal({ prescription, onClose, onStatusUpdate }: Props) {
  const [log, setLog] = useState<LogEntry[]>([])
  const [logLoading, setLogLoading] = useState(true)
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const transition = STATUS_TRANSITIONS[prescription.status]
  const isTerminal = ['completed', 'rejected', 'cancelled'].includes(prescription.status)

  const fullLog = useMemo(() => {
    const submittedEntry: LogEntry = {
      id: '__submitted__',
      status: 'submitted',
      actor_name: prescription.patient_name,
      actor_role: 'patient',
      note: null,
      created_at: prescription.created_at,
    }
    const alreadyLogged = log.some(e => e.status === 'submitted')
    return alreadyLogged ? log : [submittedEntry, ...log]
  }, [log, prescription.patient_name, prescription.created_at])

  const fetchLog = () => {
    setLogLoading(true)
    fetch(`/api/manager/prescriptions/${prescription.id}/log`)
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setLog(data) : setLog([]))
      .catch(() => setLog([]))
      .finally(() => setLogLoading(false))
  }

  useEffect(() => {
    fetchLog()
    fetch(`/api/manager/prescriptions/${prescription.id}`)
      .then(r => r.json())
      .then(({ imageUrl }) => { if (imageUrl) setPrescriptionImage(imageUrl) })
      .catch(console.error)
      .finally(() => setImageLoading(false))
  }, [prescription.id])

  const handleAdvance = async () => {
    if (!transition) return
    setSubmitting(true)
    try {
      await onStatusUpdate(prescription.id, transition.next, note.trim() || undefined)
      setNote('')
      fetchLog()
    } finally {
      setSubmitting(false)
    }
  }

  const openLightbox = () => {
    if (!prescriptionImage) return
    const lb = document.createElement('div')
    lb.className = 'fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4'
    lb.onclick = () => lb.remove()
    const img = document.createElement('img')
    img.src = prescriptionImage
    img.className = 'max-w-full max-h-full object-contain'
    img.onclick = e => e.stopPropagation()
    const btn = document.createElement('button')
    btn.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
    btn.className = 'absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors'
    btn.onclick = () => lb.remove()
    lb.appendChild(img)
    lb.appendChild(btn)
    document.body.appendChild(lb)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#184363] to-[#009eb9] px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Prescription Roadmap</span>
            </div>
            <h2 className="text-xl font-bold text-white">{prescription.prescription_number}</h2>
            <p className="text-white/80 text-sm">{prescription.patient_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(prescription.status)}`}>
              {prescription.status.replace(/_/g, ' ').toUpperCase()}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>

          {/* Journey Timeline */}
          <p className="text-sm font-bold text-[#184363] mb-4">Journey</p>
          {logLoading ? (
            <div className="space-y-2 mb-6">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-neutral-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="relative mb-6">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-neutral-200" />
              <div className="space-y-3">
                {fullLog.map((entry, i) => (
                  <div key={entry.id} className="relative flex gap-4 pl-10">
                    <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white shadow mt-1.5 shrink-0 ${
                      i === fullLog.length - 1 ? 'bg-[#009eb9]' : 'bg-neutral-300'
                    }`} />
                    <div className="flex-1 min-w-0 bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(entry.status)}`}>
                          {entry.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          by {entry.actor_role === 'patient' ? 'Patient' : (entry.actor_role?.replace(/_/g, ' ') ?? 'Pharmacist')}
                          {entry.actor_name && ` · ${entry.actor_name}`}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-xs text-neutral-600 mt-1 italic">"{entry.note}"</p>
                      )}
                      <p className="text-[10px] text-neutral-400 mt-1">
                        {new Date(entry.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Action */}
          {isTerminal ? (
            <div className={`rounded-2xl p-4 border-2 text-center ${
              prescription.status === 'completed'
                ? 'bg-green-50 border-green-200'
                : 'bg-neutral-50 border-neutral-200'
            }`}>
              <p className={`text-sm font-bold ${
                prescription.status === 'completed' ? 'text-green-700' : 'text-neutral-500'
              }`}>
                {prescription.status === 'completed'
                  ? '✓ Prescription completed'
                  : prescription.status === 'rejected'
                  ? 'Prescription rejected'
                  : 'Prescription cancelled'}
              </p>
            </div>
          ) : transition ? (
            <div className="bg-[#009eb9]/8 rounded-2xl p-5 border-2 border-[#009eb9]/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#009eb9] animate-pulse" />
                <p className="text-sm font-bold text-[#184363]">Next Step</p>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(transition.next)}`}>
                  {transition.next.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note for this step (optional)…"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[#009eb9]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9] resize-none text-neutral-700 placeholder:text-neutral-400 bg-white mb-3"
              />
              <button
                onClick={handleAdvance}
                disabled={submitting}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#184363] to-[#009eb9] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing…
                  </>
                ) : (
                  <>
                    Move to {transition.next.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50 rounded-b-3xl flex gap-3">
          {imageLoading ? (
            <button disabled className="flex-1 px-6 py-3 bg-neutral-300 text-neutral-600 font-bold rounded-xl flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-600 border-t-transparent" />
              Loading Script…
            </button>
          ) : prescriptionImage ? (
            <button
              onClick={openLightbox}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#184363] to-[#009eb9] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Script
            </button>
          ) : (
            <button disabled className="flex-1 px-6 py-3 bg-neutral-200 text-neutral-400 font-bold rounded-xl cursor-not-allowed">
              No Script Image
            </button>
          )}
          <button onClick={onClose} className="flex-1 px-6 py-3 bg-neutral-600 text-white font-bold rounded-xl hover:bg-neutral-700 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
