import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Health Insurance | Sparkport Pharmacy',
  description: 'Protect yourself and your family with comprehensive health insurance solutions, guided by the experts at Sparkport Pharmacy. Get a personalised quote via WhatsApp.',
};

const COVERAGE = [
  {
    title: 'Hospital Stays',
    description: 'Private and semi-private room coverage during admissions.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Surgical Procedures',
    description: 'Major and minor surgical operations covered.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Specialist Consultations',
    description: 'Direct access to a wide network of medical specialists.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Diagnostic Tests',
    description: 'X-rays, MRIs, blood tests, and other lab work.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Chronic Medication',
    description: 'Ongoing prescription coverage for chronic conditions.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: 'Emergency Services',
    description: '24/7 emergency medical care included as standard.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: 'Preventative Care',
    description: 'Annual check-ups, screenings, and wellness visits.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Maternity Coverage',
    description: 'Pre-natal and post-natal care for growing families.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Dental and Vision',
    description: 'Optional dental and optical coverage add-ons.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'Mental Health Support',
    description: 'Counselling and therapy sessions covered.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Alternative Therapies',
    description: 'Physiotherapy, chiropractic, and related care.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Travel Insurance',
    description: 'Medical coverage while you travel domestically or abroad.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    question: 'When does my coverage start?',
    answer: 'Your coverage typically begins on the first day of the month following your application approval. Some plans may have waiting periods for certain benefits.',
  },
  {
    question: 'Can I add family members to my plan?',
    answer: 'Yes. We offer comprehensive family coverage options. You can add your spouse, children, and other dependents to your plan at competitive rates.',
  },
  {
    question: 'What if I have pre-existing conditions?',
    answer: 'We offer coverage options for individuals with pre-existing conditions. Specific terms and waiting periods may apply. Contact us to discuss your situation.',
  },
  {
    question: 'How do I submit a claim?',
    answer: 'Claims can be submitted through the online portal, mobile app, or by contacting our customer service team. We will guide you through the simple process to ensure quick reimbursement.',
  },
];

const WA_ICON = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function HealthInsurancePage() {
  return (
    <div className="bg-white overflow-x-hidden">

      <style>{`
        details[open] .chevron {
          transform: rotate(180deg);
        }
        .chevron {
          transition: transform 0.3s ease;
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] lg:min-h-[600px] flex items-center overflow-hidden">
        <Image
          src="/images/heart-health.jpg"
          alt="Health Insurance at Sparkport Pharmacy"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/95 via-[#184363]/80 to-[#009eb9]/35" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs font-semibold uppercase tracking-widest mb-7 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] animate-pulse" />
            Trusted Health Solutions
          </div>
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold! text-white leading-[1.05] mb-6">
            Health Insurance
          </h1>
          <p className="text-white/70 text-lg lg:text-xl max-w-2xl leading-relaxed mb-10">
            Protect yourself and your loved ones with comprehensive health coverage. Our specialists at Sparkport Pharmacy help you find the right plan for your life and budget.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.msg.partners/P/SparkportSPO1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-colors text-sm shadow-lg shadow-[#25D366]/25"
            >
              {WA_ICON}
              Get a Quote via WhatsApp
            </a>
            <a
              href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              {WA_ICON}
              Chat with a Specialist
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-100">
            {[
              { value: 'Comprehensive', label: 'Hospital Cover' },
              { value: 'Family', label: 'Coverage Options' },
              { value: 'Expert', label: 'Guidance' },
              { value: 'Personalised', label: 'Plans' },
            ].map((stat) => (
              <div key={stat.label} className="py-8 text-center">
                <p className="text-2xl lg:text-3xl font-extrabold! text-[#009eb9]">{stat.value}</p>
                <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Health Insurance ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Why It Matters</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-[#184363] leading-tight">Protecting your health<br className="hidden lg:block" /> is protecting your future</h2>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-14 max-w-3xl mx-auto text-center">
            Medical costs in South Africa continue to rise. A single unplanned hospital visit can set a family back by tens of thousands of rands. The right health insurance plan gives you access to quality care without the financial shock, so you can focus on recovery, not bills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Financial Protection',
                desc: 'Shield your savings from unexpected medical expenses and catastrophic events.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Quality Access',
                desc: 'Reach a wide network of private hospitals, specialists, and facilities.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
              },
              {
                title: 'Family Security',
                desc: 'Comprehensive cover options that include your spouse, children, and dependents.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 hover:shadow-lg rounded-2xl p-7 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-5 transition-colors p-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Coverage ────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">What You Get</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-[#184363] leading-tight">Core Coverage</h2>
            <p className="text-neutral-500 mt-4 leading-relaxed max-w-xl mx-auto">
              Comprehensive core cover designed to protect you when it matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COVERAGE.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:border-[#009eb9]/30 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-4 transition-colors p-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#184363] mb-1.5">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Additional Benefits ──────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 lg:py-28 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Go Further</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-[#184363] leading-tight">Additional Benefits</h2>
            <p className="text-neutral-500 mt-4 leading-relaxed max-w-xl mx-auto">
              Optional add-ons and extended benefits to round out your health plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:border-[#009eb9]/30 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-4 transition-colors p-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#184363] mb-1.5">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialist CTA Band ──────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-28 px-6 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-6xl mx-auto lg:flex lg:items-center lg:gap-16">
          <div className="lg:flex-1 mb-10 lg:mb-0">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Personalised Advice</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold! text-white leading-tight mb-5">
              Not sure which plan<br className="hidden lg:block" /> is right for you?
            </h2>
            <p className="text-white/70 leading-relaxed max-w-lg">
              Our health insurance specialists take the time to understand your situation and recommend a plan that fits your life, your family, and your budget. No jargon, no pressure.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-colors text-sm shadow-lg shadow-black/20"
            >
              {WA_ICON}
              Chat with a Specialist
            </a>
            <a
              href="https://www.msg.partners/P/SparkportSPO1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              {WA_ICON}
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Questions</p>
            <h2 className="text-4xl font-extrabold! text-[#184363]">Frequently asked questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 rounded-2xl overflow-hidden transition-colors border-b border-neutral-100 last:border-0"
              >
                <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none select-none">
                  <span className="font-bold text-[#184363] text-sm lg:text-base">{faq.question}</span>
                  <svg
                    className="chevron w-5 h-5 text-[#009eb9] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-7 pb-6 pt-4 text-neutral-600 text-sm leading-relaxed border-t border-neutral-100">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-20 lg:py-28 text-center"
        style={{ background: 'linear-gradient(to right, #009eb9, #007fa0)' }}
      >
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Take the First Step</p>
        <h2 className="text-4xl lg:text-5xl font-extrabold! text-white mb-5 leading-tight">
          Ready to get protected?
        </h2>
        <p className="text-white/75 leading-relaxed mb-10 max-w-xl mx-auto">
          A personalised quote takes minutes. Speak to one of our Sparkport specialists today and find the cover that works for you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://www.msg.partners/P/SparkportSPO1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-colors text-sm shadow-lg shadow-black/20"
          >
            {WA_ICON}
            Get a Quote via WhatsApp
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
