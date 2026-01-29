'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import CategoryMegaMenu from './CategoryMegaMenu';
import ShopMegaMenu from './ShopMegaMenu';

export default function SparkportHeader() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  return (
    <header className="w-full relative">
      
      {/* Main Header - Sparkport style white background */}
      <div className="w-full bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-385 px-6">
          <div className="flex items-center justify-between h-22">
            
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="Sparkport"
                width={200}
                height={60}
                priority
                className="h-14 w-auto"
              />
            </Link>

            {/* Search Bar with Mega Menu */}
            <div className="flex-1 max-w-2xl mx-12 relative">
              <div className="relative flex items-center bg-[#f0f7f7] rounded-full overflow-hidden">
                {/* Category Button - Opens Mega Menu */}
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="h-12 pl-4 pr-2 bg-transparent border-0 text-sm font-medium text-neutral-500 hover:text-[#009eb9] focus:outline-none cursor-pointer transition-colors flex items-center gap-2"
                >
                  <span>Category</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Divider */}
                <div className="h-6 w-px bg-neutral-300"></div>
                
                <input
                  type="search"
                  placeholder="What are you looking for?"
                  className="flex-1 h-12 pl-2 pr-4 bg-transparent border-0 text-sm text-neutral-700 placeholder-neutral-500 focus:outline-none"
                />
                <button className="h-12 px-5 bg-[#009eb9] text-white hover:bg-[#184363] transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Category Mega Menu */}
              <CategoryMegaMenu 
                isOpen={isCategoryOpen} 
                onClose={() => setIsCategoryOpen(false)} 
              />
            </div>

            {/* Right Icons - Sparkport style */}
            <div className="flex items-center gap-6">
              <Link href="https://facebook.com" target="_blank" className="text-neutral-600 hover:text-[#009eb9] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link href="https://instagram.com" target="_blank" className="text-neutral-600 hover:text-[#009eb9] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link href="/fill-script" className="px-6 py-2.5 bg-[#009eb9] text-white text-sm font-semibold rounded-full hover:bg-[#184363] transition-colors">
                Fill Your Script Online
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Sparkport style dark blue */}
      <div className="w-full bg-[#184363] relative">
        <div className="mx-auto max-w-385 px-6">
          <nav className="flex items-center justify-between h-14">
            {/* Main Navigation */}
            <div className="flex items-center">
              <Link 
                href="/" 
                onMouseEnter={() => setIsShopMenuOpen(true)}
                onMouseLeave={() => setIsShopMenuOpen(false)}
                className="h-14 flex items-center px-6 bg-[#f0f7f7] text-[#184363] text-sm font-medium hover:bg-[#007a94] hover:text-white transition-colors"
              >
                Shop
              </Link>
              <Link href="/promotions" className="h-14 flex items-center px-6 bg-[#009eb9] text-white text-sm font-medium hover:bg-[#007a94] transition-colors">
                Promotions
              </Link>
              <div className="flex items-center gap-8 ml-8">
                <Link href="/get-rewarded" className="text-white text-sm font-medium hover:text-[#009eb9] transition-colors">
                  Get Rewarded
                </Link>
                <Link href="/health-care-services" className="text-white text-sm font-medium hover:text-[#009eb9] transition-colors">
                  Health Care Services
                </Link>
                <Link href="/health-insurance" className="text-white text-sm font-medium hover:text-[#009eb9] transition-colors">
                  Health Insurance
                </Link>
                <Link href="/events" className="text-white text-sm font-medium hover:text-[#009eb9] transition-colors">
                  Events
                </Link>
                <Link href="/blog" className="text-white text-sm font-medium hover:text-[#009eb9] transition-colors">
                  Blog
                </Link>
                <Link href="/store-locator" className="text-white text-sm font-medium hover:text-[#009eb9] transition-colors">
                  Store Locator
                </Link>
              </div>
            </div>

            {/* Right Icons - With labels and dividers */}
            <div className="flex items-center">
              <Link href="/account" className="flex items-center gap-2 px-4 text-white hover:text-[#009eb9] transition-colors border-r border-white/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs font-medium">Sign in / Register</span>
              </Link>
              
              <button className="flex items-center gap-2 px-4 text-white hover:text-[#009eb9] transition-colors border-r border-white/20">
                <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.758 8.729">
                  <path d="M16.537 6.252 14.26 8.51a.719.719 0 0 1-.51.219.689.689 0 0 1-.51-.219l-2.313-2.258a.72.72 0 0 1-.018-1.02.683.683 0 0 1 1 0l1 1.038V1.462H6.538a.729.729 0 1 1 0-1.457h7.194a.656.656 0 0 1 .656.71v5.537l1.093-1.038a.788.788 0 0 1 1.075 0 .742.742 0 0 1-.019 1.038Zm-6.32 1.038H3.825V2.463l1 1.038a.679.679 0 0 0 .492.219.729.729 0 0 0 .51-1.238L3.533.205a.76.76 0 0 0-1.038 0L.219 2.463a.7.7 0 0 0 0 1.02.77.77 0 0 0 1.075 0l1.092-1.038v5.537a.677.677 0 0 0 .656.747h7.194a.72.72 0 1 0-.018-1.439Z"/>
                </svg>
                <span className="text-xs font-medium">Compare</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 text-white hover:text-[#009eb9] transition-colors border-r border-white/20">
                <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.747 13.358">
                  <path d="M14.352 2.572A4.189 4.189 0 0 0 10.596 0a3.954 3.954 0 0 0-3.224 1.458A3.954 3.954 0 0 0 4.149 0 4.189 4.189 0 0 0 .396 2.572a4.362 4.362 0 0 0 .84 4.835 74.128 74.128 0 0 0 5.693 5.779.711.711 0 0 0 .926 0c.034-.017 2.675-2.418 5.693-5.779a4.413 4.413 0 0 0 .804-4.835ZM12.496 6.5a90.1 90.1 0 0 1-5.127 5.264A86.88 86.88 0 0 1 2.246 6.5a3.085 3.085 0 0 1-.617-3.378 2.894 2.894 0 0 1 2.52-1.75 2.447 2.447 0 0 1 2.555 1.715.661.661 0 0 0 .652.514.715.715 0 0 0 .669-.514 2.465 2.465 0 0 1 2.555-1.715 2.882 2.882 0 0 1 2.516 1.766 3.026 3.026 0 0 1-.6 3.362Zm-.171-1.989a.6.6 0 0 1-.566.634h-.034a.6.6 0 0 1-.6-.566c-.069-.977-.7-1.132-.823-1.149a.609.609 0 0 1-.514-.669.626.626 0 0 1 .686-.514 2.3 2.3 0 0 1 1.854 2.263Zm-.823.995a.757.757 0 0 1 .206.48.623.623 0 0 1-.206.48.663.663 0 0 1-.96 0 .721.721 0 0 1-.206-.48.649.649 0 0 1 .206-.48.721.721 0 0 1 .48-.206.862.862 0 0 1 .483.2Z"/>
                </svg>
                <span className="text-xs font-medium">Wishlist</span>
              </button>
              
              <Link href="/cart" className="relative flex items-center gap-2 px-4 text-white hover:text-[#009eb9] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.426 13.695">
                  <path d="M17.388 3.087 15.361 9.47a1.074 1.074 0 0 1-1.023.758H6.516a1.117 1.117 0 0 1-1.042-.7L2.481 1.515H.758A.758.758 0 0 1 .758 0h2.254a.776.776 0 0 1 .72.511l3.087 8.2h7.2l1.61-5.114H6.705a.758.758 0 1 1 0-1.515h9.963a.753.753 0 0 1 .606.322.735.735 0 0 1 .114.683ZM6.895 11.232a1.229 1.229 0 1 0 .871.36 1.249 1.249 0 0 0-.871-.36Zm6.8 0a1.229 1.229 0 1 0 .871.36 1.249 1.249 0 0 0-.871-.36Z"/>
                </svg>
                <span className="text-xs font-medium">Basket</span>
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 bg-[#009eb9] text-white text-[10px] font-bold rounded-full">
                  0
                </span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Shop Mega Menu - Full Width */}
        <div
          onMouseEnter={() => setIsShopMenuOpen(true)}
          onMouseLeave={() => setIsShopMenuOpen(false)}
        >
          <ShopMegaMenu 
            isOpen={isShopMenuOpen} 
            onClose={() => setIsShopMenuOpen(false)} 
          />
        </div>
      </div>

    </header>
  );
}