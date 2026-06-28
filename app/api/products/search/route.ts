import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/wordpress/products';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '6', 10), 6);

  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  try {
    const products = await getProducts({ search: q, per_page: limit });
    const results: SearchResult[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: `R${p.salePrice.toFixed(2)}`,
      image: p.image,
    }));
    return NextResponse.json({ results }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ results: [] }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
