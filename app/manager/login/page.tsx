'use client';

import { useState, useTransition } from 'react';
import { managerSignIn } from '../actions';
import Link from 'next/link';

export default function ManagerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const result = await managerSignIn(email, password);
      
      if (result.error) {
        setError(result.error);
      }
      // Success - will redirect automatically
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heart-health.jpg')",
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-white/90" />

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Manager Portal</h1>
          <p className="text-white/90 text-sm">Sparkport Pharmacy Management</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#184363] mb-2">Sign In</h2>
            <p className="text-neutral-600 text-sm">Access your store management dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">Sign in failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:bg-neutral-100 disabled:cursor-not-allowed"
              placeholder="manager@sparkport.co.za"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold text-neutral-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] disabled:bg-neutral-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full px-6 py-3 bg-linear-to-r from-[#184363] to-[#009eb9] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </>
            )}
          </button>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="text-center text-sm text-neutral-600">
              <p className="mb-2">Not a manager?</p>
              <Link
                href="/account"
                className="text-[#009eb9] hover:text-[#184363] font-semibold transition-colors"
              >
                Customer Login →
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <p className="text-xs text-neutral-600 text-center">
              <strong>Need help?</strong> Contact IT support at{' '}
              <a href="mailto:support@sparkport.co.za" className="text-[#009eb9] hover:underline">
                support@sparkport.co.za
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Version Info */}
      <div className="fixed bottom-4 right-4 text-xs text-neutral-500">
        Manager Portal v1.0
      </div>
    </div>
  );
}