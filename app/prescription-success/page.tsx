'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const prescriptionNumber = searchParams.get('number');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignupPrompt(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/success.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/90" />

      {/* Page content */}
      <main className="relative px-1 py-8 lg:py-32 min-h-screen">
        <div className="max-w-7xl mx-auto">
        
        {/* Success Animation & Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-[fadeIn_0.5s_ease-out]">
              <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white animate-[checkmark_0.5s_ease-out_0.2s_both]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold! text-[#184363] mb-6">
            Prescription Submitted Successfully!
          </h1>
          <p className="text-base lg:text-xl text-neutral-600">
            Thank you for choosing Sparkport Pharmacy
          </p>
        </div>

        {/* Main Grid Layout - Two Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
          
          {/* Left Column - Prescription Number */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-2xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden h-full">
              <div className="bg-linear-to-r from-[#009eb9] to-[#00c9d7] p-8">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-white/90 text-sm font-semibold uppercase tracking-wide">Your Prescription</p>
                </div>
                <p className="text-white text-4xl lg:text-5xl font-black tracking-tight break-all">
                  {prescriptionNumber || 'SPK-2024-XXXXX'}
                </p>
              </div>
              
              <div className="p-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-900">
                      <p className="font-bold mb-1">Keep This Number Safe</p>
                      <p>You'll need it to track your prescription and when collecting your medication.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-green-900 mb-1">WhatsApp Updates</p>
                      <p className="text-sm text-green-800">We'll send real-time updates about your prescription status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - What's Next */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-2xl shadow-neutral-200/50 border border-neutral-100 p-8 h-full">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#184363] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#009eb9]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                What Happens Next?
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-5 p-5 bg-linear-to-r from-[#009eb9]/5 to-transparent rounded-2xl border border-[#009eb9]/10">
                  <div className="w-12 h-12 bg-[#009eb9] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#184363] text-lg mb-1">Pharmacist Review</p>
                    <p className="text-neutral-600">Our pharmacist will verify your prescription within 2 hours during business hours</p>
                  </div>
                </div>

                <div className="flex gap-5 p-5 bg-linear-to-r from-[#009eb9]/5 to-transparent rounded-2xl border border-[#009eb9]/10">
                  <div className="w-12 h-12 bg-[#009eb9] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#184363] text-lg mb-1">We'll Contact You</p>
                    <p className="text-neutral-600">You'll receive a WhatsApp message with pricing and collection or delivery details</p>
                  </div>
                </div>

                <div className="flex gap-5 p-5 bg-linear-to-r from-[#009eb9]/5 to-transparent rounded-2xl border border-[#009eb9]/10">
                  <div className="w-12 h-12 bg-[#009eb9] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#184363] text-lg mb-1">Medication Ready</p>
                    <p className="text-neutral-600">We'll prepare your medication and notify you when it's ready for collection or delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNUP CTA - Full Width */}
        {showSignupPrompt && (
          <div className="mb-8 bg-linear-to-r from-[#009eb9] to-[#00c9d7] rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.5s_ease-out]">
            <div className="p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">Want to track your prescription?</h3>
                      <p className="text-white/90 text-lg">Create a free account to unlock powerful features</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">Real-time tracking</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">View all prescriptions</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">Saved addresses</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">Instant notifications</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                  <Link
                    href={`/auth/signup?email=${encodeURIComponent(email || '')}&phone=${encodeURIComponent(phone || '')}&returnTo=/prescriptions`}
                    className="block px-8 py-4 bg-white text-[#009eb9] font-bold text-lg rounded-2xl hover:bg-neutral-100 transition-all shadow-xl text-center"
                  >
                    Create Free Account
                  </Link>
                  <button
                    onClick={() => setShowSignupPrompt(false)}
                    className="px-8 py-4 text-white border-2 border-white/30 font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Full Width Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-6 py-5 bg-white border-2 border-neutral-200 text-[#184363] font-bold text-lg rounded-2xl hover:bg-neutral-50 hover:border-[#009eb9] transition-all shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/fill-script"
            className="flex items-center justify-center gap-3 px-6 py-5 bg-[#009eb9] text-white font-bold text-lg rounded-2xl hover:bg-[#184363] transition-all shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Another
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-3 px-6 py-5 bg-white border-2 border-neutral-200 text-[#184363] font-bold text-lg rounded-2xl hover:bg-neutral-50 hover:border-[#009eb9] transition-all shadow-lg sm:col-span-2 lg:col-span-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Us
          </Link>
        </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function PrescriptionSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009eb9]"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}