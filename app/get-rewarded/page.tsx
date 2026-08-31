import type { Metadata } from 'next';
import Link from 'next/link';
import RewardsRegistrationForm from '@/components/RewardsRegistrationForm';

export const metadata: Metadata = {
  title: 'Sparkport+ Rewards | Sparkport Pharmacy',
  description: 'Join Sparkport+ Rewards for free and unlock exclusive discounts on health and wellness products every time you shop.',
};

const TIERS = [
  {
    name: 'Bronze',
    pts: '0 – 499',
    color: 'from-amber-700 to-amber-500',
    ring: 'ring-amber-400/40',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    perks: ['Welcome bonus: 50 pts', 'Earn 1 pt per R1 spent', 'Members-only deals'],
  },
  {
    name: 'Silver',
    pts: '500 – 1,999',
    color: 'from-slate-500 to-slate-300',
    ring: 'ring-slate-300/50',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    perks: ['All Bronze perks', 'Priority prescription updates', 'Monthly bonus offers'],
  },
  {
    name: 'Gold',
    pts: '2,000 – 4,999',
    color: 'from-yellow-500 to-amber-300',
    ring: 'ring-yellow-300/50',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    dot: 'bg-yellow-400',
    perks: ['All Silver perks', 'Exclusive Gold pricing', 'Early access to promotions'],
  },
  {
    name: 'Platinum',
    pts: '5,000+',
    color: 'from-cyan-600 to-teal-400',
    ring: 'ring-cyan-300/50',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
    perks: ['All Gold perks', 'Dedicated health concierge', 'VIP event invitations'],
  },
];

const BENEFITS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Earn on Every Purchase',
    desc: '1 point for every rand you spend — in-store or online. Points add up fast.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Free to Join',
    desc: 'Zero enrollment fees, zero monthly charges. Just savings from day one.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant Activation',
    desc: 'Your member number arrives by email the moment you sign up. No waiting.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Members-Only Offers',
    desc: 'Exclusive deals and early access to sales reserved for Sparkport+ members.',
  },
];

const STEPS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Create Your Account',
    desc: 'Fill in the quick form below — name, email, and phone. Done in under a minute.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Get Your Member Number',
    desc: 'Your unique SPK member number arrives in your inbox instantly. Save it.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: 'Shop & Earn',
    desc: 'Give your phone number in-store or enter your member number online. Points accumulate automatically.',
  },
];

const FAQS = [
  {
    q: 'How do I use my rewards in-store?',
    a: 'Simply provide your registered phone number at the checkout. Our system will automatically apply eligible discounts to your purchase.',
  },
  {
    q: 'How do I use my rewards online?',
    a: 'Log in to your Sparkport account and your member number will be applied automatically at checkout.',
  },
  {
    q: 'Which products are eligible for discounts?',
    a: 'Discounts apply to selective items as determined by Sparkport Pharmacy. Look for the Rewards Eligible badge on qualifying products.',
  },
  {
    q: 'Can I combine rewards with other offers?',
    a: 'Rewards cannot be combined with other promotional offers unless explicitly stated at the time of the promotion.',
  },
  {
    q: 'Is there an age restriction?',
    a: 'Yes, you must be 18 years or older to participate in the Sparkport+ Rewards Programme.',
  },
  {
    q: 'How many accounts can I have?',
    a: 'Enrolment is limited to one account per phone number to ensure fair access for all customers.',
  },
];

export default function GetRewardedPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('/images/wellness.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/95 via-[#184363]/80 to-[#009eb9]/40" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs font-semibold uppercase tracking-widest mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] animate-pulse" />
              100% Free · Instant Activation
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6">
              Sparkport<span className="text-[#009eb9]">+</span><br />Rewards
            </h1>
            <p className="text-white/70 text-lg max-w-lg leading-relaxed mb-10">
              Earn points on every purchase, unlock exclusive discounts, and rise through four reward tiers — all at no cost to you.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#009eb9] hover:bg-[#0090a8] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#009eb9]/30 text-sm">
                Join Free Today
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/8 border border-white/20 hover:bg-white/15 text-white font-semibold rounded-xl transition-all text-sm">
                How It Works
              </a>
            </div>
          </div>

          {/* Member card mockup */}
          <div className="shrink-0 w-full lg:w-auto flex justify-center">
            <div className="relative w-80">
              {/* Card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#009eb9] to-[#184363] rounded-3xl blur-2xl opacity-60 scale-95" />
              {/* Card */}
              <div className="relative bg-gradient-to-br from-[#1a5580] to-[#0d3352] border border-white/10 rounded-3xl p-7 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Sparkport+</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full">
                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-amber-400 text-xs font-bold">Bronze</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">Member Number</p>
                  <p className="text-white text-2xl font-black tracking-widest">SPK-010042</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Points Balance</p>
                      <p className="text-white text-4xl font-black">1,240</p>
                    </div>
                    <p className="text-white/50 text-xs mb-1">Next: Silver at 500 pts</p>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[62%] bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-xs font-black">J</div>
                  <div>
                    <p className="text-white text-sm font-bold">Jane Dlamini</p>
                    <p className="text-white/40 text-xs">Member since 2026</p>
                  </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-5 right-5 w-24 h-24 rounded-full border border-white/5" />
                <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="border-y border-neutral-100 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-neutral-200">
            {[
              { value: 'Free', label: 'To Join' },
              { value: '50 pts', label: 'Welcome Bonus' },
              { value: '4 Tiers', label: 'Bronze to Platinum' },
            ].map(s => (
              <div key={s.label} className="py-8 text-center">
                <p className="text-3xl lg:text-4xl font-black text-[#184363]">{s.value}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Why Join</p>
            <h2 className="text-4xl lg:text-5xl font-black text-[#184363] leading-tight">Built for your health journey</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 hover:shadow-lg rounded-2xl p-7 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#009eb9]/10 group-hover:bg-[#009eb9]/20 flex items-center justify-center text-[#009eb9] mb-5 transition-colors">
                  {b.icon}
                </div>
                <h3 className="font-bold text-[#184363] text-base mb-2">{b.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tier progression ─────────────────────────────────────────────── */}
      <section className="bg-[#184363] py-20 lg:py-28 px-6 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Reward Tiers</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">The more you shop,<br className="hidden lg:block" /> the more you unlock</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier, i) => (
              <div key={tier.name}
                className={`bg-white/5 border border-white/10 hover:border-white/25 rounded-2xl p-7 transition-all duration-300 ${i === 0 ? 'ring-1 ring-amber-400/30' : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg mb-5`}>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
                <p className="text-white/40 text-xs font-semibold mb-5">{tier.pts} pts</p>
                <ul className="space-y-2.5">
                  {tier.perks.map(p => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl lg:text-5xl font-black text-[#184363] leading-tight">Up and running<br className="hidden lg:block" /> in three steps</h2>
          </div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[calc(16.667%+24px)] right-[calc(16.667%+24px)] h-0.5 bg-gradient-to-r from-[#009eb9]/30 via-[#009eb9]/60 to-[#009eb9]/30" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
              {STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center lg:relative">
                  <div className="relative w-20 h-20 rounded-2xl bg-[#184363] flex items-center justify-center text-white shadow-xl mb-6 z-10">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#009eb9] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#184363] mb-3">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Registration ─────────────────────────────────────────────────── */}
      <section id="register" className="min-h-screen flex flex-col lg:flex-row">

        {/* Left — image + pitch */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/heart-health.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#184363]/90 to-[#009eb9]/60" />
          <div className="relative z-10 flex flex-col justify-center px-14 py-16 text-white">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-6">Join Now — It&apos;s Free</p>
            <h2 className="text-5xl xl:text-6xl font-black leading-tight mb-6">
              Start earning<br />today.
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-sm">
              Sign up once and your 50-point welcome bonus lands in your account instantly.
            </p>
            <div className="space-y-4">
              {[
                'Member number sent to your email immediately',
                'Earn 1 point for every rand spent',
                'Unlock Silver at 500 pts, Gold at 2 000 pts',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#009eb9] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/85 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — card form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-neutral-50">
          <RewardsRegistrationForm />
        </div>

      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-[#184363]">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white border border-neutral-200 hover:border-[#009eb9]/40 rounded-2xl overflow-hidden transition-colors">
                <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none select-none">
                  <span className="font-bold text-[#184363] text-sm lg:text-base">{faq.q}</span>
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0 rotate-0 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#009eb9] to-[#007a91] px-6 py-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Ready to start earning?</h2>
        <p className="text-white/75 mb-8 max-w-md mx-auto">Join thousands of members already saving with Sparkport+ Rewards.</p>
        <a href="#register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#184363] font-black rounded-xl hover:bg-neutral-100 transition-all shadow-lg text-sm">
          Create Your Free Account
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>
      </section>

      {/* ── Terms ────────────────────────────────────────────────────────── */}
      <section id="terms" className="py-16 px-6 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#009eb9] text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
          <h2 className="text-2xl font-black text-[#184363] mb-8">Terms & Conditions</h2>

          <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
            <div className="p-5 bg-[#009eb9]/6 border-l-4 border-[#009eb9] rounded-r-xl">
              <p className="font-bold text-[#184363] mb-1">Programme Overview</p>
              <p>The Sparkport+ Rewards Programme offers discounts on selective items. In-store customers identify themselves with their registered phone number. Online customers use their unique member number received by email.</p>
            </div>

            {[
              {
                title: 'Eligibility',
                body: 'Only individuals 18 years or older may participate. Enrolment is free and limited to one account per phone number.',
              },
              {
                title: 'How Discounts Work',
                items: [
                  'Discounts apply only to eligible items as determined by Sparkport Pharmacy.',
                  'Not all products are eligible for discounts.',
                  'In-store customers must provide their registered phone number at checkout.',
                  'Online customers must use their member number.',
                  'Discounts cannot be redeemed for cash or store credit.',
                ],
              },
              {
                title: 'Important Information',
                items: [
                  'Sparkport Pharmacy reserves the right to modify eligible items, discount amounts, or terminate the programme at any time.',
                  'Discounts cannot be applied to past purchases.',
                  'Discounts cannot be combined with other promotional offers unless explicitly stated.',
                  'Sparkport Pharmacy is not responsible for issues from incorrect phone or member numbers.',
                ],
              },
              {
                title: 'Privacy & Security',
                body: 'Personal information is processed in accordance with POPIA. Members are responsible for the security of their member number. Report any unauthorised use immediately.',
              },
              {
                title: 'Governing Law',
                body: 'These terms are governed by the laws of the Republic of South Africa. Disputes will be resolved in South African courts.',
              },
            ].map(section => (
              <div key={section.title}>
                <h3 className="font-bold text-[#184363] mb-2">{section.title}</h3>
                {'body' in section && section.body && <p>{section.body}</p>}
                {'items' in section && section.items && (
                  <ul className="space-y-1.5">
                    {section.items.map(item => (
                      <li key={item} className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div>
              <h3 className="font-bold text-[#184363] mb-2">Contact</h3>
              <p>Questions? Call us on <strong>031 207 1011</strong> or <Link href="/contact" className="text-[#009eb9] hover:underline">send us a message</Link>.</p>
            </div>

            <p className="text-xs text-neutral-400 border-t border-neutral-100 pt-5">
              By joining Sparkport+ Rewards, you confirm you have read and agree to these terms and conditions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
