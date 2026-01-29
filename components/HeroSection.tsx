'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const mainSlides = [
    {
      image: '/images/school-kids.jpg',
      title: 'Back to School Deals',
      description: 'Quality medications and healthcare products delivered to your door',
      ctaText: 'Shop Now',
      ctaLink: '/shop'
    },
    {
      image: '/images/wellness.jpg',
      title: 'Wellness Screening',
      description: 'Your wellness, our priority. Book your screening today and live your best life.',
      ctaText: 'Book Here',
      ctaLink: '/promotions'
    },
    {
      image: '/images/heart-health.jpg',
      title: 'Cardiac Health Screening',
      description: 'designed to detect risk factors for heart disease and stroke early. Take charge of your heart health today.',
      ctaText: 'Book Here',
      ctaLink: '/promotions'
    },
    {
      image: '/images/hero-main-care.jpg',
      title: 'Expert Care, Always',
      description: 'Professional healthcare services and advice when you need it',
      ctaText: 'Learn More',
      ctaLink: '/health-care-services'
    }
  ];

  const smallCards = [
    {
      image: '/images/card-pills.jpg',
      title: 'Vitamins & Supplements',
      subtitle: 'Boost your wellness',
      link: '/categories/vitamins'
    },
    {
      image: '/images/card-baby.png',
      title: 'Baby Care',
      subtitle: 'Everything for baby',
      link: '/categories/baby'
    }
  ];

  const tallCard = {
    image: '/images/card-prescriptions.jpg',
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
      <div className="mx-auto max-w-385 px-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Main Hero Card - Left */}
          <div className="col-span-12 lg:col-span-7">
            <div 
              className="relative h-96 lg:h-125 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Slides with push-left animation */}
              {mainSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                    index === activeSlide
                      ? 'translate-x-0'
                      : index < activeSlide
                      ? '-translate-x-full'
                      : 'translate-x-full'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* Bottom gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Content Overlay with push-left animation */}
              {mainSlides.map((slide, index) => (
                <div
                  key={`content-${index}`}
                  className={`absolute inset-0 z-10 h-full flex flex-col justify-end p-6 lg:p-10 transition-transform duration-700 ease-in-out ${
                    index === activeSlide
                      ? 'translate-x-0'
                      : index < activeSlide
                      ? '-translate-x-full'
                      : 'translate-x-full'
                  }`}
                >
                  <h2 className="text-3xl lg:text-6xl font-extrabold! text-white mb-3 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-base lg:text-lg text-white! mb-6 max-w-md drop-shadow-md">
                    {slide.description}
                  </p>
                  <div>
                    <Link 
                      href={slide.ctaLink}
                      className="inline-block px-8 py-3 bg-white text-[#009eb9] font-semibold rounded-full hover:bg-[#009eb9] hover:text-white transition-colors"
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              ))}

              {/* Carousel Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {mainSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === index 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Small Cards Column - Middle */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6">
            {smallCards.map((card, index) => (
              <Link 
                key={index}
                href={card.link}
                className="group relative h-60.5 rounded-2xl overflow-hidden bg-linear-to-br from-[#f0f7f7] to-neutral-100 hover:shadow-lg transition-all"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <p className="text-xs font-medium text-neutral-600 mb-1">
                    {card.subtitle}
                  </p>
                  <h3 className="text-xl font-extrabold! text-[#184363]">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Tall Card - Right */}
          <div className="col-span-12 md:col-span-6 lg:col-span-2">
            <Link 
              href={tallCard.link}
              className="group relative block h-96 lg:h-125 rounded-2xl overflow-hidden bg-linear-to-b from-[#009eb9] to-[#184363] hover:shadow-lg transition-all"
            >
              <Image
                src={tallCard.image}
                alt={tallCard.title}
                fill
                className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
              />
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                <div className="w-16 h-16 mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold! text-white mb-2">
                  {tallCard.title}
                </h3>
                <p className="text-sm text-white/80!">
                  {tallCard.description}
                </p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}