'use client'

import { useEffect, useState } from 'react'
import { Prescription, Pharmacy } from '../types'
import { getStatusColor } from '../utils'

type DeliveryAddress = {
  street_address: string
  city: string
  [key: string]: unknown
}

type Props = {
  prescription: Prescription
  pharmacies: Pharmacy[]
  role: 'franchise_admin' | 'store_manager'
  onClose: () => void
  onStatusUpdate: (id: string, status: string, note?: string) => Promise<void>
  onReassign?: (id: string, pharmacyId: string) => Promise<void>
}

const STATUSES = [
  { status: 'submitted', label: 'Submitted' },
  { status: 'verifying', label: 'Verifying' },
  { status: 'verified', label: 'Verified' },
  { status: 'dispensing', label: 'Dispensing' },
  { status: 'ready_collect', label: 'Ready' },
  { status: 'completed', label: 'Completed' },
]

export default function PrescriptionModal({ prescription, pharmacies, role, onClose, onStatusUpdate, onReassign }: Props) {
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [reassignLoading, setReassignLoading] = useState(false)
  const [statusNote, setStatusNote] = useState('')

  const pharmacyName = pharmacies.find(p => p.id === prescription.preferred_pharmacy_id)?.name ?? '—'

  useEffect(() => {
    setImageLoading(true)
    fetch(`/api/manager/prescriptions/${prescription.id}`)
      .then(r => r.json())
      .then(({ imageUrl, deliveryAddress: addr }) => {
        if (imageUrl) setPrescriptionImage(imageUrl)
        if (addr) setDeliveryAddress(addr)
      })
      .catch(console.error)
      .finally(() => setImageLoading(false))
  }, [prescription.id])

  const handleStatusUpdate = async (status: string) => {
    setStatusLoading(true)
    try {
      await onStatusUpdate(prescription.id, status, statusNote.trim() || undefined)
      setStatusNote('')
    } finally {
      setStatusLoading(false)
    }
  }

  const handleReassign = async (pharmacyId: string) => {
    if (!onReassign) return
    setReassignLoading(true)
    try { await onReassign(prescription.id, pharmacyId) } finally { setReassignLoading(false) }
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#184363] to-[#009eb9] px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
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
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>

          {/* Info grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs font-bold text-green-700 mb-2">Patient</p>
              <p className="font-bold text-[#184363] text-sm">{prescription.patient_name}</p>
              <p className="text-xs text-neutral-500 mt-1">{prescription.patient_phone}</p>
              <p className="text-xs text-neutral-400 break-all mt-0.5">{prescription.contact_email}</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-2">Prescription</p>
              <p className="font-bold text-[#184363] text-sm">{prescription.prescription_number}</p>
              <p className="text-xs text-neutral-500 mt-1">Submitted {new Date(prescription.created_at).toLocaleDateString()}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Updated {new Date(prescription.updated_at).toLocaleDateString()}</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-700 mb-2">Store</p>
              <p className="font-bold text-[#184363] text-sm">{pharmacyName}</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <p className="text-xs font-bold text-orange-700 mb-2">Delivery</p>
              <p className="font-bold text-[#184363] text-sm capitalize">{prescription.delivery_method}</p>
              {deliveryAddress && (
                <p className="text-xs text-neutral-500 mt-1 leading-tight">{deliveryAddress.street_address}, {deliveryAddress.city}</p>
              )}
            </div>
          </div>

          {/* Status update */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 mb-4">
            <p className="text-sm font-bold text-[#184363] mb-3">Update Status</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {STATUSES.map(({ status, label }) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={statusLoading}
                  className={`px-3 py-2 rounded-lg font-bold transition-all text-xs border-2 ${getStatusColor(status)} hover:shadow-md disabled:opacity-50`}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              value={statusNote}
              onChange={e => setStatusNote(e.target.value)}
              placeholder="Optional note for this status change…"
              rows={2}
              className="mt-3 w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] resize-none text-neutral-700 placeholder:text-neutral-400"
            />
          </div>

          {/* Reassign (franchise admin only) */}
          {role === 'franchise_admin' && onReassign && pharmacies.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
              <p className="text-sm font-bold text-amber-900 mb-3">Reassign to Different Store</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {pharmacies.map(ph => (
                  <button
                    key={ph.id}
                    onClick={() => handleReassign(ph.id)}
                    disabled={ph.id === prescription.preferred_pharmacy_id || reassignLoading}
                    className={`px-3 py-2 text-xs rounded-lg font-bold transition-all ${
                      ph.id === prescription.preferred_pharmacy_id
                        ? 'bg-[#009eb9] text-white border-2 border-[#009eb9] cursor-not-allowed'
                        : 'bg-white text-neutral-700 border-2 border-amber-300 hover:border-[#009eb9] hover:text-[#009eb9] disabled:opacity-50'
                    }`}
                  >
                    {ph.name}{ph.id === prescription.preferred_pharmacy_id ? ' ✓' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

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
