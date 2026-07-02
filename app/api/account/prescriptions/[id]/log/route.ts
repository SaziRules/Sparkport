import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ROLE_LABELS: Record<string, string> = {
  franchise_admin: 'Pharmacist',
  store_manager: 'Pharmacist',
  system: 'System',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  verifying: 'Under Review',
  verified: 'Verified',
  dispensing: 'Being Prepared',
  ready_collect: 'Ready to Collect',
  out_delivery: 'Out for Delivery',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  on_hold: 'On Hold',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { data: prescription } = await admin()
    .from('prescriptions')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!prescription || prescription.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data, error } = await admin()
    .from('prescription_status_log')
    .select('id, status, actor_role, note, created_at')
    .eq('prescription_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const entries = (data ?? []).map(row => ({
    id: row.id,
    status: STATUS_LABELS[row.status] ?? row.status,
    actor: ROLE_LABELS[row.actor_role ?? ''] ?? 'Pharmacist',
    note: row.note ?? null,
    created_at: row.created_at,
  }))

  return NextResponse.json(entries)
}
