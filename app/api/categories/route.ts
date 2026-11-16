import { NextResponse } from 'next/server';
import { getProductCategories } from '@/lib/wordpress/products';
import { WC_API, wcAuthHeaders, REVALIDATE_CATEGORIES } from '@/lib/wordpress/config';
import { isPromotionalCategory } from '@/lib/wordpress/filters';

export const revalidate = 3600;

/**
 * Returns top categories with accurate published-product counts.
 * Counts come from the WC products endpoint (status=publish) per category
 * via parallel per_page=1 requests reading X-WP-Total. One tiny request per
 * candidate category — much faster than fetching every product and summing.
 */
async function countPublishedInCategory(categoryId: number): Promise<number> {
  try {
    const res = await fetch(
      `${WC_API}/products?status=publish&per_page=1&page=1&category=${categoryId}`,
      { headers: wcAuthHeaders(), next: { revalidate: REVALIDATE_CATEGORIES } },
    );
    if (!res.ok) return 0;
    const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
    return Number.isFinite(total) ? total : 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const all = await getProductCategories();

  // Narrow the candidate pool before any counting so we minimise requests.
  // Pre-sort by WC's native count (fast, approximate) and keep the top 32 non-promo cats,
  // then re-count the kept ones accurately.
  const candidates = all
    .filter((c) => c.slug !== 'uncategorized' && !isPromotionalCategory(c.slug))
    .sort((a, b) => b.count - a.count)
    .slice(0, 32);

  const counts = await Promise.all(candidates.map((c) => countPublishedInCategory(c.id)));

  const categories = candidates
    .map((c, i) => ({
      name: c.name,
      slug: c.slug,
      count: counts[i],
      image: c.image ?? null,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);

  return NextResponse.json(categories);
}
