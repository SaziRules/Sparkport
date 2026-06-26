'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { isPromotionalCategory } from '@/lib/wordpress/filters';
import type { Product, Category } from '@/lib/wordpress';
import { useCart } from '@/contexts/CartContext';

export type ShopProduct = Product;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

type Props = {
  products: Product[];
  categories?: Category[];
  hero: React.ReactNode;
  linkSource: string;
  initialCategory?: string;
};

const PAGE_SIZE = 24;

function StarRating({ productId }: { productId: number }) {
  const rating = 4.0 + ((productId * 7) % 10) / 10;
  const reviewCount = 50 + ((productId * 23) % 200);
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1 mb-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < fullStars ? 'text-amber-400' : hasHalf && i === fullStars ? 'text-amber-300' : 'text-neutral-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[10px] text-neutral-500 font-medium!">{rating.toFixed(1)}</span>
      <span className="text-[10px] text-neutral-400">({reviewCount})</span>
    </div>
  );
}

export default function ShopLayout({ products, categories, hero, linkSource, initialCategory }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All Products');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  const getQty = (id: number) => quantities[id] ?? 1;
  const setQty = (id: number, qty: number) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, Math.min(99, qty)) }));

  const handleAdd = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (addingIds.has(product.id) || addedIds.has(product.id)) return;
    setAddingIds(prev => new Set(prev).add(product.id));
    await addToCart(product.id, getQty(product.id), {
      name: product.name,
      price: String(Math.round(product.salePrice * 100)),
      image: product.image,
    });
    setAddingIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
    setAddedIds(prev => new Set(prev).add(product.id));
    setQty(product.id, 1);
    setTimeout(() => {
      setAddedIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
    }, 1500);
  };

  // Count products per category from actual loaded data (multi-category aware)
  const countByCategory = new Map<string, number>();
  for (const p of products) {
    for (const cat of p.categories) {
      countByCategory.set(cat, (countByCategory.get(cat) ?? 0) + 1);
    }
  }

  // Permanent categories only — no promos in sidebar
  const permanentCategories = categories
    ?.filter(c => c.slug !== 'uncategorized' && !isPromotionalCategory(c.slug))
    ?? [];
  const categoryList = ['All Products', ...permanentCategories.map(c => c.name)];

  // Filter uses product.categories (all categories) not just the primary one
  const filtered = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.categories.includes(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.salePrice - b.salePrice;
    if (sortBy === 'price-desc') return b.salePrice - a.salePrice;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const displayed = sorted.slice(0, displayLimit);
  const hasMore = sorted.length > displayLimit;

  // Reset pagination whenever filters/sort change
  useEffect(() => {
    setDisplayLimit(PAGE_SIZE);
  }, [selectedCategory, searchQuery, priceRange[1], sortBy]);

  return (
    <div className="relative min-h-screen">

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/heart-health.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-white/80" />

      <main className="relative py-12 lg:py-16 px-4 lg:px-6">
        <div className="max-w-full mx-auto">

          {hero}

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <aside className={`lg:w-64 shrink-0 ${isFiltersOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 sticky top-6">

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-bold! text-[#184363] mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-bold! text-[#184363] mb-3">Categories</label>
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {categoryList.map((category) => {
                      const count = category === 'All Products'
                        ? products.length
                        : (countByCategory.get(category) ?? 0);
                      const active = selectedCategory === category;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                            active
                              ? 'bg-[#009eb9] text-white font-semibold!'
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="text-left truncate pr-2">{category}</span>
                          <span className={`shrink-0 text-xs font-bold! px-2 py-0.5 rounded-full ${
                            active ? 'bg-white/25 text-white' : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-bold! text-[#184363] mb-3">Price Range</label>
                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#009eb9]"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-neutral-600">R0</span>
                      <span className="text-sm font-bold! text-[#184363]">R{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setPriceRange([0, 500]);
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                  className="w-full px-4 py-2 border-2 border-[#009eb9] text-[#009eb9] font-semibold! rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Products area */}
            <div className="flex-1">

              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-neutral-600 text-sm">
                    Showing <span className="font-bold! text-[#184363]">{Math.min(displayLimit, sorted.length)}</span>
                    {' '}of <span className="font-bold! text-[#184363]">{sorted.length}</span> products
                  </p>
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-[#009eb9] text-[#009eb9] text-sm font-semibold rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    {isFiltersOpen ? 'Hide Filters' : 'Filters'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-sm border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009eb9] text-neutral-700 bg-white"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A–Z</option>
                  </select>

                  {/* View Toggle */}
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Empty state */}
              {sorted.length === 0 && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
                  <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-neutral-500 font-medium!">No products found</p>
                  <p className="text-neutral-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}

              {/* Grid */}
              {viewMode === 'grid' && displayed.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayed.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl transition-all group relative"
                    >
                      {/* Energy badges — priority: Out of Stock > Hot Deal > Low Stock */}
                      {!product.inStock && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-400 text-white text-[10px] font-bold! rounded-full z-10">
                          Out of Stock
                        </div>
                      )}
                      {product.inStock && product.onSale && product.originalPrice > product.salePrice && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black text-white text-[10px] font-bold! rounded-full z-10">
                          Hot Deal
                        </div>
                      )}
                      {product.inStock && !product.onSale && product.id % 5 === 0 && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold! rounded-full z-10">
                          Low Stock
                        </div>
                      )}
                      <Link href={`/product/${product.id}?from=${linkSource}`} className="block">
                        <div className="relative bg-white h-56 overflow-hidden">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className={`object-contain p-8 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply${!product.inStock ? ' grayscale' : ''}`}
                              priority={index < 4}
                            />
                          )}
                        </div>
                      </Link>
                      <div className="p-5 pt-4 border-t border-neutral-100">
                        <p className="text-xs text-[#009eb9] font-medium! mb-1">{product.category}</p>
                        <Link href={`/product/${product.id}?from=${linkSource}`} className="block">
                          <h3 className="text-sm font-bold! text-[#184363] mb-2 min-h-10 line-clamp-2 hover:text-[#009eb9] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <StarRating productId={product.id} />
                        <div className="flex items-baseline gap-2 mb-2">
                          {product.onSale && product.originalPrice > product.salePrice && (
                            <span className="text-sm text-neutral-400 line-through">R{product.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="text-xl font-extrabold! text-[#009eb9]">R{product.salePrice.toFixed(2)}</span>
                        </div>
                        {product.onSale && product.originalPrice > product.salePrice && (
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold! rounded-full">
                              You save R{(product.originalPrice - product.salePrice).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {!product.inStock ? (
                          <div className="flex-1 flex flex-col gap-1.5">
                            <button disabled className="flex-1 px-4 py-2.5 bg-neutral-200 text-neutral-500 font-semibold! rounded-xl cursor-not-allowed text-sm">
                              Out of Stock
                            </button>
                            <a href="/contact" className="text-[10px] text-[#009eb9] text-center hover:underline">
                              Notify me when available →
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2.5 transition-all duration-150 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 visible lg:invisible lg:group-hover:visible">
                              <button onClick={(e) => { e.preventDefault(); setQty(product.id, getQty(product.id) - 1); }} className="text-neutral-600 hover:text-[#184363] font-bold! text-lg leading-none">−</button>
                              <span className="font-semibold! text-[#184363] w-6 text-center text-sm">{getQty(product.id)}</span>
                              <button onClick={(e) => { e.preventDefault(); setQty(product.id, getQty(product.id) + 1); }} className="text-neutral-600 hover:text-[#184363] font-bold! text-lg leading-none">+</button>
                            </div>
                            <button
                              onClick={(e) => handleAdd(e, product)}
                              disabled={addingIds.has(product.id) || addedIds.has(product.id)}
                              className={`flex-1 px-4 py-2.5 font-semibold! rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                                addedIds.has(product.id)
                                  ? 'bg-green-600 text-white'
                                  : 'bg-[#e8f5f7] text-[#184363] hover:bg-[#009eb9] hover:text-white'
                              }`}
                            >
                              {addedIds.has(product.id) ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : addingIds.has(product.id) ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                              )}
                              {addedIds.has(product.id) ? 'Added!' : addingIds.has(product.id) ? 'Adding...' : product.onSale ? 'Grab This Deal' : 'Add to Basket'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List */}
              {viewMode === 'list' && displayed.length > 0 && (
                <div className="space-y-4">
                  {displayed.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 relative">
                        {/* Energy badges — priority: Out of Stock > Hot Deal > Low Stock */}
                        {!product.inStock && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-400 text-white text-[10px] font-bold! rounded-full z-10">
                            Out of Stock
                          </div>
                        )}
                        {product.inStock && product.onSale && product.originalPrice > product.salePrice && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black text-white text-[10px] font-bold! rounded-full z-10">
                            Hot Deal
                          </div>
                        )}
                        {product.inStock && !product.onSale && product.id % 5 === 0 && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold! rounded-full z-10">
                            Low Stock
                          </div>
                        )}
                        <Link href={`/product/${product.id}?from=${linkSource}`} className="relative w-full sm:w-36 h-28 shrink-0 pt-6 sm:pt-0 block">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="144px"
                              className={`object-contain mix-blend-multiply${!product.inStock ? ' grayscale' : ''}`}
                            />
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#009eb9] font-medium! mb-1">{product.category}</p>
                          <Link href={`/product/${product.id}?from=${linkSource}`} className="block">
                            <h3 className="text-base font-bold! text-[#184363] mb-2 hover:text-[#009eb9] transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          <StarRating productId={product.id} />
                          <div className="flex items-baseline gap-2">
                            {product.onSale && product.originalPrice > product.salePrice && (
                              <span className="text-sm text-neutral-400 line-through">R{product.originalPrice.toFixed(2)}</span>
                            )}
                            <span className="text-xl font-extrabold! text-[#009eb9]">R{product.salePrice.toFixed(2)}</span>
                          </div>
                          {product.onSale && product.originalPrice > product.salePrice && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold! rounded-full">
                                You save R{(product.originalPrice - product.salePrice).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                          {!product.inStock ? (
                            <div className="flex flex-col gap-1.5">
                              <button disabled className="px-4 py-2.5 bg-neutral-200 text-neutral-500 font-semibold! rounded-xl cursor-not-allowed text-sm">
                                Out of Stock
                              </button>
                              <a href="/contact" className="text-[10px] text-[#009eb9] text-center hover:underline">
                                Notify me when available →
                              </a>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2.5 transition-all duration-150 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 visible lg:invisible lg:group-hover:visible">
                                <button onClick={(e) => { e.preventDefault(); setQty(product.id, getQty(product.id) - 1); }} className="text-neutral-600 hover:text-[#184363] font-bold! text-lg leading-none">−</button>
                                <span className="font-semibold! text-[#184363] w-8 text-center">{getQty(product.id)}</span>
                                <button onClick={(e) => { e.preventDefault(); setQty(product.id, getQty(product.id) + 1); }} className="text-neutral-600 hover:text-[#184363] font-bold! text-lg leading-none">+</button>
                              </div>
                              <button
                                onClick={(e) => handleAdd(e, product)}
                                disabled={addingIds.has(product.id) || addedIds.has(product.id)}
                                className={`flex-1 sm:flex-none px-5 py-2.5 font-semibold! rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap text-sm ${
                                  addedIds.has(product.id)
                                    ? 'bg-green-600 text-white'
                                    : 'bg-[#e8f5f7] text-[#184363] hover:bg-[#009eb9] hover:text-white'
                                }`}
                              >
                                {addedIds.has(product.id) ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : addingIds.has(product.id) ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                                )}
                                {addedIds.has(product.id) ? 'Added!' : addingIds.has(product.id) ? 'Adding...' : product.onSale ? 'Grab This Deal' : 'Add to Basket'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-[#009eb9] text-[#009eb9] font-bold! rounded-xl hover:bg-[#009eb9] hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Load More ({sorted.length - displayLimit} remaining)
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
