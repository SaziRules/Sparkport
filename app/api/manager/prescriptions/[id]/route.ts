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

async function verifyManager() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await admin()
    .from('managers')
    .select('role')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()

  return data
}

// GET /api/manager/prescriptions/[id]
// Returns { imageUrl, deliveryAddress } using service role (bypasses RLS)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const manager = await verifyManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = admin()

  // Get prescription image
  const { data: imageRow } = await db
    .from('prescription_images')
    .select('storage_path')
    .eq('prescription_id', id)
    .limit(1)
    .single()

  let imageUrl: string | null = null
  if (imageRow?.storage_path) {
    const { data: urlData } = await db.storage
      .from('prescription-images')
      .createSignedUrl(imageRow.storage_path, 3600)
    imageUrl = urlData?.signedUrl ?? null
  }

  // Get delivery address via prescription's delivery_address_id
  const { data: prescription } = await db
    .from('prescriptions')
    .select('delivery_address_id')
    .eq('id', id)
    .single()

  let deliveryAddress = null
  if (prescription?.delivery_address_id) {
    const { data: addr } = await db
      .from('delivery_addresses')
      .select('*')
      .eq('id', prescription.delivery_address_id)
      .single()
    deliveryAddress = addr ?? null
  }

  return NextResponse.json({ imageUrl, deliveryAddress })
}

// PATCH /api/manager/prescriptions/[id]
// Body: { status } or { preferred_pharmacy_id }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const manager = await verifyManager()
  if (!manager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const updates: Record<string, string> = { updated_at: new Date().toISOString() }
  if (body.status) updates.status = body.status
  if (body.preferred_pharmacy_id) updates.preferred_pharmacy_id = body.preferred_pharmacy_id

  const { error } = await admin()
    .from('prescriptions')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
