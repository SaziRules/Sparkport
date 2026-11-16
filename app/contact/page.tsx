'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WA_ICON = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const CONTACT_METHODS = [
  {
    title: 'Call Us',
    detail: '031 207 1011',
    sub: 'Mon–Sat during trading hours',
    href: 'tel:0312071011',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    title: 'Email Us',
    detail: 'online@sparkport.co.za',
    sub: 'We reply within 1–2 business days',
    href: 'mailto:online@sparkport.co.za',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'WhatsApp',
    detail: 'Chat with us',
    sub: 'Fast replies during business hours',
    href: 'https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0',
    icon: WA_ICON,
    external: true,
  },
];

const SUBJECTS = [
  'General Enquiry',
  'Prescription Enquiry',
  'Order Support',
  'Product Information',
  'Rewards Programme',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category: form.subject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setTicketNumber(data.ticket_number);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[480px] lg:min-h-[560px] flex items-center overflow-hidden">
        <Image
          src="/images/heart-health.jpg"
          alt="Contact Sparkport Pharmacy"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/95 via-[#184363]/80 to-[#009eb9]/35" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs font-semibold uppercase tracking-widest mb-7 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] animate-pulse" />
            We&apos;re Here to Help
          </div>
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold! text-white leading-[1.05] mb-6">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg lg:text-xl max-w-2xl leading-relaxed mb-10">
            Questions about a prescription, an order, or anything else — reach out and the Sparkport team will come back to you fast.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:0312071011"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007f95] transition-colors text-sm shadow-lg shadow-[#009eb9]/25"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 031 207 1011
            </a>
            <a
              href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              {WA_ICON}
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-100">
            {[
              { value: '8', label: 'KZN Branches' },
              { value: '1–2 Days', label: 'Email Reply' },
              { value: '7 Days', label: 'Support Coverage' },
              { value: 'Live', label: 'WhatsApp Chat' },
            ].map((stat) => (
              <div key={stat.label} className="py-8 text-center">
                <p className="text-2xl lg:text-3xl font-extrabold! text-[#009eb9]">{stat.value}</p>
                <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact Methods ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Reach Out</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-[#184363] leading-tight">Pick the channel that suits you</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CONTACT_METHODS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 hover:shadow-lg rounded-2xl p-7 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-5 transition-colors p-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-1">{item.title}</h3>
                <p className="text-[#009eb9] text-sm font-semibold mb-1">{item.detail}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ──────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 lg:py-24 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Send a Message</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-[#184363] leading-tight">Tell us how we can help</h2>
            <p className="text-neutral-500 mt-4 leading-relaxed max-w-xl mx-auto">
              Fill in the form and a member of our team will get back to you within 1–2 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Form */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-10">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-[#009eb9]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-[#009eb9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold! text-[#184363] mb-3">Message Sent</h3>
                    <p className="text-neutral-500 leading-relaxed mb-3 max-w-md mx-auto">
                      Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
                    </p>
                    {ticketNumber && (
                      <p className="text-sm text-neutral-500">
                        Your ticket reference is{' '}
                        <span className="font-bold text-[#009eb9]">{ticketNumber}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold! uppercase tracking-widest text-[#184363] mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] text-sm text-[#184363] placeholder:text-neutral-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold! uppercase tracking-widest text-[#184363] mb-2">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] text-sm text-[#184363] placeholder:text-neutral-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold! uppercase tracking-widest text-[#184363] mb-2">Phone <span className="text-neutral-400 font-medium! normal-case tracking-normal">(optional)</span></label>
                        <input
                          type="tel"
                          placeholder="082 000 0000"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] text-sm text-[#184363] placeholder:text-neutral-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold! uppercase tracking-widest text-[#184363] mb-2">Subject</label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] text-sm text-[#184363] bg-white transition-colors"
                        >
                          <option value="">Select a subject</option>
                          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold! uppercase tracking-widest text-[#184363] mb-2">Message</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/30 focus:border-[#009eb9] text-sm text-[#184363] placeholder:text-neutral-400 resize-none transition-colors"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#184363] text-white font-bold rounded-xl hover:bg-[#009eb9] transition-colors text-sm shadow-lg shadow-[#184363]/20 disabled:opacity-60"
                    >
                      {loading ? 'Sending…' : 'Send Message'}
                      {!loading && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar: Address + Trading Hours */}
            <div className="space-y-5 order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-7">
                <div className="w-11 h-11 rounded-2xl bg-[#009eb9]/10 flex items-center justify-center text-[#009eb9] mb-4 p-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-2">Head Office</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                  382 Randles Rd, Overport<br />Durban, 4091
                </p>
                <Link
                  href="/store-locator"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#009eb9] hover:text-[#007f95] transition-colors"
                >
                  Find all branches
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-7">
                <div className="w-11 h-11 rounded-2xl bg-[#009eb9]/10 flex items-center justify-center text-[#009eb9] mb-4 p-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-3">Office Trading Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Mon – Fri</span>
                    <span className="font-semibold text-[#184363]">08:00 – 17:30</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Saturday</span>
                    <span className="font-semibold text-[#184363]">08:30 – 14:00</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Sun &amp; Public Hols</span>
                    <span className="font-semibold text-neutral-400">Closed</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 mt-4 leading-relaxed">
                  Branch trading hours vary — see the store locator for live hours per branch.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Dark Band ───────────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-24 px-6 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-6xl mx-auto lg:flex lg:items-center lg:gap-16">
          <div className="lg:flex-1 mb-10 lg:mb-0">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Prefer in Person?</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-white leading-tight mb-5">
              Pop into your nearest<br className="hidden lg:block" /> Sparkport branch
            </h2>
            <p className="text-white/70 leading-relaxed max-w-lg">
              8 branches across KwaZulu-Natal, with extended trading hours at Overport, Chatsworth, and Pietermaritzburg. Our pharmacists are available for in-store consultation during all trading hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007f95] transition-colors text-sm shadow-lg shadow-black/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find a Store
            </Link>
            <a
              href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              {WA_ICON}
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section
        className="px-6 py-20 lg:py-24 text-center"
        style={{ background: 'linear-gradient(to right, #009eb9, #007fa0)' }}
      >
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Need a Prescription?</p>
        <h2 className="text-4xl lg:text-5xl font-extrabold! text-white mb-5 leading-tight">
          Upload your script in seconds
        </h2>
        <p className="text-white/75 leading-relaxed mb-10 max-w-xl mx-auto">
          Submit your prescription online and pick the branch nearest you. Our pharmacy team will prepare your meds and notify you when they&apos;re ready.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/fill-script"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#009eb9] font-bold rounded-xl hover:bg-neutral-100 transition-colors text-sm shadow-lg shadow-black/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload a Script
          </Link>
          <Link
            href="/store-locator"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors text-sm"
          >
            Browse Branches
          </Link>
        </div>
      </section>

    </div>
  );
}
