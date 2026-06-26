'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { decodeHtml } from '@/lib/wordpress';

export default function CartDrawer() {
  const {
    items,
    count,
    total,
    currencySymbol,
    isLoading,
    isDrawerOpen,
    lastAddedKey,
    closeDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const symbol = currencySymbol || 'R';
  // WC Store API returns prices in minor units (cents): "1999" = R19.99
  const formattedTotal = (parseInt(total, 10) / 100).toFixed(2);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Backdrop — fades in/out */}
      <div
        aria-hidden={!isDrawerOpen}
        onClick={closeDrawer}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel — slides in/out from right */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping basket"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <h2 className="text-lg font-black! text-[#184363]">Your Basket</h2>
            {count > 0 && (
              <span className="px-2 py-0.5 bg-[#009eb9] text-white text-xs font-bold! rounded-full">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close basket"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {count === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#e8f5f7] flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-bold! text-[#184363] mb-1">Your basket is empty</p>
              <p className="text-sm text-neutral-500 mb-6">Add products to get started</p>
              <button
                onClick={closeDrawer}
                className="px-6 py-2.5 bg-[#009eb9] text-white font-semibold! text-sm rounded-xl hover:bg-[#007a8f] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            (isDrawerOpen || items.length > 0) && items.map((item) => {
              const unitPrice = (parseInt(item.prices.price, 10) / 100).toFixed(2);
              const lineTotal = (parseInt(item.totals.line_total, 10) / 100).toFixed(2);

              return (
                <div
                  key={item.key}
                  className={`flex gap-4 bg-neutral-50 rounded-2xl p-4 border transition-all duration-300 ${
                    item.key === lastAddedKey
                      ? 'border-[#009eb9] ring-2 ring-[#009eb9]/20'
                      : 'border-neutral-100'
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-neutral-200">
                    {item.images?.[0]?.src ? (
                      <Image
                        src={item.images[0].src}
                        alt={item.images[0].alt || item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2 mix-blend-multiply"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold! text-[#184363] leading-snug line-clamp-2 mb-1">{decodeHtml(item.name)}</p>
                    <p className="text-xs text-[#009eb9] font-medium! mb-3">{symbol}{unitPrice} each</p>

                    <div className="flex items-center justify-between gap-2">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-2 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-[#184363] font-bold! text-base disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-semibold! text-[#184363] w-5 text-center text-sm select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-[#184363] font-bold! text-base disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold! text-[#009eb9]">{symbol}{lineTotal}</span>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="shrink-0 border-t border-neutral-200 px-6 py-5 space-y-3 bg-white">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-neutral-600">Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
              <span className="text-2xl font-extrabold! text-[#009eb9]">{symbol}{formattedTotal}</span>
            </div>
            <p className="text-xs text-neutral-400">Shipping & taxes calculated at checkout</p>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black! text-white text-base transition-all ${
                isLoading ? 'bg-neutral-300 pointer-events-none' : 'bg-[#009eb9] hover:bg-[#007a8f]'
              }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
              Proceed to Checkout
            </Link>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold! text-[#009eb9] border-2 border-[#009eb9] hover:bg-[#e8f5f7] transition-colors text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
