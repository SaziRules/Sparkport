export function getAgeInfo(updatedAt: string): { label: string; colorClass: string } {
  const ms = Date.now() - new Date(updatedAt).getTime()
  const totalMins = Math.floor(ms / 60000)

  if (totalMins < 60) {
    return {
      label: `${totalMins}m`,
      colorClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    }
  }

  const totalHours = ms / 3600000
  if (totalHours < 24) {
    const h = totalHours.toFixed(1)
    if (totalHours < 8)
      return { label: `${h}h`, colorClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' }
    return { label: `${h}h`, colorClass: 'bg-red-50 text-red-700 ring-1 ring-red-200' }
  }

  const days = Math.floor(totalHours / 24)
  const remHours = Math.floor(totalHours % 24)
  const label = remHours > 0 ? `${days}d ${remHours}h` : `${days}d`
  return { label, colorClass: 'bg-red-100 text-red-800 ring-1 ring-red-300' }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'submitted':    return 'border-yellow-300 bg-yellow-50 text-yellow-700'
    case 'verifying':   return 'border-blue-300 bg-blue-50 text-blue-700'
    case 'verified':    return 'border-purple-300 bg-purple-50 text-purple-700'
    case 'dispensing':  return 'border-indigo-300 bg-indigo-50 text-indigo-700'
    case 'ready_collect': return 'border-green-300 bg-green-50 text-green-700'
    case 'out_delivery':  return 'border-cyan-300 bg-cyan-50 text-cyan-700'
    case 'completed':   return 'border-neutral-300 bg-neutral-50 text-neutral-600'
    case 'rejected':    return 'border-red-300 bg-red-50 text-red-700'
    case 'cancelled':   return 'border-neutral-300 bg-neutral-50 text-neutral-500'
    default:            return 'border-neutral-300 bg-neutral-50 text-neutral-600'
  }
}

export const STATUS_TRANSITIONS: Record<string, { next: string; label: string }> = {
  submitted:    { next: 'verifying',    label: 'Process' },
  verifying:    { next: 'dispensing',   label: 'Process' },
  dispensing:   { next: 'ready_collect', label: 'Process' },
  ready_collect: { next: 'completed',   label: 'Process' },
}

export function getRelativeTime(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return days === 1 ? 'yesterday' : `${days}d ago`
}

export function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name[0]?.toUpperCase() ?? '?'
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}
