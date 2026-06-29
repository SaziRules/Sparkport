import { createClient } from '@supabase/supabase-js'
import { calculateTier } from '@/lib/rewards'

export interface WcWebhookOrder {
  id: number
  number: string
  status: string
  total: string
  subtotal?: string
  discount_total?: string
  billing: {
    first_name: string
    last_name: string
    email: string
    city: string
  }
  payment_method_title: string
  date_created: string
  date_modified: string
  customer_id: number
  line_items: Array<{
    product_id: number
    name: string
    quantity: number
    total: string
    image?: { src: string }
  }>
}

export interface WcWebhookCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  date_created: string
  orders_count?: number
  total_spent?: string
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function upsertOrder(order: WcWebhookOrder): Promise<void> {
  const supabase = serviceClient()

  await supabase.from('wc_orders').upsert({
    id: order.id,
    number: order.number,
    status: order.status,
    customer_email: order.billing.email,
    customer_wc_id: order.customer_id || null,
    billing_name: `${order.billing.first_name} ${order.billing.last_name}`.trim(),
    billing_city: order.billing.city,
    payment_method: order.payment_method_title,
    total: parseFloat(order.total),
    subtotal: order.subtotal ? parseFloat(order.subtotal) : null,
    discount: order.discount_total ? parseFloat(order.discount_total) : 0,
    date_created: order.date_created,
    date_modified: order.date_modified,
    raw: order,
    synced_at: new Date().toISOString(),
  }, { onConflict: 'id' })

  // Replace line items
  await supabase.from('wc_order_items').delete().eq('order_id', order.id)

  if (order.line_items?.length) {
    await supabase.from('wc_order_items').insert(
      order.line_items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        line_total: parseFloat(item.total),
        image_url: item.image?.src ?? null,
      }))
    )
  }

  // Mirror customer if this is a registered WC customer
  if (order.customer_id > 0) {
    await supabase.from('wc_customers').upsert({
      wc_id: order.customer_id,
      email: order.billing.email,
      first_name: order.billing.first_name,
      last_name: order.billing.last_name,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'wc_id' })
  }
}

export async function upsertCustomer(customer: WcWebhookCustomer): Promise<void> {
  const supabase = serviceClient()

  await supabase.from('wc_customers').upsert({
    wc_id: customer.id,
    email: customer.email,
    first_name: customer.first_name,
    last_name: customer.last_name,
    orders_count: customer.orders_count ?? 0,
    total_spent: customer.total_spent ? parseFloat(customer.total_spent) : 0,
    date_registered: customer.date_created,
    synced_at: new Date().toISOString(),
  }, { onConflict: 'wc_id' })
}

export async function awardOrderPoints(order: WcWebhookOrder): Promise<void> {
  const supabase = serviceClient()

  // Find Supabase user by email via profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', order.billing.email)
    .single()

  if (!profile) return // guest order, no rewards

  const reference = order.id.toString()

  // Idempotency — skip if already awarded for this order
  const { data: existing } = await supabase
    .from('rewards_transactions')
    .select('id')
    .eq('user_id', profile.id)
    .eq('reference', reference)
    .eq('type', 'order_completed')
    .single()

  if (existing) return

  const points = Math.floor(parseFloat(order.total))

  await supabase.from('rewards_transactions').insert({
    user_id: profile.id,
    points,
    type: 'order_completed',
    description: `Order #${order.number} completed`,
    reference,
  })

  const { data: current } = await supabase
    .from('rewards')
    .select('points')
    .eq('user_id', profile.id)
    .single()

  const newTotal = (current?.points ?? 0) + points

  await supabase.from('rewards').upsert({
    user_id: profile.id,
    points: newTotal,
    tier: calculateTier(newTotal),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
}
