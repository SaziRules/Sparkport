import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

import { cookies } from 'next/headers';
import { POST } from '@/app/api/checkout/route';

const MOCK_CART_TOKEN = 'test-cart-token';

const VALID_BODY = {
  billing: {
    first_name: 'Sipho', last_name: 'Dlamini',
    email: 'sipho@example.com', phone: '0831234567',
    address_1: '12 Main Road', address_2: '',
    city: 'Durban', state: 'KwaZulu-Natal',
    postcode: '4001', country: 'ZA',
  },
  payment_method: 'payfast',
  customer_note: '',
};

const MOCK_CART = {
  items: [{ id: 42, quantity: 1 }],
  coupons: [],
};

function makeFetchMock(responses: Array<{ ok: boolean; headers?: Record<string, string>; body: unknown }>) {
  let call = 0;
  return vi.fn().mockImplementation(() => {
    const r = responses[call++];
    return Promise.resolve({
      ok: r.ok,
      status: r.ok ? 200 : 422,
      headers: { get: (k: string) => (r.headers ?? {})[k] ?? null },
      json: () => Promise.resolve(r.body),
    });
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_WP_API_URL  = 'https://sparkport.co.za/wp-json';
  process.env.WC_CONSUMER_KEY         = 'ck_test';
  process.env.WC_CONSUMER_SECRET      = 'cs_test';
  process.env.PAYFAST_MERCHANT_ID     = 'test_mid';
  process.env.PAYFAST_MERCHANT_KEY    = 'test_mkey';
  delete process.env.PAYFAST_PASSPHRASE;
  process.env.PAYFAST_SANDBOX         = 'true';
  process.env.NEXT_PUBLIC_SITE_URL    = 'http://localhost:3000';
  vi.mocked(cookies).mockResolvedValue({
    get: (name: string) => (name === 'wc_cart_token' ? { value: MOCK_CART_TOKEN } : undefined),
    delete: vi.fn(),
  } as unknown as ReturnType<typeof cookies> extends Promise<infer T> ? T : never);
});

describe('POST /api/checkout', () => {
  it('PayFast: returns sandbox PayFast URL with correct params', async () => {
    global.fetch = makeFetchMock([
      { ok: true, headers: { 'Cart-Token': MOCK_CART_TOKEN }, body: MOCK_CART },
      { ok: true, body: { id: 101, total: '299.99' } },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_BODY, payment_method: 'payfast' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.redirect).toMatch(/^https:\/\/sandbox\.payfast\.co\.za\/eng\/process/);
    expect(data.redirect).toContain('m_payment_id=101');
    expect(data.redirect).toContain('amount=299.99');
    expect(data.redirect).toContain('signature=');
  });

  it('EFT: returns /checkout/success redirect', async () => {
    global.fetch = makeFetchMock([
      { ok: true, headers: { 'Cart-Token': MOCK_CART_TOKEN }, body: MOCK_CART },
      { ok: true, body: { id: 202, total: '150.00' } },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_BODY, payment_method: 'bacs' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.redirect).toBe('/checkout/success?order_id=202&method=bacs');
  });

  it('In-store: returns /checkout/success redirect', async () => {
    global.fetch = makeFetchMock([
      { ok: true, headers: { 'Cart-Token': MOCK_CART_TOKEN }, body: MOCK_CART },
      { ok: true, body: { id: 303, total: '75.00' } },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_BODY, payment_method: 'cod' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.redirect).toBe('/checkout/success?order_id=303&method=cod');
  });

  it('returns 502 when cart cannot be read', async () => {
    global.fetch = makeFetchMock([
      { ok: false, body: {} },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify(VALID_BODY),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  it('forwards WC order creation error to client', async () => {
    global.fetch = makeFetchMock([
      { ok: true, headers: { 'Cart-Token': MOCK_CART_TOKEN }, body: MOCK_CART },
      { ok: false, body: { message: 'Product is out of stock.' } },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify(VALID_BODY),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data.message).toBe('Product is out of stock.');
  });
});
