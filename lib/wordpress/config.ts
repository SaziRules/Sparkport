export const WP_API = process.env.NEXT_PUBLIC_WP_API_URL!;
export const WC_API = `${WP_API}/wc/v3`;

export function wcAuthHeaders(): HeadersInit {
  const key = process.env.WC_CONSUMER_KEY!;
  const secret = process.env.WC_CONSUMER_SECRET!;
  const token = Buffer.from(`${key}:${secret}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, '’')  // right single quotation mark
    .replace(/&#8216;/g, '‘')  // left single quotation mark
    .replace(/&#8220;/g, '“')  // left double quotation mark
    .replace(/&#8221;/g, '”')  // right double quotation mark
    .replace(/&#8211;/g, '–')  // en dash
    .replace(/&#8212;/g, '—')  // em dash
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export const REVALIDATE_POSTS = 3600;
export const REVALIDATE_PRODUCTS = 300;
export const REVALIDATE_CATEGORIES = 86400;
