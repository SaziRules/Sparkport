'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopMegaMenu({ isOpen, onClose }: ShopMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      name: 'Health & Wellness',
      subcategories: [
        { name: 'Vitamins & Supplements', link: '/categories/vitamins', image: '/images/categories/vitamins.jpeg' },
        { name: 'Weight Management', link: '/categories/weight-management', image: '/images/categories/weight.jpg' },
      ]
    },
    {
      name: 'Medicines',
      subcategories: [
        { name: 'Pain Relief', link: '/categories/pain-relief', image: '/images/categories/pain.jpg' },
        { name: 'Cold & Flu', link: '/categories/cold-flu', image: '/images/categories/cold.jpeg' },
      ]
    },
    {
      name: 'Personal Care',
      subcategories: [
        { name: 'Skincare', link: '/categories/skincare', image: '/images/categories/skincare.jpeg' },
        { name: 'Hair Care', link: '/categories/haircare', image: '/images/categories/haircare.jpg' },
      ]
    },
    {
      name: 'Baby & Child',
      subcategories: [
        { name: 'Baby Food & Formula', link: '/categories/baby-food', image: '/images/categories/baby-food.jpeg' },
        { name: 'Diapers & Wipes', link: '/categories/diapers', image: '/images/categories/diapers.jpg' },
      ]
    },
    {
      name: 'Medical Devices',
      subcategories: [
        { name: 'Blood Pressure Monitors', link: '/categories/bp-monitors', image: '/images/categories/bp-monitor.jpeg' },
        { name: 'Surgical Tools & Wheelchairs', link: '/categories/surgical-tools', image: '/images/categories/surgical-tools.webp' },
      ]
    },
  ];

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-neutral-200 z-50"
      style={{
        animation: 'slideUpFade 0.4s ease-out forwards'
      }}
    >
      <style jsx>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="mx-auto max-w-385 px-6 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-black! text-[#184363] mb-2">
            Shop by Category
          </h3>
          <p className="text-sm text-neutral-600">
            Browse our complete range of healthcare products and wellness solutions
          </p>
        </div>

        {/* Categories Grid - 5 columns */}
        <div className="grid grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="space-y-3">
              {/* Category Title */}
              <h4 className="text-sm font-bold! text-[#184363] uppercase tracking-wide border-b-2 border-[#009eb9] pb-2">
                {category.name}
              </h4>
              
              {/* Subcategories - 2 rows */}
              <div className="space-y-3">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.link}
                    onClick={onClose}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative h-28 rounded-lg overflow-hidden mb-2 bg-neutral-100">
                      <Image
                        src={sub.image}
                        alt={sub.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Name */}
                    <p className="text-sm text-neutral-700 group-hover:text-[#009eb9] transition-colors font-medium!">
                      {sub.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/sale"
              onClick={onClose}
              className="text-sm font-semibold text-white bg-[#009eb9] px-6 py-2.5 rounded-full hover:bg-[#184363] transition-colors"
            >
              Shop Sale Items
            </Link>
            <Link 
              href="/brands"
              onClick={onClose}
              className="text-sm font-semibold text-white bg-[#009eb9] px-6 py-2.5 rounded-full hover:bg-[#184363] transition-colors"
            >
              Shop by Brand
            </Link>
            <Link 
              href="/new-arrivals"
              onClick={onClose}
              className="text-sm font-semibold text-[#009eb9] hover:text-[#184363] transition-colors"
            >
              New Arrivals →
            </Link>
          </div>
          <Link 
            href="/categories"
            onClick={onClose}
            className="text-sm font-semibold text-neutral-600 hover:text-[#009eb9] transition-colors"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </div>
  );
}