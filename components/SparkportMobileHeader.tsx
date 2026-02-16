'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

// Mobile version of SparkportHeader - matches desktop functionality
// Shows on screens smaller than lg (1024px)

export default function SparkportMobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const categories = [
    'Vitamins & Supplements',
    'Personal Care',
    'Baby & Toddlers',
    'Women\'s Health',
    'Cold & Flu',
    'Pain Relief',
    'Oral Care',
    'Hair & Beauty',
    'First Aid',
    'Digestive Health',
  ];

  return (
    <>
      {/* Main Mobile Header - Sticky */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 px-4">
          
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-[#184363] hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Sparkport"
              width={140}
              height={42}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-[#184363] hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center text-[#184363] hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 flex items-center justify-center bg-[#009eb9] text-white text-[10px] font-bold! rounded-full px-1">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Quick Actions Bar */}
        
      </header>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-33"></div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-60 bg-white animate-[slideDown_0.3s_ease-out]">
          <div className="p-4">
            {/* Search Header */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-[#184363] hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-bold! text-[#184363]">Search Products</h2>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="search"
                placeholder="What are you looking for?"
                autoFocus
                className="w-full h-14 pl-5 pr-14 bg-neutral-100 border-2 border-neutral-200 rounded-2xl text-base text-[#184363] placeholder-neutral-500 focus:outline-none focus:border-[#009eb9] transition-colors"
              />
              <button className="absolute right-2 top-2 w-10 h-10 flex items-center justify-center bg-[#009eb9] text-white rounded-xl hover:bg-[#007a8f] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Popular Searches */}
            <div>
              <p className="text-sm font-bold! text-[#184363] mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Vitamins', 'Pain Relief', 'Baby Care', 'Cold & Flu', 'Supplements'].map((term) => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium! rounded-full hover:bg-[#009eb9] hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu - Full Screen Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-70 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="relative h-32 bg-linear-to-br from-[#184363] to-[#2a5a7a] p-6">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-8">
              <p className="text-white/80! text-sm font-medium!">Welcome to</p>
              <p className="text-white! text-2xl font-black!">Sparkport</p>
            </div>
          </div>

          {/* Menu Content - Scrollable */}
          <div className="h-[calc(100%-8rem)] overflow-y-auto">
            
            {/* Account Section */}
            <div className="p-4 border-b border-neutral-200">
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 bg-linear-to-r from-neutral-50 to-neutral-100 rounded-2xl hover:from-[#009eb9]/10 hover:to-[#00c9d7]/10 transition-all"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#009eb9] to-[#00c9d7] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold! text-[#184363]">Sign In / Register</p>
                  <p className="text-xs text-neutral-500">Access your account</p>
                </div>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="p-4 space-y-2">
              
              {/* Shop with Categories */}
              <div>
                <button
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-[#009eb9] to-[#00c9d7] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="font-bold! text-[#184363]">Shop by Category</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-neutral-400 transition-transform ${isCategoryExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Categories Dropdown */}
                {isCategoryExpanded && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-[#009eb9] space-y-1 animate-[fadeIn_0.3s_ease-out]">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2.5 px-4 text-sm text-neutral-700 hover:text-[#009eb9] hover:bg-neutral-50 rounded-lg transition-all"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Menu Items */}
              {[
                { href: '/get-rewarded', label: 'Get Rewarded', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { href: '/health-care-services', label: 'Health Care Services', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                { href: '/health-insurance', label: 'Health Insurance', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { href: '/blog', label: 'Health Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                { href: '/store-locator', label: 'Store Locator', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-4 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#184363]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="font-semibold! text-[#184363]">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-neutral-200 space-y-2">
              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold! text-[#184363]">Wishlist</span>
                </div>
              </Link>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-[#184363] hover:bg-[#009eb9] hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-[#184363] hover:bg-[#009eb9] hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}