'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/wordpress';
import { useCart } from '@/contexts/CartContext';
import WishlistHeart from './WishlistHeart';
import ProductImagePlaceholder from './ProductImagePlaceholder';

function StarRating({ rating, count }: { rating: number; count: number }) {
  if (count === 0) return null;
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
      <span className="text-[10px] text-neutral-400">({count})</span>
    </div>
  );
}

interface Props {
  product: Product;
  linkSource?: string;
  priority?: boolean;
}

export default function ShopProductCard({ product, linkSource = 'shop', priority = false }: Props) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const subtotal = product.salePrice * qty;
  const originalSubtotal = product.originalPrice * qty;

  const bump = (delta: number) => setQty((q) => Math.max(1, Math.min(99, q + delta)));

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding || added) return;
    setAdding(true);
    try {
      await addToCart(product.id, qty, {
        name: product.name,
        price: String(Math.round(product.salePrice * 100)),
        image: product.image,
      });
      setAdded(true);
      setQty(1);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      // error toast handled upstream
    } finally {
      setAdding(false);
    }
  };

  const href = `/product/${product.id}?from=${linkSource}`;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl transition-all group relative">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        {product.inStock && product.onSale && product.originalPrice > product.salePrice && (
          <span key="hot-deal" className="px-2.5 py-1 bg-black text-white text-[10px] font-bold! rounded-full">Hot Deal</span>
        )}
        {!product.inStock && (
          <span key="out-of-stock" className="px-2.5 py-1 bg-neutral-600 text-white text-[10px] font-bold! rounded-full">Out of Stock</span>
        )}
        {product.inStock && product.stockQuantity !== null && product.stockQuantity <= 5 && (
          <span key="low-stock" className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold! rounded-full">Low Stock</span>
        )}
      </div>
      <div className="relative">
        <WishlistHeart product={product} />
        <Link href={href} className="block">
          <div className="relative bg-white h-56 overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-contain p-8 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply${!product.inStock ? ' grayscale' : ''}`}
                priority={priority}
              />
            ) : (
              <ProductImagePlaceholder name={product.name} size="md" />
            )}
          </div>
        </Link>
      </div>
      <div className="p-5 pt-4 border-t border-neutral-100">
        <p className="text-xs text-[#009eb9] font-medium! mb-1">{product.category}</p>
        <Link href={href} className="block">
          <h3 className="text-sm font-bold! text-[#184363] mb-2 min-h-10 line-clamp-2 hover:text-[#009eb9] transition-colors">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.averageRating} count={product.ratingCount} />
        <div className="flex items-baseline gap-2 mb-1">
          {product.onSale && product.originalPrice > product.salePrice && (
            <span className="text-sm text-neutral-400 line-through">R{originalSubtotal.toFixed(2)}</span>
          )}
          <span className="text-xl font-extrabold! text-[#009eb9]">R{subtotal.toFixed(2)}</span>
        </div>
        {qty > 1 && (
          <p className="text-[10px] text-neutral-500 mb-1">R{product.salePrice.toFixed(2)} × {qty}</p>
        )}
        {product.onSale && product.originalPrice > product.salePrice && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold! rounded-full">
              You save R{((product.originalPrice - product.salePrice) * qty).toFixed(2)}
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
              <button type="button" onClick={(e) => { e.preventDefault(); bump(-1); }} className="text-neutral-600 hover:text-[#184363] font-bold! text-lg leading-none">−</button>
              <span className="font-semibold! text-[#184363] w-6 text-center text-sm">{qty}</span>
              <button type="button" onClick={(e) => { e.preventDefault(); bump(1); }} className="text-neutral-600 hover:text-[#184363] font-bold! text-lg leading-none">+</button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || added}
              className={`flex-1 px-4 py-2.5 font-semibold! rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-[#e8f5f7] text-[#184363] hover:bg-[#009eb9] hover:text-white'
              }`}
            >
              {added ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : adding ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              )}
              {added ? 'Added!' : adding ? 'Adding...' : product.onSale ? 'Grab This Deal' : 'Add to Basket'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
