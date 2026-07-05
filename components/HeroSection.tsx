'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FALLBACK_SLIDES = [
  {
    image: '/images/school-kids.jpg',
    title: 'Back to School Deals',
    description: 'Quality medications and healthcare products delivered to your door',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
  },
  {
    image: '/images/wellness.jpg',
    title: 'Wellness Screening',
    description: 'Your wellness, our priority. Book your screening today and live your best life.',
    ctaText: 'Book Here',
    ctaLink: '/promotions',
  },
  {
    image: '/images/heart-health.jpg',
    title: 'Cardiac Health Screening',
    description: 'Designed to detect risk factors for heart disease and stroke early. Take charge of your heart health today.',
    ctaText: 'Book Here',
    ctaLink: '/promotions',
  },
  {
    image: '/images/hero-main-care.jpg',
    title: 'Expert Care, Always',
    description: 'Professional healthcare services and advice when you need it',
    ctaText: 'Learn More',
    ctaLink: '/health-care-services',
  },
];

const FALLBACK_TILES = [
  {
    image: '/images/card-pills.jpg',
    title: 'Vitamins & Supplements',
    subtitle: 'Boost your wellness',
    link: '/categories/vitamins',
  },
  {
    image: '/images/card-baby.png',
    title: 'Baby Care',
    subtitle: 'Everything for baby',
    link: '/categories/baby',
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mainSlides, setMainSlides] = useState<typeof FALLBACK_SLIDES>([]);
  const [smallCards, setSmallCards] = useState<typeof FALLBACK_TILES>(FALLBACK_TILES);

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then((data: { image_url: string; title: string; description: string; cta_text: string; cta_link: string }[]) => {
        setMainSlides(
          Array.isArray(data) && data.length > 0
            ? data.map(b => ({
                image: b.image_url,
                title: b.title,
                description: b.description,
                ctaText: b.cta_text,
                ctaLink: b.cta_link,
              }))
            : FALLBACK_SLIDES
        );
      })
      .catch(() => setMainSlides(FALLBACK_SLIDES));

    fetch('/api/tiles')
      .then(r => r.json())
      .then((data: { image_url: string; title: string; subtitle: string; link: string }[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSmallCards(data.map(t => ({
            image: t.image_url,
            title: t.title,
            subtitle: t.subtitle,
            link: t.link,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const tallCard = {
    image: '/images/card-pills.jpg',
    title: 'Fill Your Prescription Online',
    description: 'Quick, easy and secure',
    link: '/fill-script'
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % mainSlides.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered, mainSlides.length]);

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <section className="w-full bg-neutral-50 py-8 mt-10">
      <div className="mx-auto max-w-385 px-4 lg:px-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Main Hero Card - Left */}
          <div className="col-span-12 lg:col-span-7">
            <div
              className="relative h-96 lg:h-125 rounded-2xl overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br from-[#184363] to-[#009eb9]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Image layer — cinematic push with Ken Burns on active frame */}
              {mainSlides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-[transform] duration-[800ms]"
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
                    transform:
                      index === activeSlide
                        ? 'translateX(0)'
                        : index < activeSlide
                        ? 'translateX(-100%)'
                        : 'translateX(100%)',
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    style={
                      index === activeSlide
                        ? { animation: 'heroKenBurns 6s ease-out forwards' }
                        : { animation: 'none', transform: 'scale(1)' }
                    }
                  />
                </div>
              ))}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/18 to-transparent" />

              {/* Content — decoupled from image push; key remounts to retrigger stagger */}
              {mainSlides.length > 0 && (
                <div
                  key={activeSlide}
                  className="absolute inset-0 z-10 flex flex-col justify-end px-6 pt-6 pb-16 lg:px-10 lg:pt-10 lg:pb-14"
                >
                  <h2
                    className="text-3xl lg:text-5xl font-extrabold! text-white mb-3 leading-tight drop-shadow-lg"
                    style={{ animation: 'heroReveal 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both' }}
                  >
                    {mainSlides[activeSlide].title}
                  </h2>
                  <p
                    className="text-sm lg:text-base text-white/85 mb-6 max-w-sm leading-relaxed"
                    style={{ animation: 'heroReveal 0.7s cubic-bezier(0.16,1,0.3,1) 0.38s both' }}
                  >
                    {mainSlides[activeSlide].description}
                  </p>
                  <div style={{ animation: 'heroReveal 0.7s cubic-bezier(0.16,1,0.3,1) 0.54s both' }}>
                    <Link
                      href={mainSlides[activeSlide].ctaLink}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#184363] font-bold rounded-full shadow-lg hover:bg-[#009eb9] hover:text-white hover:shadow-xl transition-all duration-200 group"
                    >
                      {mainSlides[activeSlide].ctaText}
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Controls — dots act as live progress bar, counter anchors right */}
              <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-6 lg:px-10 py-4">
                <div className="flex items-center gap-2">
                  {mainSlides.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`h-1.5 rounded-full ${
                        activeSlide === index ? 'bg-white' : 'bg-white/35 hover:bg-white/60'
                      }`}
                      style={
                        index === activeSlide
                          ? {
                              animation: 'heroDotProgress 5s linear forwards',
                              animationPlayState: isHovered ? 'paused' : 'running',
                            }
                          : { width: '8px', animation: 'none' }
                      }
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-white/55 text-xs font-medium tabular-nums tracking-widest">
                  {String(activeSlide + 1).padStart(2, '0')} / {String(mainSlides.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Small Cards Column - Middle */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6">
            {smallCards.map((card, index) => (
              <Link
                key={index}
                href={card.link}
                className="group relative h-60.5 lg:h-auto lg:flex-1 rounded-2xl overflow-hidden bg-neutral-900 hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#184363]/80 via-[#184363]/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-extrabold! text-white mb-1">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-white/70 group-hover:text-[#009eb9] transition-colors duration-200">
                    <span className="text-xs font-medium">{card.subtitle}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tall Card - Right */}
          <div className="col-span-12 md:col-span-6 lg:col-span-2 lg:flex lg:flex-col">
            <Link
              href={tallCard.link}
              className="group relative block h-96 md:h-full rounded-2xl overflow-hidden bg-[#184363] hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={tallCard.image}
                alt={tallCard.title}
                fill
                className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#184363] via-[#184363]/70 to-[#009eb9]/50" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="w-11 h-11 mb-5 rounded-2xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold! text-white mb-1.5 leading-snug">
                  {tallCard.title}
                </h3>
                <p className="text-xs text-white/60 mb-4 leading-relaxed">
                  {tallCard.description}
                </p>
                <div className="flex items-center gap-1.5 text-[#009eb9] group-hover:text-white transition-colors duration-200">
                  <span className="text-sm font-semibold">Start Now</span>
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}