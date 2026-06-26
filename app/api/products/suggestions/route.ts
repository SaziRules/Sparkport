import { NextResponse } from 'next/server';
import { getOnSaleProducts } from '@/lib/wordpress/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getOnSaleProducts(3);
    return NextResponse.json(
      products.map(p => ({
        id: p.id,
        name: p.name,
        salePrice: p.salePrice,
        imageUrl: p.image ?? '',
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
