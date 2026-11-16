import { NextResponse } from 'next/server';
import { getProducts, getProductCategories } from '@/lib/wordpress/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get('category')?.trim() ?? '';
  const exclude = (searchParams.get('exclude') ?? '')
    .split(',')
    .map((s) => parseInt(s, 10))
    .filter(Boolean);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '6', 10), 10);

  if (!categoryParam) {
    return NextResponse.json({ products: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    // Accept either a slug ("baby-care") OR a display name ("Baby Care") —
    // Product.category on the client is the category's display name, so we
    // try slug first then fall back to a case-insensitive name match.
    const categories = await getProductCategories();
    const needle = categoryParam.toLowerCase();
    const match = categories.find(
      (c) => c.slug.toLowerCase() === needle || c.name.toLowerCase() === needle,
    );
    if (!match) {
      return NextResponse.json({ products: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const pool = await getProducts({ category: match.id, per_page: limit + exclude.length });
    const products = pool.filter((p) => !exclude.includes(p.id)).slice(0, limit);
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ products: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
