interface WcLineItem {
  name: string;
  quantity: number;
  total: string;
  image?: { src: string };
}

interface WcOrder {
  id: number;
  status: string;
  billing: { email: string };
  total: string;
  currency_symbol: string;
  line_items: WcLineItem[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;
  const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const res = await fetch(`${WP_API}/wc/v3/orders/${id}`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    return Response.json({ error: 'Order not found' }, { status: res.status });
  }

  const order = await res.json() as WcOrder;

  return Response.json({
    id: order.id,
    status: order.status,
    email: order.billing?.email ?? '',
    total: order.total,
    currency_symbol: order.currency_symbol ?? 'R',
    items: order.line_items?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      total: item.total,
      image: item.image?.src ?? '',
    })) ?? [],
  });
}
