'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ShopMegaMenuProps {
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

/** Compact, readable Heroicons-style paths matched by keyword. Specific rules first. */
const CATEGORY_ICONS: { match: RegExp; path: string }[] = [
  // First aid → medical plus/cross
  { match: /first.?aid|bandage|emergency/,
    path: 'M12 4.5v15m7.5-7.5h-15' },
  // Oral / dental → water drop
  { match: /oral|dental|teeth|tooth|mouth|mint/,
    path: 'M12 2.25a.75.75 0 01.53.22l5.47 5.47c3.03 3.03 3.03 7.94 0 10.97a7.75 7.75 0 01-10.97 0c-3.03-3.03-3.03-7.94 0-10.97L11.47 2.47A.75.75 0 0112 2.25z' },
  // Snacks / drinks / beverage → cup
  { match: /snack|drink|beverage|juice|water|thirst|hydrat/,
    path: 'M6 7h12v9a5 5 0 01-5 5h-2a5 5 0 01-5-5V7zM16 9h3a2 2 0 010 4h-3M9 4l1-2M14 4l-1-2' },
  // Eye / vision / glasses
  { match: /eye|vision|optical|glasses/,
    path: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  // Smoking cessation
  { match: /smoke|quit|nicotine|cigarette/,
    path: 'M3 21l18-18M4.5 12.75l6 6 9-13.5' },
  // Diapers / wipes → gift box
  { match: /diaper|wipe/,
    path: 'M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
  // Baby / toddler → smiley
  { match: /baby|toddler|infant|kid/,
    path: 'M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z' },
  // Brain / mental → lightbulb
  { match: /brain|mental|cogniti/,
    path: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18' },
  // Cold / flu / fever / allergy → thermometer
  { match: /cold|flu|fever|allerg|respirat/,
    path: 'M12 3v16.5M9 19.5h6M8.25 15h7.5' },
  // Devices → tablet/phone
  { match: /device|monitor|equip/,
    path: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3' },
  // Hair → scissors
  { match: /hair|scalp/,
    path: 'M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664' },
  // Personal care / beauty → user
  { match: /person|beauty|cosmetic/,
    path: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  // Pain / medicine → tablet w/ check
  { match: /pain|medicine|treatment|pharma|script|prescri/,
    path: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' },
  // Skin / face → sparkle
  { match: /skin|face/,
    path: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z' },
  // Sport / fitness → lightning bolt
  { match: /sport|nutrition|fitness|protein|muscle/,
    path: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  // Surgical → heart (per request)
  { match: /surgical/,
    path: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  // Tool → wrench
  { match: /tool/,
    path: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75' },
  // Traditional / herbal → sun / radiating
  { match: /traditional|herb|natural|organic/,
    path: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  // Vitamins / supplement → capsule
  { match: /vitamin|supplement/,
    path: 'M10.5 1.5a6 6 0 00-6 6v9a6 6 0 1012 0v-9a6 6 0 00-6-6zM4.5 10.5h12' },
  // Weight / slimming → scale
  { match: /weight|slimming|diet/,
    path: 'M12 6.75a5.25 5.25 0 017.242 4.858.75.75 0 01-.575 1.093 3.75 3.75 0 00-2.904 3.542c0 2.071-1.679 3.75-3.75 3.75s-3.75-1.679-3.75-3.75a3.75 3.75 0 00-2.904-3.542.75.75 0 01-.575-1.093A5.25 5.25 0 0112 6.75zM12 3v2.25' },
  // Women / female / maternity → female symbol ♀
  { match: /women|female|maternity|ladies/,
    path: 'M12 3a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 9v9m-3.5-3.5h7' },
];

function categoryIcon(slug: string, name: string): string {
  const key = `${slug} ${name}`.toLowerCase();
  const match = CATEGORY_ICONS.find((rule) => rule.match.test(key));
  // Default: tag
  return match?.path ?? 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zm5.927 1.023h.008v.008h-.008v-.008z';
}

function categoryImage(category: Category, index: number): string {
  const slug = category.slug.toLowerCase();
  const normalized = `${category.slug} ${category.name}`.toLowerCase();
  const localImage = CATEGORY_IMAGE_BY_SLUG[slug] ??
    CATEGORY_IMAGE_RULES.find(rule => normalized.includes(rule.keyword))?.image;

  return localImage ?? FALLBACK_CATEGORY_IMAGES[index % FALLBACK_CATEGORY_IMAGES.length];
}

const FEATURED_COUNT = 6;

export default function ShopMegaMenu({ isOpen, onClose }: ShopMegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    Promise.all([
      fetch('/api/categories').then((r) => r.json()).catch(() => []),
      fetch('/api/products/count').then((r) => r.json()).catch(() => ({ count: 0 })),
    ]).then(([cats, cnt]: [Category[], { count: number }]) => {
      setCategories(Array.isArray(cats) ? cats.slice(0, 20) : []);
      setTotalProducts(cnt?.count ?? 0);
      setLoaded(true);
    });
  }, [loaded]);

  const featured = categories.slice(0, FEATURED_COUNT);
  const textCats = categories.slice(FEATURED_COUNT);

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 w-full max-w-385 bg-white shadow-2xl rounded-b-2xl border border-neutral-100 border-t-2 border-t-[#009eb9] z-50 transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      <div className="px-6 py-6">
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
                <div className="grid grid-cols-4 gap-2 pt-5 border-t border-neutral-100">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-13 rounded-xl bg-neutral-100 animate-pulse" />
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
                        <Image
                          src={categoryImage(cat, idx)}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
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

                {/* Category button grid — 4 cols, icon · name · count. Ends with two shop-all buttons. */}
                {textCats.length > 0 && (() => {
                  // Icons for the two shop-all buttons
                  const ICON_ALL_CATEGORIES = 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z';
                  const ICON_ALL_PRODUCTS = 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z';

                  return (
                    <div className="pt-5 border-t border-neutral-100">
                      <div className="grid grid-cols-4 gap-2">
                        {textCats.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/shop?category=${cat.slug}`}
                            onClick={onClose}
                            className="group relative flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 hover:bg-white hover:border-[#009eb9]/40 hover:shadow-sm transition-all duration-200 min-w-0"
                          >
                            <span className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#009eb9]/15 to-[#184363]/15 border border-[#009eb9]/20 flex items-center justify-center text-[#009eb9] group-hover:from-[#009eb9] group-hover:to-[#007f95] group-hover:text-white group-hover:border-[#009eb9] transition-all duration-200">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcon(cat.slug, cat.name)} />
                              </svg>
                            </span>
                            <span className="flex-1 min-w-0 text-xs font-bold text-[#184363] group-hover:text-[#009eb9] truncate leading-tight transition-colors">
                              {shortName(cat.name, cat.slug)}
                            </span>
                            <span className="shrink-0 text-[10px] font-bold tabular-nums text-neutral-400 group-hover:text-[#009eb9] transition-colors">
                              {cat.count}
                            </span>
                          </Link>
                        ))}

                        {/* Shop all categories */}
                        <Link
                          href="/categories"
                          onClick={onClose}
                          className="group relative flex items-center gap-2.5 p-2.5 rounded-xl bg-[#184363] border border-[#184363] hover:bg-[#009eb9] hover:border-[#009eb9] transition-all duration-200 min-w-0 shadow-sm"
                        >
                          <span className="shrink-0 w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d={ICON_ALL_CATEGORIES} />
                            </svg>
                          </span>
                          <span className="flex-1 min-w-0 text-[11px] font-black text-white uppercase tracking-wider truncate leading-tight">
                            Shop All Categories
                          </span>
                          <span className="shrink-0 text-[10px] font-bold tabular-nums text-[#7fd4e0]">
                            {categories.length}
                          </span>
                        </Link>

                        {/* Shop all products */}
                        <Link
                          href="/shop"
                          onClick={onClose}
                          className="group relative flex items-center gap-2.5 p-2.5 rounded-xl bg-[#009eb9] border border-[#009eb9] hover:bg-[#007f95] hover:border-[#007f95] transition-all duration-200 min-w-0 shadow-sm"
                        >
                          <span className="shrink-0 w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d={ICON_ALL_PRODUCTS} />
                            </svg>
                          </span>
                          <span className="flex-1 min-w-0 text-[11px] font-black text-white uppercase tracking-wider truncate leading-tight">
                            Shop All Products
                          </span>
                          <span className="shrink-0 text-[10px] font-bold tabular-nums text-white/85">
                            {totalProducts.toLocaleString()}
                          </span>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
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

            <div className="mt-auto flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9]/60" aria-hidden="true" />
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
