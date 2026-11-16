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
    <footer className="relative bg-[#101820] text-white overflow-hidden">

      {/* Top brand accent band */}
      <div className="h-1 bg-gradient-to-r from-[#009eb9] via-[#184363] to-[#009eb9]" aria-hidden="true" />

      {/* Subtle radial background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      {/* Main Footer Content */}
      <div className="relative max-w-385 mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Newsletter — col-span-3 */}
          <div className="lg:col-span-3 sm:col-span-2">
            <Image
              src="https://sparkport.co.za/wp-content/uploads/SP-Logo-01.png"
              alt="Sparkport"
              width={180}
              height={60}
              className="h-14 w-auto mb-7"
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#009eb9] mb-3">The Pharmacist&apos;s Insider</p>
            <h3 className="text-xl font-extrabold text-white leading-tight mb-2">Stay in the loop</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-sm">
              New releases, in-store specials and health-first guidance. Delivered monthly, never spammy.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-sm text-emerald-300 font-medium">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                You&apos;re in. See you in your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex items-stretch rounded-xl overflow-hidden shadow-lg shadow-black/20 ring-1 ring-white/5 focus-within:ring-2 focus-within:ring-[#009eb9] transition-all">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.co.za"
                    className="flex-1 min-w-0 px-4 py-3 bg-white/10 text-white placeholder:text-neutral-500 focus:outline-none text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!acceptedTerms || subLoading}
                    className="shrink-0 px-5 bg-[#009eb9] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#007f95] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    aria-label="Subscribe"
                  >
                    {subLoading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <>
                        Join
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                {subError && (
                  <p className="text-xs text-red-400">{subError}</p>
                )}
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-500 bg-transparent accent-[#009eb9]"
                  />
                  <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors leading-snug">
                    I accept the <Link href="/terms-conditions" className="underline hover:text-white">terms</Link> &amp; <Link href="/privacy-policy" className="underline hover:text-white">privacy policy</Link>.
                  </span>
                </label>
              </form>
            )}
          </div>

          {/* Information — col-span-2 */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#009eb9] mb-5 after:block after:w-8 after:h-px after:bg-[#009eb9]/50 after:mt-2">Information</h3>
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
              <li>
                <Link href="/regulated-medication" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  Regulated Medication
                </Link>
              </li>
            </ul>
          </div>

          {/* Account — col-span-2 */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#009eb9] mb-5 after:block after:w-8 after:h-px after:bg-[#009eb9]/50 after:mt-2">Account</h3>
            <div className="flex-1 flex flex-col gap-2">
              {[
                {
                  href: '/account/orders',
                  label: 'Orders',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  ),
                },
                {
                  href: '/terms-conditions#returns',
                  label: 'Returns',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  ),
                },
                {
                  href: '/fill-script',
                  label: 'Fill Your Script',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  ),
                },
                {
                  href: '/get-rewarded',
                  label: 'Earn Rewards',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  ),
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#009eb9]/30 transition-all duration-200"
                >
                  <span className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#009eb9]/25 to-[#184363]/25 border border-[#009eb9]/20 flex items-center justify-center text-[#7fd4e0] group-hover:from-[#009eb9] group-hover:to-[#007f95] group-hover:text-white group-hover:border-[#009eb9] transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </span>
                  <span className="flex-1 text-sm font-bold text-white leading-tight">{item.label}</span>
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#009eb9] group-hover:translate-x-0.5 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — col-span-2 */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#009eb9] mb-5 after:block after:w-8 after:h-px after:bg-[#009eb9]/50 after:mt-2">Reach us</h3>
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
                <svg className="w-4 h-4 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors text-sm">Send us a message</Link>
              </li>
            </ul>

            <div className="pt-6 mt-6 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#009eb9] mb-4 after:block after:w-8 after:h-px after:bg-[#009eb9]/50 after:mt-2">
                Follow us
              </p>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com/sparkport"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1877F2]/40"
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-[#1877F2] transition-colors duration-300" />
                  <div className="relative w-full h-full flex items-center justify-center text-white">
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/sparkport"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/40"
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:opacity-0 transition-opacity duration-300" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    }}
                  />
                  <div className="relative w-full h-full flex items-center justify-center text-white">
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/27312071011"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="group relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#25D366]/40"
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-[#25D366] transition-colors duration-300" />
                  <div className="relative w-full h-full flex items-center justify-center text-white">
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Our Branches — col-span-3, simple 2-col button grid, flush to bottom */}
          <div className="lg:col-span-3 sm:col-span-2 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#009eb9] mb-5 after:block after:w-8 after:h-px after:bg-[#009eb9]/50 after:mt-2">Our Branches</h3>
            <div className="flex-1 grid grid-cols-2 auto-rows-fr gap-2">
              {STORES.map((store) => (
                <Link
                  key={store.slug}
                  href={`/branches/${store.slug}`}
                  className="group relative flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#009eb9]/30 transition-all duration-200 min-w-0"
                >
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#009eb9]/25 to-[#184363]/25 border border-[#009eb9]/20 flex items-center justify-center text-[#7fd4e0] group-hover:from-[#009eb9] group-hover:to-[#007f95] group-hover:text-white group-hover:border-[#009eb9] transition-all duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="flex-1 min-w-0 text-xs font-bold text-white leading-tight truncate">
                    {store.name.replace('Sparkport ', '')}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="max-w-385 mx-auto px-6 lg:px-10 py-5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

            <p className="text-neutral-400 text-xs text-center lg:text-left tracking-wide">
              © 1983–2026 <span className="font-bold text-white">Sparkport GOP</span>. All rights reserved. Built to thrive by <a href="https://movedigital.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline-offset-2 hover:underline">Move Digital</a>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-2.5 gap-y-1 text-[11px]">
              <span className="font-bold uppercase tracking-[0.3em] text-[#009eb9]">Accepted</span>
              {['Visa', 'Mastercard', 'PayFast', 'Instant EFT', 'SnapScan'].map((name, i) => (
                <span key={name} className="flex items-center gap-2.5 text-neutral-300">
                  {i > 0 && <span className="text-white/20" aria-hidden="true">/</span>}
                  <span className="font-semibold">{name}</span>
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}