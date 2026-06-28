import { cookies } from 'next/headers';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;

async function getNonce(cartToken: string | undefined): Promise<{ nonce: string; token: string }> {
  const res = await fetch(`${STORE}/cart`, {
    headers: { ...(cartToken ? { 'Cart-Token': cartToken } : {}) },
    cache: 'no-store',
  });
  return {
    nonce: res.headers.get('Nonce') ?? '',
    token: res.headers.get('Cart-Token') ?? cartToken ?? '',
  };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;

  const { billing, payment_method, customer_note } = await request.json();

  const { nonce, token } = await getNonce(cartToken);

  const res = await fetch(`${STORE}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Nonce: nonce,
      ...(token ? { 'Cart-Token': token } : {}),
    },
    body: JSON.stringify({
      billing_address: billing,
      shipping_address: billing,
      payment_method,
      customer_note: customer_note ?? '',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { message: (err as { message?: string }).message ?? 'Checkout failed. Please try again.' },
      { status: res.status }
    );
  }

  const data = await res.json() as {
    order_id: number;
    payment_result?: { redirect_url?: string };
  };

  const orderId = data.order_id;

  if (payment_method === 'payfast' && data.payment_result?.redirect_url) {
    return Response.json({ redirect: data.payment_result.redirect_url });
  }

  return Response.json({ redirect: `/checkout/success?order_id=${orderId}&method=${payment_method}` });
}
