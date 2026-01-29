'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryMegaMenu({ isOpen, onClose }: CategoryMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      name: 'Personal Care',
      image: '/images/categories/personal-care.jpg',
      link: '/categories/personal-care',
      description: 'Skincare, haircare, and hygiene essentials'
    },
    {
      name: 'Brain Boosters',
      image: '/images/categories/brain-boost.jpg',
      link: '/categories/brain-boosters',
      description: 'Support your mental wellness'
    },
    {
      name: 'Baby & Toddler',
      image: '/images/categories/baby.jpeg',
      link: '/categories/baby',
      description: 'Everything for your little ones'
    },
    {
      name: 'Women Health',
      image: '/images/categories/women-health.jpg',
      link: '/categories/women-health',
      description: 'Feminine care essentials and more'
    },
    {
      name: 'Traditional Healing',
      image: '/images/categories/traditional-healing.avif',
      link: '/categories/traditional-healing',
      description: 'Herbal & natural remedies the traditional way'
    },
    {
      name: 'Surgical Devices',
      image: '/images/categories/devices.jpg',
      link: '/categories/devices',
      description: 'High-quality medical devices and supplies'
    }
  ];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold! text-[#184363] mb-2">
            Shop by Category
          </h3>
          <p className="text-sm text-neutral-600">
            Browse our full range of healthcare products and services
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              onClick={onClose}
              className="group relative h-48 rounded-xl overflow-hidden bg-neutral-100 hover:shadow-lg transition-all"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-bold! text-white mb-1">
                  {category.name}
                </h4>
                <p className="text-xs text-white/80!">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Can't find what you're looking for?
          </p>
          <Link 
            href="/categories"
            onClick={onClose}
            className="text-sm font-semibold text-[#009eb9] hover:text-[#184363] transition-colors"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </div>
  );
}