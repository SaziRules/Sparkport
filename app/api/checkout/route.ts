import { cookies } from 'next/headers';

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

const PAYMENT_TITLES: Record<string, string> = {
  payfast: 'PayFast',
  bacs:    'Direct bank transfer',
  cod:     'In-store collection',
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;

  const { billing, payment_method, customer_note } = await request.json() as {
    billing: {
      first_name: string; last_name: string; email: string; phone: string;
      address_1: string; address_2: string; city: string; state: string;
      postcode: string; country: string;
    };
    payment_method: string;
    customer_note:  string;
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
      set_paid: false,
      status: 'pending',
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
      line_items: cartData.cart.items.map((item) => ({
        product_id: item.id,
        quantity:   item.quantity,
      })),
      coupon_lines: cartData.cart.coupons.map((c) => ({ code: c.code })),
      customer_note: customer_note ?? '',
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

  const order = await orderRes.json() as { id: number; payment_url?: string };

  if (payment_method === 'payfast' && order.payment_url) {
    return Response.json({ redirect: order.payment_url });
  }

  return Response.json({
    redirect: `/checkout/success?order_id=${order.id}&method=${payment_method}`,
  });
}
