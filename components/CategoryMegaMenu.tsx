'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = { name: string; slug: string; count: number; image: string | null }

const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  'baby-toddler': '/images/categories/baby.jpeg',
  'baby-and-toddler': '/images/categories/baby.jpeg',
  'baby-food': '/images/categories/baby-food.jpeg',
  'brain-boost': '/images/categories/brain-boost.jpg',
  'brain-boosters': '/images/categories/brain-boosters.jpg',
  'cold-flu': '/images/categories/cold.jpeg',
  'cold-and-flu': '/images/categories/cold.jpeg',
  devices: '/images/categories/devices.jpg',
  diapers: '/images/categories/diapers.jpg',
  haircare: '/images/categories/haircare.jpg',
  'health-personal-care': '/images/categories/personal-care.jpg',
  'medical-devices': '/images/categories/devices.jpg',
  'medicines-treatments': '/images/categories/pain.jpg',
  'pain-relief': '/images/categories/pain.jpg',
  'personal-care': '/images/categories/personal-care.jpg',
  'skincare-beauty': '/images/categories/skincare.jpeg',
  'sports-nutrition': '/images/categories/weight.jpg',
  'surgical-tools': '/images/categories/surgical-tools.webp',
  'traditional-healing': '/images/categories/traditional-healing.avif',
  'vitamins-and-supplements': '/images/categories/vitamins.jpeg',
  'vitamins-supplements': '/images/categories/vitamins.jpeg',
  vitamins: '/images/categories/vitamins.jpeg',
  weight: '/images/categories/weight.jpg',
  'weight-management': '/images/categories/weight.jpg',
  'women-health': '/images/categories/women-health.jpg',
};

const CATEGORY_IMAGE_RULES = [
  { keyword: 'baby', image: '/images/categories/baby.jpeg' },
  { keyword: 'brain', image: '/images/categories/brain-boost.jpg' },
  { keyword: 'cold', image: '/images/categories/cold.jpeg' },
  { keyword: 'diaper', image: '/images/categories/diapers.jpg' },
  { keyword: 'hair', image: '/images/categories/haircare.jpg' },
  { keyword: 'device', image: '/images/categories/devices.jpg' },
  { keyword: 'personal', image: '/images/categories/personal-care.jpg' },
  { keyword: 'skin', image: '/images/categories/skincare.jpeg' },
  { keyword: 'surgical', image: '/images/categories/surgical-tools.webp' },
  { keyword: 'traditional', image: '/images/categories/traditional-healing.avif' },
  { keyword: 'vitamin', image: '/images/categories/vitamins.jpeg' },
  { keyword: 'weight', image: '/images/categories/weight.jpg' },
  { keyword: 'women', image: '/images/categories/women-health.jpg' },
];

const FALLBACK_CATEGORY_IMAGES = [
  '/images/categories/vitamins.jpeg',
  '/images/categories/baby.jpeg',
  '/images/categories/personal-care.jpg',
  '/images/categories/skincare.jpeg',
  '/images/categories/cold.jpeg',
  '/images/categories/weight.jpg',
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

function categoryImage(category: Category, index: number): string {
  const slug = category.slug.toLowerCase();
  const normalized = `${category.slug} ${category.name}`.toLowerCase();
  const localImage = CATEGORY_IMAGE_BY_SLUG[slug] ??
    CATEGORY_IMAGE_RULES.find(rule => normalized.includes(rule.keyword))?.image;

  return localImage ?? FALLBACK_CATEGORY_IMAGES[index % FALLBACK_CATEGORY_IMAGES.length];
}

export default function CategoryMegaMenu({ isOpen, onClose }: CategoryMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    fetch('/api/categories')
      .then(r => r.json())
      .then((data: Category[]) => {
        setCategories(data.slice(0, 6));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const [featured, ...rest] = categories;
  const secondary = rest.slice(0, 4);
  const wide = rest[4];

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">Browse Categories</p>
          <Link
            href="/categories"
            onClick={onClose}
            className="text-[11px] text-[#009eb9] hover:text-[#184363] font-semibold transition-colors flex items-center gap-0.5"
          >
            View all
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Skeleton */}
        {!loaded ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-44 shrink-0 h-[208px] bg-neutral-100 rounded-xl animate-pulse" />
              <div className="flex-1 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            <div className="h-14 bg-neutral-100 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Bento: featured tall left + 2×2 grid right */}
            <div className="flex gap-3">
              {/* Featured card */}
              {featured && (
                <Link
                  href={`/shop?category=${featured.slug}`}
                  onClick={onClose}
                  className="group relative w-44 shrink-0 rounded-xl overflow-hidden bg-neutral-900 min-h-[208px]"
                >
                  <Image
                    src={categoryImage(featured, 0)}
                    alt={featured.name}
                    fill
                    className="object-cover opacity-75 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                  {/* Teal accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#009eb9] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400 ease-out" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#009eb9]">Top Pick</span>
                    <h4 className="text-[15px] font-extrabold text-white mt-1 leading-tight">
                      {shortName(featured.name, featured.slug)}
                    </h4>
                    <p className="text-[10px] text-white/50 mt-0.5">{featured.count} products</p>
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] text-white opacity-0 translate-y-1 group-hover:opacity-75 group-hover:translate-y-0 transition-all duration-200">
                      <span>Shop now</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )}

              {/* 2×2 secondary grid */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                {secondary.map((cat, idx) => (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    onClick={onClose}
                    className="group relative h-24 rounded-xl overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={categoryImage(cat, idx + 1)}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/5 to-transparent" />
                    {/* Bottom accent bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009eb9] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {shortName(cat.name, cat.slug)}
                      </h4>
                      <p className="text-[9px] text-white/50">{cat.count} products</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Wide bottom card */}
            {wide && (
              <Link
                href={`/shop?category=${wide.slug}`}
                onClick={onClose}
                className="group relative flex items-center rounded-xl overflow-hidden h-[52px]"
              >
                <Image
                  src={categoryImage(wide, 5)}
                  alt={wide.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-200" />
                <div className="relative flex items-center justify-between w-full px-4">
                  <h4 className="text-sm font-bold text-white">{shortName(wide.name, wide.slug)}</h4>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs">
                    <span>{wide.count} products</span>
                    <svg
                      className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
