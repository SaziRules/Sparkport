'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/wordpress';
import { useCart } from '@/contexts/CartContext';

export default function SurgicalProductsGrid({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  const handleAdd = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (addingIds.has(product.id)) return;
    setAddingIds(prev => new Set(prev).add(product.id));
    await addToCart(product.id, 1);
    setAddingIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Prev */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-neutral-200 rounded-full shadow-md flex items-center justify-center text-[#184363] hover:bg-[#009eb9] hover:text-white hover:border-[#009eb9] transition-all duration-200"
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl transition-all group relative flex-none w-72 snap-start"
          >
            {product.onSale && (
              <div className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-bold! rounded-full z-10">
                Sale
              </div>
            )}
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative bg-white h-56 overflow-hidden">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="288px"
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                  />
                )}
              </div>
            </Link>
            <div className="p-5 pt-4 border-t border-neutral-100">
              <p className="text-xs text-[#009eb9] font-medium! mb-1">{product.category}</p>
              <Link href={`/product/${product.id}`} className="block">
                <h3 className="text-sm font-bold! text-[#184363] mb-2 min-h-10 line-clamp-2 hover:text-[#009eb9] transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-baseline gap-2 mb-4">
                {product.onSale && product.originalPrice > product.salePrice && (
                  <span className="text-sm text-neutral-400 line-through">R{product.originalPrice.toFixed(2)}</span>
                )}
                <span className="text-xl font-extrabold! text-[#009eb9]">R{product.salePrice.toFixed(2)}</span>
              </div>
              <button
                onClick={(e) => handleAdd(e, product)}
                disabled={addingIds.has(product.id)}
                className="w-full px-4 py-2.5 bg-[#e8f5f7] text-[#184363] font-semibold! rounded-xl hover:bg-[#009eb9] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                {addingIds.has(product.id) ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                )}
                {addingIds.has(product.id) ? 'Adding...' : 'Add to basket'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-neutral-200 rounded-full shadow-md flex items-center justify-center text-[#184363] hover:bg-[#009eb9] hover:text-white hover:border-[#009eb9] transition-all duration-200"
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
