import crypto from 'crypto';

function basicAuth() {
  return `Basic ${Buffer.from(
    `${process.env.WC_CONSUMER_KEY ?? ''}:${process.env.WC_CONSUMER_SECRET ?? ''}`
  ).toString('base64')}`;
}

export async function POST(request: Request) {
  const text = await request.text();
  const params = new URLSearchParams(text);

  const receivedChecksum = params.get('CHECKSUM') ?? '';
  const entries = [...params.entries()].filter(([k]) => k !== 'CHECKSUM');
  const toHash = entries.map(([, v]) => v).join('') + (process.env.PAYGATE_ENCRYPTION_KEY ?? '');
  const expectedChecksum = crypto.createHash('md5').update(toHash).digest('hex');

  if (receivedChecksum !== expectedChecksum) {
    console.error('[paygate-notify] checksum mismatch');
    return new Response('OK', { status: 200 });
  }

  const transactionStatus = params.get('TRANSACTION_STATUS') ?? '';
  const reference = params.get('REFERENCE') ?? '';
  const payRequestId = params.get('PAY_REQUEST_ID') ?? '';

  if (transactionStatus === '1' && reference) {
    const REST = `${process.env.NEXT_PUBLIC_WP_API_URL}/wc/v3`;
    await fetch(`${REST}/orders/${reference}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: basicAuth() },
      body: JSON.stringify({
        status: 'processing',
        meta_data: [{ key: '_paygate_pay_request_id', value: payRequestId }],
      }),
    }).catch(err => console.error('[paygate-notify] WC update error:', err));
  }

  return new Response('OK', { status: 200 });
}
