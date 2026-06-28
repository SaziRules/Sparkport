import crypto from 'node:crypto';

function pfEncode(val: string): string {
  return encodeURIComponent(val.trim())
    .replace(/%20/g, '+')
    .replace(/!/g,   '%21')
    .replace(/~/g,   '%7E')
    .replace(/'/g,   '%27')
    .replace(/\(/g,  '%28')
    .replace(/\)/g,  '%29')
    .replace(/\*/g,  '%2A');
}

export function buildPayFastSignature(
  data: [string, string][],
  passphrase?: string,
): string {
  const pfString = data.map(([k, v]) => `${k}=${pfEncode(v)}`).join('&');
  const signInput = passphrase
    ? `${pfString}&passphrase=${pfEncode(passphrase)}`
    : pfString;
  return crypto.createHash('md5').update(signInput).digest('hex');
}
