'use client'

import { useEffect, useState, useMemo } from 'react'
import { Prescription, Pharmacy, Manager, Analytics } from './types'
import { getGreeting, formatDate } from './utils'
import ManagerSidebar from './components/ManagerSidebar'
import PrescriptionTable from './components/PrescriptionTable'
import PrescriptionModal from './components/PrescriptionModal'
import PrescriptionRoadmapModal from './components/PrescriptionRoadmapModal'
import OverviewSection from './sections/OverviewSection'
import OrdersSection from './sections/OrdersSection'
import StoresSection from './sections/StoresSection'
import EnquiriesSection from './sections/EnquiriesSection'
import SubscribersSection from './sections/SubscribersSection'
import PromotionsSection from './sections/PromotionsSection'
import RewardsSection from './sections/RewardsSection'

type Section = 'dashboard' | 'prescriptions' | 'orders' | 'stores' | 'promotions' | 'subscriptions' | 'enquiries' | 'rewards'

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <svg className="w-7 h-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-extrabold text-[#184363] mb-2">{title}</h2>
      <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">{description}</p>
      <span className="mt-4 text-[10px] font-bold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-400 uppercase tracking-widest">
        Coming Soon
      </span>
    </div>
  )
}

export default function FranchiseAdminDashboard({ initialManager }: { initialManager: Manager }) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoadmapPrescription, setSelectedRoadmapPrescription] = useState<Prescription | null>(null)
  const [showRoadmap, setShowRoadmap] = useState(false)

  useEffect(() => {
    loadData()
    fetch('/api/manager/analytics')
      .then(r => r.json())
      .then(data => setAnalytics(data))
      .catch(console.error)
      .finally(() => setAnalyticsLoading(false))
  }, [])

  const loadData = async () => {
    try {
      const [phRes, rxRes] = await Promise.all([
        fetch('/api/manager/pharmacies'),
        fetch('/api/manager/prescriptions'),
      ])
      if (phRes.ok) setPharmacies(await phRes.json())
      if (rxRes.ok) setPrescriptions(await rxRes.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openRoadmap = (prescription: Prescription) => {
    setSelectedRoadmapPrescription(prescription)
    setShowRoadmap(true)
  }

  const handleRoadmapStatusUpdate = async (id: string, status: string, note?: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    })
    const res = await fetch('/api/manager/prescriptions')
    if (res.ok) {
      const updated: Prescription[] = await res.json()
      setPrescriptions(updated)
      const fresh = updated.find(p => p.id === id)
      if (fresh) setSelectedRoadmapPrescription(fresh)
    }
  }

  const handleStatusUpdate = async (id: string, status: string, note?: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    })
    await loadData()
    setShowModal(false)
  }

  const handleReassign = async (id: string, pharmacyId: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferred_pharmacy_id: pharmacyId }),
    })
    await loadData()
    setShowModal(false)
  }

  const openModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowModal(true)
  }

  const sidebarStats = useMemo(() => ({
    pending: prescriptions.filter(p => p.status === 'submitted' || p.status === 'verifying').length,
    active: prescriptions.filter(p =>
      ['submitted', 'verifying', 'dispensing', 'ready_collect', 'out_delivery'].includes(p.status)
    ).length,
    completed: prescriptions.filter(p => p.status === 'completed').length,
    total: prescriptions.length,
    stores: pharmacies.length,
    todayRevenue: analytics?.kpis.today ?? null,
  }), [prescriptions, pharmacies, analytics])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009eb9] mx-auto mb-4" />
          <p className="text-neutral-600">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <ManagerSidebar
        role="franchise_admin"
        activeSection={activeSection}
        onNavigate={s => setActiveSection(s as Section)}
        manager={initialManager}
        stats={sidebarStats}
      />

      <main className="lg:ml-64 pb-20 lg:pb-0">
        {/* ── Hero ── */}
        <div className="bg-gradient-to-r from-[#184363] via-[#1a5276] to-[#009eb9] px-6 md:px-10 py-10 md:py-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Franchise Admin</span>
          </div>
          <p className="text-white/50 text-sm font-medium mb-2">{formatDate()}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            {getGreeting()}, {initialManager.name}
          </h1>
          <p className="text-white/75 text-base max-w-xl leading-relaxed">
            {sidebarStats.pending > 0 ? (
              <>
                You have{' '}
                <span className="text-white font-bold">{sidebarStats.pending}</span>{' '}
                prescription{sidebarStats.pending !== 1 ? 's' : ''} pending action across{' '}
                <span className="text-white font-bold">{pharmacies.length}</span>{' '}
                store{pharmacies.length !== 1 ? 's' : ''}
                {analytics && analytics.kpis.today > 0 && (
                  <>, with{' '}
                    <span className="text-white font-bold">R{analytics.kpis.today.toFixed(0)}</span>{' '}
                    in completed revenue today
                  </>
                )}.
              </>
            ) : (
              <>
                All clear — no prescriptions pending action across{' '}
                <span className="text-white font-bold">{pharmacies.length}</span>{' '}
                store{pharmacies.length !== 1 ? 's' : ''}
                {analytics && analytics.kpis.today > 0 && (
                  <>. Today's revenue is at{' '}
                    <span className="text-white font-bold">R{analytics.kpis.today.toFixed(0)}</span>
                  </>
                )}.
              </>
            )}
          </p>
        </div>

        {/* ── Section content ── */}
        <div className="p-4 lg:p-8">
          {activeSection === 'dashboard' && (
            <OverviewSection
              prescriptions={prescriptions}
              pharmacies={pharmacies}
              analytics={analytics}
              analyticsLoading={analyticsLoading}
            />
          )}

          {activeSection === 'prescriptions' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#184363]">Prescriptions</h1>
                <p className="text-neutral-500 text-sm mt-0.5">All prescriptions across the network</p>
              </div>
              <PrescriptionTable
                prescriptions={prescriptions}
                pharmacies={pharmacies}
                role="franchise_admin"
                onProcessClick={openRoadmap}
                onRowClick={openModal}
              />
            </div>
          )}

          {activeSection === 'orders' && (
            <OrdersSection
              analytics={analytics}
              analyticsLoading={analyticsLoading}
            />
          )}

          {activeSection === 'stores' && (
            <StoresSection
              prescriptions={prescriptions}
              pharmacies={pharmacies}
            />
          )}

          {activeSection === 'promotions' && (
            <PromotionsSection />
          )}

          {activeSection === 'subscriptions' && (
            <SubscribersSection />
          )}

          {activeSection === 'enquiries' && (
            <EnquiriesSection role="franchise_admin" pharmacies={pharmacies} />
          )}

          {activeSection === 'rewards' && (
            <RewardsSection />
          )}
        </div>
      </main>

      {showModal && selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          pharmacies={pharmacies}
          role="franchise_admin"
          onClose={() => setShowModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onReassign={handleReassign}
        />
      )}

      {showRoadmap && selectedRoadmapPrescription && (
        <PrescriptionRoadmapModal
          prescription={selectedRoadmapPrescription}
          onClose={() => setShowRoadmap(false)}
          onStatusUpdate={handleRoadmapStatusUpdate}
        />
      )}
    </div>
  )
}
