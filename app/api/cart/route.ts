import { cookies } from 'next/headers';

const STORE = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/store/v1`;

export async function GET() {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('wc_cart_token')?.value;

  try {
    const res = await fetch(`${STORE}/cart`, {
      headers: { ...(cartToken ? { 'Cart-Token': cartToken } : {}) },
      cache: 'no-store',
    });

    const nonce = res.headers.get('Nonce') ?? '';
    const newToken = res.headers.get('Cart-Token') ?? '';
    const data = await res.json();

    const response = Response.json({ ...data, _nonce: nonce });
    if (newToken) {
      response.headers.append(
        'Set-Cookie',
        `wc_cart_token=${newToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      );
    }
    return response;
  } catch {
    return Response.json(
      { items: [], items_count: 0, totals: { total_price: '0', currency_symbol: 'R', total_items: '0' }, _nonce: '' },
    );
  }
}
