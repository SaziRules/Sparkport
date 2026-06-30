import { createClient } from '@/lib/supabase/server';
import { WC_API, wcAuthHeaders } from '@/lib/wordpress/config';

interface WcLineItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image?: { src: string };
}

interface WcOrder {
  id: number;
  number: string;
  status: string;
  date_created: string;
  date_modified: string;
  total: string;
  subtotal: string;
  currency_symbol: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
    city: string;
  };
  shipping: {
    address_1: string;
    city: string;
    method_title?: string;
  };
  line_items: WcLineItem[];
  payment_method_title: string;
}

const ORDER_PARAMS = {
  orderby: 'date',
  order: 'desc',
  per_page: '50',
} as const;

function buildOrderUrl(extra: Record<string, string>) {
  const url = new URL(`${WC_API}/orders`);
  Object.entries({ ...ORDER_PARAMS, ...extra }).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

function shape(orders: WcOrder[]) {
  return orders.map((o) => ({
    id: o.id,
    number: o.number,
    status: o.status,
    date: o.date_created,
    updated: o.date_modified,
    total: o.total,
    currency_symbol: o.currency_symbol ?? 'R',
    payment_method: o.payment_method_title ?? '',
    billing: {
      name: `${o.billing.first_name} ${o.billing.last_name}`.trim(),
      email: o.billing.email,
      address: [o.billing.address_1, o.billing.city].filter(Boolean).join(', '),
    },
    shipping_address: [o.shipping?.address_1, o.shipping?.city].filter(Boolean).join(', '),
    items: o.line_items?.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      total: item.total,
      image: item.image?.src ?? '',
    })) ?? [],
  }));
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const headers = wcAuthHeaders();

  // 1. Try registered WC customer lookup — most accurate, avoids false-positive search hits
  const customerRes = await fetch(
    `${WC_API}/customers?email=${encodeURIComponent(user.email)}&per_page=1`,
    { headers, cache: 'no-store' }
  );
  const customers = customerRes.ok ? await customerRes.json() as { id: number }[] : [];

  if (customers.length > 0) {
    const res = await fetch(buildOrderUrl({ customer: String(customers[0].id) }), {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) return Response.json({ error: 'Failed to fetch orders' }, { status: res.status });
    return Response.json(shape(await res.json() as WcOrder[]));
  }

  // 2. No WC customer record (guest checkout) — search by email and exact-match filter
  const res = await fetch(buildOrderUrl({ search: user.email }), {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) return Response.json({ error: 'Failed to fetch orders' }, { status: res.status });

  const all = await res.json() as WcOrder[];
  return Response.json(shape(all.filter(o => o.billing.email === user.email)));
}
