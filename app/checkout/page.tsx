'use client';

import { useEffect } from 'react';

export default function CheckoutPage() {
  useEffect(() => {
    // Analytics stub: checkout initiated
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sparkport:checkout:begin', {
        detail: { itemCount: 0, total: '' },
      }));
    }

    // Cart session is maintained via the wc_cart_token HttpOnly cookie
    // which the browser sends automatically with same-site requests.
    // Just redirect — WC will pick up the session.
    const t = setTimeout(() => {
      window.location.href = 'https://sparkport.co.za/checkout/';
    }, 800); // Small delay so the loading state is visible
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#009eb9] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-xl font-black! text-[#184363]">Sparkport</span>
        </div>
      </div>

      {/* Spinner */}
      <div className="mb-6">
        <svg className="w-12 h-12 text-[#009eb9] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>

      <h1 className="text-xl font-black! text-[#184363] mb-2">Taking you to secure checkout...</h1>
      <p className="text-sm text-neutral-500 mb-10">Please do not close this window.</p>

      {/* Security badges */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs text-neutral-400">256-bit SSL encrypted checkout</span>
        </div>
        <div className="flex items-center gap-2">
          {['VISA', 'MC', 'PayFast', 'EFT'].map(label => (
            <div key={label} className="px-2 py-0.5 border border-neutral-200 rounded text-[10px] font-bold! text-neutral-500 bg-neutral-50">
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Fallback link */}
      <p className="text-xs text-neutral-400 mt-8">
        Not redirecting?{' '}
        <a
          href="https://sparkport.co.za/checkout/"
          className="text-[#009eb9] hover:underline"
        >
          Click here
        </a>
      </p>
    </div>
  );
}
