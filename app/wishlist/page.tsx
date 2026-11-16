'use client';

import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import ShopProductCard from '@/components/ShopProductCard';

export default function WishlistPage() {
  const { items, count, clearWishlist } = useWishlist();

  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-2">Saved for later</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#184363]">Your Wishlist</h1>
            <p className="text-sm text-neutral-500 mt-2">
              {count === 0
                ? 'Save products as you browse to come back to them later.'
                : `${count} saved on this device. Items stay here for 30 days.`}
            </p>
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm font-semibold text-[#184363] hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {count === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-5">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-[#184363] mb-2">No saved items yet</h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
              Tap the heart on any product to save it here. Your list is kept on this device for 30 days.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007f95] transition-colors text-sm"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <ShopProductCard key={p.id} product={p} linkSource="wishlist" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
