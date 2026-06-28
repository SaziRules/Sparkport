import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers before importing the route
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

import { cookies } from 'next/headers';
import { POST } from '@/app/api/checkout/route';

const MOCK_CART_TOKEN = 'test-cart-token';
const MOCK_NONCE = 'test-nonce-123';

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
  vi.mocked(cookies).mockResolvedValue({
    get: (name: string) => (name === 'wc_cart_token' ? { value: MOCK_CART_TOKEN } : undefined),
  } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never);
});

describe('POST /api/checkout', () => {
  it('PayFast: returns WC redirect_url', async () => {
    global.fetch = makeFetchMock([
      // 1. nonce fetch (GET /cart)
      { ok: true, headers: { Nonce: MOCK_NONCE, 'Cart-Token': MOCK_CART_TOKEN }, body: {} },
      // 2. checkout POST
      {
        ok: true, body: {
          order_id: 101,
          payment_result: { redirect_url: 'https://www.payfast.co.za/eng/process?m=123' },
        },
      },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_BODY, payment_method: 'payfast' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.redirect).toBe('https://www.payfast.co.za/eng/process?m=123');
  });

  it('EFT: returns /checkout/success redirect', async () => {
    global.fetch = makeFetchMock([
      { ok: true, headers: { Nonce: MOCK_NONCE }, body: {} },
      { ok: true, body: { order_id: 202, payment_result: { redirect_url: '' } } },
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
      { ok: true, headers: { Nonce: MOCK_NONCE }, body: {} },
      { ok: true, body: { order_id: 303, payment_result: { redirect_url: '' } } },
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

  it('forwards WC error message to client', async () => {
    global.fetch = makeFetchMock([
      { ok: true, headers: { Nonce: MOCK_NONCE }, body: {} },
      { ok: false, body: { message: 'Invalid payment method.' } },
    ]);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify(VALID_BODY),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data.message).toBe('Invalid payment method.');
  });
});
