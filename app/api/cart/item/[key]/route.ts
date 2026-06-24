import { cookies } from 'next/headers';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;

export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;
  const { quantity, nonce } = await request.json();

  try {
    const res = await fetch(`${STORE}/cart/items/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Nonce: nonce ?? '',
        ...(cartToken ? { 'Cart-Token': cartToken } : {}),
      },
      body: JSON.stringify({ key, quantity }),
    });

    const newNonce = res.headers.get('Nonce') ?? nonce ?? '';
    if (!res.ok) return Response.json({}, { status: res.status });
    const data = await res.json();
    return Response.json({ ...data, _nonce: newNonce });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;
  const { nonce } = await request.json().catch(() => ({ nonce: '' }));

  try {
    const res = await fetch(`${STORE}/cart/items/${key}`, {
      method: 'DELETE',
      headers: {
        Nonce: nonce ?? '',
        ...(cartToken ? { 'Cart-Token': cartToken } : {}),
      },
    });

    const newNonce = res.headers.get('Nonce') ?? nonce ?? '';
    if (!res.ok) return Response.json({}, { status: res.status });
    const data = await res.json();
    return Response.json({ ...data, _nonce: newNonce });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
