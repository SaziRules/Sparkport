'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/app/auth/actions';

function CardChip() {
  return (
    <svg className="w-9 h-7" viewBox="0 0 50 40" fill="none">
      <rect width="50" height="40" rx="6" fill="url(#cg1)" />
      <rect x="18" y="1" width="14" height="10" fill="url(#cg2)" opacity="0.7" />
      <rect x="18" y="29" width="14" height="10" fill="url(#cg2)" opacity="0.7" />
      <rect x="1"  y="14" width="10" height="12" fill="url(#cg2)" opacity="0.7" />
      <rect x="39" y="14" width="10" height="12" fill="url(#cg2)" opacity="0.7" />
      <rect x="18" y="14" width="14" height="12" rx="2" fill="url(#cg2)" opacity="0.9" />
      <line x1="18" y1="11" x2="32" y2="11" stroke="#c8a84b" strokeWidth="0.5" />
      <line x1="18" y1="29" x2="32" y2="29" stroke="#c8a84b" strokeWidth="0.5" />
      <line x1="11" y1="14" x2="11" y2="26" stroke="#c8a84b" strokeWidth="0.5" />
      <line x1="39" y1="14" x2="39" y2="26" stroke="#c8a84b" strokeWidth="0.5" />
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="50" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4a843"/><stop offset=".5" stopColor="#f0c96e"/><stop offset="1" stopColor="#b8922e"/>
        </linearGradient>
        <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f0c96e"/><stop offset="1" stopColor="#c8a030"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RewardsRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', dateOfBirth: '', password: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.dateOfBirth) {
      const age = (Date.now() - new Date(formData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) { setError('You must be 18 or older to join.'); return; }
    }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setIsSubmitting(true);
    try {
      const result = await signUp({
        email: formData.email, password: formData.password,
        firstName: formData.firstName, lastName: formData.lastName,
        phone: formData.phone, receiveMarketing: false,
      });
      if (!result.success) { setError(result.error ?? 'Something went wrong.'); return; }
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = (formData.firstName || formData.lastName)
    ? `${formData.firstName} ${formData.lastName}`.trim().toUpperCase()
    : 'YOUR NAME';

  // Shared styles for inputs on the dark card
  const inputCls = [
    'w-full rounded-xl px-3.5 py-2.5 text-sm text-white font-medium',
    'bg-white/10 border border-white/15',
    'placeholder:text-white/30',
    'focus:outline-none focus:bg-white/15 focus:border-white/40',
    'transition-all duration-150',
  ].join(' ');

  const labelCls = 'block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5';

  /* ── Success state ──────────────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="w-full max-w-xl">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg,#184363 0%,#1a4a6e 50%,#0d2a42 100%)' }}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#009eb9]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 p-8 text-center">
            <div className="w-16 h-16 bg-[#009eb9] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-white text-2xl font-black mb-2">Card Activated!</h3>
            <p className="text-white/60 text-sm mb-1">Welcome to Sparkport+ Rewards, <span className="text-white font-bold">{formData.firstName}</span>.</p>
            <p className="text-white/50 text-sm mb-6">Your member number and 50 bonus points are on their way to <span className="text-white/80">{formData.email}</span>.</p>

            <div className="bg-white/8 border border-white/10 rounded-2xl p-5 mb-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Cardholder</p>
                  <p className="text-white font-black tracking-widest">{displayName}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full">
                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-amber-400 text-[10px] font-bold">Bronze · 50 pts</span>
                </div>
              </div>
            </div>

            <Link
              href="/account/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#009eb9] hover:bg-[#00b0ce] text-white font-black rounded-xl transition-all shadow-lg text-sm"
            >
              Go to My Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Card form ──────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        {/* The card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg,#184363 0%,#1a4a6e 55%,#0d2a42 100%)' }}
        >
          {/* Subtle sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
          {/* Glow blobs */}
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#009eb9]/20 blur-3xl pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 p-7 lg:p-8">

            {/* ── Card header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CardChip />
                <div>
                  <p className="text-white font-black text-base tracking-tight leading-none">Sparkport<span className="text-[#009eb9]">+</span></p>
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Rewards Programme</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-400/25 rounded-full">
                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Bronze</span>
                </div>
                {/* Contactless */}
                <svg className="w-6 h-6 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/>
                </svg>
              </div>
            </div>

            {/* ── Divider ─────────────────────────────────────────────────── */}
            <div className="h-px bg-white/10 mb-6" />

            {/* ── Fields ──────────────────────────────────────────────────── */}
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input name="firstName" required value={formData.firstName} onChange={handle}
                    className={inputCls} placeholder="Jane" />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input name="lastName" required value={formData.lastName} onChange={handle}
                    className={inputCls} placeholder="Dlamini" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handle}
                  className={inputCls} placeholder="jane@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handle}
                    className={inputCls} placeholder="0XX XXX XXXX" />
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handle}
                    className={`${inputCls} [color-scheme:dark]`} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" required value={formData.password} onChange={handle}
                    className={`${inputCls} pr-10`} placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      {showPassword
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

            </div>

            {/* ── Terms + error ─────────────────────────────────────────────── */}
            <div className="mt-5 flex items-start gap-2.5">
              <input type="checkbox" id="agreeToTerms" name="agreeToTerms" required
                checked={formData.agreeToTerms} onChange={handle}
                className="mt-0.5 w-4 h-4 accent-[#009eb9] shrink-0" />
              <label htmlFor="agreeToTerms" className="text-white/45 text-xs leading-relaxed">
                I agree to the{' '}
                <a href="#terms" className="text-[#009eb9] hover:text-white transition-colors font-semibold">Terms & Conditions</a>
                {' '}and confirm I am 18 years or older.
              </label>
            </div>

            {error && (
              <p className="mt-3 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* ── Card footer ─────────────────────────────────────────────── */}
            <div className="h-px bg-white/10 mt-6 mb-5" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-0.5">Cardholder</p>
                <p className="text-white/70 text-sm font-black tracking-widest truncate max-w-[160px]">{displayName}</p>
                <p className="text-white/30 text-[10px] mt-0.5 tracking-widest">SPK — ??????</p>
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#009eb9] hover:bg-[#00b0ce] text-white font-black rounded-xl transition-all shadow-lg shadow-[#009eb9]/30 text-sm disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Activating…</>
                  : <>Activate Card <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                }
              </button>
            </div>

          </div>
        </div>
      </form>

      <p className="text-neutral-400 text-xs text-center mt-4">
        Already a member?{' '}
        <Link href="/account" className="text-[#009eb9] hover:underline font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
