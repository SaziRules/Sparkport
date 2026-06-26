'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { decodeHtml } from '@/lib/wordpress';

export default function CartPage() {
  const { items, count, total, currencySymbol, isLoading, updateQuantity, removeFromCart } = useCart();

  const symbol = currencySymbol || 'R';
  // WC Store API returns prices in minor units (cents): "1999" = R19.99
  const formattedTotal = (parseInt(total, 10) / 100).toFixed(2);

  if (count === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#e8f5f7] flex items-center justify-center">
            <svg className="w-12 h-12 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black! text-[#184363] mb-3">Your basket is empty</h1>
          <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#009eb9] text-white font-bold! rounded-xl hover:bg-[#007a8f] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-14">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black! text-[#184363]">Your Basket</h1>
          <p className="text-neutral-500 mt-1">{count} {count === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Item list */}
          <div className="flex-1 space-y-4">
            {items.map((item) => {
              const unitPrice = (parseInt(item.prices.price, 10) / 100).toFixed(2);
              const lineTotal = (parseInt(item.totals.line_total, 10) / 100).toFixed(2);

              return (
                <div
                  key={item.key}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-28 h-28 shrink-0 bg-neutral-50 rounded-xl overflow-hidden">
                    {item.images?.[0]?.src ? (
                      <Image
                        src={item.images[0].src}
                        alt={item.images[0].alt || item.name}
                        fill
                        sizes="112px"
                        className="object-contain p-3 mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold! text-[#184363] text-sm leading-snug mb-1 line-clamp-2">{decodeHtml(item.name)}</h3>
                    <p className="text-[#009eb9] text-sm font-medium! mb-3">{symbol}{unitPrice} each</p>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="text-neutral-600 hover:text-[#184363] font-bold! text-lg w-6 h-6 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="font-semibold! text-[#184363] w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={isLoading}
                          className="text-neutral-600 hover:text-[#184363] font-bold! text-lg w-6 h-6 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Line total */}
                        <span className="text-xl font-extrabold! text-[#009eb9]">{symbol}{lineTotal}</span>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.key)}
                          disabled={isLoading}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-black! text-[#184363] mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold! text-[#184363]">{symbol}{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold! text-[#184363]">Total</span>
                  <span className="text-2xl font-extrabold! text-[#009eb9]">{symbol}{formattedTotal}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Taxes calculated at checkout</p>
              </div>

              <Link
                href="/checkout"
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black! text-white text-base transition-all ${
                  isLoading
                    ? 'bg-neutral-300 cursor-not-allowed pointer-events-none'
                    : 'bg-[#009eb9] hover:bg-[#007a8f]'
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
                href="/shop"
                className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold! text-[#009eb9] border-2 border-[#009eb9] hover:bg-[#e8f5f7] transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
