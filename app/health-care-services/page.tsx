import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Health Care Services | Sparkport Pharmacy',
  description: 'From Vitality Health Checks to chronic disease management, clinic services, and blister packaging — discover the full range of healthcare services at Sparkport Pharmacy.',
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const SERVICES = [
  { name: 'Family Planning', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { name: 'Baby Wellness', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { name: 'Ear Syringing', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg> },
  { name: 'Pap Smear', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg> },
  { name: 'Prostate Screening', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { name: 'HIV Screening', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
  { name: 'Wound Care', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { name: 'Blood Pressure Testing', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
  { name: 'Blood Sugar Testing', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
  { name: 'Cholesterol Testing', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
  { name: 'Minor Injury Treatment', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg> },
  { name: 'Health Consultations', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg> },
];

const REVIEWS = [
  {
    text: "I can always rely on getting your essentials here at even the late hours of the night as they close at 10 pm most days",
    source: "Google Review",
    initial: "A",
  },
  {
    text: "Has everything you could look for in a pharmacy. Excellent business hours allowing for the late and weekend shop.",
    source: "Google Review",
    initial: "M",
  },
  {
    text: "Great hours, they were open after 9pm on a night I desperately needed medicine for a child.",
    source: "Google Review",
    initial: "T",
  },
  {
    text: "Absolutely friendly staff. The pharmacist staff are so helpful, fast and so efficient. Thanks guys keep up the great work.",
    source: "Google Review",
    initial: "N",
  },
];

const FAQS = [
  {
    q: 'Do I need an appointment for clinic services?',
    a: 'Most clinic services are available on a walk-in basis at our branches. However, for certain screenings or consultations, we recommend calling ahead to confirm availability at your nearest branch.',
  },
  {
    q: 'How do I book a Vitality Health Check?',
    a: 'Simply visit any Sparkport branch with your Discovery Vitality membership details. Our pharmacists will conduct the assessment and submit your results directly to Discovery so your points are loaded automatically.',
  },
  {
    q: 'Is blister packaging available at all branches?',
    a: 'Blister packaging is available at our main dispensing branches. Contact your nearest Sparkport store to confirm availability and to set up your monthly blister pack schedule.',
  },
  {
    q: 'Which medical aids does Sparkport accept?',
    a: 'Sparkport is a Medxpress network pharmacy and accepts Discovery Health, GEMS, and most major South African medical aids. We recommend contacting your scheme to confirm your specific plan benefits.',
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HealthCareServicesPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] lg:h-[600px]">
          <Image
            src="/images/wellness.jpg"
            alt="Sparkport healthcare services"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/90 via-[#184363]/75 to-[#009eb9]/30" />
        </div>

        {/* Overlay content — absolutely positioned over the image div */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs font-semibold uppercase tracking-widest mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] animate-pulse" />
                Clinic &amp; Pharmacy Services
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black! leading-[1.05] mb-6">
                Healthcare you can<br className="hidden lg:block" /> count on
              </h1>
              <p className="text-white/70 text-lg max-w-lg leading-relaxed mb-10">
                From routine check-ups to specialised treatments, Sparkport Pharmacy is your trusted partner in health across KwaZulu-Natal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/store-locator"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#009eb9] hover:bg-[#0090a8] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#009eb9]/30 text-sm"
                >
                  Find a Branch
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/8 border border-white/20 hover:bg-white/15 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  Book a Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-neutral-200">
            {[
              { value: '50K+', label: 'Monthly Visits' },
              { value: '45K+', label: 'Customers' },
              { value: '8', label: 'Branches in KZN' },
            ].map((stat) => (
              <div key={stat.label} className="py-8 text-center">
                <p className="text-3xl lg:text-4xl font-black text-[#009eb9]">{stat.value}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Clinic Services Grid ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">In-Pharmacy Clinic</p>
            <h2 className="text-4xl lg:text-5xl font-black! text-[#184363] leading-tight mb-4">Clinic Services</h2>
            <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Our dedicated team of healthcare professionals provides top-notch care across a broad spectrum of medical needs, available without an appointment at most branches.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {SERVICES.map((service) => (
              <div
                key={service.name}
                className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 hover:shadow-lg rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] transition-colors shrink-0">
                  {service.icon}
                </div>
                <p className="font-bold text-[#184363] text-sm leading-snug">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vitality Health Check ─────────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-28 px-6 overflow-hidden relative">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-6xl mx-auto lg:flex lg:items-center lg:gap-16">
          {/* Text */}
          <div className="lg:flex-1 mb-10 lg:mb-0">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Discovery Vitality</p>
            <h2 className="text-4xl lg:text-5xl font-black! text-white mb-5 leading-tight">Vitality Health Check</h2>
            <p className="text-white/75 leading-relaxed mb-8 max-w-lg">
              Book your next Vitality Health Check at any Sparkport branch. Earn up to 22,500 Vitality Points while taking control of your health. Our trained pharmacists assess your biometrics, identify risk factors, and recommend personalised wellness improvements.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Help manage existing health risks',
                'Potentially identify new health risks early',
                'Receive personalised wellness recommendations',
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-white/80 text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#009eb9] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <a
                href="https://sparkport.co.za/wp-content/uploads/vitality-health-check.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] hover:bg-[#0090a8] text-white font-bold rounded-xl transition-all text-sm"
              >
                Download PDF
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </a>
              <Link href="/store-locator" className="text-white/70 hover:text-white text-sm font-semibold transition-colors">
                Find a branch →
              </Link>
            </div>
          </div>

          {/* Stat card */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-7xl font-black text-[#009eb9] mb-2">22.5K</p>
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-6">Vitality Points Possible</p>
              <div className="h-px bg-white/10 mb-6" />
              <p className="text-white/60 text-sm leading-relaxed">
                Complete your biometric assessment at any branch and earn points toward your Vitality status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Medxpress ────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 lg:p-14 lg:flex lg:items-center lg:gap-16">
            {/* Icon column */}
            <div className="shrink-0 mb-8 lg:mb-0">
              <div className="w-20 h-20 rounded-2xl bg-[#184363] flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="lg:flex-1">
              <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Discovery Health</p>
              <h2 className="text-3xl lg:text-4xl font-black! text-[#184363] mb-4 leading-tight">Medxpress Network Pharmacy</h2>
              <p className="text-neutral-600 leading-relaxed max-w-2xl">
                Fill your chronic scripts at any of our stores and avoid the 20% DSP co-payment. The Discovery Smart plan is accepted at all our branches, giving you convenient access to essential medications across KwaZulu-Natal without paying more than you should.
              </p>
            </div>

            {/* Callout */}
            <div className="mt-8 lg:mt-0 lg:w-48 shrink-0 text-center">
              <p className="text-5xl font-black text-[#184363] mb-1">20%</p>
              <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold">Co-payment saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GEMS Members ─────────────────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-28 px-6 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-6xl mx-auto lg:flex lg:items-start lg:gap-16">
          {/* Heading column */}
          <div className="lg:w-72 shrink-0 mb-8 lg:mb-0">
            <div className="w-14 h-14 rounded-2xl bg-[#009eb9]/20 border border-[#009eb9]/30 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-2">Government Employees</p>
            <h2 className="text-3xl font-black! text-white leading-tight">GEMS Members</h2>
          </div>

          {/* Body */}
          <div className="lg:flex-1 space-y-5">
            <p className="text-white/75 leading-relaxed">
              Sparkport extends a heartfelt thank you to all GEMS members for your continued support. As a valued GEMS member, you qualify for the Screening Preventative Benefit available from the Risk Fund.
            </p>
            <p className="text-white/75 leading-relaxed">
              Please visit your nearest Sparkport branch to complete your Health Risk Assessment and take full advantage of the benefits available to you.
            </p>
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] hover:bg-[#0090a8] text-white font-bold rounded-xl transition-all text-sm"
            >
              Find your nearest branch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Generic Insurance ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="lg:flex lg:items-center lg:gap-16">
            {/* Image panel */}
            <div className="relative lg:w-1/2 h-80 lg:h-[460px] rounded-3xl overflow-hidden mb-10 lg:mb-0 shrink-0">
              <Image
                src="/images/hero-main-care.jpg"
                alt="Generic health insurance"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#184363]/60 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9]" />
                  Affordable Coverage
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:flex-1">
              <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Affordable Coverage</p>
              <h2 className="text-4xl lg:text-5xl font-black! text-[#184363] mb-5 leading-tight">Generic Insurance</h2>
              <p className="text-neutral-600 leading-relaxed mb-8">
                Our generic health insurance plans deliver essential coverage without the heavy price tag, giving you access to quality healthcare regardless of your budget.
              </p>
              <div className="space-y-4 mb-10">
                {['Main Member Coverage', 'Adult Dependant Coverage', 'Child Dependant Coverage'].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#009eb9]/15 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-semibold text-[#184363] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://sparkport.co.za/wp-content/uploads/Genric-Product-Brochure-2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] hover:bg-[#0090a8] text-white font-bold rounded-xl transition-all text-sm"
              >
                Download Brochure
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blister Packaging ────────────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-28 px-6 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#009eb9]/20 border border-[#009eb9]/30 rounded-full text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-6">
              R120 / month
            </div>
            <h2 className="text-4xl lg:text-5xl font-black! text-white mb-5 leading-tight">Blister Packaging</h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              A tamper-evident pop-out system that greatly improves medication compliance. Once the blister seal is broken it cannot be refilled, and the foil ensures the correct storage temperature is maintained throughout.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                title: 'Right Pills',
                body: 'Dosage instructions and special precautions are printed on each blister, removing the need for a separate guide.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
              {
                title: 'Right Dose',
                body: 'Schedule 5 and 6 items are colour-coded for quick identification. Each blister is pre-filled to your exact prescription.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
              },
              {
                title: 'Right Time',
                body: 'Morning, midday, evening, and night compartments are clearly separated so you never miss a dose again.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 hover:border-white/25 rounded-2xl p-7 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-5">
                  {item.icon}
                </div>
                <h3 className="text-white font-black text-lg mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="text-white/50 text-sm text-center leading-relaxed max-w-2xl mx-auto">
            Ask your nearest Sparkport pharmacist about setting up your blister pack programme at just R120 per month.
          </p>
        </div>
      </section>

      {/* ── Why Sparkport ────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Our Promise</p>
            <h2 className="text-4xl lg:text-5xl font-black! text-[#184363] leading-tight">Why Sparkport Pharmacy?</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed text-center max-w-2xl mx-auto mb-12">
            Choosing Sparkport means choosing quality healthcare, advanced technology, skilled professionals, and a patient-centred experience. We are committed to serving you and your family with excellence and compassion across all eight of our KwaZulu-Natal branches.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Quality Healthcare',
                body: 'Trusted excellence in every prescription and consultation.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
              },
              {
                title: 'Advanced Technology',
                body: 'Modern dispensary systems and equipment at every branch.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.638-1.38 2.638H4.178c-1.41 0-2.38-1.638-1.38-2.638L4.2 15.3" /></svg>,
              },
              {
                title: 'Skilled Professionals',
                body: 'Registered pharmacists and clinical staff who care.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
              },
              {
                title: 'Convenient Access',
                body: 'Extended trading hours and eight branches across KZN.',
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
              },
            ].map((item) => (
              <div key={item.title} className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 hover:shadow-lg rounded-2xl p-7 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-5 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-28 px-6 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Google Reviews</p>
            <h2 className="text-4xl lg:text-5xl font-black! text-white leading-tight">What our customers say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REVIEWS.map((review, i) => (
              <blockquote
                key={i}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed text-base mb-6 italic">&ldquo;{review.text}&rdquo;</p>
                <footer className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-sm font-black shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">{review.source}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black! text-[#184363]">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 rounded-2xl overflow-hidden transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none select-none">
                  <span className="font-bold text-[#184363] text-sm lg:text-base">{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-[#009eb9] shrink-0 rotate-0 group-open:rotate-180 transition-transform duration-300"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-7 pb-6 text-neutral-600 text-sm leading-relaxed border-t border-neutral-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: 'linear-gradient(to right, #009eb9, #007fa0)' }}
      >
        <h2 className="text-3xl lg:text-4xl font-black! text-white mb-4">Ready to take control of your health?</h2>
        <p className="text-white/75 mb-8 max-w-md mx-auto">
          Visit any of our eight branches across KwaZulu-Natal, or book a service today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#184363] font-black rounded-xl hover:bg-neutral-100 transition-all shadow-lg text-sm"
          >
            Book a Service
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <Link
            href="/store-locator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 border border-white/30 hover:bg-white/25 text-white font-bold rounded-xl transition-all text-sm"
          >
            Find a Branch
          </Link>
        </div>
      </section>

    </div>
  );
}
