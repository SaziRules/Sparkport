import { cookies } from 'next/headers';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;
  const { productId, quantity, nonce } = await request.json();

  try {
    const res = await fetch(`${STORE}/cart/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Nonce: nonce ?? '',
        ...(cartToken ? { 'Cart-Token': cartToken } : {}),
      },
      body: JSON.stringify({ id: productId, quantity }),
    });

    const newNonce = res.headers.get('Nonce') ?? nonce ?? '';
    const newToken = res.headers.get('Cart-Token') ?? '';

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
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
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
