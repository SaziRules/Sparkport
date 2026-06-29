'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    startTransition(async () => {
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (sbError) {
        setError(sbError.message || 'Failed to send reset email. Please try again.');
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex m-0 p-0">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/categories/brain-boost.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-br from-[#184363]/80 to-[#009eb9]/60" />
        </div>
        <div className="relative z-10 flex flex-col w-full px-12 py-10 text-white">
          <Link href="/" className="text-white/50 hover:text-white text-xs flex items-center gap-1.5 transition-colors self-start mb-8">
            ← Back to Sparkport
          </Link>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="max-w-md">
              <h2 className="text-6xl font-extrabold! mb-6">Reset your password</h2>
              <p className="text-xl! text-white/90! mb-8">
                No worries — it happens to the best of us. Enter your email and we'll send you a reset link right away.
              </p>
              <div className="space-y-4">
                {[
                  'Secure, one-time reset link',
                  'Link expires after 24 hours',
                  'Your account details stay safe',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-xl">

          {/* Mobile back link */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="text-neutral-400 hover:text-[#184363] text-xs flex items-center gap-1.5 transition-colors">
              ← Back to Sparkport
            </Link>
          </div>

          {success ? (
            /* Success state */
            <div>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-3">Check your inbox</h1>
              <p className="text-neutral-600! mb-6">
                We've sent a password reset link to <span className="font-semibold text-[#184363]">{email}</span>.
                The link expires in 24 hours.
              </p>
              <p className="text-neutral-500! text-sm mb-8">
                Didn't receive it? Check your spam folder, or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[#009eb9] font-semibold hover:text-[#184363] transition-colors"
                >
                  try a different email address
                </button>.
              </p>
              <Link
                href="/account"
                className="block w-full bg-[#009eb9] text-white font-bold py-4 rounded-full hover:bg-[#184363] transition-colors text-lg text-center"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* Form state */
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-2">Lost your password?</h1>
              <p className="text-neutral-600! mb-8">
                Enter your email address and we'll email you a link to reset your password.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800! text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:bg-neutral-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#009eb9] text-white font-bold py-4 rounded-full hover:bg-[#184363] transition-colors text-lg disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-neutral-600">
                  Remembered it?{' '}
                  <Link href="/account" className="text-[#009eb9] font-bold hover:text-[#184363] transition-colors">
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
