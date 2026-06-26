'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { decodeHtml } from '@/lib/wordpress';

const FREE_DELIVERY_THRESHOLD = 500; // R500

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
    addToCart,
  } = useCart();

  const symbol = currencySymbol || 'R';
  // WC Store API returns prices in minor units (cents): "1999" = R19.99
  const parsedTotal = parseInt(total, 10) / 100;
  const formattedTotal = parsedTotal.toFixed(2);

  // Free delivery progress bar
  const amountLeft = Math.max(0, FREE_DELIVERY_THRESHOLD - parsedTotal);
  const progressPct = Math.min(100, (parsedTotal / FREE_DELIVERY_THRESHOLD) * 100);

  // 5.2 Undo remove state
  const [pendingRemoval, setPendingRemoval] = useState<{
    key: string;
    item: (typeof items)[number];
    timerId: ReturnType<typeof setTimeout>;
  } | null>(null);

  // 5.4 Empty drawer suggestions
  const [suggestions, setSuggestions] = useState<Array<{
    id: number;
    name: string;
    salePrice: number;
    imageUrl: string;
  }>>([]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  // Cleanup pending removal timer on unmount
  useEffect(() => {
    return () => {
      if (pendingRemoval) clearTimeout(pendingRemoval.timerId);
    };
  }, [pendingRemoval]);

  // Fetch suggestions when drawer opens with empty cart
  useEffect(() => {
    if (!isDrawerOpen || count > 0) return;
    fetch('/api/products/suggestions')
      .then(r => r.json())
      .then((data) => setSuggestions(data.slice(0, 3)))
      .catch(() => setSuggestions([]));
  }, [isDrawerOpen, count]);

  // Ref for focus trap
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus first focusable element when drawer opens
  useEffect(() => {
    if (!isDrawerOpen) return;
    const focusable = drawerRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [isDrawerOpen]);

  // Escape key + Tab focus trap
  useEffect(() => {
    if (!isDrawerOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;

      const focusableEls = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  function handleRemove(item: (typeof items)[number]) {
    if (pendingRemoval) {
      // If another item was already pending, fire it immediately
      clearTimeout(pendingRemoval.timerId);
      removeFromCart(pendingRemoval.key);
    }
    const timerId = setTimeout(() => {
      removeFromCart(item.key);
      setPendingRemoval(null);
    }, 4000);
    setPendingRemoval({ key: item.key, item, timerId });
  }

  function handleUndo() {
    if (!pendingRemoval) return;
    clearTimeout(pendingRemoval.timerId);
    setPendingRemoval(null);
  }

  // Show footer if there are active items or a pending removal
  const activeItems = items.filter(i => i.key !== pendingRemoval?.key);
  const showFooter = activeItems.length > 0 || pendingRemoval != null;

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
        ref={drawerRef}
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
          {count === 0 && !isLoading && !pendingRemoval ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#e8f5f7] flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-bold! text-[#184363] mb-1">Your basket is empty</p>
              <p className="text-sm text-neutral-500 mb-6">Trusted by thousands of South Africans since 1983.</p>
              <button
                onClick={closeDrawer}
                className="px-6 py-2.5 bg-[#009eb9] text-white font-semibold! text-sm rounded-xl hover:bg-[#007a8f] transition-colors"
              >
                Continue Shopping
              </button>

              {/* 5.4 Empty drawer suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-6 w-full text-left">
                  <p className="text-xs font-semibold! text-neutral-400 uppercase tracking-wider mb-3">Bestsellers you might like</p>
                  <div className="space-y-2">
                    {suggestions.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl border border-neutral-100 hover:border-[#009eb9]/30 hover:bg-[#e8f5f7]/40 transition-colors">
                        <div className="relative w-12 h-12 shrink-0 bg-white rounded-lg overflow-hidden border border-neutral-100">
                          {s.imageUrl && (
                            <Image src={s.imageUrl} alt={s.name} fill sizes="48px" className="object-contain p-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold! text-[#184363] line-clamp-1">{s.name}</p>
                          <p className="text-xs text-[#009eb9] font-bold!">R{s.salePrice.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(s.id, 1, {
                              name: s.name,
                              price: String(Math.round(s.salePrice * 100)),
                              image: s.imageUrl,
                            });
                          }}
                          className="shrink-0 px-2.5 py-1.5 bg-[#009eb9] text-white text-[10px] font-bold! rounded-lg hover:bg-[#007a8f] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Normal items (excluding pending removal) */}
              {(isDrawerOpen || items.length > 0) && activeItems.map((item) => {
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
                            onClick={() => handleRemove(item)}
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
              })}

              {/* 5.2 Pending removal — dimmed row with undo */}
              {pendingRemoval && (
                <div className="flex gap-4 bg-neutral-50 rounded-2xl p-4 border border-neutral-100 opacity-40">
                  <div className="relative w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-neutral-200">
                    {pendingRemoval.item.images?.[0]?.src ? (
                      <Image
                        src={pendingRemoval.item.images[0].src}
                        alt={pendingRemoval.item.images[0].alt || pendingRemoval.item.name}
                        fill sizes="80px" className="object-contain p-2 mix-blend-multiply"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <p className="text-sm font-bold! text-[#184363] line-clamp-2">{decodeHtml(pendingRemoval.item.name)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Item removed</span>
                      <button
                        onClick={handleUndo}
                        className="text-xs font-semibold! text-[#009eb9] hover:underline"
                      >
                        Undo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="shrink-0 border-t border-neutral-200 px-6 py-5 space-y-3 bg-white">
            {/* 5.1 Free delivery progress bar */}
            <div>
              {amountLeft > 0 ? (
                <>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-500">Add <span className="font-semibold! text-[#009eb9]">{symbol}{amountLeft.toFixed(2)}</span> more for free delivery — you&apos;re close!</span>
                    <span className="text-neutral-400">{symbol}500 threshold</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#009eb9] rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-green-700 text-xs font-semibold!">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You&apos;ve unlocked FREE delivery!
                  <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden ml-1">
                    <div className="h-full bg-green-500 rounded-full w-full" />
                  </div>
                </div>
              )}
            </div>

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
              Proceed to Checkout →
            </Link>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold! text-[#009eb9] border-2 border-[#009eb9] hover:bg-[#e8f5f7] transition-colors text-sm"
            >
              View Full Cart
            </Link>

            {/* 5.3 Security footer */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] text-neutral-400">Safe &amp; secure checkout</span>
              <div className="flex items-center gap-1.5 ml-1">
                {/* Visa */}
                <div className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-black! text-neutral-500 bg-neutral-50">VISA</div>
                {/* Mastercard */}
                <div className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-black! text-neutral-500 bg-neutral-50">MC</div>
                {/* Maestro */}
                <div className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-black! text-neutral-500 bg-neutral-50">Maestro</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
