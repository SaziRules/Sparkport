import { NextResponse } from 'next/server'
import { getProductCategories } from '@/lib/wordpress/products'
import { isPromotionalCategory } from '@/lib/wordpress/filters'

export const revalidate = 3600

export async function GET() {
  const all = await getProductCategories()
  const categories = all
    .filter(c => c.slug !== 'uncategorized' && c.count > 0 && !isPromotionalCategory(c.slug))
    .sort((a, b) => b.count - a.count)
    .slice(0, 24)
    .map(c => ({ name: c.name, slug: c.slug, count: c.count, image: c.image ?? null }))

  return NextResponse.json(categories)
}
