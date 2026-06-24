'use client';

import Link from 'next/link';

interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopMegaMenu({ isOpen, onClose }: ShopMegaMenuProps) {

  const columns = [
    {
      title: 'Health & Wellness',
      links: [
        { name: 'Vitamins & Supplements', href: '/categories/vitamins' },
        { name: 'Weight Management', href: '/categories/weight-management' },
        { name: 'Sports Nutrition', href: '/categories/sports-nutrition' },
        { name: 'Immune Support', href: '/categories/immune-support' },
        { name: 'Mental Wellness', href: '/categories/mental-wellness' },
      ],
    },
    {
      title: 'Medicines',
      links: [
        { name: 'Pain Relief', href: '/categories/pain-relief' },
        { name: 'Cold & Flu', href: '/categories/cold-flu' },
        { name: 'Allergy & Sinus', href: '/categories/allergy' },
        { name: 'Digestive Health', href: '/categories/digestive' },
        { name: 'Chronic Medication', href: '/categories/chronic' },
      ],
    },
    {
      title: 'Personal Care',
      links: [
        { name: 'Skincare', href: '/categories/skincare' },
        { name: 'Hair Care', href: '/categories/haircare' },
        { name: 'Oral Health', href: '/categories/oral-health' },
        { name: 'Eye Care', href: '/categories/eye-care' },
        { name: 'Feminine Care', href: '/categories/feminine-care' },
      ],
    },
    {
      title: 'Baby, Child & Mom',
      links: [
        { name: 'Baby Food & Formula', href: '/categories/baby-food' },
        { name: 'Diapers & Wipes', href: '/categories/diapers' },
        { name: 'Baby Skincare', href: '/categories/baby-skincare' },
        { name: 'Pregnancy & Mom', href: '/categories/pregnancy' },
        { name: 'Medical Devices', href: '/categories/medical-devices' },
      ],
    },
  ];

  return (
    <div
      className={`absolute left-0 right-0 top-full bg-white shadow-2xl border-t-2 border-t-[#009eb9] z-50 transition-all duration-200 ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-385 px-6 py-8">
        <div className="flex gap-8">

          {/* 4 text-link columns */}
          <div className="flex-1 grid grid-cols-4 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold! text-[#184363] uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="group flex items-center gap-1.5 text-sm text-neutral-600 hover:text-[#009eb9] transition-colors"
                      >
                        <svg
                          className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shrink-0 text-[#009eb9]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured dark panel */}
          <div className="w-52 shrink-0 bg-[#184363] rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-[#009eb9] text-xs font-bold! uppercase tracking-widest">Quick Access</p>

            <Link
              href="/fill-your-script"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 transition-colors group"
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
              href="/sale"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 transition-colors group"
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
              href="/rewards"
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 transition-colors group"
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

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-6">
          <Link href="/brands" onClick={onClose} className="text-xs font-semibold text-neutral-400 hover:text-[#009eb9] transition-colors">
            Shop by Brand →
          </Link>
          <Link href="/new-arrivals" onClick={onClose} className="text-xs font-semibold text-neutral-400 hover:text-[#009eb9] transition-colors">
            New Arrivals →
          </Link>
          <Link href="/sale" onClick={onClose} className="text-xs font-semibold text-neutral-400 hover:text-[#009eb9] transition-colors">
            Sale Items →
          </Link>
        </div>
      </div>
    </div>
  );
}
