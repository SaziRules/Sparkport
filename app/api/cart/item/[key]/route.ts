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

function setCookieHeader(response: Response, token: string) {
  response.headers.append(
    'Set-Cookie',
    `wc_cart_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
  );
}

export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const cookieStore = await cookies();
  let cartToken = cookieStore.get('wc_cart_token')?.value;
  const { quantity } = await request.json();

  const session = await getFreshNonce(cartToken);
  if (session.token) cartToken = session.token;

  try {
    const res = await fetch(`${STORE}/cart/items/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Nonce: session.nonce,
        ...(cartToken ? { 'Cart-Token': cartToken } : {}),
      },
      body: JSON.stringify({ quantity }),
    });

    const newNonce = res.headers.get('Nonce') ?? session.nonce;
    const newToken = res.headers.get('Cart-Token') ?? cartToken ?? '';

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[cart/item PUT] WC error:', res.status, JSON.stringify(err));
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const response = Response.json({ ...data, _nonce: newNonce });
    if (newToken) setCookieHeader(response, newToken);
    return response;
  } catch (e) {
    console.error('[cart/item PUT] Exception:', e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const cookieStore = await cookies();
  let cartToken = cookieStore.get('wc_cart_token')?.value;

  const session = await getFreshNonce(cartToken);
  if (session.token) cartToken = session.token;

  try {
    const res = await fetch(`${STORE}/cart/items/${key}`, {
      method: 'DELETE',
      headers: {
        Nonce: session.nonce,
        ...(cartToken ? { 'Cart-Token': cartToken } : {}),
      },
    });

    const newNonce = res.headers.get('Nonce') ?? session.nonce;
    const newToken = res.headers.get('Cart-Token') ?? cartToken ?? '';

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[cart/item DELETE] WC error:', res.status, JSON.stringify(err));
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const response = Response.json({ ...data, _nonce: newNonce });
    if (newToken) setCookieHeader(response, newToken);
    return response;
  } catch (e) {
    console.error('[cart/item DELETE] Exception:', e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
