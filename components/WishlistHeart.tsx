'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import type { Product } from '@/lib/wordpress';

interface Props {
  product: Product;
  /** `floating` sits absolute top-right over a product image; `inline` is a plain button. */
  variant?: 'floating' | 'inline';
  className?: string;
}

export default function WishlistHeart({ product, variant = 'floating', className = '' }: Props) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const base = variant === 'floating'
    ? 'absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border border-white/60 shadow-sm hover:bg-white transition-colors'
    : 'inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white hover:border-rose-300 transition-colors';

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${base} ${saved ? 'text-rose-600' : 'text-neutral-400 hover:text-rose-600'} ${className}`}
    >
      <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
