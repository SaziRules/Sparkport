'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { validateCheckoutForm, validateBillingData } from '@/lib/checkoutValidation';
import type { CheckoutFormData, FormErrors, BillingData, BillingErrors } from '@/lib/checkoutValidation';
import { STORES } from '@/lib/stores';
import { supabase } from '@/lib/supabase/client';

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
    desc: 'Choose a branch and pay when you collect',
    icon: (
      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const FREE_DELIVERY_THRESHOLD = 1500;

const EMPTY_FORM: CheckoutFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', province: '', postcode: '',
  orderNotes: '',
};

const EMPTY_BILLING: BillingData = {
  firstName: '', lastName: '', address1: '', address2: '', city: '', province: '', postcode: '',
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
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [storeError, setStoreError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Profile / address state
  const [isLoggedIn, setIsLoggedIn]              = useState(false);
  const [hasProfileAddress, setHasProfileAddress] = useState(false);
  const [editingAddress, setEditingAddress]       = useState(false);
  const [saveToProfile, setSaveToProfile]         = useState(false);
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [billingForm, setBillingForm]             = useState<BillingData>(EMPTY_BILLING);
  const [billingErrors, setBillingErrors]         = useState<BillingErrors>({});

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setIsLoggedIn(true);
      const { data: p } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, address1, address2, city, province, postcode')
        .eq('id', user.id)
        .single();
      if (p) {
        setForm(prev => ({
          ...prev,
          firstName: p.first_name || '',
          lastName:  p.last_name  || '',
          email:     user.email   || '',
          phone:     p.phone      || '',
          address1:  p.address1   || '',
          address2:  p.address2   || '',
          city:      p.city       || '',
          province:  p.province   || '',
          postcode:  p.postcode   || '',
        }));
        const hasAddr = !!(p.address1 && p.city);
        setHasProfileAddress(hasAddr);
        setSaveToProfile(!hasAddr);
      } else {
        setForm(prev => ({ ...prev, email: user.email || '' }));
        setSaveToProfile(true);
      }
    }
    load();
  }, []);

  const isInStore = paymentMethod === 'cod';

  const symbol = currencySymbol || 'R';
  const subtotal = parseInt(cartTotals.total_items ?? '0', 10) / 100;
  const discount = parseInt(cartTotals.total_discount ?? '0', 10) / 100;
  const discountedSubtotal = subtotal - discount;
  const grandTotal = parseInt(cartTotals.total_price ?? '0', 10) / 100;
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

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingForm(prev => ({ ...prev, [name]: value }));
    if (billingErrors[name as keyof BillingData]) {
      setBillingErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateCheckoutForm(form, { isInStore });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.getElementsByName(firstErrorKey)[0]?.focus();
      return;
    }

    if (!isInStore && useDifferentBilling) {
      const bErrors = validateBillingData(billingForm);
      if (Object.keys(bErrors).length > 0) {
        setBillingErrors(bErrors);
        document.getElementById('billing-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    if (paymentMethod === 'cod' && !selectedStoreId) {
      setStoreError('Please select a collection branch to continue');
      document.getElementById('store-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Build billing object
      const billingFirstName = (!isInStore && useDifferentBilling) ? billingForm.firstName : form.firstName;
      const billingLastName  = (!isInStore && useDifferentBilling) ? billingForm.lastName  : form.lastName;
      const billingAddress1  = isInStore ? '' : (useDifferentBilling ? billingForm.address1  : form.address1);
      const billingAddress2  = isInStore ? '' : (useDifferentBilling ? billingForm.address2  : form.address2);
      const billingCity      = isInStore ? '' : (useDifferentBilling ? billingForm.city      : form.city);
      const billingProvince  = isInStore ? '' : (useDifferentBilling ? billingForm.province  : form.province);
      const billingPostcode  = isInStore ? '' : (useDifferentBilling ? billingForm.postcode  : form.postcode);

      const billing = {
        first_name: billingFirstName,
        last_name:  billingLastName,
        email:      form.email,
        phone:      form.phone,
        address_1:  billingAddress1,
        address_2:  billingAddress2,
        city:       billingCity,
        state:      billingProvince,
        postcode:   billingPostcode,
        country:    'ZA',
      };

      // Build shipping object (only when delivery + using different billing)
      const shipping = (!isInStore && useDifferentBilling) ? {
        first_name: form.firstName,
        last_name:  form.lastName,
        address_1:  form.address1,
        address_2:  form.address2,
        city:       form.city,
        state:      form.province,
        postcode:   form.postcode,
        country:    'ZA',
      } : undefined;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing,
          ...(shipping ? { shipping } : {}),
          payment_method: paymentMethod,
          customer_note: form.orderNotes,
          ...(paymentMethod === 'cod' && selectedStoreId ? { store_id: selectedStoreId } : {}),
        }),
      });

      const data = await res.json() as { redirect?: string; message?: string };

      if (!res.ok) {
        setSubmitError(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.redirect) {
        if (isLoggedIn && saveToProfile && !isInStore) {
          fetch('/api/account/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              first_name: form.firstName,
              last_name:  form.lastName,
              phone:      form.phone,
              address1:   form.address1,
              address2:   form.address2,
              city:       form.city,
              province:   form.province,
              postcode:   form.postcode,
            }),
          }).catch(() => {});
        }
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
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

  const billingInputClass = (field: keyof BillingErrors) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-[#184363] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] transition-colors ${
      billingErrors[field] ? 'border-red-400 bg-red-50' : 'border-neutral-200'
    }`;

  const submitLabel = paymentMethod === 'payfast' ? 'Pay with PayFast' : 'Place Order';

  return (
    <div className="min-h-screen">
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

              {/* Card 1 — Contact Details */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h2 className="text-lg font-black! text-[#184363] mb-5">Contact Details</h2>

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
                      readOnly={isLoggedIn}
                      className={`${inputClass('email')} ${isLoggedIn ? 'bg-neutral-50 text-neutral-500 cursor-not-allowed' : ''}`}
                      placeholder="sipho@example.com"
                    />
                    {isLoggedIn && (
                      <p className="text-[10px] text-neutral-400 mt-1">(cannot be changed here)</p>
                    )}
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
                </div>
              </div>

              {/* Card 2 — Delivery Address (hidden for in-store) */}
              {!isInStore && (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                  <h2 className="text-lg font-black! text-[#184363] mb-5">Delivery Address</h2>

                  {/* Saved address banner */}
                  {isLoggedIn && hasProfileAddress && !editingAddress ? (
                    <div className="bg-[#e8f5f7] border border-[#009eb9]/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#184363] mb-0.5">Using your saved delivery address</p>
                          <p className="text-xs text-neutral-600">
                            {[form.address1, form.city, form.province, form.postcode].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingAddress(true)}
                        className="text-xs text-[#009eb9] font-bold hover:underline mt-2 block"
                      >
                        Use a different address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
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

                      {/* Save to profile checkbox */}
                      {isLoggedIn && (
                        <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={saveToProfile}
                            onChange={e => setSaveToProfile(e.target.checked)}
                            className="w-4 h-4 rounded accent-[#009eb9]"
                          />
                          <span className="text-xs text-neutral-600 font-medium">Save delivery address to my profile</span>
                        </label>
                      )}
                    </div>
                  )}

                  {/* Different billing address toggle */}
                  <div className="border-t border-neutral-100 mt-5 pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useDifferentBilling}
                        onChange={e => setUseDifferentBilling(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#009eb9]"
                      />
                      <span className="text-xs text-neutral-600 font-medium">Use a different billing address</span>
                    </label>

                    {useDifferentBilling && (
                      <div id="billing-section" className="mt-4 space-y-4">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Billing Address</p>

                        {/* Billing name row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                              First name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text" name="firstName" value={billingForm.firstName}
                              onChange={handleBillingChange} autoComplete="billing given-name"
                              className={billingInputClass('firstName')} placeholder="Sipho"
                            />
                            <FieldError msg={billingErrors.firstName} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                              Last name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text" name="lastName" value={billingForm.lastName}
                              onChange={handleBillingChange} autoComplete="billing family-name"
                              className={billingInputClass('lastName')} placeholder="Dlamini"
                            />
                            <FieldError msg={billingErrors.lastName} />
                          </div>
                        </div>

                        {/* Billing Address 1 */}
                        <div>
                          <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                            Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text" name="address1" value={billingForm.address1}
                            onChange={handleBillingChange} autoComplete="billing address-line1"
                            className={billingInputClass('address1')} placeholder="12 Main Road"
                          />
                          <FieldError msg={billingErrors.address1} />
                        </div>

                        {/* Billing Address 2 */}
                        <div>
                          <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                            Apartment, suite, unit <span className="text-neutral-400 font-normal!">(optional)</span>
                          </label>
                          <input
                            type="text" name="address2" value={billingForm.address2}
                            onChange={handleBillingChange} autoComplete="billing address-line2"
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm text-[#184363] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] transition-colors"
                            placeholder="Flat 2B"
                          />
                        </div>

                        {/* Billing City + Province */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                              City <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text" name="city" value={billingForm.city}
                              onChange={handleBillingChange} autoComplete="billing address-level2"
                              className={billingInputClass('city')} placeholder="Durban"
                            />
                            <FieldError msg={billingErrors.city} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                              Province <span className="text-red-400">*</span>
                            </label>
                            <select
                              name="province" value={billingForm.province}
                              onChange={handleBillingChange} autoComplete="billing address-level1"
                              className={billingInputClass('province')}
                            >
                              <option value="">Select province</option>
                              {SA_PROVINCES.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                            <FieldError msg={billingErrors.province} />
                          </div>
                        </div>

                        {/* Billing Postcode + Country */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold! text-neutral-600 mb-1.5">
                              Postal code <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text" name="postcode" value={billingForm.postcode}
                              onChange={handleBillingChange} autoComplete="billing postal-code"
                              className={billingInputClass('postcode')} placeholder="4001"
                            />
                            <FieldError msg={billingErrors.postcode} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold! text-neutral-600 mb-1.5">Country</label>
                            <div className="w-full px-4 py-3 border border-neutral-100 rounded-xl text-sm text-neutral-500 bg-neutral-50">
                              South Africa
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                          onChange={() => {
                            setPaymentMethod(method.slug);
                            setStoreError('');
                          }}
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

                  {/* Store picker — revealed when In-store is selected */}
                  {paymentMethod === 'cod' && (
                    <div id="store-picker" className="mt-5 pt-5 border-t border-neutral-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold! text-neutral-700">
                          Select your collection branch <span className="text-red-400">*</span>
                        </p>
                        {storeError && (
                          <p className="text-xs text-red-500">{storeError}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {STORES.map(store => {
                          const isSelected = selectedStoreId === store.id;
                          const shortName = store.name.replace('Sparkport ', '');
                          const area = store.address.split(',').slice(1, 3).join(',').trim();
                          const mainHours = store.hours.split('•')[0].trim();
                          return (
                            <button
                              key={store.id}
                              type="button"
                              onClick={() => {
                                setSelectedStoreId(store.id);
                                setStoreError('');
                              }}
                              className={`relative text-left p-3 rounded-xl border-2 transition-all duration-150 ${
                                isSelected
                                  ? 'border-[#009eb9] bg-[#e8f5f7] shadow-sm'
                                  : 'border-neutral-200 hover:border-[#009eb9]/50 hover:bg-neutral-50'
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#009eb9] flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                              <p className={`text-xs font-bold! pr-5 leading-tight ${isSelected ? 'text-[#009eb9]' : 'text-[#184363]'}`}>
                                {shortName}
                              </p>
                              <p className="text-[10px] text-neutral-500 mt-1 leading-tight">{area}</p>
                              <p className="text-[10px] text-neutral-400 mt-1 leading-tight">{mainHours}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected store detail strip */}
                      {selectedStoreId && (() => {
                        const store = STORES.find(s => s.id === selectedStoreId)!;
                        return (
                          <div className="mt-3 p-3 bg-[#009eb9]/5 border border-[#009eb9]/20 rounded-xl">
                            <div className="flex items-start gap-2">
                              <svg className="w-3.5 h-3.5 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div className="min-w-0">
                                <p className="text-xs font-bold! text-[#184363]">{store.name}</p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">{store.address}</p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">{store.hours}</p>
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-[#009eb9] font-semibold! mt-1 inline-block hover:underline"
                                >
                                  Get directions →
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
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
                    <div className="flex items-center gap-1.5 ml-1">
                      <div className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-black! text-neutral-500 bg-neutral-50">VISA</div>
                      <div className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-black! text-neutral-500 bg-neutral-50">MC</div>
                      <div className="px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-black! text-neutral-500 bg-neutral-50">EFT</div>
                    </div>
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
