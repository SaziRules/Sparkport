# Manager Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild both manager dashboards into a sidebar app shell with focused sections — prescription table with search/pagination/aging, an operational Overview for franchise admin, and prescription + commerce analytics charts for both roles.

**Architecture:** Extract shared types, utilities, and components into `app/manager/dashboard/components/` and `sections/`. Both `FranchiseAdminDashboard.tsx` and `StoreManagerDashboard.tsx` become thin shells that manage state and render sections. All data access remains through the existing API routes using the service role.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Tailwind CSS, Supabase (service role API routes). No external chart libraries — all charts use CSS.

## Global Constraints

- No external chart libraries (Recharts, Chart.js, etc.) — CSS bar charts only
- All Supabase data access goes through `/api/manager/*` routes using the service role
- `supabase` browser client must NOT be used in dashboard components
- Tailwind CSS only for styling — no inline style objects except where percentage values are required for chart bars
- Brand colours: teal `#009eb9`, dark blue `#184363`
- Server actions (`managerSignOut`) are imported from `../../actions` (relative) inside component subfolders

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/manager/dashboard/types.ts` | Create | All shared TypeScript types |
| `app/manager/dashboard/utils.ts` | Create | Shared pure functions (age, status colour, transitions) |
| `lib/supabase/analytics.ts` | Modify | Add `getPrescriptionsByDay()` |
| `app/api/manager/analytics/route.ts` | Modify | Include `prescriptionsByDay` in response |
| `app/manager/dashboard/components/ManagerSidebar.tsx` | Create | Fixed sidebar + mobile bottom tab bar |
| `app/manager/dashboard/components/PrescriptionTable.tsx` | Create | Search, filter, date range, age, quick-action, pagination |
| `app/manager/dashboard/components/PrescriptionModal.tsx` | Create | Detail modal extracted from current FranchiseAdminDashboard |
| `app/manager/dashboard/sections/OverviewSection.tsx` | Create | Franchise admin landing — KPI strip, store cards, sparkline, activity feed |
| `app/manager/dashboard/sections/AnalyticsSection.tsx` | Create | Prescription + commerce analytics charts for both roles |
| `app/manager/dashboard/sections/StoresSection.tsx` | Create | Franchise admin store performance table |
| `app/manager/dashboard/FranchiseAdminDashboard.tsx` | Rewrite | Shell + state, renders sections |
| `app/manager/dashboard/StoreManagerDashboard.tsx` | Rewrite | Shell + state, renders sections |

---

## Task 1: Shared Types and Utilities

**Files:**
- Create: `app/manager/dashboard/types.ts`
- Create: `app/manager/dashboard/utils.ts`

**Interfaces:**
- Produces: `Prescription`, `Pharmacy`, `Manager`, `Analytics` types consumed by every subsequent task
- Produces: `getAgeInfo()`, `getStatusColor()`, `STATUS_TRANSITIONS`, `getRelativeTime()` used by Table, Modal, Overview, Analytics sections

- [ ] **Step 1: Create `app/manager/dashboard/types.ts`**

```ts
export type Prescription = {
  id: string
  prescription_number: string
  patient_name: string
  patient_phone: string
  contact_email: string
  delivery_method: string
  status: string
  is_anonymous: boolean
  preferred_pharmacy_id: string
  created_at: string
  updated_at: string
  delivery_address_id?: string | null
}

export type Pharmacy = {
  id: string
  name: string
  city: string
  street_address: string
  phone: string | null
}

export type Manager = {
  id: string
  name: string
  email: string
  role: 'franchise_admin' | 'store_manager'
  pharmacy?: { id: string; name: string; city: string } | null
}

export type Analytics = {
  kpis: {
    today: number
    thisMonth: number
    lastMonth: number
    growthPct: number | null
    totalOrders: number
  }
  revenueByDay: { date: string; revenue: number }[]
  ordersByStatus: { status: string; count: number; total: number }[]
  topProducts: { product_name: string; qty: number; revenue: number }[]
  customerGrowth: { month: string; new_customers: number }[]
  recentOrders: {
    id: number
    number: string
    status: string
    billing_name: string
    total: number
    date_created: string
  }[]
  prescriptionMetrics: { status: string; count: number }[]
  prescriptionsByDay: { date: string; count: number }[]
}
```

- [ ] **Step 2: Create `app/manager/dashboard/utils.ts`**

```ts
export function getAgeInfo(updatedAt: string): { label: string; colorClass: string } {
  const hours = (Date.now() - new Date(updatedAt).getTime()) / 3600000
  if (hours < 2) {
    const mins = Math.round(hours * 60)
    return { label: `${mins}m`, colorClass: 'bg-green-100 text-green-700' }
  }
  if (hours < 8) return { label: `${hours.toFixed(1)}h`, colorClass: 'bg-amber-100 text-amber-700' }
  return { label: `${hours.toFixed(1)}h`, colorClass: 'bg-red-100 text-red-700' }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'submitted': return 'border-yellow-300 bg-yellow-50 text-yellow-700'
    case 'verifying': return 'border-blue-300 bg-blue-50 text-blue-700'
    case 'verified': return 'border-purple-300 bg-purple-50 text-purple-700'
    case 'dispensing': return 'border-indigo-300 bg-indigo-50 text-indigo-700'
    case 'ready_collect': return 'border-green-300 bg-green-50 text-green-700'
    case 'out_delivery': return 'border-cyan-300 bg-cyan-50 text-cyan-700'
    case 'completed': return 'border-neutral-300 bg-neutral-50 text-neutral-600'
    case 'rejected': return 'border-red-300 bg-red-50 text-red-700'
    case 'cancelled': return 'border-neutral-300 bg-neutral-50 text-neutral-500'
    default: return 'border-neutral-300 bg-neutral-50 text-neutral-600'
  }
}

export const STATUS_TRANSITIONS: Record<string, { next: string; label: string }> = {
  submitted: { next: 'verifying', label: 'Mark Verifying' },
  verifying: { next: 'dispensing', label: 'Mark Dispensing' },
  dispensing: { next: 'ready_collect', label: 'Mark Ready' },
  ready_collect: { next: 'completed', label: 'Mark Completed' },
}

export function getRelativeTime(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name[0]?.toUpperCase() ?? '?'
}
```

- [ ] **Step 3: Verify — confirm both files exist and TypeScript compiles**

Run: `cd C:/Users/scorp/Desktop/AppDev/sparkport && npx tsc --noEmit 2>&1 | head -20`
Expected: no errors related to the new files (other pre-existing errors are OK to ignore for now)

- [ ] **Step 4: Commit**

```bash
git add app/manager/dashboard/types.ts app/manager/dashboard/utils.ts
git commit -m "feat: add shared types and utilities for manager dashboard redesign"
```

---

## Task 2: Analytics Data Layer — Add `prescriptionsByDay`

**Files:**
- Modify: `lib/supabase/analytics.ts`
- Modify: `app/api/manager/analytics/route.ts`

**Interfaces:**
- Consumes: nothing new
- Produces: `getPrescriptionsByDay(days: number): Promise<{ date: string; count: number }[]>` — consumed by analytics route
- Produces: `analytics.prescriptionsByDay` in API response — consumed by AnalyticsSection (Task 7)

- [ ] **Step 1: Add `getPrescriptionsByDay` to `lib/supabase/analytics.ts`**

Add after the closing brace of `getRecentOrders`:

```ts
export async function getPrescriptionsByDay(days = 30): Promise<{ date: string; count: number }[]> {
  const supabase = adminClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const { data } = await supabase
    .from('prescriptions')
    .select('created_at')
    .gte('created_at', since)

  const byDate: Record<string, number> = {}
  for (const row of data ?? []) {
    const date = row.created_at.slice(0, 10)
    byDate[date] = (byDate[date] ?? 0) + 1
  }

  const result: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, count: byDate[dateStr] ?? 0 })
  }
  return result
}
```

- [ ] **Step 2: Update `app/api/manager/analytics/route.ts` to include `prescriptionsByDay`**

Replace the import block at the top:

```ts
import {
  getRevenueKPIs,
  getRevenueByDay,
  getOrdersByStatus,
  getTopProducts,
  getCustomerGrowth,
  getPrescriptionMetrics,
  getRecentOrders,
  getPrescriptionsByDay,
} from '@/lib/supabase/analytics'
```

Replace the `Promise.all` call and return:

```ts
  const [kpis, revenueByDay, ordersByStatus, topProducts, customerGrowth, prescriptionMetrics, recentOrders, prescriptionsByDay] =
    await Promise.all([
      getRevenueKPIs(),
      getRevenueByDay(30),
      getOrdersByStatus(),
      getTopProducts(10),
      getCustomerGrowth(6),
      getPrescriptionMetrics(),
      getRecentOrders(10),
      getPrescriptionsByDay(30),
    ])

  return NextResponse.json({ kpis, revenueByDay, ordersByStatus, topProducts, customerGrowth, prescriptionMetrics, recentOrders, prescriptionsByDay })
```

- [ ] **Step 3: Verify — hit the analytics endpoint**

Start dev server if not running: `npm run dev`
Visit `http://localhost:3000/api/manager/analytics` while logged in as a manager.
Expected: JSON response includes `"prescriptionsByDay"` array with 30 `{ date, count }` objects.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/analytics.ts app/api/manager/analytics/route.ts
git commit -m "feat: add prescriptionsByDay to analytics data layer and API response"
```

---

## Task 3: ManagerSidebar Component

**Files:**
- Create: `app/manager/dashboard/components/ManagerSidebar.tsx`

**Interfaces:**
- Consumes: `Manager` from `../types`, `managerSignOut` from `../../actions`
- Produces: `<ManagerSidebar role activeSection onNavigate manager />` — consumed by Tasks 9 and 10

- [ ] **Step 1: Create `app/manager/dashboard/components/ManagerSidebar.tsx`**

```tsx
'use client'

import { Manager } from '../types'
import { managerSignOut } from '../../actions'
import { getInitials } from '../utils'

type Props = {
  role: 'franchise_admin' | 'store_manager'
  activeSection: string
  onNavigate: (section: string) => void
  manager: Manager
}

const FRANCHISE_NAV = [
  {
    section: 'overview',
    label: 'Overview',
    short: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    section: 'prescriptions',
    label: 'Prescriptions',
    short: 'Rx',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    section: 'analytics',
    label: 'Analytics',
    short: 'Stats',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    section: 'stores',
    label: 'Stores',
    short: 'Stores',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
]

const STORE_NAV = [
  {
    section: 'prescriptions',
    label: 'Prescriptions',
    short: 'Rx',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    section: 'analytics',
    label: 'Analytics',
    short: 'Stats',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export default function ManagerSidebar({ role, activeSection, onNavigate, manager }: Props) {
  const navItems = role === 'franchise_admin' ? FRANCHISE_NAV : STORE_NAV

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-white border-r border-neutral-200 flex-col z-30">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-neutral-100">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Manager Portal</p>
          <p className="text-lg font-extrabold text-[#184363] mt-0.5">Sparkport</p>
        </div>

        {/* Manager info */}
        <div className="px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getInitials(manager.name)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#184363] text-sm truncate">{manager.name}</p>
              <p className="text-xs text-neutral-500 truncate">{manager.email}</p>
              <span className="inline-block text-[10px] font-bold text-[#009eb9] uppercase tracking-wide mt-0.5">
                {role === 'franchise_admin' ? 'Franchise Admin' : 'Store Manager'}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.section}
              onClick={() => onNavigate(item.section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === item.section
                  ? 'bg-[#009eb9] text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-[#184363]'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-neutral-100">
          <form action={managerSignOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex lg:hidden z-40">
        {navItems.map(item => (
          <button
            key={item.section}
            onClick={() => onNavigate(item.section)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
              activeSection === item.section ? 'text-[#009eb9]' : 'text-neutral-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.short}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Verify — no TypeScript errors in the new file**

Run: `npx tsc --noEmit 2>&1 | grep ManagerSidebar`
Expected: no output (no errors)

- [ ] **Step 3: Commit**

```bash
git add app/manager/dashboard/components/ManagerSidebar.tsx
git commit -m "feat: add ManagerSidebar with desktop fixed sidebar and mobile bottom tab bar"
```

---

## Task 4: PrescriptionTable Component

**Files:**
- Create: `app/manager/dashboard/components/PrescriptionTable.tsx`

**Interfaces:**
- Consumes: `Prescription`, `Pharmacy` from `../types`; `getAgeInfo`, `getStatusColor`, `STATUS_TRANSITIONS` from `../utils`
- Produces: `<PrescriptionTable prescriptions pharmacies role onQuickAction onRowClick />` — consumed by Tasks 9 and 10

- [ ] **Step 1: Create `app/manager/dashboard/components/PrescriptionTable.tsx`**

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Prescription, Pharmacy } from '../types'
import { getAgeInfo, getStatusColor, STATUS_TRANSITIONS } from '../utils'

const PAGE_SIZE = 20

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
  role: 'franchise_admin' | 'store_manager'
  onQuickAction: (id: string, status: string) => Promise<void>
  onRowClick: (prescription: Prescription) => void
}

export default function PrescriptionTable({ prescriptions, pharmacies, role, onQuickAction, onRowClick }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStore, setFilterStore] = useState('all')
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('all')
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const pharmacyMap = useMemo(() => {
    const m: Record<string, string> = {}
    pharmacies.forEach(p => { m[p.id] = p.name })
    return m
  }, [pharmacies])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const now = Date.now()
    const dayMs = 86400000
    return prescriptions.filter(p => {
      if (q && !p.prescription_number.toLowerCase().includes(q) &&
          !p.patient_name.toLowerCase().includes(q) &&
          !p.patient_phone.includes(q)) return false
      if (filterStatus !== 'all' && p.status !== filterStatus) return false
      if (role === 'franchise_admin' && filterStore !== 'all' && p.preferred_pharmacy_id !== filterStore) return false
      if (dateRange === 'today') {
        const start = new Date(); start.setHours(0, 0, 0, 0)
        if (new Date(p.created_at) < start) return false
      } else if (dateRange === '7d' && now - new Date(p.created_at).getTime() > 7 * dayMs) {
        return false
      } else if (dateRange === '30d' && now - new Date(p.created_at).getTime() > 30 * dayMs) {
        return false
      }
      return true
    })
  }, [prescriptions, search, filterStatus, filterStore, dateRange, role])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const reset = () => setPage(1)

  const handleQuickAction = async (e: React.MouseEvent, id: string, next: string) => {
    e.stopPropagation()
    setActionLoading(id)
    try { await onQuickAction(id, next) } finally { setActionLoading(null) }
  }

  return (
    <div>
      {/* Controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search name, Rx#, or phone…"
              value={search}
              onChange={e => { setSearch(e.target.value); reset() }}
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); reset() }}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
          >
            <option value="all">All Status</option>
            {['submitted','verifying','verified','dispensing','ready_collect','out_delivery','completed','rejected','cancelled'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
          {role === 'franchise_admin' && (
            <select
              value={filterStore}
              onChange={e => { setFilterStore(e.target.value); reset() }}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
            >
              <option value="all">All Stores</option>
              {pharmacies.map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
            </select>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['today', '7d', '30d', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => { setDateRange(r); reset() }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                dateRange === r ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-neutral-500 mb-3 px-1">
        Showing{' '}
        <span className="font-bold text-[#184363]">
          {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
        </span>{' '}
        of <span className="font-bold text-[#184363]">{filtered.length}</span> prescriptions
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">No prescriptions match your filters.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Rx #</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Patient</th>
                    {role === 'franchise_admin' && (
                      <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Store</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Age in Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginated.map(p => {
                    const age = getAgeInfo(p.updated_at)
                    const transition = STATUS_TRANSITIONS[p.status]
                    return (
                      <tr
                        key={p.id}
                        onClick={() => onRowClick(p)}
                        className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-bold text-[#184363] whitespace-nowrap">{p.prescription_number}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-neutral-800 whitespace-nowrap">{p.patient_name}</p>
                          <p className="text-xs text-neutral-400">{p.patient_phone}</p>
                        </td>
                        {role === 'franchise_admin' && (
                          <td className="px-4 py-3 text-sm text-neutral-600 whitespace-nowrap">
                            {pharmacyMap[p.preferred_pharmacy_id] ?? '—'}
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-neutral-600 capitalize whitespace-nowrap">{p.delivery_method}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(p.status)}`}>
                            {p.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${age.colorClass}`}>
                            {age.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {transition ? (
                            <button
                              onClick={e => handleQuickAction(e, p.id, transition.next)}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1 bg-[#009eb9] text-white text-xs font-bold rounded-lg hover:bg-[#184363] transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {actionLoading === p.id ? '…' : transition.label}
                            </button>
                          ) : (
                            <span className="text-xs text-neutral-300">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-1 text-sm font-semibold text-[#009eb9] disabled:text-neutral-300 hover:text-[#184363] transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-sm text-neutral-500">Page {safePage} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-3 py-1 text-sm font-semibold text-[#009eb9] disabled:text-neutral-300 hover:text-[#184363] transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

With dev server running, temporarily render `<PrescriptionTable>` inside either dashboard (or use the full rewrite in Task 9 first). Verify:
- Search filters by name, Rx#, and phone in real time
- Status and store dropdowns narrow the list
- Date range buttons filter correctly
- Age pills show green/amber/red based on `updated_at`
- Quick Action button fires PATCH and the row's status updates without page reload
- Pagination controls appear when more than 20 rows exist

- [ ] **Step 3: Commit**

```bash
git add app/manager/dashboard/components/PrescriptionTable.tsx
git commit -m "feat: add PrescriptionTable with search, filters, age badges, quick action, and pagination"
```

---

## Task 5: PrescriptionModal Component

**Files:**
- Create: `app/manager/dashboard/components/PrescriptionModal.tsx`

**Interfaces:**
- Consumes: `Prescription`, `Pharmacy` from `../types`; `getStatusColor` from `../utils`
- Produces: `<PrescriptionModal prescription pharmacies role onClose onStatusUpdate onReassign? />` — consumed by Tasks 9 and 10

The modal fetches its own image and delivery address from `GET /api/manager/prescriptions/[id]` on mount. This keeps the parent free of image state.

- [ ] **Step 1: Create `app/manager/dashboard/components/PrescriptionModal.tsx`**

```tsx
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
  onStatusUpdate: (id: string, status: string) => Promise<void>
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
    try { await onStatusUpdate(prescription.id, status) } finally { setStatusLoading(false) }
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
```

- [ ] **Step 2: Verify in browser**

Open any prescription from the table. Confirm:
- Modal opens with correct patient info
- Image loads and "View Script" button appears (or "No Script Image" if none exists)
- Delivery address appears in the Delivery card if `delivery_address_id` is set
- Status buttons trigger a PATCH and close the modal
- Reassign buttons visible for franchise_admin, hidden for store_manager

- [ ] **Step 3: Commit**

```bash
git add app/manager/dashboard/components/PrescriptionModal.tsx
git commit -m "feat: add PrescriptionModal component with self-contained image loading"
```

---

## Task 6: OverviewSection (Franchise Admin)

**Files:**
- Create: `app/manager/dashboard/sections/OverviewSection.tsx`

**Interfaces:**
- Consumes: `Prescription`, `Pharmacy`, `Analytics` from `../types`; `getAgeInfo`, `getStatusColor`, `getRelativeTime` from `../utils`
- Produces: `<OverviewSection prescriptions pharmacies analytics analyticsLoading />` — consumed by Task 9 only

- [ ] **Step 1: Create `app/manager/dashboard/sections/OverviewSection.tsx`**

```tsx
'use client'

import { useMemo } from 'react'
import { Prescription, Pharmacy, Analytics } from '../types'
import { getAgeInfo, getStatusColor, getRelativeTime } from '../utils'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
  analytics: Analytics | null
  analyticsLoading: boolean
}

export default function OverviewSection({ prescriptions, pharmacies, analytics, analyticsLoading }: Props) {
  const now = Date.now()

  // KPI: pending action count
  const pendingCount = prescriptions.filter(p => p.status === 'submitted' || p.status === 'verifying').length

  // KPI: oldest unprocessed (submitted only)
  const oldestSubmitted = useMemo(() => {
    const submitted = prescriptions.filter(p => p.status === 'submitted')
    if (!submitted.length) return null
    return submitted.reduce((oldest, p) => new Date(p.created_at) < new Date(oldest.created_at) ? p : oldest)
  }, [prescriptions])

  const oldestAge = oldestSubmitted ? getAgeInfo(oldestSubmitted.created_at) : null

  // Store cards
  const storeCards = useMemo(() => {
    return pharmacies.map(ph => {
      const store = prescriptions.filter(p => p.preferred_pharmacy_id === ph.id)
      const pending = store.filter(p => p.status === 'submitted' || p.status === 'verifying')
      const oldest = pending.length
        ? pending.reduce((o, p) => new Date(p.created_at) < new Date(o.created_at) ? p : o)
        : null
      const oldestHours = oldest ? (now - new Date(oldest.created_at).getTime()) / 3600000 : 0
      const urgency = pending.length === 0 ? 0 : oldestHours > 8 ? 2 : oldestHours > 2 ? 1 : 0
      return { ph, pending: pending.length, oldestHours, urgency, oldest }
    }).sort((a, b) => b.urgency - a.urgency || b.pending - a.pending)
  }, [pharmacies, prescriptions, now])

  // 14-day sparkline derived from prescriptions
  const sparkline = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now - (13 - i) * 86400000)
      return d.toISOString().slice(0, 10)
    })
    const counts: Record<string, number> = {}
    prescriptions.forEach(p => {
      const date = p.created_at.slice(0, 10)
      if (days.includes(date)) counts[date] = (counts[date] ?? 0) + 1
    })
    return days.map(date => ({ date, count: counts[date] ?? 0 }))
  }, [prescriptions, now])

  const sparkMax = Math.max(...sparkline.map(d => d.count), 1)

  // Recent activity: last 10 by updated_at
  const recentActivity = useMemo(() => {
    return [...prescriptions]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)
  }, [prescriptions])

  const pharmacyMap = useMemo(() => {
    const m: Record<string, string> = {}
    pharmacies.forEach(p => { m[p.id] = p.name })
    return m
  }, [pharmacies])

  const borderColor = (urgency: number) => {
    if (urgency === 2) return 'border-red-400'
    if (urgency === 1) return 'border-amber-400'
    return 'border-green-400'
  }

  const oldestAgeCardBorder = !oldestAge ? 'border-green-300' : oldestAge.colorClass.includes('red') ? 'border-red-400' : oldestAge.colorClass.includes('amber') ? 'border-amber-400' : 'border-green-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Network Overview</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Operational health across all stores</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Action */}
        <div className="bg-white rounded-2xl border-2 border-[#009eb9]/30 p-5 shadow-sm">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Pending Action</p>
          <p className="text-4xl font-extrabold text-[#009eb9]">{pendingCount}</p>
          <p className="text-xs text-neutral-400 mt-1">submitted + verifying</p>
        </div>

        {/* Oldest Unprocessed */}
        <div className={`bg-white rounded-2xl border-2 ${oldestAgeCardBorder} p-5 shadow-sm`}>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Oldest Unprocessed</p>
          {oldestSubmitted ? (
            <>
              <p className={`text-4xl font-extrabold ${oldestAge?.colorClass.split(' ')[1] ?? 'text-neutral-700'}`}>
                {oldestAge?.label}
              </p>
              <p className="text-xs text-neutral-400 mt-1 truncate">{oldestSubmitted.prescription_number}</p>
            </>
          ) : (
            <>
              <p className="text-4xl font-extrabold text-green-600">—</p>
              <p className="text-xs text-green-500 mt-1">All clear</p>
            </>
          )}
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Today's Revenue</p>
          {analyticsLoading ? (
            <div className="h-8 bg-neutral-100 rounded animate-pulse w-24" />
          ) : (
            <p className="text-3xl font-extrabold text-[#184363]">R {analytics?.kpis.today.toFixed(2) ?? '0.00'}</p>
          )}
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Total Orders</p>
          {analyticsLoading ? (
            <div className="h-8 bg-neutral-100 rounded animate-pulse w-16" />
          ) : (
            <p className="text-3xl font-extrabold text-[#184363]">{analytics?.kpis.totalOrders ?? 0}</p>
          )}
        </div>
      </div>

      {/* Stores Needing Attention */}
      <div>
        <h2 className="text-base font-extrabold text-[#184363] mb-3">Stores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {storeCards.map(({ ph, pending, oldestHours, urgency }) => (
            <div key={ph.id} className={`bg-white rounded-xl border-2 ${borderColor(urgency)} p-4 shadow-sm`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-[#184363] text-sm">{ph.name}</p>
                  <p className="text-xs text-neutral-400">{ph.city}</p>
                </div>
                <span className={`text-2xl font-extrabold ${pending === 0 ? 'text-green-500' : urgency === 2 ? 'text-red-500' : 'text-amber-500'}`}>
                  {pending}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {pending === 0
                  ? 'No pending scripts'
                  : `${pending} pending · oldest ${oldestHours < 1 ? `${Math.round(oldestHours * 60)}m` : `${oldestHours.toFixed(1)}h`}`
                }
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sparkline + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* 14-day sparkline */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#184363] mb-4">Prescription Submissions — Last 14 Days</h3>
          {sparkline.every(d => d.count === 0) ? (
            <p className="text-sm text-neutral-400 text-center py-8">No submissions in the last 14 days.</p>
          ) : (
            <>
              <div className="flex items-end gap-1 h-24">
                {sparkline.map((d, i) => (
                  <div key={i} className="flex-1 group relative h-full flex items-end">
                    <div
                      className="w-full bg-[#009eb9]/70 hover:bg-[#009eb9] rounded-t-sm transition-colors"
                      style={{ height: `${Math.max((d.count / sparkMax) * 100, d.count > 0 ? 4 : 0)}%` }}
                    />
                    {d.count > 0 && (
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#184363] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                        {d.date.slice(5)} · {d.count}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>{sparkline[0].date.slice(5)}</span>
                <span>{sparkline[sparkline.length - 1].date.slice(5)}</span>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#184363] mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-neutral-400">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(p => (
                <div key={p.id} className="flex items-start gap-2">
                  <span className={`mt-0.5 inline-block w-2 h-2 rounded-full shrink-0 ${getStatusColor(p.status).includes('yellow') ? 'bg-yellow-400' : getStatusColor(p.status).includes('green') ? 'bg-green-400' : getStatusColor(p.status).includes('blue') ? 'bg-blue-400' : getStatusColor(p.status).includes('indigo') ? 'bg-indigo-400' : 'bg-neutral-400'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#184363] truncate">{p.prescription_number} → {p.status.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{pharmacyMap[p.preferred_pharmacy_id] ?? '—'} · {getRelativeTime(p.updated_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser (after Task 9 wires it)**

Open franchise admin dashboard → Overview tab. Confirm:
- KPI strip shows correct pending count
- Oldest unprocessed card border turns red if > 8h
- Store cards sorted by urgency, border colours correct
- 14-day sparkline renders with hover tooltips
- Recent activity lists last 10 updates with relative time

- [ ] **Step 3: Commit**

```bash
git add app/manager/dashboard/sections/OverviewSection.tsx
git commit -m "feat: add OverviewSection with KPI strip, store urgency cards, sparkline, and activity feed"
```

---

## Task 7: AnalyticsSection

**Files:**
- Create: `app/manager/dashboard/sections/AnalyticsSection.tsx`

**Interfaces:**
- Consumes: `Prescription`, `Pharmacy`, `Analytics` from `../types`
- Produces: `<AnalyticsSection prescriptions pharmacies analytics analyticsLoading role />` — consumed by Tasks 9 and 10

- [ ] **Step 1: Create `app/manager/dashboard/sections/AnalyticsSection.tsx`**

```tsx
'use client'

import { useMemo } from 'react'
import { Prescription, Pharmacy, Analytics } from '../types'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
  analytics: Analytics | null
  analyticsLoading: boolean
  role: 'franchise_admin' | 'store_manager'
}

const STATUS_ORDER = ['submitted', 'verifying', 'dispensing', 'ready_collect', 'completed']
const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  verifying: 'Verifying',
  dispensing: 'Dispensing',
  ready_collect: 'Ready',
  completed: 'Completed',
}
const ACTIVE_STATUSES = ['submitted', 'verifying', 'dispensing', 'ready_collect']

export default function AnalyticsSection({ prescriptions, pharmacies, analytics, analyticsLoading, role }: Props) {
  const now = Date.now()

  // Status funnel from analytics.prescriptionMetrics
  const funnelData = useMemo(() => {
    const map: Record<string, number> = {}
    analytics?.prescriptionMetrics.forEach(m => { map[m.status] = m.count })
    return STATUS_ORDER.map(s => ({ status: s, label: STATUS_LABELS[s], count: map[s] ?? 0 }))
  }, [analytics])
  const funnelMax = Math.max(...funnelData.map(d => d.count), 1)

  // Per-store comparison (franchise admin)
  const storeData = useMemo(() => {
    if (role !== 'franchise_admin') return []
    return pharmacies.map(ph => ({
      name: ph.name,
      count: prescriptions.filter(p => p.preferred_pharmacy_id === ph.id).length,
    })).sort((a, b) => b.count - a.count)
  }, [pharmacies, prescriptions, role])
  const storeMax = Math.max(...storeData.map(d => d.count), 1)

  // Store manager status breakdown
  const storeBreakdown = useMemo(() => {
    if (role !== 'store_manager') return []
    const statuses = ['submitted', 'verifying', 'dispensing', 'ready_collect', 'completed', 'rejected']
    const total = prescriptions.length || 1
    return statuses.map(s => ({
      status: s,
      label: STATUS_LABELS[s] ?? s,
      count: prescriptions.filter(p => p.status === s).length,
      pct: Math.round((prescriptions.filter(p => p.status === s).length / total) * 100),
    }))
  }, [prescriptions, role])

  // Avg age by active status
  const avgAgeByStatus = useMemo(() => {
    return ACTIVE_STATUSES.map(status => {
      const matching = prescriptions.filter(p => p.status === status)
      if (!matching.length) return null
      const avgMs = matching.reduce((sum, p) => sum + (now - new Date(p.updated_at).getTime()), 0) / matching.length
      return { status, label: STATUS_LABELS[status], avgHours: avgMs / 3600000, count: matching.length }
    }).filter((x): x is { status: string; label: string; avgHours: number; count: number } => x !== null)
  }, [prescriptions, now])

  const LoadingBlock = ({ h = 'h-40' }: { h?: string }) => (
    <div className={`bg-white rounded-2xl border border-neutral-200 ${h} animate-pulse`} />
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Analytics</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Prescription and commerce metrics</p>
      </div>

      {/* ── Prescription Analytics ── */}
      <section>
        <h2 className="text-lg font-extrabold text-[#184363] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#009eb9] rounded-full inline-block" />
          Prescription Analytics
        </h2>

        <div className="space-y-4">
          {/* Submissions per day */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#184363] mb-4">Submissions Per Day — Last 30 Days</h3>
            {analyticsLoading ? (
              <div className="h-32 bg-neutral-100 rounded animate-pulse" />
            ) : !analytics?.prescriptionsByDay ? (
              <p className="text-sm text-neutral-400">No data.</p>
            ) : (() => {
              const max = Math.max(...analytics.prescriptionsByDay.map(d => d.count), 1)
              return (
                <>
                  <div className="flex items-end gap-0.5 h-32">
                    {analytics.prescriptionsByDay.map((d, i) => (
                      <div key={i} className="flex-1 group relative h-full flex items-end">
                        <div
                          className="w-full bg-[#009eb9]/70 hover:bg-[#009eb9] rounded-t-sm transition-colors"
                          style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 2 : 0)}%` }}
                        />
                        {d.count > 0 && (
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#184363] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                            {d.date.slice(5)} · {d.count}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>{analytics.prescriptionsByDay[0]?.date.slice(5)}</span>
                    <span>{analytics.prescriptionsByDay[analytics.prescriptionsByDay.length - 1]?.date.slice(5)}</span>
                  </div>
                </>
              )
            })()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Status Funnel */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-4">Status Pipeline</h3>
              {analyticsLoading ? <LoadingBlock h="h-32" /> : (
                <div className="space-y-2">
                  {funnelData.map(({ status, label, count }) => (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-neutral-600">{label}</span>
                        <span className="font-bold text-[#184363]">{count}</span>
                      </div>
                      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#009eb9] rounded-full transition-all duration-500"
                          style={{ width: `${(count / funnelMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avg Age by Status */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-4">Avg Time in Status (Active Scripts)</h3>
              {avgAgeByStatus.length === 0 ? (
                <p className="text-sm text-neutral-400">No active prescriptions.</p>
              ) : (
                <div className="space-y-3">
                  {avgAgeByStatus.map(({ status, label, avgHours, count }) => (
                    <div key={status} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">{label}</p>
                        <p className="text-xs text-neutral-400">{count} prescription{count !== 1 ? 's' : ''}</p>
                      </div>
                      <span className={`text-lg font-extrabold ${avgHours > 8 ? 'text-red-500' : avgHours > 2 ? 'text-amber-500' : 'text-green-500'}`}>
                        {avgHours < 1 ? `${Math.round(avgHours * 60)}m` : `${avgHours.toFixed(1)}h`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Per-Store Comparison (franchise admin) */}
          {role === 'franchise_admin' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-4">Prescriptions by Store</h3>
              {storeData.length === 0 ? (
                <p className="text-sm text-neutral-400">No store data.</p>
              ) : (
                <div className="space-y-3">
                  {storeData.map(({ name, count }) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-neutral-600 truncate pr-2">{name}</span>
                        <span className="font-bold text-[#184363] shrink-0">{count}</span>
                      </div>
                      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#184363] rounded-full transition-all duration-500"
                          style={{ width: `${(count / storeMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Store Status Breakdown (store manager) */}
          {role === 'store_manager' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-4">My Store — Status Breakdown</h3>
              {storeBreakdown.length === 0 ? (
                <p className="text-sm text-neutral-400">No prescriptions yet.</p>
              ) : (
                <div className="space-y-3">
                  {storeBreakdown.map(({ status, label, count, pct }) => (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-neutral-600">{label}</span>
                        <span className="font-bold text-[#184363]">{count} ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#009eb9] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Commerce Analytics ── */}
      <section>
        <h2 className="text-lg font-extrabold text-[#184363] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#184363] rounded-full inline-block" />
          Commerce Analytics
          {role === 'store_manager' && <span className="text-xs font-normal text-neutral-400 ml-1">(all branches)</span>}
        </h2>

        {analyticsLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <LoadingBlock key={i} h="h-24" />)}
            </div>
            <LoadingBlock />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LoadingBlock /><LoadingBlock />
            </div>
          </div>
        ) : !analytics?.kpis ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-400">
            Failed to load commerce analytics.
          </div>
        ) : (
          <div className="space-y-4">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today's Revenue", value: `R ${analytics.kpis.today.toFixed(2)}`, color: 'text-[#009eb9]' },
                { label: 'This Month', value: `R ${analytics.kpis.thisMonth.toFixed(2)}`, color: 'text-[#184363]' },
                {
                  label: 'MoM Growth',
                  value: analytics.kpis.growthPct !== null ? `${analytics.kpis.growthPct > 0 ? '+' : ''}${analytics.kpis.growthPct}%` : '—',
                  color: analytics.kpis.growthPct !== null && analytics.kpis.growthPct >= 0 ? 'text-green-600' : 'text-red-500',
                },
                { label: 'Total Orders', value: analytics.kpis.totalOrders.toString(), color: 'text-[#184363]' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">{label}</p>
                  <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#184363] mb-4">Revenue — Last 30 Days (Completed Orders)</h3>
              {analytics.revenueByDay.every(d => d.revenue === 0) ? (
                <p className="text-sm text-neutral-400 text-center py-6">No completed orders yet.</p>
              ) : (() => {
                const max = Math.max(...analytics.revenueByDay.map(d => d.revenue), 1)
                return (
                  <>
                    <div className="flex items-end gap-0.5 h-32">
                      {analytics.revenueByDay.map((d, i) => (
                        <div key={i} className="flex-1 group relative h-full flex items-end">
                          <div
                            className="w-full bg-[#184363]/70 hover:bg-[#184363] rounded-t-sm transition-colors"
                            style={{ height: `${Math.max((d.revenue / max) * 100, d.revenue > 0 ? 2 : 0)}%` }}
                          />
                          {d.revenue > 0 && (
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#184363] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                              {d.date.slice(5)}<br />R {d.revenue.toFixed(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>{analytics.revenueByDay[0]?.date.slice(5)}</span>
                      <span>{analytics.revenueByDay[analytics.revenueByDay.length - 1]?.date.slice(5)}</span>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Orders by Status */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#184363] mb-4">Orders by Status</h3>
                {analytics.ordersByStatus.length === 0 ? (
                  <p className="text-sm text-neutral-400">No orders yet.</p>
                ) : (
                  <div className="space-y-2">
                    {analytics.ordersByStatus.map(({ status, count, total }) => (
                      <div key={status} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-neutral-700 font-medium">{status.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-400">R {total.toFixed(2)}</span>
                          <span className="inline-block min-w-[28px] text-center px-2 py-0.5 bg-[#009eb9]/10 text-[#009eb9] font-bold rounded-full text-xs">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Growth */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#184363] mb-4">New Customers — Last 6 Months</h3>
                {analytics.customerGrowth.every(m => m.new_customers === 0) ? (
                  <p className="text-sm text-neutral-400">No customer data yet.</p>
                ) : (() => {
                  const max = Math.max(...analytics.customerGrowth.map(m => m.new_customers), 1)
                  return (
                    <div className="flex items-end gap-2 h-24">
                      {analytics.customerGrowth.map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-[#009eb9]/60 hover:bg-[#009eb9] rounded-t-sm transition-colors"
                            style={{ height: `${Math.max((m.new_customers / max) * 80, m.new_customers > 0 ? 4 : 0)}px` }}
                          />
                          <span className="text-[10px] text-neutral-400">{m.month.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-[#184363]">Top 10 Products by Revenue</h3>
              </div>
              {analytics.topProducts.length === 0 ? (
                <p className="text-sm text-neutral-400 p-6">No order item data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">#</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Product</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-500 uppercase tracking-wide">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {analytics.topProducts.map((p, i) => (
                        <tr key={i} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3 text-xs text-neutral-400 font-bold">{i + 1}</td>
                          <td className="px-6 py-3 text-sm text-[#184363] font-semibold">{p.product_name}</td>
                          <td className="px-6 py-3 text-sm text-center text-neutral-600">{p.qty}</td>
                          <td className="px-6 py-3 text-sm text-right font-bold text-[#009eb9]">R {p.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-[#184363]">Recent Orders</h3>
              </div>
              {analytics.recentOrders.length === 0 ? (
                <p className="text-sm text-neutral-400 p-6">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Total</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wide">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {analytics.recentOrders.map(o => (
                        <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3 text-sm font-bold text-[#184363]">#{o.number}</td>
                          <td className="px-6 py-3 text-sm text-neutral-600">{o.billing_name || '—'}</td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 capitalize">{o.status}</span>
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-right text-[#009eb9]">R {o.total.toFixed(2)}</td>
                          <td className="px-6 py-3 text-xs text-neutral-400 text-right">{new Date(o.date_created).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/manager/dashboard/sections/AnalyticsSection.tsx
git commit -m "feat: add AnalyticsSection with prescription funnel, trends, per-store chart, and commerce analytics"
```

---

## Task 8: StoresSection (Franchise Admin)

**Files:**
- Create: `app/manager/dashboard/sections/StoresSection.tsx`

**Interfaces:**
- Consumes: `Prescription`, `Pharmacy` from `../types`
- Produces: `<StoresSection prescriptions pharmacies />` — consumed by Task 9 only

- [ ] **Step 1: Create `app/manager/dashboard/sections/StoresSection.tsx`**

```tsx
'use client'

import { useMemo } from 'react'
import { Prescription, Pharmacy } from '../types'

type Props = {
  prescriptions: Prescription[]
  pharmacies: Pharmacy[]
}

const STATUSES = ['submitted', 'verifying', 'dispensing', 'ready_collect', 'completed']

export default function StoresSection({ prescriptions, pharmacies }: Props) {
  const rows = useMemo(() => {
    return pharmacies.map(ph => {
      const store = prescriptions.filter(p => p.preferred_pharmacy_id === ph.id)
      return {
        id: ph.id,
        name: ph.name,
        city: ph.city,
        total: store.length,
        submitted: store.filter(p => p.status === 'submitted').length,
        verifying: store.filter(p => p.status === 'verifying').length,
        dispensing: store.filter(p => p.status === 'dispensing').length,
        ready_collect: store.filter(p => p.status === 'ready_collect').length,
        completed: store.filter(p => p.status === 'completed').length,
      }
    }).sort((a, b) => b.total - a.total)
  }, [pharmacies, prescriptions])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Store Performance</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Prescription breakdown by pharmacy</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wide">Store</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-neutral-500 uppercase tracking-wide">Total</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-yellow-600 uppercase tracking-wide">Submitted</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wide">Verifying</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-indigo-600 uppercase tracking-wide">Dispensing</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-green-600 uppercase tracking-wide">Ready</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-neutral-400 uppercase tracking-wide">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#184363]">{row.name}</p>
                    <p className="text-xs text-neutral-400">{row.city}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-[#009eb9]">{row.total}</td>
                  <td className="px-6 py-4 text-center font-bold text-yellow-600">{row.submitted}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">{row.verifying}</td>
                  <td className="px-6 py-4 text-center font-bold text-indigo-600">{row.dispensing}</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">{row.ready_collect}</td>
                  <td className="px-6 py-4 text-center font-bold text-neutral-400">{row.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/manager/dashboard/sections/StoresSection.tsx
git commit -m "feat: add StoresSection with per-pharmacy prescription breakdown table"
```

---

## Task 9: Rewrite FranchiseAdminDashboard

**Files:**
- Rewrite: `app/manager/dashboard/FranchiseAdminDashboard.tsx`

**Interfaces:**
- Consumes: all components and sections from Tasks 3–8
- Produces: `<FranchiseAdminDashboard initialManager={Manager} />` — already consumed by `app/manager/dashboard/page.tsx` (unchanged)

- [ ] **Step 1: Replace the full contents of `app/manager/dashboard/FranchiseAdminDashboard.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Manager, Prescription, Pharmacy, Analytics } from './types'
import { managerSignOut } from '../actions'
import ManagerSidebar from './components/ManagerSidebar'
import PrescriptionTable from './components/PrescriptionTable'
import PrescriptionModal from './components/PrescriptionModal'
import OverviewSection from './sections/OverviewSection'
import AnalyticsSection from './sections/AnalyticsSection'
import StoresSection from './sections/StoresSection'

type Section = 'overview' | 'prescriptions' | 'analytics' | 'stores'

export default function FranchiseAdminDashboard({ initialManager }: { initialManager: Manager }) {
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadData()
    fetch('/api/manager/analytics')
      .then(r => r.json())
      .then(setAnalytics)
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
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = async (id: string, status: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await loadData()
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009eb9] mx-auto mb-4" />
          <p className="text-neutral-600">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar
        role="franchise_admin"
        activeSection={activeSection}
        onNavigate={s => setActiveSection(s as Section)}
        manager={initialManager}
      />

      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {activeSection === 'overview' && (
            <OverviewSection
              prescriptions={prescriptions}
              pharmacies={pharmacies}
              analytics={analytics}
              analyticsLoading={analyticsLoading}
            />
          )}
          {activeSection === 'prescriptions' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-[#184363]">All Prescriptions</h1>
                <p className="text-neutral-500 text-sm mt-0.5">Network-wide · {prescriptions.length} total</p>
              </div>
              <PrescriptionTable
                prescriptions={prescriptions}
                pharmacies={pharmacies}
                role="franchise_admin"
                onQuickAction={handleQuickAction}
                onRowClick={p => { setSelectedPrescription(p); setShowModal(true) }}
              />
            </div>
          )}
          {activeSection === 'analytics' && (
            <AnalyticsSection
              prescriptions={prescriptions}
              pharmacies={pharmacies}
              analytics={analytics}
              analyticsLoading={analyticsLoading}
              role="franchise_admin"
            />
          )}
          {activeSection === 'stores' && (
            <StoresSection prescriptions={prescriptions} pharmacies={pharmacies} />
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
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser as franchise admin**

Log in as franchise_admin. Confirm:
- Overview tab loads as the landing page with KPI strip, store cards, sparkline, activity feed
- Prescriptions tab shows the table with search/filters/pagination
- Analytics tab shows both prescription analytics and commerce analytics
- Stores tab shows the per-pharmacy table
- Sidebar nav highlights the active section
- Mobile: bottom tab bar appears instead of sidebar (shrink browser < 1024px to test)
- Sign Out button works

- [ ] **Step 3: Commit**

```bash
git add app/manager/dashboard/FranchiseAdminDashboard.tsx
git commit -m "feat: rewrite FranchiseAdminDashboard as sidebar shell with Overview, Prescriptions, Analytics, Stores sections"
```

---

## Task 10: Rewrite StoreManagerDashboard

**Files:**
- Rewrite: `app/manager/dashboard/StoreManagerDashboard.tsx`

**Interfaces:**
- Consumes: `ManagerSidebar`, `PrescriptionTable`, `PrescriptionModal`, `AnalyticsSection` from Tasks 3–5, 7
- Produces: `<StoreManagerDashboard initialManager={Manager} />` — already consumed by `app/manager/dashboard/page.tsx` (unchanged)

- [ ] **Step 1: Replace the full contents of `app/manager/dashboard/StoreManagerDashboard.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Manager, Prescription, Pharmacy, Analytics } from './types'
import { managerSignOut } from '../actions'
import ManagerSidebar from './components/ManagerSidebar'
import PrescriptionTable from './components/PrescriptionTable'
import PrescriptionModal from './components/PrescriptionModal'
import AnalyticsSection from './sections/AnalyticsSection'

type Section = 'prescriptions' | 'analytics'

export default function StoreManagerDashboard({ initialManager }: { initialManager: Manager }) {
  const [activeSection, setActiveSection] = useState<Section>('prescriptions')
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadData()
    fetch('/api/manager/analytics')
      .then(r => r.json())
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setAnalyticsLoading(false))
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/manager/prescriptions')
      if (res.ok) setPrescriptions(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = async (id: string, status: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await loadData()
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch(`/api/manager/prescriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await loadData()
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009eb9] mx-auto mb-4" />
          <p className="text-neutral-600">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerSidebar
        role="store_manager"
        activeSection={activeSection}
        onNavigate={s => setActiveSection(s as Section)}
        manager={initialManager}
      />

      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {activeSection === 'prescriptions' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-[#184363]">
                  {initialManager.pharmacy?.name ?? 'Your Store'}
                </h1>
                <p className="text-neutral-500 text-sm mt-0.5">
                  {initialManager.pharmacy?.city} · {initialManager.name} · {prescriptions.length} prescriptions
                </p>
              </div>
              <PrescriptionTable
                prescriptions={prescriptions}
                pharmacies={[]}
                role="store_manager"
                onQuickAction={handleQuickAction}
                onRowClick={p => { setSelectedPrescription(p); setShowModal(true) }}
              />
            </div>
          )}
          {activeSection === 'analytics' && (
            <AnalyticsSection
              prescriptions={prescriptions}
              pharmacies={[]}
              analytics={analytics}
              analyticsLoading={analyticsLoading}
              role="store_manager"
            />
          )}
        </div>
      </main>

      {showModal && selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          pharmacies={[]}
          role="store_manager"
          onClose={() => setShowModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser as store_manager**

Log in as a store_manager. Confirm:
- Prescriptions tab is the landing page, shows store name + city in header
- Table has no Store column (store_manager role)
- Age pills coloured correctly
- Quick Action buttons fire and update the row status
- Clicking a row opens the modal — no reassign section visible
- Analytics tab shows prescription sub-section (status breakdown, funnel, avg age) + commerce analytics
- Sidebar shows 2 nav items only
- Mobile bottom bar shows 2 icons

- [ ] **Step 3: Final smoke test — both roles**

Check both roles do not show console errors. Pay attention to:
- `analytics.prescriptionsByDay` is defined (not undefined) — Task 2 must be complete
- No RLS errors (all data fetched via API routes)
- TypeScript: `npx tsc --noEmit` passes with no new errors

- [ ] **Step 4: Commit**

```bash
git add app/manager/dashboard/StoreManagerDashboard.tsx
git commit -m "feat: rewrite StoreManagerDashboard as sidebar shell with Prescriptions and Analytics sections"
```
