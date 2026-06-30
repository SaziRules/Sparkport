'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { managerSignIn } from '../actions';

export default function ManagerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const result = await managerSignIn(email, password);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex">

      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/heart-health.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-br from-[#184363]/90 to-[#009eb9]/70" />
        </div>

        <div className="relative z-10 flex flex-col w-full px-12 py-10 text-white">
          <Link href="/" className="text-white/50 hover:text-white text-xs flex items-center gap-1.5 transition-colors self-start mb-8">
            ← Back to Sparkport
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-md">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold rounded-full mb-6 text-sm">
                Manager Portal
              </div>
              <h2 className="text-6xl font-extrabold mb-6 leading-tight">
                Sparkport<br />Pharmacy
              </h2>
              <p className="text-lg text-white/90 mb-10">
                Manage prescriptions, monitor store performance, and serve your community with confidence.
              </p>
              <div className="space-y-4">
                {[
                  'View and process all prescriptions',
                  'Update prescription statuses',
                  'Monitor store analytics',
                  'Manage your pharmacy network',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile back link */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="text-neutral-400 hover:text-[#184363] text-xs flex items-center gap-1.5 transition-colors">
              ← Back to Sparkport
            </Link>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#184363] mb-2">
            Manager Sign In
          </h1>
          <p className="text-neutral-600 mb-8">
            Access your Sparkport pharmacy dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
                className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:bg-neutral-100"
                placeholder="manager@sparkport.co.za"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                  className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:bg-neutral-100"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-500">
            Not a manager?{' '}
            <Link href="/account" className="text-[#009eb9] font-semibold hover:text-[#184363] transition-colors">
              Customer login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
