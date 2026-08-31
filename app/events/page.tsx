import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Community Health Events | Sparkport Pharmacy',
  description: 'Free health screenings, wellness workshops, and community health drives across all Sparkport Pharmacy branches in KwaZulu-Natal.',
};

const EVENT_TYPES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Health Screenings',
    description: 'Free blood pressure, glucose, cholesterol, and BMI checks — bringing clinical care directly to your community.',
    tag: 'Free · Walk-in',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Wellness Workshops',
    description: 'Expert-led sessions on chronic disease management, nutrition, mental health, and medication compliance.',
    tag: 'Education · Groups',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Baby Wellness Days',
    description: 'Dedicated clinics for new parents covering infant nutrition, vaccinations, growth tracking, and clinic services.',
    tag: 'Families · Community',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'HIV Testing & Awareness',
    description: 'Confidential HIV screenings and awareness drives supporting community health across KwaZulu-Natal.',
    tag: 'Confidential · Free',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V13.5zm0 3h.008v.008H12v-.008zm-3 0h.008v.008H9v-.008zm6 0h.008v.008H15v-.008z" />
      </svg>
    ),
    title: 'Vitality Health Checks',
    description: 'Earn up to 22,500 Vitality Points with your annual health check. Biometrics, risk assessment, and personalised recommendations.',
    tag: 'Discovery · Points',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: 'Flu Vaccination Drives',
    description: 'Annual in-store flu vaccination campaigns — fast, affordable, and available at all eight branches.',
    tag: 'Seasonal · In-store',
  },
];

export default function EventsPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center overflow-hidden">
        <Image
          src="/images/school-kids.jpg"
          alt="Sparkport Community Health Events"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/95 via-[#184363]/80 to-[#009eb9]/35" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest mb-7">
            <span className="w-1.5 h-1.5 bg-[#009eb9] rounded-full animate-pulse" />
            Community Health Events
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold! text-white mb-6 leading-tight max-w-3xl">
            Health for your<br />
            <span className="text-[#009eb9]">whole community</span>
          </h1>
          <p className="text-white/75 text-lg lg:text-xl max-w-xl leading-relaxed mb-10">
            Free screenings, wellness workshops, and community health drives — across all eight Sparkport branches in KwaZulu-Natal.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#009eb9] hover:bg-[#00b0ce] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#009eb9]/30 text-sm"
            >
              Get Notified
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-neutral-100">
            {[
              { value: '8', label: 'Branches in KZN' },
              { value: 'Free', label: 'For All Customers' },
              { value: 'KZN-wide', label: 'Community Reach' },
            ].map(s => (
              <div key={s.label} className="py-8 text-center">
                <p className="text-3xl lg:text-4xl font-extrabold! text-[#009eb9]">{s.value}</p>
                <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Event types ──────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">What We Run</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-4">Types of events we host</h2>
            <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed">
              From clinical screenings to community education, Sparkport brings quality healthcare directly to your neighbourhood.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENT_TYPES.map(type => (
              <div
                key={type.title}
                className="group bg-white border border-neutral-100 rounded-2xl p-6 hover:border-[#009eb9]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-[#009eb9]/8 rounded-2xl flex items-center justify-center text-[#009eb9] mb-5 group-hover:bg-[#009eb9] group-hover:text-white transition-colors duration-200">
                  {type.icon}
                </div>
                <span className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                  {type.tag}
                </span>
                <h3 className="font-bold text-[#184363] text-base mb-2">{type.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming events placeholder ──────────────────────────────────────── */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Coming Up</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-5">Next event to be announced</h2>
          <p className="text-neutral-500 max-w-lg mx-auto leading-relaxed mb-10">
            We&apos;re planning our next community health event. Follow us on social media or contact your nearest branch to be among the first to hear about upcoming dates and locations.
          </p>
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </div>
            <span className="text-xs font-bold px-4 py-2 rounded-full bg-neutral-100 text-neutral-400 uppercase tracking-widest">
              Watch this space
            </span>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363]">How to attend an event</h2>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#009eb9]/30 via-[#009eb9] to-[#009eb9]/30" />
            {[
              {
                step: '1',
                title: 'Find an event',
                desc: 'Check this page or follow us on social media for upcoming event announcements at your nearest branch.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                  </svg>
                ),
              },
              {
                step: '2',
                title: 'Walk in or register',
                desc: 'Most events are walk-in — no appointment needed. For larger workshops, drop us a WhatsApp or call to reserve your spot.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
              },
              {
                step: '3',
                title: 'Get your results',
                desc: 'Receive your screening results privately, with optional referral to a healthcare professional if follow-up care is recommended.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
            ].map(s => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className="relative w-16 h-16 bg-[#009eb9] rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-[#009eb9]/20">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#184363] rounded-full text-white text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-2">{s.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Get notified band ─────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-6 border-t border-neutral-100" style={{ background: 'linear-gradient(135deg, #184363 0%, #1a4a6e 60%, #0d2a42 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-[#009eb9]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold! text-white mb-4">Be the first to know</h2>
          <p className="text-white/65 leading-relaxed mb-10 max-w-lg mx-auto">
            Events are announced across our branches. Contact us and let us know your nearest Sparkport — we&apos;ll make sure you&apos;re notified before each event.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#009eb9] hover:bg-[#00b0ce] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#009eb9]/30 text-sm"
            >
              Register Interest
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all text-sm"
            >
              Find Your Branch
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA footer ───────────────────────────────────────────────────────── */}
      <div className="bg-neutral-50 border-t border-neutral-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold! text-[#184363] mb-1">Want to host a community health event?</h3>
            <p className="text-neutral-500 text-sm">We partner with schools, corporates, and community groups.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007fa0] transition-colors text-sm"
            >
              Partner With Us
            </Link>
            <Link
              href="/health-care-services"
              className="px-6 py-3 border-2 border-[#184363] text-[#184363] font-semibold rounded-xl hover:bg-[#184363] hover:text-white transition-colors text-sm"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
