'use client';

import Image from 'next/image';

interface ImageBannerProps {
  image: string;
  link: string;
  alt?: string;
  height?: string;
}

export default function ImageBanner({ 
  image, 
  link, 
  alt = 'Promotional Banner',
  height = 'h-[200px] lg:h-[250px]'
}: ImageBannerProps) {
  return (
    <section className="py-8 lg:py-12 px-4 lg:px-1">
      <div className="max-w-full mx-auto">
        <a
          href={link}
          className={`block relative overflow-hidden rounded-2xl group ${height} shadow-lg hover:shadow-xl transition-shadow`}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </a>
      </div>
    </section>
  );
}