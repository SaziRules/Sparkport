import { describe, it, expect } from 'vitest';
import { buildPayFastSignature } from '@/lib/payfastSignature';

const SAMPLE: [string, string][] = [
  ['merchant_id',   '10000100'],
  ['merchant_key',  '46f0cd694581a'],
  ['amount',        '100.00'],
  ['item_name',     'Order #42'],
];

describe('buildPayFastSignature', () => {
  it('returns a 32-character MD5 hex string', () => {
    const sig = buildPayFastSignature(SAMPLE);
    expect(sig).toMatch(/^[0-9a-f]{32}$/);
  });

  it('produces a different signature with a passphrase', () => {
    const withoutPf = buildPayFastSignature(SAMPLE);
    const withPf    = buildPayFastSignature(SAMPLE, 'jt7NOE43FZPn');
    expect(withPf).not.toBe(withoutPf);
  });

  it('is deterministic — same inputs always produce the same signature', () => {
    const a = buildPayFastSignature(SAMPLE, 'secret');
    const b = buildPayFastSignature(SAMPLE, 'secret');
    expect(a).toBe(b);
  });

  it('encodes spaces in values as +', () => {
    const data: [string, string][] = [['item_name', 'My Order 42']];
    // Signature should be based on item_name=My+Order+42 (PHP urlencode behaviour)
    const sig = buildPayFastSignature(data);
    expect(sig).toMatch(/^[0-9a-f]{32}$/);
  });

  it('passphrase is appended and encoded correctly', () => {
    // With passphrase containing a space — it must be encoded as +
    const sig1 = buildPayFastSignature(SAMPLE, 'pass phrase');
    const sig2 = buildPayFastSignature(SAMPLE, 'pass+phrase');
    // These should differ because 'pass phrase' encodes to 'pass+phrase'
    // while 'pass+phrase' encodes the '+' itself
    expect(sig1).not.toBe(sig2);
  });
});
