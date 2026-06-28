import { cookies } from 'next/headers';
import { buildPayFastSignature } from '@/lib/payfastSignature';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;
const REST   = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/v3`;

function basicAuth() {
  return `Basic ${Buffer.from(
    `${process.env.WC_CONSUMER_KEY ?? ''}:${process.env.WC_CONSUMER_SECRET ?? ''}`
  ).toString('base64')}`;
}

interface StoreCart {
  items:   Array<{ id: number; quantity: number }>;
  coupons: Array<{ code: string }>;
}

async function getCart(cartToken: string | undefined): Promise<{
  cart:  StoreCart;
  token: string;
} | null> {
  const res = await fetch(`${STORE}/cart`, {
    headers: { ...(cartToken ? { 'Cart-Token': cartToken } : {}) },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const cart = await res.json() as StoreCart;
  return {
    cart,
    token: res.headers.get('Cart-Token') ?? cartToken ?? '',
  };
}

function buildPayFastUrl(params: {
  orderId:   number;
  amount:    string;
  firstName: string;
  lastName:  string;
  email:     string;
}): string {
  const MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID  ?? '';
  const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY ?? '';
  const PASSPHRASE   = process.env.PAYFAST_PASSPHRASE || undefined;
  const SITE_URL     = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
  const isSandbox    = process.env.PAYFAST_SANDBOX === 'true';

  const pfBase = isSandbox
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  const data: [string, string][] = [
    ['merchant_id',   MERCHANT_ID],
    ['merchant_key',  MERCHANT_KEY],
    ['return_url',    `${SITE_URL}/checkout/success?order_id=${params.orderId}&method=payfast`],
    ['cancel_url',    `${SITE_URL}/checkout`],
    ['notify_url',    `${SITE_URL}/api/checkout/payfast-notify`],
    ['name_first',    params.firstName],
    ['name_last',     params.lastName],
    ['email_address', params.email],
    ['m_payment_id',  String(params.orderId)],
    ['amount',        parseFloat(params.amount).toFixed(2)],
    ['item_name',     `Order #${params.orderId}`],
  ];

  const signature = buildPayFastSignature(data, PASSPHRASE);
  const search = new URLSearchParams([...data, ['signature', signature]]);
  return `${pfBase}?${search.toString()}`;
}

const PAYMENT_TITLES: Record<string, string> = {
  payfast: 'PayFast',
  bacs:    'Direct bank transfer',
  cod:     'In-store collection',
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;

  const { billing, payment_method, customer_note, store_id } = await request.json() as {
    billing: {
      first_name: string; last_name: string; email: string; phone: string;
      address_1: string; address_2: string; city: string; state: string;
      postcode: string; country: string;
    };
    payment_method: string;
    customer_note:  string;
    store_id?:      string;
  };

  const cartData = await getCart(cartToken);
  if (!cartData) {
    return Response.json(
      { message: 'Could not read your cart. Please try again.' },
      { status: 502 }
    );
  }

  const orderRes = await fetch(`${REST}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicAuth(),
    },
    body: JSON.stringify({
      payment_method,
      payment_method_title: PAYMENT_TITLES[payment_method] ?? payment_method,
      set_paid:     false,
      status:       'pending',
      billing,
      shipping: {
        first_name: billing.first_name,
        last_name:  billing.last_name,
        address_1:  billing.address_1,
        address_2:  billing.address_2,
        city:       billing.city,
        state:      billing.state,
        postcode:   billing.postcode,
        country:    billing.country,
      },
      line_items:   cartData.cart.items.map((item) => ({
        product_id: item.id,
        quantity:   item.quantity,
      })),
      coupon_lines: cartData.cart.coupons.map((c) => ({ code: c.code })),
      customer_note: customer_note ?? '',
      ...(store_id ? { meta_data: [{ key: '_collection_store_id', value: store_id }] } : {}),
    }),
  });

  if (!orderRes.ok) {
    const err = await orderRes.json().catch(() => ({}));
    console.error('[checkout] WC order error:', orderRes.status, JSON.stringify(err));
    return Response.json(
      { message: (err as { message?: string }).message ?? 'Could not place order. Please try again.' },
      { status: orderRes.status >= 400 && orderRes.status < 600 ? orderRes.status : 500 }
    );
  }

  const order = await orderRes.json() as { id: number; total: string; payment_url?: string };

  // Clear the WC cart session so the user starts fresh after paying
  cookieStore.delete('wc_cart_token');

  if (payment_method === 'payfast') {
    return Response.json({
      redirect: buildPayFastUrl({
        orderId:   order.id,
        amount:    order.total,
        firstName: billing.first_name,
        lastName:  billing.last_name,
        email:     billing.email,
      }),
    });
  }

  const storeParam = payment_method === 'cod' && store_id ? `&store_id=${store_id}` : '';
  return Response.json({
    redirect: `/checkout/success?order_id=${order.id}&method=${payment_method}${storeParam}`,
  });
}
