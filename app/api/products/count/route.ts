import { NextResponse } from 'next/server';
import { WC_API, wcAuthHeaders, REVALIDATE_PRODUCTS } from '@/lib/wordpress/config';

export const revalidate = 3600;

/**
 * Returns the exact number of published products in the WooCommerce catalogue,
 * read from the X-WP-Total response header. More accurate than summing
 * category.count (which double-counts products that belong to >1 category
 * and omits products in uncategorised slots).
 */
export async function GET() {
  try {
    const res = await fetch(
      `${WC_API}/products?status=publish&per_page=1&page=1`,
      { headers: wcAuthHeaders(), next: { revalidate: REVALIDATE_PRODUCTS } },
    );
    if (!res.ok) return NextResponse.json({ count: 0 });
    const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
    return NextResponse.json({ count: Number.isFinite(total) ? total : 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
