'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Banner = {
  slot: string;
  image_url: string;
  link: string;
  badge_text: string;
  title: string;
  title_line2: string;
  cta_text: string;
}

const FALLBACKS: Banner[] = [
  {
    slot: 'surgical',
    image_url: 'https://sparkport.co.za/wp-content/uploads/SURGICAL-BANNER.png',
    link: '/surgical-catalogue',
    badge_text: '', title: '', title_line2: '', cta_text: '',
  },
  {
    slot: 'flu_season',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    link: '/flu-protection-guide',
    badge_text: 'Quick, Safe & Effective',
    title: 'Protect Yourself',
    title_line2: 'This Flu Season',
    cta_text: 'Read the Guide',
  },
  {
    slot: 'healthcare',
    image_url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
    link: '/health-care-services',
    badge_text: 'Your Health, Our Priority',
    title: 'Comprehensive Care',
    title_line2: 'Close to Home',
    cta_text: 'Learn More About Our Services',
  },
];

export default function PromotionalBanners() {
  const [banners, setBanners] = useState<Banner[]>(FALLBACKS);

  useEffect(() => {
    fetch('/api/promotional-banners')
      .then(r => r.json())
      .then((data: Banner[]) => {
        if (Array.isArray(data) && data.length > 0) setBanners(data);
      })
      .catch(() => {});
  }, []);

  const surgical   = banners.find(b => b.slot === 'surgical')   ?? FALLBACKS[0];
  const fluSeason  = banners.find(b => b.slot === 'flu_season')  ?? FALLBACKS[1];
  const healthcare = banners.find(b => b.slot === 'healthcare') ?? FALLBACKS[2];

  return (
    <section className="py-12 lg:py-16">
      <div className="lg:px-6 space-y-6">

        {/* Full-width surgical banner */}
        <Link
          href={surgical.link}
          className="block relative overflow-hidden lg:rounded-3xl group h-75 lg:h-87.5 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <Image
            src={surgical.image_url}
            alt="Surgical Supplies Banner"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Two half-width banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6">

          {/* Flu Season — left */}
          <Link
            href={fluSeason.link}
            className="relative overflow-hidden lg:rounded-3xl group h-70 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${fluSeason.image_url}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-slate-800/90 to-slate-900/85" />
            <div className="relative h-full flex flex-col justify-end p-8">
              {fluSeason.badge_text && (
                <div className="mb-3">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold! uppercase tracking-wide">
                    {fluSeason.badge_text}
                  </span>
                </div>
              )}
              <h3 className="text-3xl lg:text-4xl font-extrabold! text-white mb-3 leading-tight">
                {fluSeason.title}
                {fluSeason.title_line2 && <span className="block mt-1">{fluSeason.title_line2}</span>}
              </h3>
              {fluSeason.cta_text && (
                <div className="inline-flex items-center gap-2 text-white font-semibold! group-hover:gap-3 transition-all">
                  {fluSeason.cta_text}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </Link>

          {/* Healthcare Services — right */}
          <Link
            href={healthcare.link}
            className="relative overflow-hidden lg:rounded-3xl group h-70 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${healthcare.image_url}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-[#009eb9]/90 to-[#007a8f]/90" />
            <div className="relative h-full flex flex-col justify-end p-8">
              {healthcare.badge_text && (
                <div className="mb-3">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold! uppercase tracking-wide">
                    {healthcare.badge_text}
                  </span>
                </div>
              )}
              <h3 className="text-3xl lg:text-4xl font-extrabold! text-white mb-3 leading-tight">
                {healthcare.title}
                {healthcare.title_line2 && <span className="block mt-1">{healthcare.title_line2}</span>}
              </h3>
              {healthcare.cta_text && (
                <div className="inline-flex items-center gap-2 text-white font-semibold! group-hover:gap-3 transition-all">
                  {healthcare.cta_text}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
