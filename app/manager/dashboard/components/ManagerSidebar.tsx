'use client'

import { Manager } from '../types'
import { managerSignOut } from '../../actions'
import { getInitials } from '../utils'

type SidebarStats = {
  pending: number
  active: number
  completed: number
  total: number
  stores?: number
  todayRevenue?: number | null
}

type Props = {
  role: 'franchise_admin' | 'store_manager'
  activeSection: string
  onNavigate: (section: string) => void
  manager: Manager
  stats?: SidebarStats
}

type NavItem = {
  section: string
  label: string
  short: string
  soon?: boolean
  roles?: ('franchise_admin' | 'store_manager')[]
  icon: React.ReactNode
}

const MAIN_NAV: NavItem[] = [
  {
    section: 'dashboard',
    label: 'Dashboard',
    short: 'Home',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    section: 'prescriptions',
    label: 'Prescriptions',
    short: 'Rx',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    section: 'orders',
    label: 'Orders',
    short: 'Orders',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    section: 'stores',
    label: 'Stores',
    short: 'Stores',
    roles: ['franchise_admin'],
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    section: 'promotions',
    label: 'Promotions',
    short: 'Promo',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18M3 19.5h18M21 4.5v15" />
      </svg>
    ),
  },
]

const BUSINESS_NAV: NavItem[] = [
  {
    section: 'subscriptions',
    label: 'Subscriptions',
    short: 'Subs',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    section: 'enquiries',
    label: 'Enquiries',
    short: 'Msgs',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    section: 'rewards',
    label: 'Rewards',
    short: 'Pts',
    soon: true,
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
]

function NavButton({
  item,
  active,
  pending,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  pending?: number
  onNavigate: (s: string) => void
}) {
  return (
    <button
      onClick={() => onNavigate(item.section)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
        active
          ? 'bg-[#009eb9] text-white font-semibold shadow-[0_2px_8px_rgba(0,158,185,0.30)]'
          : item.soon
          ? 'text-neutral-300 cursor-not-allowed'
          : 'text-neutral-500 hover:bg-slate-50 hover:text-[#184363] font-medium'
      }`}
      disabled={item.soon}
      title={item.soon ? 'Coming soon' : undefined}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1 text-left truncate">{item.label}</span>
      {pending !== undefined && pending > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
          active ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'
        }`}>
          {pending}
        </span>
      )}
      {item.soon && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-400 shrink-0">
          SOON
        </span>
      )}
    </button>
  )
}

export default function ManagerSidebar({ role, activeSection, onNavigate, manager, stats }: Props) {
  const visibleMainNav = MAIN_NAV.filter(item => !item.roles || item.roles.includes(role))
  const allNavItems = [...visibleMainNav, ...BUSINESS_NAV]

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 flex-col z-30">
        {/* Brand */}
        <div className="px-5 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#184363] leading-none">Sparkport</p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5 leading-none">Manager Portal</p>
            </div>
          </div>
        </div>

        {/* Manager profile */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(manager.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#184363] truncate leading-tight">{manager.name}</p>
              <p className="text-[10px] text-neutral-400 truncate leading-tight">
                {role === 'franchise_admin' ? 'Franchise Admin' : manager.pharmacy?.name ?? 'Store Manager'}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] px-3 mb-2">Main</p>
          {visibleMainNav.map(item => (
            <NavButton
              key={item.section}
              item={item}
              active={activeSection === item.section}
              pending={item.section === 'prescriptions' && stats ? stats.pending : undefined}
              onNavigate={onNavigate}
            />
          ))}

          <div className="pt-4 pb-1">
            <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.1em] px-3 mb-2">Business</p>
            {BUSINESS_NAV.map(item => (
              <NavButton
                key={item.section}
                item={item}
                active={activeSection === item.section}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-slate-100">
          <form action={managerSignOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile bottom bar ─────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex lg:hidden z-40">
        {allNavItems.slice(0, 5).map(item => {
          const isPending = item.section === 'prescriptions' && stats && stats.pending > 0
          return (
            <button
              key={item.section}
              onClick={() => !item.soon && onNavigate(item.section)}
              disabled={item.soon}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 relative transition-colors ${
                activeSection === item.section
                  ? 'text-[#009eb9]'
                  : item.soon
                  ? 'text-neutral-200'
                  : 'text-neutral-400'
              }`}
            >
              {isPending && (
                <span className="absolute top-1.5 right-[22%] w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
              {item.icon}
              <span className="text-[9px] font-bold">{item.short}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
