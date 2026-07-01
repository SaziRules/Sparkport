'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = { name: string; slug: string; count: number; image: string | null }

const GRADIENTS = [
  'from-[#184363] to-[#009eb9]',
  'from-teal-600 to-cyan-400',
  'from-violet-600 to-purple-400',
  'from-rose-500 to-pink-400',
  'from-orange-500 to-amber-400',
  'from-emerald-600 to-teal-400',
];

const NAME_MAP: Record<string, string> = {
  'vitamins-supplements': 'Vitamins',
  'vitamins-and-supplements': 'Vitamins',
  'baby-toddler': 'Baby Care',
  'baby-and-toddler': 'Baby Care',
  'sports-nutrition': 'Sports Nutrition',
  'medicines-treatments': 'Medicines',
  'health-personal-care': 'Personal Care',
  'skincare-beauty': 'Skincare',
  'cold-flu': 'Cold & Flu',
};

function shortName(name: string, slug: string): string {
  if (NAME_MAP[slug]) return NAME_MAP[slug];
  if (name.length <= 20) return name;
  for (const sep of [' & ', ' / ', ' and ', ' + ']) {
    const idx = name.indexOf(sep);
    if (idx > 3) return name.slice(0, idx);
  }
  return name.slice(0, 18) + '…';
}

const FEATURED_COUNT = 6;
const TEXT_COLS = 4;

export default function ShopMegaMenu({ isOpen, onClose }: ShopMegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    fetch('/api/categories')
      .then(r => r.json())
      .then((data: Category[]) => {
        setCategories(data.slice(0, 20));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  const featured = categories.slice(0, FEATURED_COUNT);
  const textCats = categories.slice(FEATURED_COUNT);
  const columns: Category[][] = Array.from({ length: TEXT_COLS }, () => []);
  textCats.forEach((cat, i) => columns[i % TEXT_COLS].push(cat));

  return (
    <div
      className={`absolute left-0 right-0 top-full bg-white shadow-2xl border-t-2 border-t-[#009eb9] z-50 transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-385 px-6 py-6">
        <div className="flex gap-8">

          {/* Left: category area */}
          <div className="flex-1 min-w-0">
            {!loaded ? (
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-neutral-100 animate-pulse" />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-x-6 pt-4 border-t border-neutral-100">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2.5">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <div key={j} className="h-3 bg-neutral-50 rounded animate-pulse" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Featured image cards */}
                {featured.length > 0 && (
                  <div className="grid grid-cols-6 gap-3">
                    {featured.map((cat, idx) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={onClose}
                        className="group relative h-28 rounded-xl overflow-hidden bg-neutral-100"
                      >
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`} />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                        {/* Bottom accent bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009eb9] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5">
                          <p className="text-[11px] font-bold text-white leading-tight">
                            {shortName(cat.name, cat.slug)}
                          </p>
                          <p className="text-[9px] text-white/50 mt-0.5">{cat.count}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Text link grid */}
                {textCats.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="grid grid-cols-4 gap-x-6">
                      {columns.map((col, ci) => (
                        <ul key={ci} className="space-y-2.5">
                          {col.map((cat) => (
                            <li key={cat.slug}>
                              <Link
                                href={`/shop?category=${cat.slug}`}
                                onClick={onClose}
                                className="group flex items-center gap-1.5 text-sm text-neutral-600 hover:text-[#009eb9] transition-colors"
                              >
                                <svg
                                  className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shrink-0 text-[#009eb9]"
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="truncate">{shortName(cat.name, cat.slug)}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Access dark panel */}
          <div className="w-52 shrink-0 bg-[#184363] rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-[#009eb9] text-xs font-bold! uppercase tracking-widest">Quick Access</p>

            <Link
              href="/fill-script"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 transition-colors"
            >
              <svg className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold! leading-tight">Fill Your Script</p>
                <p className="text-white/45 text-xs mt-0.5">Upload &amp; collect or deliver</p>
              </div>
            </Link>

            <Link
              href="/shop/promotions"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 transition-colors"
            >
              <svg className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold! leading-tight">Shop Deals</p>
                <p className="text-white/45 text-xs mt-0.5">Savings across all categories</p>
              </div>
            </Link>

            <Link
              href="/get-rewarded"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 transition-colors"
            >
              <svg className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold! leading-tight">Sparkport+ Rewards</p>
                <p className="text-white/45 text-xs mt-0.5">Earn points on every purchase</p>
              </div>
            </Link>

            <div className="mt-auto pt-4 border-t border-white/10">
              <Link
                href="/categories"
                onClick={onClose}
                className="text-white/40 hover:text-white/75 text-xs transition-colors"
              >
                View all categories →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
