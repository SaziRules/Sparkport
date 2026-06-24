export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  prices: {
    price: string;
    regular_price: string;
    currency_symbol: string;
  };
  totals: {
    line_total: string;
    line_subtotal: string;
    currency_symbol: string;
  };
  images: { src: string; alt: string }[];
}

export interface Cart {
  items: CartItem[];
  items_count: number;
  totals: {
    total_price: string;
    total_items: string;
    currency_symbol: string;
  };
  _nonce?: string;
}

const EMPTY_CART: Cart = {
  items: [],
  items_count: 0,
  totals: { total_price: '0', total_items: '0', currency_symbol: 'R' },
  _nonce: '',
};

// All calls go through the Next.js proxy — no CORS issues, nonce handled server-side.
export async function fetchCart(): Promise<Cart> {
  try {
    const res = await fetch('/api/cart', { cache: 'no-store' });
    if (!res.ok) return EMPTY_CART;
    return res.json();
  } catch {
    return EMPTY_CART;
  }
}

export async function addToCart(productId: number, quantity: number, nonce: string): Promise<Cart | null> {
  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, nonce }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateCartItem(key: string, quantity: number, nonce: string): Promise<Cart | null> {
  try {
    const res = await fetch(`/api/cart/item/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, nonce }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function removeCartItem(key: string, nonce: string): Promise<Cart | null> {
  try {
    const res = await fetch(`/api/cart/item/${key}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nonce }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
