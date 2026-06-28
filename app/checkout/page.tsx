'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { validateCheckoutForm } from '@/lib/checkoutValidation';
import type { CheckoutFormData, FormErrors } from '@/lib/checkoutValidation';

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

const PAYMENT_METHODS = [
  {
    slug: 'payfast' as const,
    name: 'PayFast',
    desc: 'Pay securely by card — instant confirmation',
    icon: (
      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    slug: 'bacs' as const,
    name: 'EFT',
    desc: 'Direct bank transfer — use your order ID as reference',
    icon: (
      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
  {
    slug: 'cod' as const,
    name: 'In-store',
    desc: 'Pay when you collect at our Durban pharmacy',
    icon: (
      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const FREE_DELIVERY_THRESHOLD = 500;

const EMPTY_FORM: CheckoutFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', province: '', postcode: '',
  orderNotes: '',
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function CheckoutPage() {
  const { items, cartTotals, currencySymbol, count, isLoading: cartLoading } = useCart();

  const [form, setForm] = useState<CheckoutFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'bacs' | 'cod'>('payfast');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const symbol = currencySymbol || 'R';
  const subtotal = parseInt(cartTotals.total_items, 10) / 100;
  const discount = parseInt(cartTotals.total_discount, 10) / 100;
  const discountedSubtotal = subtotal - discount;
  const grandTotal = parseInt(cartTotals.total_price, 10) / 100;
  const isFreeDelivery = discountedSubtotal >= FREE_DELIVERY_THRESHOLD;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.getElementsByName(firstErrorKey)[0]?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address_1: form.address1,
            address_2: form.address2,
            city: form.city,
            state: form.province,
            postcode: form.postcode,
            country: 'ZA',
          },
          payment_method: paymentMethod,
          customer_note: form.orderNotes,
        }),
      });

      const data = await res.json() as { redirect?: string; message?: string };

      if (!res.ok) {
        setSubmitError(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch {
      setSubmitError("Couldn't connect. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartLoading && count === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-neutral-50">
        <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h1 className="text-xl font-black! text-[#184363] mb-2">Your basket is empty</h1>
        <p className="text-sm text-neutral-500 mb-6">Add some products before checking out.</p>
        <Link href="/shop" className="px-6 py-3 bg-[#009eb9] text-white font-bold! rounded-xl hover:bg-[#007a8f] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-[#184363] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-neutral-200'
    }`;

  const selectedMethod = PAYMENT_METHODS.find(m => m.slug === paymentMethod)!;
  const submitLabel = paymentMethod === 'payfast' ? 'Pay with PayFast' : 'Place Order';

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black! text-[#184363]">Secure Checkout</h1>
          <p className="text-sm text-neutral-500 mt-1">
            <Link href="/cart" className="text-[#009eb9] hover:underline">← Back to basket</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── LEFT: form fields ───────────────────────────── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Delivery details */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h2 className="text-lg font-black! text-[#184363] mb-5">Delivery Details</h2>

                <div className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                        First name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" name="firstName" value={form.firstName}
                        onChange={handleChange} autoComplete="given-name"
                        className={inputClass('firstName')} placeholder="Sipho"
                      />
                      <FieldError msg={errors.firstName} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                        Last name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" name="lastName" value={form.lastName}
                        onChange={handleChange} autoComplete="family-name"
                        className={inputClass('lastName')} placeholder="Dlamini"
                      />
                      <FieldError msg={errors.lastName} />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                      Email address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} autoComplete="email"
                      className={inputClass('email')} placeholder="sipho@example.com"
                    />
                    <FieldError msg={errors.email} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                      Phone number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel" name="phone" value={form.phone}
                      onChange={handleChange} autoComplete="tel"
                      className={inputClass('phone')} placeholder="083 123 4567"
                    />
                    <FieldError msg={errors.phone} />
                  </div>

                  {/* Address 1 */}
                  <div>
                    <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                      Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" name="address1" value={form.address1}
                      onChange={handleChange} autoComplete="address-line1"
                      className={inputClass('address1')} placeholder="12 Main Road"
                    />
                    <FieldError msg={errors.address1} />
                  </div>

                  {/* Address 2 */}
                  <div>
                    <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                      Apartment, suite, unit <span className="text-neutral-400 font-normal!">(optional)</span>
                    </label>
                    <input
                      type="text" name="address2" value={form.address2}
                      onChange={handleChange} autoComplete="address-line2"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm text-[#184363] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] transition-colors"
                      placeholder="Flat 2B"
                    />
                  </div>

                  {/* City + Province */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" name="city" value={form.city}
                        onChange={handleChange} autoComplete="address-level2"
                        className={inputClass('city')} placeholder="Durban"
                      />
                      <FieldError msg={errors.city} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                        Province <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="province" value={form.province}
                        onChange={handleChange} autoComplete="address-level1"
                        className={inputClass('province')}
                      >
                        <option value="">Select province</option>
                        {SA_PROVINCES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <FieldError msg={errors.province} />
                    </div>
                  </div>

                  {/* Postal code + Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                        Postal code <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" name="postcode" value={form.postcode}
                        onChange={handleChange} autoComplete="postal-code"
                        className={inputClass('postcode')} placeholder="4001"
                      />
                      <FieldError msg={errors.postcode} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold! text-neutral-600 mb-1.5">Country</label>
                      <div className="w-full px-4 py-3 border border-neutral-100 rounded-xl text-sm text-neutral-500 bg-neutral-50">
                        South Africa
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order notes */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h2 className="text-base font-bold! text-[#184363] mb-3">Order Notes <span className="text-neutral-400 font-normal! text-sm">(optional)</span></h2>
                <textarea
                  name="orderNotes" value={form.orderNotes}
                  onChange={handleChange} rows={3}
                  placeholder="Special instructions for your order..."
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm text-[#184363] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] transition-colors resize-none"
                />
              </div>
            </div>

            {/* ── RIGHT: summary + payment ─────────────────────── */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 space-y-4">

                {/* Order summary */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                  <h2 className="text-lg font-black! text-[#184363] mb-4">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {items.map(item => {
                      const unitPrice = (parseInt(item.prices.price, 10) / 100).toFixed(2);
                      const lineTotal = (parseInt(item.totals.line_total, 10) / 100).toFixed(2);
                      return (
                        <div key={item.key} className="flex gap-3">
                          <div className="relative w-12 h-12 shrink-0 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100">
                            {item.images?.[0]?.src && (
                              <Image
                                src={item.images[0].src}
                                alt={item.images[0].alt || item.name}
                                fill sizes="48px"
                                className="object-contain p-1 mix-blend-multiply"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold! text-[#184363] line-clamp-2">{item.name}</p>
                            <p className="text-xs text-neutral-500">Qty {item.quantity} × {symbol}{unitPrice}</p>
                          </div>
                          <p className="text-sm font-bold! text-[#184363] shrink-0">{symbol}{lineTotal}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-semibold!">{symbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold!">−{symbol}{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery</span>
                      {isFreeDelivery ? (
                        <span className="text-green-600 font-semibold!">FREE</span>
                      ) : (
                        <span className="text-neutral-500">Calculated after order</span>
                      )}
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-100">
                      <span className="font-black! text-[#184363]">Total</span>
                      <span className="text-xl font-extrabold! text-[#009eb9]">{symbol}{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                  <h2 className="text-base font-black! text-[#184363] mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(method => (
                      <label
                        key={method.slug}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.slug
                            ? 'border-[#009eb9] bg-[#e8f5f7]'
                            : 'border-neutral-200 hover:border-[#009eb9]/40'
                        }`}
                      >
                        <input
                          type="radio" name="paymentMethod" value={method.slug}
                          checked={paymentMethod === method.slug}
                          onChange={() => setPaymentMethod(method.slug)}
                          className="mt-0.5 accent-[#009eb9]"
                        />
                        <div className="flex items-start gap-3 flex-1">
                          {method.icon}
                          <div>
                            <p className="text-sm font-bold! text-[#184363]">{method.name}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{method.desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="space-y-3">
                  {submitError && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || cartLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black! text-white text-base transition-all bg-[#009eb9] hover:bg-[#007a8f] disabled:bg-neutral-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {submitLabel}
                      </>
                    )}
                  </button>

                  {/* Security row */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px] text-neutral-400">Secure checkout</span>
                    {['VISA', 'MC', 'PayFast'].map(label => (
                      <div key={label} className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-bold! text-neutral-500 bg-neutral-50">{label}</div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
