import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/wordpress/products', () => ({
  getProducts: vi.fn(),
}));

import { getProducts } from '@/lib/wordpress/products';
import { GET } from '@/app/api/products/search/route';
import type { Product } from '@/lib/wordpress';

const mockProduct: Product = {
  id: 1, name: 'Vitamin C', slug: 'vitamin-c',
  category: 'Vitamins', categories: ['Vitamins'], tags: [],
  originalPrice: 39.99, salePrice: 29.99,
  image: 'https://sparkport.co.za/wp-content/uploads/img.jpg',
  imageAlt: 'Vitamin C', inStock: true, onSale: true, featured: false,
  shortDescription: '', description: '', sku: 'VC001',
  averageRating: 4.5, ratingCount: 12,
};

function makeRequest(q: string, limit?: string): Request {
  const url = new URL('http://localhost/api/products/search');
  url.searchParams.set('q', q);
  if (limit) url.searchParams.set('limit', limit);
  return new Request(url.toString());
}

beforeEach(() => vi.clearAllMocks());

describe('GET /api/products/search', () => {
  it('returns empty results when query is shorter than 2 characters', async () => {
    const res = await GET(makeRequest('a'));
    const data = await res.json();
    expect(data).toEqual({ results: [] });
    expect(getProducts).not.toHaveBeenCalled();
  });

  it('returns empty results for empty query', async () => {
    const res = await GET(makeRequest(''));
    const data = await res.json();
    expect(data).toEqual({ results: [] });
    expect(getProducts).not.toHaveBeenCalled();
  });

  it('maps WC products to SearchResult shape', async () => {
    vi.mocked(getProducts).mockResolvedValue([mockProduct]);

    const res = await GET(makeRequest('vitamin'));
    const data = await res.json();

    expect(data.results).toHaveLength(1);
    expect(data.results[0]).toEqual({
      id: 1,
      name: 'Vitamin C',
      slug: 'vitamin-c',
      price: 'R29.99',
      image: 'https://sparkport.co.za/wp-content/uploads/img.jpg',
    });
  });

  it('returns empty results when WC returns no products', async () => {
    vi.mocked(getProducts).mockResolvedValue([]);
    const res = await GET(makeRequest('xyz123'));
    const data = await res.json();
    expect(data).toEqual({ results: [] });
  });
});
