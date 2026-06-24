'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/wordpress';
import { useCart } from '@/contexts/CartContext';

type TabType = 'hot-deals' | 'bestsellers' | 'new-arrivals';

interface Props {
  hotDeals: Product[];
  bestsellers: Product[];
  newArrivals: Product[];
}

export default function FeaturedProductsTabs({ hotDeals, bestsellers, newArrivals }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('hot-deals');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  const getQty = (id: number) => quantities[id] ?? 1;
  const setQty = (id: number, qty: number) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, Math.min(99, qty)) }));

  const handleAdd = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (addingIds.has(product.id)) return;
    setAddingIds(prev => new Set(prev).add(product.id));
    await addToCart(product.id, getQty(product.id));
    setAddingIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
  };

  const tabs: { key: TabType; label: string; products: Product[]; badge: string; icon: React.ReactNode }[] = [
    {
      key: 'hot-deals',
      label: 'Hot Deals',
      products: hotDeals,
      badge: 'Sale',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: 'bestsellers',
      label: 'Bestsellers',
      products: bestsellers,
      badge: 'Bestseller',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      key: 'new-arrivals',
      label: 'New Arrivals',
      products: newArrivals,
      badge: 'New',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
      ),
    },
  ];

  const active = tabs.find((t) => t.key === activeTab)!;

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white rounded-xl shadow-md border border-neutral-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-xl font-semibold! text-sm transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#009eb9] text-white shadow-md'
                  : 'text-neutral-600 hover:text-[#184363]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {active.products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 hover:border-[#009eb9]/25 transition-all duration-200 group relative"
          >
            <div className={`absolute top-3 left-3 px-3 py-1 text-white text-xs font-bold! rounded-full z-10 ${
              active.badge === 'Sale' ? 'bg-black' : 'bg-[#009eb9]'
            }`}>
              {active.badge}
            </div>

            <div className="relative bg-white p-6 h-52 overflow-hidden">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                />
              )}
            </div>

            <div className="p-4 border-t border-neutral-100">
              <p className="text-xs text-[#009eb9] font-medium! mb-2">{product.category}</p>
              <h3 className="text-sm font-bold! text-[#184363] mb-3 line-clamp-2 min-h-10">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                {product.originalPrice !== product.salePrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    R{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-extrabold! text-[#009eb9]">
                  R{product.salePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-neutral-50 rounded-xl px-2 py-2">
                  <button
                    onClick={(e) => { e.preventDefault(); setQty(product.id, getQty(product.id) - 1); }}
                    className="text-neutral-600 hover:text-[#184363] font-bold! text-lg w-6 h-6 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-semibold! text-[#184363] w-6 text-center text-sm">{getQty(product.id)}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); setQty(product.id, getQty(product.id) + 1); }}
                    className="text-neutral-600 hover:text-[#184363] font-bold! text-lg w-6 h-6 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={(e) => handleAdd(e, product)}
                  disabled={addingIds.has(product.id)}
                  className="flex-1 px-3 py-2 bg-[#e8f5f7] text-[#184363] font-semibold! text-sm rounded-xl hover:bg-[#009eb9] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1"
                >
                  {addingIds.has(product.id) ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  )}
                  {addingIds.has(product.id) ? 'Adding...' : 'Add to basket'}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
