import { buildPayFastSignature } from '@/lib/payfastSignature';

const REST = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/v3`;

function basicAuth() {
  return `Basic ${Buffer.from(
    `${process.env.WC_CONSUMER_KEY ?? ''}:${process.env.WC_CONSUMER_SECRET ?? ''}`
  ).toString('base64')}`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);

  // Rebuild signature from received data (excluding 'signature' field)
  const pfData: [string, string][] = [];
  params.forEach((value, key) => {
    if (key !== 'signature') pfData.push([key, value]);
  });

  const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || undefined;
  const expected = buildPayFastSignature(pfData, PASSPHRASE);
  const received = params.get('signature') ?? '';

  if (expected !== received) {
    console.error('[payfast-notify] Signature mismatch');
    return new Response('Invalid signature', { status: 400 });
  }

  const paymentStatus = params.get('payment_status');
  const orderId       = params.get('m_payment_id');

  if (paymentStatus === 'COMPLETE' && orderId) {
    const res = await fetch(`${REST}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicAuth(),
      },
      body: JSON.stringify({ status: 'processing' }),
    });
    if (!res.ok) {
      console.error('[payfast-notify] Failed to update order', orderId);
    }
  }

  return new Response('OK', { status: 200 });
}
