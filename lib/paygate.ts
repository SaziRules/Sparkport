import crypto from 'crypto';

const PAYGATE_INITIATE_URL = 'https://secure.paygate.co.za/payweb3/initiate.trans';
export const PAYGATE_PROCESS_URL = 'https://secure.paygate.co.za/payweb3/process.trans';

export function buildPayGateChecksum(params: Record<string, string>): string {
  const str = Object.values(params).join('') + (process.env.PAYGATE_ENCRYPTION_KEY ?? '');
  return crypto.createHash('md5').update(str).digest('hex');
}

export interface PayGateInitResult {
  payRequestId: string;
  checksum: string;
}

export async function initiatePayment(opts: {
  reference: string;
  amountCents: number;
  email: string;
  returnUrl: string;
  notifyUrl: string;
}): Promise<PayGateInitResult> {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const params: Record<string, string> = {
    PAYGATE_ID:       process.env.PAYGATE_ID ?? '',
    REFERENCE:        opts.reference,
    AMOUNT:           String(opts.amountCents),
    CURRENCY:         'ZAR',
    RETURN_URL:       opts.returnUrl,
    TRANSACTION_DATE: now,
    LOCALE:           'en-za',
    COUNTRY:          'ZAF',
    EMAIL:            opts.email,
    NOTIFY_URL:       opts.notifyUrl,
  };

  params.CHECKSUM = buildPayGateChecksum(params);

  const res = await fetch(PAYGATE_INITIATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });

  const text = await res.text();
  const result = new URLSearchParams(text);
  const payRequestId = result.get('PAY_REQUEST_ID');
  const checksum = result.get('CHECKSUM');

  if (!payRequestId || !checksum) {
    throw new Error(`PayGate initiate failed: ${text}`);
  }

  return { payRequestId, checksum };
}
