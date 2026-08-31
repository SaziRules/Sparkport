'use client'

import { useEffect, useState } from 'react'

type Profile = { first_name: string | null; last_name: string | null; email: string | null; member_number: string | null }
type TxProfile = { first_name: string | null; last_name: string | null; email: string | null }

type TopEarner = {
  user_id: string
  points: number
  tier: string
  profiles: Profile | Profile[] | null
}

type Transaction = {
  id: string
  user_id: string
  points: number
  type: string
  description: string | null
  created_at: string
  profiles: TxProfile | TxProfile[] | null
}

type RewardsData = {
  kpis: { totalMembers: number; totalPoints: number; avgPoints: number }
  tierCounts: Record<string, number>
  topEarners: TopEarner[]
  recentTransactions: Transaction[]
}

const TIER_STYLES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  bronze:   { label: 'Bronze',   bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  silver:   { label: 'Silver',   bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400' },
  gold:     { label: 'Gold',     bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-500' },
  platinum: { label: 'Platinum', bg: 'bg-cyan-50',    text: 'text-cyan-700',    dot: 'bg-cyan-500' },
}

const TX_TYPE_STYLE: Record<string, { label: string; color: string; sign: string }> = {
  signup:   { label: 'Welcome Bonus', color: 'text-green-600', sign: '+' },
  purchase: { label: 'Purchase',      color: 'text-green-600', sign: '+' },
  redeem:   { label: 'Redemption',    color: 'text-red-500',   sign: '−' },
  manual:   { label: 'Manual',        color: 'text-blue-600',  sign: '+' },
  expiry:   { label: 'Expiry',        color: 'text-neutral-400', sign: '−' },
}

function getProfile<T extends Profile | TxProfile>(p: T | T[] | null): T | null {
  if (!p) return null
  return Array.isArray(p) ? (p[0] ?? null) : p
}

function memberName(p: Profile | TxProfile | null) {
  if (!p) return '—'
  const n = [p.first_name, p.last_name].filter(Boolean).join(' ')
  return n || p.email || '—'
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function KpiCard({ label, value, sub, icon, accent }: {
  label: string; value: string | number; sub?: string; icon: React.ReactNode; accent: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(24,67,99,0.06),0_6px_20px_rgba(24,67,99,0.04)]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
        {icon}
      </div>
      <p className="text-3xl font-extrabold text-[#184363] leading-none mb-1">{value.toLocaleString()}</p>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-neutral-300 mt-1">{sub}</p>}
    </div>
  )
}

export default function RewardsSection() {
  const [data, setData] = useState<RewardsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tierFilter, setTierFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/manager/rewards')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin w-8 h-8 border-2 border-[#009eb9] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-neutral-400">Failed to load rewards data.</div>
    )
  }

  const filteredEarners = tierFilter === 'all'
    ? data.topEarners
    : data.topEarners.filter(e => e.tier === tierFilter)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#184363]">Rewards Programme</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Member overview, tier distribution, and transaction history</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Active Members"
          value={data.kpis.totalMembers}
          sub="enrolled in rewards"
          accent="bg-[#009eb9]/10"
          icon={
            <svg className="w-5 h-5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Total Points Issued"
          value={data.kpis.totalPoints}
          sub="across all members"
          accent="bg-amber-50"
          icon={
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          }
        />
        <KpiCard
          label="Avg Points / Member"
          value={data.kpis.avgPoints}
          sub="points per enrolled member"
          accent="bg-purple-50"
          icon={
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Tier Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(24,67,99,0.06)]">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-5">Tier Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['bronze', 'silver', 'gold', 'platinum'] as const).map(tier => {
            const s = TIER_STYLES[tier]
            const count = data.tierCounts[tier] ?? 0
            const pct = data.kpis.totalMembers > 0
              ? Math.round((count / data.kpis.totalMembers) * 100)
              : 0
            return (
              <div key={tier} className={`rounded-xl p-4 ${s.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${s.text}`}>{s.label}</span>
                </div>
                <p className={`text-2xl font-extrabold ${s.text}`}>{count}</p>
                <p className={`text-xs mt-0.5 ${s.text} opacity-60`}>{pct}% of members</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Earners */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Top Earners</h2>
          <div className="flex items-center gap-2">
            {(['all', 'bronze', 'silver', 'gold', 'platinum'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all ${
                  tierFilter === t
                    ? 'bg-[#184363] text-white'
                    : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filteredEarners.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-10">No members in this tier yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Member</th>
                  <th className="px-6 py-3 text-left">Member No.</th>
                  <th className="px-6 py-3 text-left">Tier</th>
                  <th className="px-6 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredEarners.map((earner, i) => {
                  const profile = getProfile(earner.profiles)
                  const ts = TIER_STYLES[earner.tier] ?? TIER_STYLES.bronze
                  return (
                    <tr key={earner.user_id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-3.5 text-neutral-300 font-bold">{i + 1}</td>
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-[#184363]">{memberName(profile)}</p>
                        {profile?.email && <p className="text-xs text-neutral-400">{profile.email}</p>}
                      </td>
                      <td className="px-6 py-3.5 text-neutral-500 text-xs font-mono">
                        {profile && 'member_number' in profile ? (profile.member_number ?? '—') : '—'}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ts.bg} ${ts.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ts.dot}`} />
                          {ts.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-extrabold text-[#184363]">
                        {earner.points.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(24,67,99,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Recent Transactions</h2>
        </div>

        {data.recentTransactions.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-10">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                  <th className="px-6 py-3 text-left">Member</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.recentTransactions.map(tx => {
                  const profile = getProfile(tx.profiles)
                  const style = TX_TYPE_STYLE[tx.type] ?? { label: tx.type, color: 'text-neutral-500', sign: '+' }
                  return (
                    <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-[#184363]">{memberName(profile)}</p>
                        {profile?.email && <p className="text-xs text-neutral-400">{profile.email}</p>}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[10px] font-bold uppercase tracking-wider">
                          {style.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-500">{tx.description ?? '—'}</td>
                      <td className="px-6 py-3.5 text-neutral-400 text-xs">{fmt(tx.created_at)}</td>
                      <td className={`px-6 py-3.5 text-right font-extrabold ${style.color}`}>
                        {style.sign}{tx.points.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
