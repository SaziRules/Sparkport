import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildPayFastSignature } from '@/lib/payfastSignature';
import { POST } from '@/app/api/checkout/payfast-notify/route';

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_WP_API_URL = 'https://sparkport.co.za/wp-json';
  process.env.WC_CONSUMER_KEY        = 'ck_test';
  process.env.WC_CONSUMER_SECRET     = 'cs_test';
  delete process.env.PAYFAST_PASSPHRASE;
});

function buildItnBody(overrides: Record<string, string> = {}): string {
  const map = new Map<string, string>([
    ['m_payment_id',   '101'],
    ['pf_payment_id',  'pf_abc123'],
    ['payment_status', 'COMPLETE'],
    ['item_name',      'Order #101'],
    ['amount_gross',   '299.99'],
  ]);
  for (const [k, v] of Object.entries(overrides)) map.set(k, v);
  const data = [...map] as [string, string][];
  const signature = buildPayFastSignature(data);
  return new URLSearchParams([...data, ['signature', signature]]).toString();
}

describe('POST /api/checkout/payfast-notify', () => {
  it('returns 200 and updates WC order on COMPLETE payment', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const req = new Request('http://localhost/api/checkout/payfast-notify', {
      method: 'POST',
      body: buildItnBody(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const fetchSpy = global.fetch as ReturnType<typeof vi.fn>;
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/wc/v3/orders/101'),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('returns 400 on signature mismatch', async () => {
    const p = new URLSearchParams(buildItnBody());
    p.set('signature', 'tampered000000000000000000000000');
    const body = p.toString();

    const req = new Request('http://localhost/api/checkout/payfast-notify', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 but does not update order for non-COMPLETE status', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const req = new Request('http://localhost/api/checkout/payfast-notify', {
      method: 'POST',
      body: buildItnBody({ payment_status: 'CANCELLED' }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
