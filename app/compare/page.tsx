'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompare, COMPARE_MAX_ITEMS } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';
import ProductImagePlaceholder from '@/components/ProductImagePlaceholder';
import type { Product } from '@/lib/wordpress';

/* ─────────────────────────── helpers ───────────────────────────────────── */

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#8217;|&rsquo;/gi, '’')
    .replace(/&#8230;|&hellip;/gi, '…')
    .replace(/\s+/g, ' ')
    .trim();
}

function priceOf(p: Product): number {
  return p.onSale && p.salePrice ? p.salePrice : p.originalPrice;
}

function stockLabel(p: Product): string {
  if (!p.inStock) return 'Out of stock';
  if (p.stockQuantity == null) return 'In stock';
  return `${p.stockQuantity} in stock`;
}

function StarRow({ rating, count }: { rating: number; count: number }) {
  if (count === 0) return <span className="text-neutral-400">—</span>;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < full ? 'text-amber-400' : half && i === full ? 'text-amber-300' : 'text-neutral-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-neutral-600">{rating.toFixed(1)}</span>
      <span className="text-xs text-neutral-400">({count})</span>
    </div>
  );
}

/* ─────────────────────────── row groups ────────────────────────────────── */

type Group = {
  title: string;
  rows: { label: string; render: (p: Product) => React.ReactNode }[];
};

const GROUPS: Group[] = [
  {
    title: 'Pricing',
    rows: [
      {
        label: 'Price',
        render: (p) => (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-extrabold text-[#184363]">R{priceOf(p).toFixed(2)}</span>
            {p.onSale && p.originalPrice > p.salePrice && (
              <span className="text-xs text-neutral-400 line-through">R{p.originalPrice.toFixed(2)}</span>
            )}
          </div>
        ),
      },
      {
        label: 'Sale',
        render: (p) =>
          p.onSale && p.originalPrice > p.salePrice ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Save R{(p.originalPrice - p.salePrice).toFixed(2)}
            </span>
          ) : (
            <span className="text-neutral-400">—</span>
          ),
      },
    ],
  },
  {
    title: 'Availability',
    rows: [
      {
        label: 'Stock',
        render: (p) =>
          p.inStock ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stockLabel(p)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Out of stock
            </span>
          ),
      },
    ],
  },
  {
    title: 'Details',
    rows: [
      { label: 'Brand',    render: (p) => p.brand    ? <span className="font-semibold text-[#184363]">{p.brand}</span>    : <span className="text-neutral-400">—</span> },
      { label: 'Category', render: (p) => p.category ? <span className="font-semibold text-[#184363]">{p.category}</span> : <span className="text-neutral-400">—</span> },
      { label: 'Rating',   render: (p) => <StarRow rating={p.averageRating} count={p.ratingCount} /> },
      { label: 'SKU',      render: (p) => p.sku ? <span className="font-mono text-xs text-neutral-500">{p.sku}</span> : <span className="text-neutral-400">—</span> },
    ],
  },
  {
    title: 'About',
    rows: [
      {
        label: 'Description',
        render: (p) => {
          const txt = stripHtml(p.shortDescription || p.description || '');
          if (!txt) return <span className="text-neutral-400">—</span>;
          return <p className="text-sm leading-relaxed text-neutral-600 line-clamp-6">{txt}</p>;
        },
      },
    ],
  },
];

/* ─────────────────────────── page ──────────────────────────────────────── */

type Slot = { kind: 'pinned' | 'suggested'; product: Product };

export default function ComparePage() {
  const { items, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      setSuggestions([]);
      return;
    }
    const seed = items[0];
    if (!seed.category) return;
    const needed = COMPARE_MAX_ITEMS - items.length;
    if (needed <= 0) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const exclude = items.map((p) => p.id).join(',');
    fetch(`/api/products/related?category=${encodeURIComponent(seed.category)}&exclude=${exclude}&limit=${needed}`)
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((data: { products: Product[] }) => setSuggestions(data.products ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [items]);

  const slots: Slot[] = useMemo(() => {
    const pinned: Slot[] = items.map((p) => ({ kind: 'pinned', product: p }));
    const needed = Math.max(0, COMPARE_MAX_ITEMS - pinned.length);
    const suggested: Slot[] = suggestions.slice(0, needed).map((p) => ({ kind: 'suggested', product: p }));
    return [...pinned, ...suggested];
  }, [items, suggestions]);

  const emptySlots = Math.max(0, COMPARE_MAX_ITEMS - slots.length);
  const totalCols = slots.length + emptySlots;

  const handleAddToCart = async (p: Product) => {
    setAddingId(p.id);
    try {
      await addToCart(p.id, 1, {
        name: p.name,
        price: String(Math.round(p.salePrice * 100)),
        image: p.image,
      });
    } finally {
      setTimeout(() => setAddingId(null), 1200);
    }
  };

  /* ── Empty state ───────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <main className="bg-neutral-50 min-h-screen">
        <section className="relative bg-gradient-to-br from-[#184363] via-[#184363] to-[#009eb9] py-24 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <p className="text-[#7fd4e0] text-xs font-bold uppercase tracking-[0.4em] mb-4">Side by side</p>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">Compare Products</h1>
            <p className="text-white/75 leading-relaxed max-w-xl mx-auto">
              Pin any product and we will line it up next to the most similar items in the catalogue so you can make the call in seconds.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 -mt-10 relative">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/50 p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#009eb9]/10 flex items-center justify-center text-[#009eb9] mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 16.758 8.729" aria-hidden="true">
                <path d="M16.537 6.252 14.26 8.51a.719.719 0 0 1-.51.219.689.689 0 0 1-.51-.219l-2.313-2.258a.72.72 0 0 1-.018-1.02.683.683 0 0 1 1 0l1 1.038V1.462H6.538a.729.729 0 1 1 0-1.457h7.194a.656.656 0 0 1 .656.71v5.537l1.093-1.038a.788.788 0 0 1 1.075 0 .742.742 0 0 1-.019 1.038Zm-6.32 1.038H3.825V2.463l1 1.038a.679.679 0 0 0 .492.219.729.729 0 0 0 .51-1.238L3.533.205a.76.76 0 0 0-1.038 0L.219 2.463a.7.7 0 0 0 0 1.02.77.77 0 0 0 1.075 0l1.092-1.038v5.537a.677.677 0 0 0 .656.747h7.194a.72.72 0 1 0-.018-1.439Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#184363] mb-3">Nothing to compare yet</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Open any product and tap &ldquo;Compare&rdquo;. We will auto-line up similar items from the same category so you can see how it stacks up.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007f95] transition-colors text-sm shadow-lg shadow-[#009eb9]/25"
            >
              Browse the shop
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── Comparison view ──────────────────────────────────────────── */
  return (
    <main className="bg-neutral-50 min-h-screen pb-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#184363] via-[#184363] to-[#009eb9] py-10 lg:py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <p className="text-[#7fd4e0] text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mb-2 sm:mb-3">Side by side</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">Compare Products</h1>
            <p className="text-sm sm:text-base text-white/70 mt-2 sm:mt-3 max-w-xl">
              {slots.length > items.length
                ? `${items.length} pinned alongside ${slots.length - items.length} similar from ${items[0].category}.`
                : `${items.length} pinned product${items.length === 1 ? '' : 's'}.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/15 transition-colors text-xs sm:text-sm"
            >
              Add more
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-[#184363] font-bold rounded-lg hover:bg-neutral-100 transition-colors text-xs sm:text-sm"
            >
              Clear pinned
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 -mt-6 lg:-mt-10 relative">
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/50 overflow-hidden relative">
          {/* Right-edge scroll affordance on mobile */}
          <div className="lg:hidden absolute top-0 right-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-white/90 to-transparent z-10" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] sm:min-w-[760px] table-fixed">
              {/* ── Product header row ─────────────────────── */}
              <thead>
                <tr className="bg-gradient-to-b from-white to-neutral-50/70">
                  <th className="w-24 sm:w-32 lg:w-40 p-3 sm:p-6 bg-neutral-50 border-r border-neutral-100 align-top" />

                  {slots.map((slot) => (
                    <th
                      key={`${slot.kind}-${slot.product.id}`}
                      className={`p-3 sm:p-5 lg:p-6 align-top border-r border-neutral-100 last:border-r-0  ${slot.kind === 'suggested' ? 'bg-neutral-50/50' : ''}`}
                    >
                      <div className="flex flex-col items-start">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 ${
                            slot.kind === 'pinned'
                              ? 'bg-[#009eb9] text-white shadow-sm shadow-[#009eb9]/40'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${slot.kind === 'pinned' ? 'bg-white' : 'bg-neutral-500'}`} />
                          {slot.kind === 'pinned' ? 'Pinned' : 'Similar'}
                        </span>

                        <div className="relative aspect-square w-full bg-white border border-neutral-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
                          {slot.product.image ? (
                            <Image
                              src={slot.product.image}
                              alt={slot.product.imageAlt || slot.product.name}
                              fill
                              className="object-contain p-4 mix-blend-multiply"
                              sizes="240px"
                            />
                          ) : (
                            <ProductImagePlaceholder name={slot.product.name} size="md" />
                          )}
                        </div>

                        {/* Fixed-height name slot (always 2 lines) so every column aligns */}
                        <Link
                          href={`/product/${slot.product.id}`}
                          className="block w-full text-sm sm:text-base font-extrabold text-[#184363] hover:text-[#009eb9] transition-colors leading-snug line-clamp-2 text-left h-[2.5rem] sm:h-[2.75rem] mb-1"
                        >
                          {slot.product.name}
                        </Link>

                        {/* Fixed-height brand slot (reserves space even when empty) */}
                        <p className="w-full text-[9px] sm:text-[10px] uppercase tracking-widest text-[#009eb9] font-bold text-left h-[1rem] leading-[1rem] mb-3 sm:mb-4">
                          {slot.product.brand || ' '}
                        </p>

                        {slot.kind === 'pinned' ? (
                          <button
                            type="button"
                            onClick={() => removeFromCompare(slot.product.id)}
                            className="text-[11px] text-neutral-400 hover:text-rose-600 font-semibold uppercase tracking-widest transition-colors"
                          >
                            Unpin
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCompare(slot.product)}
                            className="text-[11px] text-[#009eb9] hover:text-[#007f95] font-semibold uppercase tracking-widest transition-colors"
                          >
                            Pin this
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-3 sm:p-5 lg:p-6 align-top border-r border-neutral-100 last:border-r-0 ">
                      {loading ? (
                        <div className="aspect-square w-full flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400">
                          <div className="w-6 h-6 border-2 border-neutral-300 border-t-[#009eb9] rounded-full animate-spin" />
                        </div>
                      ) : (
                        <Link
                          href="/shop"
                          className="aspect-square w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 hover:border-[#009eb9] hover:text-[#009eb9] hover:bg-[#009eb9]/5 transition-all"
                        >
                          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs font-semibold uppercase tracking-wider">Add product</span>
                        </Link>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── Grouped attribute rows ─────────────────── */}
              <tbody>
                {GROUPS.map((group) => (
                  <Fragment key={group.title}>
                    <tr className="bg-[#184363]">
                      <td colSpan={totalCols + 1} className="px-3 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#7fd4e0]">
                        {group.title}
                      </td>
                    </tr>
                    {group.rows.map((row, rowIdx) => (
                      <tr key={`${group.title}-${row.label}`} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/40'}>
                        <td className="w-24 sm:w-32 lg:w-40 px-3 sm:px-5 lg:px-6 py-4 lg:py-5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 align-top border-r border-neutral-100">
                          {row.label}
                        </td>
                        {slots.map((slot) => (
                          <td
                            key={`${slot.kind}-${slot.product.id}`}
                            className={`px-3 sm:px-5 lg:px-6 py-4 lg:py-5 text-xs sm:text-sm text-neutral-700 align-top border-r border-neutral-100 last:border-r-0 ${slot.kind === 'suggested' ? 'bg-neutral-50/40' : ''}`}
                          >
                            {row.render(slot.product)}
                          </td>
                        ))}
                        {Array.from({ length: emptySlots }).map((_, i) => (
                          <td
                            key={`empty-${i}`}
                            className="px-3 sm:px-5 lg:px-6 py-4 lg:py-5 text-xs sm:text-sm text-neutral-300 align-top border-r border-neutral-100 last:border-r-0"
                          >
                            —
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}

                {/* Actions row */}
                <tr className="bg-[#184363]">
                  <td colSpan={totalCols + 1} className="px-3 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#7fd4e0]">
                    Take Action
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="w-24 sm:w-32 lg:w-40 px-3 sm:px-5 lg:px-6 py-4 lg:py-5 bg-neutral-50 border-r border-neutral-100 align-top" />
                  {slots.map((slot) => {
                    const busy = addingId === slot.product.id;
                    return (
                      <td
                        key={`action-${slot.kind}-${slot.product.id}`}
                        className={`px-3 sm:px-5 lg:px-6 py-4 lg:py-5 align-top border-r border-neutral-100 last:border-r-0 ${slot.kind === 'suggested' ? 'bg-neutral-50/40' : ''}`}
                      >
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            disabled={!slot.product.inStock || busy}
                            onClick={() => handleAddToCart(slot.product)}
                            className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${
                              !slot.product.inStock
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : busy
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#009eb9] text-white hover:bg-[#007f95]'
                            }`}
                          >
                            {!slot.product.inStock ? 'Out of stock' : busy ? 'Added ✓' : 'Add to Basket'}
                          </button>
                          <Link
                            href={`/product/${slot.product.id}`}
                            className="w-full text-center px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-neutral-200 text-[#184363] hover:border-[#009eb9] hover:text-[#009eb9] transition-colors"
                          >
                            View Product
                          </Link>
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-3 sm:px-5 lg:px-6 py-4 lg:py-5 border-r border-neutral-100 last:border-r-0" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
