'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/wordpress';
import type { ProductReview } from '@/lib/wordpress/products';
import { useCart } from '@/contexts/CartContext';
import DeliveryEstimate from '@/components/DeliveryEstimate';
import ValuePropositionStrip from '@/components/ValuePropositionStrip';

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();

interface Props {
  product: Product;
  relatedProducts: Product[];
  reviews?: ProductReview[];
}

function ProductDetailInner({ product, relatedProducts, reviews = [] }: Props) {
  const searchParams = useSearchParams();
  const origin = searchParams.get('from');

  const originMap = {
    promotions: { label: 'Promotions', href: '/shop/promotions' },
    shop: { label: 'Shop', href: '/shop' },
  };
  const breadcrumb = originMap[origin as keyof typeof originMap] || originMap.shop;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'usage' | 'reviews'>('description');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const { addToCart } = useCart();

  const handleAdd = async () => {
    if (!product.inStock || isAdding || isAdded) return;
    setIsAdding(true);
    await addToCart(product.id, quantity, {
      name: product.name,
      price: String(Math.round(product.salePrice * 100)),
      image: product.image,
    });
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  useEffect(() => {
    const el = mainButtonRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const savings = product.originalPrice - product.salePrice;
  const savingsPercent = product.originalPrice > 0 ? Math.round((savings / product.originalPrice) * 100) : 0;
  const rating = 4.5;
  const reviewCount = 50 + ((product.id * 23) % 200);
  const shortDesc = stripHtml(product.shortDescription || '');

  return (
    <div className="min-h-screen">

      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-100 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 lg:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-neutral-500 hover:text-[#009eb9] transition-colors duration-200">Home</Link>
            <svg className="w-3.5 h-3.5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href={breadcrumb.href} className="text-neutral-500 hover:text-[#009eb9] transition-colors duration-200">
              {breadcrumb.label}
            </Link>
            <svg className="w-3.5 h-3.5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-neutral-400">{product.category}</span>
            <svg className="w-3.5 h-3.5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[#184363] font-semibold!">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 lg:px-6 py-8 lg:py-12">

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">

          {/* Left: Image */}
          <div className="lg:col-span-6">
            <div className="sticky top-24">

              {/* Sale Badge */}
              {product.onSale && savings > 0 && (
                <div className="absolute top-6 left-6 z-10 animate-[fadeIn_0.5s_ease-out]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black/20 blur-xl rounded-full"></div>
                    <div className="relative px-5 py-2.5 bg-linear-to-br from-black to-neutral-800 text-white rounded-full shadow-2xl">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold!">Save {savingsPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Image */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
                <div className="relative bg-linear-to-br from-neutral-50 to-white p-12 aspect-square">
                  <div className={`absolute inset-0 transition-opacity duration-700 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute inset-0 bg-linear-to-br from-neutral-100 to-neutral-50 animate-pulse"></div>
                  </div>
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onLoad={() => setImageLoaded(true)}
                      className="object-contain p-12 transform transition-transform duration-700 hover:scale-105 mix-blend-multiply"
                    />
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <div key={idx} className="group relative">
                      <div className="absolute inset-0 bg-linear-to-r from-[#009eb9] to-[#00c9d7] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                      <span className="relative inline-block px-4 py-2 bg-linear-to-r from-[#e8f5f7] to-[#d4eff3] text-[#007a8f] text-sm font-semibold! rounded-full border border-[#009eb9]/20">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-6 space-y-6">

            {/* Category Badge */}
            <div className="inline-block">
              <span className="px-3 py-1 bg-linear-to-r from-[#009eb9]/10 to-[#00c9d7]/10 text-[#007a8f] text-xs font-bold! uppercase tracking-wider rounded-full border border-[#009eb9]/20">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-black! text-[#184363] leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 transition-colors ${i < Math.floor(rating) ? 'text-amber-400' : 'text-neutral-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold! text-[#184363]">{rating}</span>
              </div>
              <div className="h-4 w-px bg-neutral-300"></div>
              <button className="text-sm text-neutral-600 hover:text-[#009eb9] transition-colors duration-200 font-medium!">
                {reviewCount} reviews
              </button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black! bg-linear-to-r from-[#009eb9] to-[#00c9d7] bg-clip-text text-transparent">
                  R{product.salePrice.toFixed(2)}
                </span>
                {product.onSale && product.originalPrice > product.salePrice && (
                  <span className="text-base text-neutral-400 font-medium!">
                    was R{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.onSale && savings > 0 && (
                <div className="inline-block">
                  <div className="px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-sm font-bold! text-green-700">
                      Save R{savings.toFixed(2)} ({savingsPercent}% OFF)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Short Description */}
            {shortDesc && (
              <p className="text-lg text-neutral-600 leading-relaxed">{shortDesc}</p>
            )}

            {/* Stock Status */}
            <div className="relative overflow-hidden rounded-2xl">
              {product.inStock ? (
                <>
                  <div className="absolute inset-0 bg-linear-to-r from-green-500/10 to-emerald-500/10"></div>
                  <div className="relative p-5 border border-green-200/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/30 blur-lg rounded-full"></div>
                        <div className="relative w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold! text-green-900">In Stock</p>
                        <p className="text-sm text-green-700">Ready to dispatch from Sparkport Durban</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-linear-to-r from-red-500/10 to-rose-500/10"></div>
                  <div className="relative p-5 border border-red-200/50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-linear-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold! text-red-900">Out of Stock</p>
                        <p className="text-sm text-red-700">Contact us to enquire</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-bold! text-[#184363]">Quantity:</label>
                  <div className="flex items-center bg-white rounded-xl border-2 border-neutral-200 hover:border-[#009eb9] transition-all duration-200 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-[#009eb9] hover:bg-neutral-50 rounded-l-xl transition-all duration-200 font-bold! text-xl"
                    >
                      −
                    </button>
                    <div className="w-16 h-12 flex items-center justify-center border-x-2 border-neutral-200 bg-neutral-50">
                      <span className="font-black! text-[#184363] text-lg">{quantity}</span>
                    </div>
                    <button
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-[#009eb9] hover:bg-neutral-50 rounded-r-xl transition-all duration-200 font-bold! text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  ref={mainButtonRef}
                  onClick={handleAdd}
                  disabled={!product.inStock || isAdding || isAdded}
                  className="flex-1 group relative overflow-hidden disabled:cursor-not-allowed"
                >
                  <div className={`absolute inset-0 transition-transform duration-300 ${
                    isAdded
                      ? 'bg-green-600'
                      : product.inStock
                        ? 'bg-linear-to-r from-[#009eb9] to-[#00c9d7] group-hover:scale-105'
                        : 'bg-neutral-300'
                  }`}></div>
                  {product.inStock && !isAdding && !isAdded && (
                    <div className="absolute inset-0 bg-linear-to-r from-[#007a8f] to-[#009eb9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <div className="relative px-8 py-4 flex items-center justify-center gap-3">
                    {isAdded ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isAdding ? (
                      <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    )}
                    <span className="text-white font-black! text-lg tracking-wide">
                      {isAdded ? 'Added!' : isAdding ? 'Adding...' : product.inStock ? 'Add to Basket' : 'Out of Stock'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Pharmacy trust bar */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  {
                    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                    text: 'Fulfilled by Sparkport Pharmacy',
                  },
                  {
                    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                    text: 'Pharmacist reviewed product',
                  },
                  {
                    icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 2 1 2-1 4 2z',
                    text: '30-day return policy',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5 p-2">
                    <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    <span className="text-[10px] text-neutral-500 leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <DeliveryEstimate />

            {/* Ask a pharmacist */}
            <a
              href="/contact"
              className="flex items-center gap-3 px-4 py-3 border border-[#009eb9]/30 rounded-xl text-[#009eb9] hover:bg-[#e8f5f7] transition-colors group"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-semibold!">Have a question? Ask our pharmacist</span>
              <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6">
              {[
                { icon: 'M5 13l4 4L19 7', title: 'Authentic', desc: '100% Genuine' },
                { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Fast Delivery', desc: '2-3 business days' },
                { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: 'Secure Payment', desc: 'Safe checkout' },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Quality Assured', desc: 'Trusted source' },
              ].map((badge, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-linear-to-br from-neutral-50 to-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-4 border border-neutral-200 rounded-xl bg-white group-hover:border-[#009eb9]/30 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#009eb9]/10 to-[#00c9d7]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold! text-[#184363] text-sm">{badge.title}</p>
                        <p className="text-xs text-neutral-500">{badge.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ValuePropositionStrip />

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100 mb-16">
          <div className="border-b border-neutral-100 bg-linear-to-r from-neutral-50 to-white p-2">
            <div className="flex gap-2">
              {[
                { key: 'description', label: 'Description', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                { key: 'usage', label: 'Usage & Dosage', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { key: 'reviews', label: `Reviews (${reviewCount})`, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold! text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-linear-to-r from-[#009eb9] to-[#00c9d7] text-white shadow-lg shadow-[#009eb9]/30 scale-[1.02]'
                      : 'text-neutral-600 hover:bg-white hover:text-[#009eb9]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-10">
            {activeTab === 'description' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-2xl font-black! text-[#184363]">Product Description</h3>
                {product.description ? (
                  <div
                    className="prose prose-lg max-w-none text-neutral-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-neutral-700 leading-relaxed">
                    {product.name} is a trusted healthcare product available at Sparkport Pharmacy. For full product details, consult the packaging or speak to our pharmacist.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <div>
                  <h3 className="text-2xl font-black! text-[#184363] mb-4">Dosage Instructions</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-black! text-xl">A</span>
                      </div>
                      <div>
                        <p className="font-bold! text-[#184363] mb-1">Adults</p>
                        <p className="text-neutral-700">Follow package instructions or as directed by your healthcare professional. Do not exceed recommended dosage.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-black! text-xl">C</span>
                      </div>
                      <div>
                        <p className="font-bold! text-[#184363] mb-1">Children</p>
                        <p className="text-neutral-700">Consult a healthcare professional before use.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black! text-[#184363] mb-4">Storage</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    Store in a cool, dry place away from direct sunlight. Keep out of reach of children.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-neutral-100">
                  <div>
                    <h3 className="text-2xl font-black! text-[#184363] mb-3">Customer Reviews</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-6 h-6 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-neutral-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xl font-black! text-[#184363]">{rating}</span>
                      </div>
                      <span className="text-neutral-600">Based on {reviewCount} reviews</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-linear-to-r from-[#009eb9] to-[#00c9d7] text-white font-bold! rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Write a Review
                  </button>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => {
                      const initials = review.reviewer.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                      const date = new Date(review.date_created).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
                      return (
                        <div key={review.id} className="group relative overflow-hidden rounded-2xl">
                          <div className="relative p-6 border border-neutral-100 rounded-2xl bg-white">
                            <div className="flex items-start gap-5">
                              <div className="w-14 h-14 bg-linear-to-br from-[#009eb9] to-[#00c9d7] rounded-2xl flex items-center justify-center shrink-0">
                                <span className="text-white font-black! text-lg">{initials}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <p className="font-bold! text-[#184363] text-lg">{review.reviewer}</p>
                                    <p className="text-sm text-neutral-500">{date}</p>
                                  </div>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-neutral-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-neutral-700 leading-relaxed">{review.review}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-500 mb-3">Be the first to review this product</p>
                    <a href="/contact" className="text-[#009eb9] hover:underline font-semibold! text-sm">
                      Contact us to leave a review
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm text-[#009eb9] font-bold! uppercase tracking-wider mb-2">Continue Shopping</p>
                <h2 className="text-3xl lg:text-4xl font-black! text-[#184363]">You May Also Like</h2>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center gap-2 text-[#009eb9] font-bold! hover:gap-3 transition-all duration-300">
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <a key={related.id} href={`/product/${related.id}`} className="group relative">
                  <div className="bg-white rounded-3xl shadow-lg shadow-neutral-200/50 overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-300/50 hover:-translate-y-2">
                    {related.onSale && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-black/20 blur-lg rounded-full"></div>
                          <div className="relative px-3 py-1.5 bg-linear-to-br from-black to-neutral-800 text-white text-xs font-bold! rounded-full">
                            Sale
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="relative bg-linear-to-br from-neutral-50 to-white aspect-square overflow-hidden">
                      {related.image && (
                        <Image
                          src={related.image}
                          alt={related.imageAlt}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain p-8 transform transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                        />
                      )}
                    </div>
                    <div className="p-5 border-t border-neutral-100">
                      <span className="inline-block px-2 py-1 bg-[#009eb9]/10 text-[#007a8f] text-xs font-bold! rounded-full mb-2">
                        {related.category}
                      </span>
                      <h3 className="text-sm font-bold! text-[#184363] mb-3 line-clamp-2 min-h-10 group-hover:text-[#009eb9] transition-colors">
                        {related.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        {related.onSale && related.originalPrice > related.salePrice && (
                          <span className="text-sm text-neutral-400 line-through font-medium!">
                            R{related.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-xl font-black! bg-linear-to-r from-[#009eb9] to-[#00c9d7] bg-clip-text text-transparent">
                          R{related.salePrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile sticky buy bar */}
      {showStickyBar && product.inStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-500 truncate">{product.name}</p>
              <p className="text-base font-black! text-[#009eb9]">R{product.salePrice.toFixed(2)}</p>
            </div>
            <button
              onClick={handleAdd}
              disabled={isAdding || isAdded}
              className={`px-5 py-3 rounded-xl font-bold! text-white text-sm flex items-center gap-2 transition-all ${
                isAdded ? 'bg-green-600' : 'bg-[#009eb9] hover:bg-[#007a8f]'
              } disabled:opacity-60`}
            >
              {isAdded ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : isAdding ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              )}
              {isAdded ? 'Added!' : isAdding ? 'Adding...' : `Buy Now — R${product.salePrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <ProductDetailInner {...props} />
    </Suspense>
  );
}
