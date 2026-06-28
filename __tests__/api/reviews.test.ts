import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/wordpress/config', () => ({
  WC_API: 'https://sparkport.co.za/wp-json/wc/v3',
  wcAuthHeaders: () => ({ Authorization: 'Basic dGVzdA==' }),
}));

import { POST } from '@/app/api/products/[id]/reviews/route';

const VALID_BODY = {
  reviewer: 'Jane Dlamini',
  reviewer_email: 'jane@example.com',
  rating: 5,
  review: 'Excellent product, highly recommend it to everyone!',
};

function makeRequest(
  body: unknown,
  id = '42'
): [Request, { params: Promise<{ id: string }> }] {
  return [
    new Request('http://localhost/api/products/42/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id }) },
  ];
}

beforeEach(() => vi.clearAllMocks());

describe('POST /api/products/[id]/reviews', () => {
  it('returns 201 on valid submission', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    const res = await POST(...makeRequest(VALID_BODY));
    expect(res.status).toBe(201);
  });

  it('passes correct payload to WooCommerce', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    await POST(...makeRequest(VALID_BODY));
    const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('/products/42/reviews');
    const sent = JSON.parse(opts.body as string);
    expect(sent.rating).toBe(5);
    expect(sent.reviewer).toBe('Jane Dlamini');
    expect(sent.status).toBe('approved');
  });

  it('returns 400 when reviewer is empty', async () => {
    const res = await POST(...makeRequest({ ...VALID_BODY, reviewer: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is invalid', async () => {
    const res = await POST(...makeRequest({ ...VALID_BODY, reviewer_email: 'notanemail' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when rating is out of range', async () => {
    const res = await POST(...makeRequest({ ...VALID_BODY, rating: 6 }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when rating is zero', async () => {
    const res = await POST(...makeRequest({ ...VALID_BODY, rating: 0 }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when review is too short', async () => {
    const res = await POST(...makeRequest({ ...VALID_BODY, review: 'Too short' }));
    expect(res.status).toBe(400);
  });

  it('returns 502 when WooCommerce fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) });
    const res = await POST(...makeRequest(VALID_BODY));
    expect(res.status).toBe(502);
  });
});
