import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const WC_BASE = process.env.NEXT_PUBLIC_WP_API_URL + '/wc/v3';
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;
const WC_AUTH = 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function calculateTier(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (points >= 5000) return 'platinum';
  if (points >= 2000) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
}

async function wcFetch(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${WC_BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), { headers: { Authorization: WC_AUTH } });
  if (!res.ok) throw new Error(`WC API error ${res.status}: ${url}`);
  return res.json();
}

async function paginate<T>(endpoint: string, perPage = 100): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  while (true) {
    const batch: T[] = await wcFetch(endpoint, { per_page: perPage, page });
    if (!batch.length) break;
    results.push(...batch);
    console.log(`  ${endpoint} — page ${page}: ${batch.length} records`);
    if (batch.length < perPage) break;
    page++;
  }
  return results;
}

// ─── Upsert orders ───────────────────────────────────────────────────────────

async function upsertOrders(orders: any[]) {
  let upserted = 0;
  for (const o of orders) {
    await supabase.from('wc_orders').upsert({
      id: o.id,
      number: o.number,
      status: o.status,
      customer_email: o.billing?.email ?? '',
      customer_wc_id: o.customer_id || null,
      billing_name: `${o.billing?.first_name ?? ''} ${o.billing?.last_name ?? ''}`.trim(),
      billing_city: o.billing?.city ?? null,
      payment_method: o.payment_method_title ?? null,
      total: parseFloat(o.total ?? '0'),
      subtotal: o.line_items?.reduce((sum: number, i: any) => sum + parseFloat(i.subtotal ?? '0'), 0) ?? null,
      discount: parseFloat(o.discount_total ?? '0'),
      date_created: o.date_created,
      date_modified: o.date_modified,
      raw: o,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (o.line_items?.length) {
      await supabase.from('wc_order_items').delete().eq('order_id', o.id);
      await supabase.from('wc_order_items').insert(
        o.line_items.map((item: any) => ({
          order_id: o.id,
          product_id: item.product_id,
          product_name: item.name,
          quantity: item.quantity,
          line_total: parseFloat(item.total ?? '0'),
          image_url: item.image?.src ?? null,
        }))
      );
    }
    upserted++;
  }
  return upserted;
}

// ─── Upsert customers ────────────────────────────────────────────────────────

async function upsertCustomers(customers: any[]) {
  let upserted = 0;
  for (const c of customers) {
    if (!c.id || !c.email) continue;
    await supabase.from('wc_customers').upsert({
      wc_id: c.id,
      email: c.email,
      first_name: c.first_name ?? null,
      last_name: c.last_name ?? null,
      orders_count: c.orders_count ?? 0,
      total_spent: parseFloat(c.total_spent ?? '0'),
      date_registered: c.date_created ?? null,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'wc_id' });
    upserted++;
  }
  return upserted;
}

// ─── Backfill points for historical completed orders ─────────────────────────

async function backfillPoints() {
  const { data: completedOrders, error } = await supabase
    .from('wc_orders')
    .select('id, number, total, customer_email')
    .eq('status', 'completed');

  if (error || !completedOrders) {
    console.error('Failed to fetch completed orders:', error);
    return;
  }

  console.log(`\nBackfilling points for ${completedOrders.length} completed orders...`);
  let awarded = 0;
  let skipped = 0;

  for (const order of completedOrders) {
    // Find Supabase user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', order.customer_email)
      .single();

    if (!profile) { skipped++; continue; }

    const reference = order.id.toString();

    // Skip if already awarded
    const { data: existing } = await supabase
      .from('rewards_transactions')
      .select('id')
      .eq('user_id', profile.id)
      .eq('reference', reference)
      .eq('type', 'order_completed')
      .single();

    if (existing) { skipped++; continue; }

    const points = Math.floor(order.total);

    await supabase.from('rewards_transactions').insert({
      user_id: profile.id,
      points,
      type: 'order_completed',
      description: `Order #${order.number} completed`,
      reference,
    });

    const { data: current } = await supabase
      .from('rewards')
      .select('points')
      .eq('user_id', profile.id)
      .single();

    const newTotal = (current?.points ?? 0) + points;
    await supabase.from('rewards').upsert({
      user_id: profile.id,
      points: newTotal,
      tier: calculateTier(newTotal),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    awarded++;
  }

  console.log(`Points backfill done — awarded: ${awarded}, skipped (guest/already done): ${skipped}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Sparkport WooCommerce Backfill ===\n');

  console.log('Fetching orders from WooCommerce...');
  const orders = await paginate<any>('orders');
  console.log(`Total orders fetched: ${orders.length}`);
  const orderCount = await upsertOrders(orders);
  console.log(`Orders upserted: ${orderCount}\n`);

  console.log('Fetching customers from WooCommerce...');
  const customers = await paginate<any>('customers');
  console.log(`Total customers fetched: ${customers.length}`);
  const customerCount = await upsertCustomers(customers);
  console.log(`Customers upserted: ${customerCount}\n`);

  await backfillPoints();

  console.log('\n=== Backfill complete ===');
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
