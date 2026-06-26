'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useCart } from '@/contexts/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Green checkmark */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black! text-[#184363] mb-2">
          {orderId ? `Order #${orderId} confirmed!` : 'Order confirmed!'}
        </h1>
        <p className="text-neutral-500 mb-8">
          Thank you for your order. We&apos;ll send a confirmation to your email shortly.
        </p>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-8 text-left">
          <h2 className="font-bold! text-[#184363] mb-3">What happens next?</h2>
          <ul className="space-y-2">
            {[
              "You'll receive an order confirmation email",
              'Our pharmacists will review your order',
              'Your order will be dispatched within 1 business day',
              'Delivery in 3–5 working days nationwide',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                <span className="w-5 h-5 rounded-full bg-[#e8f5f7] text-[#009eb9] text-[10px] font-black! flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#009eb9] text-white font-bold! rounded-xl hover:bg-[#007a8f] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#009eb9] text-[#009eb9] font-bold! rounded-xl hover:bg-[#e8f5f7] transition-colors"
          >
            View Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 text-[#009eb9] animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
