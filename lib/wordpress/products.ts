import { WC_API, wcAuthHeaders, REVALIDATE_PRODUCTS, REVALIDATE_CATEGORIES, decodeHtml } from './config';
import type { WCProduct, WCProductCategory, Product, Category } from './types';

function mapProduct(p: WCProduct): Product {
  return {
    id: p.id,
    name: decodeHtml(p.name),
    slug: p.slug,
    category: decodeHtml(p.categories[0]?.name ?? ''),
    categories: p.categories.map((c) => decodeHtml(c.name)),
    tags: p.tags.map((t) => decodeHtml(t.name)),
    originalPrice: parseFloat(p.regular_price) || 0,
    salePrice: parseFloat(p.price) || 0,
    image: p.images[0]?.src ?? '',
    imageAlt: decodeHtml(p.images[0]?.alt ?? p.name),
    inStock: p.stock_status === 'instock',
    stockQuantity: p.stock_quantity ?? null,
    onSale: p.on_sale,
    featured: p.featured,
    shortDescription: p.short_description,
    description: p.description,
    sku: p.sku,
    brand: p.attributes.find((a) => a.name.toLowerCase() === 'brand')?.options[0] ?? '',
    averageRating: parseFloat(p.average_rating) || 0,
    ratingCount:   p.rating_count,
  };
}

export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  category?: number;
  on_sale?: boolean;
  featured?: boolean;
  search?: string;
  orderby?: 'date' | 'price' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
}): Promise<Product[]> {
  const query = new URLSearchParams({
    status: 'publish',
    per_page: String(params?.per_page ?? 20),
    page: String(params?.page ?? 1),
    ...(params?.category ? { category: String(params.category) } : {}),
    ...(params?.on_sale ? { on_sale: '1' } : {}),
    ...(params?.featured ? { featured: '1' } : {}),
    ...(params?.search ? { search: params.search } : {}),
    ...(params?.orderby ? { orderby: params.orderby } : {}),
    ...(params?.order ? { order: params.order } : {}),
  });

  const res = await fetch(`${WC_API}/products?${query}`, {
    headers: wcAuthHeaders(),
    next: { revalidate: REVALIDATE_PRODUCTS },
  });

  if (!res.ok) return [];
  const data: WCProduct[] = await res.json();
  return data.map(mapProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${WC_API}/products/${id}`, {
    headers: wcAuthHeaders(),
    next: { revalidate: REVALIDATE_PRODUCTS },
  });

  if (!res.ok) return null;
  const data: WCProduct = await res.json();
  return mapProduct(data);
}

export async function getAllProductIds(): Promise<number[]> {
  const res = await fetch(`${WC_API}/products?per_page=100&_fields=id&status=publish`, {
    headers: wcAuthHeaders(),
    next: { revalidate: REVALIDATE_PRODUCTS },
  });

  if (!res.ok) return [];
  const data: { id: number }[] = await res.json();
  return data.map((p) => p.id);
}

export async function getProductCategories(): Promise<Category[]> {
  const res = await fetch(`${WC_API}/products/categories?per_page=100&hide_empty=true`, {
    headers: wcAuthHeaders(),
    next: { revalidate: REVALIDATE_CATEGORIES },
  });

  if (!res.ok) return [];
  const data: WCProductCategory[] = await res.json();
  return data.map((c) => ({
    id: c.id,
    name: decodeHtml(c.name),
    slug: c.slug,
    count: c.count,
    image: c.image?.src,
  }));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return getProducts({ featured: true, per_page: limit });
}

export async function getOnSaleProducts(limit = 20): Promise<Product[]> {
  return getProducts({ on_sale: true, per_page: limit });
}

export async function getProductsByCategory(categorySlug: string, limit = 20): Promise<Product[]> {
  const categories = await getProductCategories();
  const match = categories.find((c) => c.slug === categorySlug);
  if (!match) return [];
  return getProducts({ category: match.id, per_page: limit });
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return getProducts({ orderby: 'date', order: 'desc', per_page: limit });
}

export interface ProductReview {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

export async function getProductReviews(productId: number): Promise<ProductReview[]> {
  try {
    const res = await fetch(`${WC_API}/products/${productId}/reviews?per_page=10&status=approved`, {
      headers: wcAuthHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: {
      id: number;
      reviewer: string;
      review: string;
      rating: number;
      date_created: string;
      verified: boolean;
    }) => ({
      id: r.id,
      reviewer: r.reviewer,
      review: r.review.replace(/<[^>]*>/g, '').trim(),
      rating: r.rating,
      date_created: r.date_created,
      verified: r.verified,
    }));
  } catch {
    return [];
  }
}

export async function getAllProducts(params?: {
  category?: number;
  on_sale?: boolean;
  search?: string;
}): Promise<Product[]> {
  const base = new URLSearchParams({
    status: 'publish',
    per_page: '100',
    ...(params?.category ? { category: String(params.category) } : {}),
    ...(params?.on_sale ? { on_sale: '1' } : {}),
    ...(params?.search ? { search: params.search } : {}),
  });

  const firstRes = await fetch(`${WC_API}/products?${base}&page=1`, {
    headers: wcAuthHeaders(),
    next: { revalidate: REVALIDATE_PRODUCTS },
  });
  if (!firstRes.ok) return [];

  const totalPages = parseInt(firstRes.headers.get('X-WP-TotalPages') ?? '1');
  const firstData: WCProduct[] = await firstRes.json();

  if (totalPages <= 1) return firstData.map(mapProduct);

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map(async (page) => {
      const res = await fetch(`${WC_API}/products?${base}&page=${page}`, {
        headers: wcAuthHeaders(),
        next: { revalidate: REVALIDATE_PRODUCTS },
      });
      if (!res.ok) return [] as WCProduct[];
      return (await res.json()) as WCProduct[];
    })
  );

  return [...firstData, ...rest.flat()].map(mapProduct);
}
