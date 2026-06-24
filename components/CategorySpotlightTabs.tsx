'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category, Product } from '@/lib/wordpress';

export interface Spotlight {
  category: Category;
  products: Product[];
}

interface Props {
  spotlights: Spotlight[];
}

function getCategoryIcon(slug: string) {
  if (slug.includes('vitamin') || slug.includes('supplement'))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  if (slug.includes('baby') || slug.includes('toddler') || slug.includes('infant'))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  if (slug.includes('cold') || slug.includes('flu') || slug.includes('pain'))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  if (slug.includes('skin') || slug.includes('beauty') || slug.includes('personal'))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  if (slug.includes('oral') || slug.includes('dental') || slug.includes('teeth'))
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

export default function CategorySpotlightTabs({ spotlights }: Props) {
  const [activeId, setActiveId] = useState(spotlights[0]?.category.id ?? 0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const current = spotlights.find(s => s.category.id === activeId) ?? spotlights[0];
  if (!current) return null;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6">
      <div className="max-w-full mx-auto">

        {/* Scrollable Category Tabs */}
        <div className="mb-8 -mx-4 lg:-mx-6 relative group">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-all ml-2 lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-all mr-2 lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-x-auto px-4 lg:px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            <div className="flex gap-3 pb-4 min-w-max">
              {spotlights.map(({ category }) => (
                <button
                  key={category.id}
                  onClick={() => setActiveId(category.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold! text-sm transition-all whitespace-nowrap ${
                    activeId === category.id
                      ? 'bg-[#184363] text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span className={activeId === category.id ? 'text-white' : 'text-[#009eb9]'}>
                    {getCategoryIcon(category.slug)}
                  </span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold! text-[#184363] mb-2">
              {current.category.name}
            </h3>
            <p className="text-neutral-600">
              Explore our {current.category.name.toLowerCase()} range — trusted brands, great prices.
            </p>
          </div>
          <Link
            href={`/shop?category=${current.category.slug}`}
            className="hidden lg:inline-flex items-center gap-2 text-[#009eb9] font-semibold! hover:gap-3 transition-all"
          >
            View All in {current.category.name}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        {current.products.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-lg font-medium">Products coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {current.products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 hover:border-[#009eb9]/25 transition-all duration-200 group relative"
              >
                {product.onSale && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs font-bold! rounded-full z-10">
                    Sale
                  </div>
                )}
                <div className="relative bg-white p-4 h-40 overflow-hidden">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                  )}
                </div>
                <div className="p-3 border-t border-neutral-100">
                  <p className="text-xs text-[#009eb9] font-medium! mb-1">{product.category}</p>
                  <h4 className="text-xs font-bold! text-[#184363] mb-2 line-clamp-2 min-h-8">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-2">
                    {product.onSale && product.originalPrice > product.salePrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        R{product.originalPrice.toFixed(0)}
                      </span>
                    )}
                    <span className="text-base font-extrabold! text-[#009eb9]">
                      R{product.salePrice.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full px-3 py-2 bg-[#e8f5f7] text-[#184363] font-semibold! text-xs rounded-xl hover:bg-[#009eb9] hover:text-white transition-all duration-200 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Add to basket
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="text-center lg:hidden">
          <Link
            href={`/shop?category=${current.category.slug}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View All in {current.category.name}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
