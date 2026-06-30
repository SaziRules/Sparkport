import { cookies } from 'next/headers';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;

async function getFreshNonce(cartToken: string | undefined): Promise<{ nonce: string; token: string }> {
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
  let cartToken = cookieStore.get('wc_cart_token')?.value;
  const { productId, quantity, clientNonce } = await request.json();

  let session: { nonce: string; token: string };

  try {
    if (clientNonce && typeof clientNonce === 'string' && clientNonce.length > 0) {
      session = { nonce: clientNonce, token: cartToken ?? '' };
    } else {
      session = await getFreshNonce(cartToken);
      if (session.token) cartToken = session.token;
    }

    const res = await fetch(`${STORE}/cart/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Nonce: session.nonce,
        ...(cartToken ? { 'Cart-Token': cartToken } : {}),
      },
      body: JSON.stringify({ id: productId, quantity }),
    });

    const newNonce = res.headers.get('Nonce') ?? session.nonce;
    const newToken = res.headers.get('Cart-Token') ?? cartToken ?? '';

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[cart/add] WC error:', res.status, JSON.stringify(err));
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const response = Response.json({ ...data, _nonce: newNonce });
    if (newToken) {
      response.headers.append(
        'Set-Cookie',
        `wc_cart_token=${newToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      );
    }
    return response;
  } catch (e) {
    console.error('[cart/add] Exception:', e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
