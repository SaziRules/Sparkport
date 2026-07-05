'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { STORES } from '@/lib/stores';

const EFT_DETAILS = {
  bankName: 'FNB',
  accountName: 'Sparkport Pharmacy',
  accountNumber: '62XXXXXXXXXX',            // REPLACE with real account number
  branchCode: '250655',
};

interface OrderItem {
  name: string;
  quantity: number;
  total: string;
  image: string;
}

interface OrderData {
  id: number;
  status: string;
  email: string;
  total: string;
  currency_symbol: string;
  items: OrderItem[];
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const method = searchParams.get('method') ?? 'payfast';
  const storeId = searchParams.get('store_id');
  const selectedStore = storeId ? (STORES.find(s => s.id === storeId) ?? null) : null;
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    clearCart();

    if (!orderId) {
      setError('No order ID found.');
      setIsLoading(false);
      return;
    }

    fetch(`/api/checkout/order/${orderId}`)
      .then(r => {
        if (!r.ok) throw new Error('Order not found');
        return r.json() as Promise<OrderData>;
      })
      .then(data => setOrder(data))
      .catch(() => setError('We couldn\'t load your order details. Your order was placed — check your email for confirmation.'))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="w-10 h-10 text-[#009eb9] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  const symbol = order?.currency_symbol ?? 'R';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Confirmation header */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
          {/* Checkmark animation */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 animate-[scaleIn_0.4s_ease-out]">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black! text-[#184363] mb-1">
            Order #{orderId} confirmed!
          </h1>
          {order?.email && (
            <p className="text-sm text-neutral-500">
              {method === 'payfast' ? 'Confirmation will be sent to' : 'Confirmation sent to'}{' '}
              <span className="font-semibold! text-[#184363]">{order.email}</span>
            </p>
          )}
          {error && (
            <p className="text-sm text-amber-600 mt-2">{error}</p>
          )}
        </div>

        {/* Method-specific block */}
        {method === 'payfast' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold! text-green-800">Payment received — your order is being prepared.</p>
            </div>
          </div>
        )}

        {method === 'bacs' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-base font-black! text-[#184363] mb-4">EFT Payment Details</h2>
            <div className="space-y-2 text-sm mb-4">
              {[
                { label: 'Bank', value: EFT_DETAILS.bankName },
                { label: 'Account name', value: EFT_DETAILS.accountName },
                { label: 'Account number', value: EFT_DETAILS.accountNumber },
                { label: 'Branch code', value: EFT_DETAILS.branchCode },
                { label: 'Reference', value: `#${orderId}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-neutral-500">{label}</span>
                  <span className="font-bold! text-[#184363]">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-700 bg-blue-100 rounded-xl px-4 py-2">
              Your order ships once payment clears. Use <strong>#{orderId}</strong> as your payment reference.
            </p>
          </div>
        )}

        {method === 'cod' && (
          <div className="bg-[#e8f5f7] border border-[#009eb9]/30 rounded-2xl p-6">
            <h2 className="text-base font-black! text-[#184363] mb-1">Collect In-Store</h2>
            {selectedStore ? (
              <>
                <p className="text-sm font-semibold! text-[#009eb9] mb-4">{selectedStore.name}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-[#184363]">{selectedStore.address}</p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#009eb9] font-semibold! hover:underline mt-0.5 inline-block"
                      >
                        Get directions →
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[#184363]">{selectedStore.hours}</p>
                  </div>
                  <div className="flex gap-3">
                    <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${selectedStore.phone.replace(/[^0-9]/g, '')}`} className="text-[#184363] hover:text-[#009eb9] transition-colors">
                      {selectedStore.phone}
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#184363] mt-2">Visit any Sparkport branch to collect your order.</p>
            )}
            <div className="mt-4 pt-4 border-t border-[#009eb9]/20">
              <p className="text-xs text-[#009eb9] font-semibold!">
                Bring order number <strong>#{orderId}</strong> when you collect. Payment is due on collection.
              </p>
            </div>
          </div>
        )}

        {/* Order summary */}
        {order && order.items.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-base font-black! text-[#184363] mb-4">Your Order</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && (
                    <div className="relative w-12 h-12 shrink-0 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold! text-[#184363] line-clamp-1">{item.name}</p>
                    <p className="text-xs text-neutral-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold! text-[#184363]">{symbol}{parseFloat(item.total).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 pt-4 mt-4 flex justify-between">
              <span className="font-black! text-[#184363]">Total</span>
              <span className="text-xl font-extrabold! text-[#009eb9]">{symbol}{parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-[#009eb9] text-white font-bold! rounded-xl hover:bg-[#007a8f] transition-colors text-sm"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-[#184363] text-[#184363] font-bold! rounded-xl hover:bg-[#184363] hover:text-white transition-colors text-sm"
          >
            View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessInner />
    </Suspense>
  );
}
