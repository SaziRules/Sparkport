import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/checkout/order/[id]/route';

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_WP_API_URL = 'https://sparkport.co.za/wp-json';
  process.env.WC_CONSUMER_KEY = 'ck_test';
  process.env.WC_CONSUMER_SECRET = 'cs_test';
});

const MOCK_WC_ORDER = {
  id: 123,
  status: 'pending',
  billing: { email: 'sipho@example.com' },
  total: '299.99',
  currency_symbol: 'R',
  line_items: [
    { name: 'Panado 24s', quantity: 2, total: '199.98', image: { src: 'https://example.com/img.jpg' } },
  ],
};

describe('GET /api/checkout/order/[id]', () => {
  it('returns mapped order data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_WC_ORDER),
    });

    const req = new Request('http://localhost/api/checkout/order/123');
    const res = await GET(req, { params: Promise.resolve({ id: '123' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe(123);
    expect(data.email).toBe('sipho@example.com');
    expect(data.total).toBe('299.99');
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('Panado 24s');
    expect(data.items[0].quantity).toBe(2);
  });

  it('returns 404 when WC order not found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Order not found.' }),
    });

    const req = new Request('http://localhost/api/checkout/order/999');
    const res = await GET(req, { params: Promise.resolve({ id: '999' }) });

    expect(res.status).toBe(404);
  });

  it('uses Basic auth with consumer key and secret', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_WC_ORDER),
    });
    global.fetch = fetchSpy;

    const req = new Request('http://localhost/api/checkout/order/123');
    await GET(req, { params: Promise.resolve({ id: '123' }) });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    const calledInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const expectedCreds = Buffer.from('ck_test:cs_test').toString('base64');

    expect(calledUrl).toContain('/wc/v3/orders/123');
    expect((calledInit.headers as Record<string, string>)['Authorization']).toBe(`Basic ${expectedCreds}`);
  });
});
