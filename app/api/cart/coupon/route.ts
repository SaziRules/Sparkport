import { cookies } from 'next/headers';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;

async function getSession(cartToken: string | undefined) {
  const res = await fetch(`${STORE}/cart`, {
    headers: cartToken ? { 'Cart-Token': cartToken } : {},
    cache: 'no-store',
  });
  return {
    nonce: res.headers.get('Nonce') ?? '',
    token: res.headers.get('Cart-Token') ?? cartToken ?? '',
  };
}

// POST: apply coupon
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;
  const { code } = await request.json();
  const session = await getSession(cartToken);

  const res = await fetch(`${STORE}/cart/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Nonce: session.nonce,
      ...(session.token ? { 'Cart-Token': session.token } : {}),
    },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json({ error: err }, { status: res.status });
  }
  // Return the updated cart so caller can refresh
  const data = await res.json();
  const newToken = res.headers.get('Cart-Token') ?? cartToken ?? '';
  const response = Response.json(data);
  if (newToken) {
    response.headers.append(
      'Set-Cookie',
      `wc_cart_token=${newToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
  }
  return response;
}

// DELETE: remove coupon
export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;
  const { code } = await request.json();
  const session = await getSession(cartToken);

  const res = await fetch(`${STORE}/cart/coupons/${encodeURIComponent(code)}`, {
    method: 'DELETE',
    headers: {
      Nonce: session.nonce,
      ...(session.token ? { 'Cart-Token': session.token } : {}),
    },
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to remove coupon' }, { status: res.status });
  }
  const newToken = res.headers.get('Cart-Token') ?? cartToken ?? '';
  const response = Response.json({ success: true });
  if (newToken) {
    response.headers.append(
      'Set-Cookie',
      `wc_cart_token=${newToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
  }
  return response;
}
