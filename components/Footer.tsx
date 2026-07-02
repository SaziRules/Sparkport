'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { STORES } from '@/lib/stores';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !acceptedTerms) return;
    setSubLoading(true);
    setSubError(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setSubscribed(true);
      setEmail('');
      setAcceptedTerms(false);
    } catch (err) {
      setSubError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer className="bg-[#2c2c2c] text-white">
      
      {/* Main Footer Content */}
      <div className="max-w-full mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Newsletter — col-span-3 */}
          <div className="lg:col-span-3">
            <Image
              src="https://sparkport.co.za/wp-content/uploads/SP-Logo-01.png"
              alt="Sparkport"
              width={160}
              height={56}
              className="h-14 w-auto mb-6"
            />
            <p className="text-neutral-300! mb-6">
              Stay tuned for latest updates and new features
            </p>

            {subscribed ? (
              <div className="mb-4 flex items-center gap-2 text-sm text-emerald-400 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You&apos;re subscribed — thanks!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mb-4">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 px-4 py-2.5 bg-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none rounded-l-lg"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!acceptedTerms || subLoading}
                    className="px-6 py-2.5 bg-[#00bcd4] text-white font-medium rounded-r-lg hover:bg-[#00acc1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {subLoading ? '…' : 'Subscribe'}
                  </button>
                </div>
                {subError && (
                  <p className="mt-1.5 text-xs text-red-400">{subError}</p>
                )}
              </form>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-neutral-500 bg-transparent"
              />
              <span className="text-sm text-neutral-400">
                I accept terms and conditions &amp; privacy policy
              </span>
            </label>
          </div>

          {/* Information — col-span-2 */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/health-care-services" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Health Care Services
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Account — col-span-2 */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Account details</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/account/orders" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions#returns" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/auth/forgot-password" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Lost password
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact — col-span-2 */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-neutral-300 text-sm leading-snug">382 Randles Rd, Overport, Durban, 4091</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+27312071011" className="text-neutral-300 hover:text-white transition-colors text-sm">(031) 207-1011</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:online@sparkport.co.za" className="text-neutral-300 hover:text-white transition-colors text-sm">online@sparkport.co.za</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#009eb9] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a href="https://wa.me/27312071011" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors text-sm">WhatsApp Us</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors text-sm">Send us a message</Link>
              </li>
              <li className="pt-1 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <Link href="/store-locator" className="text-neutral-300 hover:text-white transition-colors text-sm">Find a branch near you</Link>
              </li>
              <li className="pt-3 flex items-center gap-2.5">
                <a
                  href="https://facebook.com/sparkport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#00bcd4] rounded flex items-center justify-center hover:bg-[#00acc1] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/sparkport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#00bcd4] rounded flex items-center justify-center hover:bg-[#00acc1] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Our Branches — col-span-3 */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-4">Our Branches</h3>
            <ul className="space-y-2.5">
              {STORES.map((store) => (
                <li key={store.slug}>
                  <Link
                    href={`/branches/${store.slug}`}
                    className="text-neutral-300 hover:text-white transition-colors text-sm"
                  >
                    {store.name.replace('Sparkport ', '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-neutral-700">
        <div className="max-w-full mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            <p className="text-neutral-400! text-xs text-center lg:text-left">
              © 1983-2026 Sparkport GOP. All Rights Reserved | Built to thrive by Move Digital.
            </p>

            <div className="flex items-center gap-3">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={48} height={24} className="h-6 w-auto" />
              <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" width={48} height={24} className="h-6 w-auto" />
              <div className="px-2 py-1 bg-white text-black text-xs font-semibold">
                PayFast
              </div>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}