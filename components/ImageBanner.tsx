'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type BannerData = {
  image_url: string;
  link: string;
  alt_text: string;
}

const FALLBACK: BannerData = {
  image_url: 'https://sparkport.co.za/wp-content/uploads/sparkport-web-banner.png',
  link: '/shop',
  alt_text: 'Promotional Banner',
}

export default function ImageBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null)

  useEffect(() => {
    fetch('/api/image-banner')
      .then(r => r.json())
      .then((data: BannerData) => {
        setBanner(data?.image_url ? data : FALLBACK)
      })
      .catch(() => setBanner(FALLBACK))
  }, [])

  const b = banner ?? FALLBACK
  if (!b.image_url) return null

  return (
    <section className="py-8 lg:py-12">
      <div className="lg:px-6">
        <a
          href={b.link}
          className="block relative overflow-hidden lg:rounded-2xl group h-[300px] lg:h-[400px] shadow-lg hover:shadow-xl transition-shadow"
        >
          <Image
            src={b.image_url}
            alt={b.alt_text}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </a>
      </div>
    </section>
  );
}
